/**
 * ═══════════════════════════════════════════════════════════════════
 * Stage.tsx — Integracao com StageBase do Chub Venus AI
 *
 * Implementa o ciclo de vida oficial: constructor, load, beforePrompt,
 * afterResponse, setState e render. Parser/middleware/auditoria rodam
 * 100% dentro do ciclo de vida, sem dependencias externas.
 * ═══════════════════════════════════════════════════════════════════
 */

import React from 'react';
import { StageBase } from '@chub-ai/stages-ts';
import type { InitialData, Message, LoadResponse, StageResponse } from './types/chub';
import type { InitStateType, ChatStateType, MessageStateType, ConfigType } from './types/chub';
import { parseErosStatusFromMessage } from './core/parser';
import { processIncomingState } from './core/middleware';
import { createInitialState, createDefaultInitState, createDefaultChatState, deepClone } from './core/state';
import { normalizeCharKey, getContextForPrompt, incrementTurnId, saveCharacterCache, updateCacheMeta, loadCharacterCache, mergeCharacterState } from './services/characterState';
import { buildMemoryContext } from './systems/memory';
import { limitTokens } from './utils';
import ErosTerminal from './components/terminal/ErosTerminal';

interface StageData extends InitialData<InitStateType, ChatStateType, MessageStateType, ConfigType> {}

export default class Stage extends StageBase<InitStateType, ChatStateType, MessageStateType, ConfigType> {
  private messageState: MessageStateType;
  private chatState: ChatStateType;
  private initState: InitStateType;
  private config: ConfigType | null;
  private charKey: string;
  private localCacheLoaded: boolean;

  constructor(data: StageData) {
    super(data);
    this.config = data.config ?? null;
    this.initState = data.initState ?? createDefaultInitState();
    this.chatState = data.chatState ?? createDefaultChatState();
    this.messageState = data.messageState ?? createInitialState();
    this.charKey = normalizeCharKey(this.messageState.character?.name || 'unknown');
    this.localCacheLoaded = false;
  }

  async load(): Promise<Partial<LoadResponse<InitStateType, ChatStateType, MessageStateType>>> {
    // Carrega cache local opcional apenas para pre-seed nao critico
    if (!this.localCacheLoaded && typeof window !== 'undefined') {
      const cached = loadCharacterCache(this.charKey);
      if (cached) {
        this.messageState = mergeCharacterState(createInitialState(), cached);
      }
      this.localCacheLoaded = true;
    }

    return {
      success: true,
      initState: this.initState,
      chatState: this.chatState,
      messageState: this.messageState,
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

    const result = processIncomingState(this.messageState, parsed, {
      ntrEnabled: this.config?.enableNTR ?? false,
      auditorEnabled: this.config?.auditorEnabled ?? true,
      imgAuditorEnabled: this.config?.imgAuditorEnabled ?? true,
      config: this.config,
      currentTurnId: turnId,
      parentTurnId,
      previousChatState: this.chatState,
    });

    this.messageState = result.messageState;
    this.chatState = result.chatState;
    this.charKey = normalizeCharKey(this.messageState.character?.name || this.charKey);

    // Cache local opcional (backup), nunca API key
    saveCharacterCache(this.charKey, this.messageState);
    updateCacheMeta(this.charKey, this.messageState.character?.name || this.charKey);

    return {
      messageState: this.messageState,
      chatState: this.chatState,
      systemMessage: result.notifications.length > 0 ? result.notifications.map((n) => n.message).join(' | ') : undefined,
    };
  }

  render(): React.ReactElement {
    return (
      <ErosTerminal
        state={this.messageState}
        chatState={this.chatState}
        config={this.config}
        onParse={(text) => {
          // Handler para testes standalone; no StageBase a parse e via afterResponse.
          void this.afterResponse({ content: text, isBot: true, anonymizedId: '', promptForId: null, identity: '', isMain: true });
        }}
      />
    );
  }
}
