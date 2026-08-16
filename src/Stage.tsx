/**
 * ═══════════════════════════════════════════════════════════════════
 * Stage.tsx — Integracao com StageBase do Chub Venus AI
 *
 * Implementa o ciclo de vida oficial: constructor, load, beforePrompt,
 * afterResponse, setState e render. Parser/middleware/auditoria rodam
 * 100% dentro do ciclo de vida, sem dependencias externas.
 *
 * NOTA DE SEGURANCA: nenhum estado critico e persistido em localStorage.
 * O StageBase do Chub gerencia initState/chatState/messageState. O unico
 * dado local sao preferencias leves (tema/densidade), gerenciadas por
 * setPreference/getPreference em characterState.ts.
 * ═══════════════════════════════════════════════════════════════════
 */

import React from 'react';
import { StageBase } from '@chub-ai/stages-ts';
import type { InitialData, Message, LoadResponse, StageResponse } from './types/chub';
import type { InitStateType, ChatStateType, MessageStateType, ConfigType } from './types/chub';
import type { ErosStatusState } from './types/eros-status';
import { parseErosStatusFromMessage } from './core/parser';
import { processIncomingState, enforceSchema } from './core/middleware';
import { createInitialState, createDefaultInitState, createDefaultChatState, deepClone, STATE_SCHEMA_VERSION } from './core/state';
import { normalizeCharKey, getContextForPrompt, incrementTurnId } from './services/characterState';
import { buildMemoryContext, condenseChatMemory } from './systems/memory';
import { limitTokens } from './utils';
import ErosTerminal from './components/terminal/ErosTerminal';

interface StageData extends InitialData<InitStateType, ChatStateType, MessageStateType, ConfigType> {}

export default class Stage extends StageBase<InitStateType, ChatStateType, MessageStateType, ConfigType> {
  private messageState: MessageStateType;
  private chatState: ChatStateType;
  private initState: InitStateType;
  private config: ConfigType | null;
  private runtimeConfig: ConfigType | null;
  private charKey: string;

  constructor(data: StageData) {
    super(data);
    this.config = data.config ?? null;
    this.runtimeConfig = this.config;
    this.initState = data.initState ?? createDefaultInitState();
    this.chatState = data.chatState ?? createDefaultChatState();
    this.messageState = data.messageState ?? createInitialState();
    this.charKey = normalizeCharKey(this.messageState.character?.name || 'unknown');
  }

  async load(): Promise<Partial<LoadResponse<InitStateType, ChatStateType, MessageStateType>>> {
    // Estado critico vem exclusivamente do StageBase; nao consultamos localStorage.
    const expectedVersion = STATE_SCHEMA_VERSION;
    let initState = this.initState;
    let chatState = this.chatState;
    let messageState = this.messageState;
    let reset = false;

    if (!initState || initState.schema_version !== expectedVersion) {
      console.warn(
        `[ESS] initState schema mismatch (expected ${expectedVersion}, got ${initState?.schema_version ?? 'undefined'}). Resetting to default.`,
      );
      initState = createDefaultInitState();
      reset = true;
    }

    if (!chatState || chatState.schema_version !== expectedVersion) {
      console.warn(
        `[ESS] chatState schema mismatch (expected ${expectedVersion}, got ${chatState?.schema_version ?? 'undefined'}). Resetting to default.`,
      );
      chatState = createDefaultChatState();
      reset = true;
    }

    if (!messageState || messageState.meta?.schema_version !== expectedVersion) {
      console.warn(
        `[ESS] messageState schema mismatch (expected ${expectedVersion}, got ${messageState?.meta?.schema_version ?? 'undefined'}). Resetting to default.`,
      );
      messageState = createInitialState();
      reset = true;
    }

    if (!reset) {
      const cloned = deepClone(messageState);
      const coerced = enforceSchema(cloned);
      if (coerced.length > 0) {
        console.warn(`[ESS] messageState schema coercion applied: ${coerced.join('; ')}`);
        messageState = cloned;
      }
    }

    return {
      success: true,
      initState,
      chatState,
      messageState,
    };
  }

  async setState(state: MessageStateType): Promise<void> {
    this.messageState = deepClone(state);
    this.charKey = normalizeCharKey(this.messageState.character?.name || this.charKey);
  }

  async beforePrompt(inputMessage: Message): Promise<Partial<StageResponse<ChatStateType, MessageStateType>>> {
    const memoryContext = buildMemoryContext(this.chatState?.longTermMemory);
    const stateContext = getContextForPrompt(this.messageState);
    const userMessageSnippet = inputMessage?.content ? `User: ${inputMessage.content.slice(0, 200)}` : '';

    const stageDirections = limitTokens(
      [
        '[EROS STATUS TERMINAL — CONTEXT INJECTION]',
        stateContext,
        memoryContext,
        userMessageSnippet,
        '[INSTRUCTION: You may include ESS status markers inline or as a JSON block. Keep narrative flowing.]',
      ].filter(Boolean).join('\n'),
      800,
    );

    return {
      stageDirections,
      messageState: this.messageState,
      chatState: this.chatState,
    };
  }

  async afterResponse(botMessage: Message): Promise<Partial<StageResponse<ChatStateType, MessageStateType>>> {
    const text = botMessage?.content || '';
    const parsed = parseErosStatusFromMessage(text);

    if (!parsed) {
      return {
        messageState: this.messageState,
        chatState: this.chatState,
      };
    }

    const turnId = incrementTurnId(this.chatState, this.messageState.meta?.branch_index || 0);
    const parentTurnId = this.messageState.meta?.turn_id || '';

    const cfg = this.runtimeConfig ?? this.config;
    const result = processIncomingState(this.messageState, parsed, {
      ntrEnabled: cfg?.enableNTR ?? false,
      auditorEnabled: cfg?.auditorEnabled ?? true,
      imgAuditorEnabled: cfg?.imgAuditorEnabled ?? true,
      config: cfg,
      currentTurnId: turnId,
      parentTurnId,
      previousChatState: this.chatState,
    });

    this.messageState = result.messageState;
    this.chatState = result.chatState;
    this.charKey = normalizeCharKey(this.messageState.character?.name || this.charKey);

    return {
      messageState: this.messageState,
      chatState: this.chatState,
      systemMessage: result.notifications.length > 0 ? result.notifications.map((n) => n.message).join(' | ') : undefined,
    };
  }

  private handleApplyParsed = (parsed: Partial<ErosStatusState>): void => {
    const turnId = incrementTurnId(this.chatState, this.messageState.meta?.branch_index || 0);
    const parentTurnId = this.messageState.meta?.turn_id || '';
    const cfg = this.runtimeConfig ?? this.config;
    const result = processIncomingState(this.messageState, parsed, {
      ntrEnabled: cfg?.enableNTR ?? false,
      auditorEnabled: cfg?.auditorEnabled ?? true,
      imgAuditorEnabled: cfg?.imgAuditorEnabled ?? true,
      config: cfg,
      currentTurnId: turnId,
      parentTurnId,
      previousChatState: this.chatState,
    });

    this.messageState = result.messageState;
    this.chatState = result.chatState;
    this.charKey = normalizeCharKey(this.messageState.character?.name || this.charKey);
  };

  private handleCorrectAudit = (issueId: string, _value: unknown): void => {
    const currentAudit = this.messageState.audit ?? { issues: [], correctedIds: [], ignoredIds: [] };
    const correctedIds = currentAudit.correctedIds ?? [];
    const ignoredIds = currentAudit.ignoredIds ?? [];
    this.messageState = {
      ...this.messageState,
      audit: {
        ...currentAudit,
        issues: currentAudit.issues.map((issue) =>
          issue.id === issueId ? { ...issue, corrected: true, ignored: false } : issue,
        ),
        correctedIds: correctedIds.includes(issueId) ? correctedIds : [...correctedIds, issueId],
        ignoredIds: ignoredIds.filter((id) => id !== issueId),
      },
    };
  };

  private handleIgnoreAudit = (issueId: string): void => {
    const currentAudit = this.messageState.audit ?? { issues: [], correctedIds: [], ignoredIds: [] };
    const correctedIds = currentAudit.correctedIds ?? [];
    const ignoredIds = currentAudit.ignoredIds ?? [];
    this.messageState = {
      ...this.messageState,
      audit: {
        ...currentAudit,
        issues: currentAudit.issues.map((issue) =>
          issue.id === issueId ? { ...issue, ignored: true, corrected: false } : issue,
        ),
        ignoredIds: ignoredIds.includes(issueId) ? ignoredIds : [...ignoredIds, issueId],
        correctedIds: correctedIds.filter((id) => id !== issueId),
      },
    };
  };

  private handleCondenseMemory = (): void => {
    const base = this.chatState ?? createDefaultChatState();
    this.chatState = condenseChatMemory(base);
  };

  private handleClearMemory = (): void => {
    const base = this.chatState ?? createDefaultChatState();
    this.chatState = {
      ...base,
      longTermMemory: { facts: [], narrativeSummary: '', lastCondensedTurn: undefined },
      turnHistory: [],
    };
  };

  render(): React.ReactElement {
    return (
      <ErosTerminal
        state={this.messageState}
        chatState={this.chatState}
        config={this.runtimeConfig ?? this.config}
        onConfigChange={(patch) => {
          this.runtimeConfig = { ...(this.runtimeConfig ?? this.config ?? {}), ...patch } as ConfigType;
        }}
        onApplyState={this.handleApplyParsed}
        onCorrectAudit={this.handleCorrectAudit}
        onIgnoreAudit={this.handleIgnoreAudit}
        onCondenseMemory={this.handleCondenseMemory}
        onClearMemory={this.handleClearMemory}
      />
    );
  }
}
