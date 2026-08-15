/**
 * ═══════════════════════════════════════════════════════════════════
 * Memory Service — Eros Status Terminal v3.0
 *
 * Memoria hibrida adaptada ao ciclo de vida do StageBase:
 *  - Curto prazo: turnHistory dentro do chatState.
 *  - Longo prazo: longTermMemory dentro do chatState.
 *  - localStorage e apenas cache opcional (nao essencial).
 *
 * Nao persiste estado critico em localStorage.
 * ═══════════════════════════════════════════════════════════════════
 */

import type { ErosChatState, ErosStatusState } from '../types/eros-status';

const DEFAULT_SHORT_TERM_LIMIT = 20;
const DEFAULT_FACTS_LIMIT = 200;

export interface MemoryConfig {
  mode?: 'narrative' | 'entities' | 'hybrid';
  shortTermLimit?: number;
  registerDiary?: boolean;
}

export interface LongTermMemory {
  facts: string[];
  narrativeSummary: string;
  lastCondensedTurn?: string;
}

export interface TurnHistoryEntry {
  turn_id: string;
  parent_turn_id?: string;
  branch_index: number;
  timestamp: string;
  summary?: string;
}

// ---------------------------------------------------------------------------
// Inicializacao
// ---------------------------------------------------------------------------

export function initLongTermMemory(): LongTermMemory {
  return { facts: [], narrativeSummary: '', lastCondensedTurn: undefined };
}

export function createMemoryConfig(config: MemoryConfig = {}): Required<MemoryConfig> {
  return {
    mode: config.mode || 'hybrid',
    shortTermLimit: config.shortTermLimit || DEFAULT_SHORT_TERM_LIMIT,
    registerDiary: config.registerDiary !== false,
  };
}

// ---------------------------------------------------------------------------
// Manipulacao de turnHistory no chatState
// ---------------------------------------------------------------------------

export interface AppendTurnInput {
  turn_id: string;
  parent_turn_id?: string;
  branch_index?: number;
  summary?: string;
}

export function appendTurnToHistory(
  chatState: ErosChatState,
  input: AppendTurnInput,
): ErosChatState {
  const entry: TurnHistoryEntry = {
    turn_id: input.turn_id,
    parent_turn_id: input.parent_turn_id,
    branch_index: input.branch_index ?? 0,
    timestamp: new Date().toISOString(),
    summary: input.summary,
  };

  return {
    ...chatState,
    turnHistory: [...(chatState.turnHistory || []), entry],
  };
}

// ---------------------------------------------------------------------------
// Condensacao de memoria de longo prazo
// ---------------------------------------------------------------------------

export function condenseChatMemory(
  chatState: ErosChatState,
  config: MemoryConfig = {},
): ErosChatState {
  const { shortTermLimit = DEFAULT_SHORT_TERM_LIMIT } = createMemoryConfig(config);
  const history = chatState.turnHistory || [];
  if (history.length <= shortTermLimit) return chatState;

  const toCondense = history.slice(0, history.length - shortTermLimit);
  const recent = history.slice(-shortTermLimit);
  const longTerm = chatState.longTermMemory || initLongTermMemory();

  const newFacts = new Set(longTerm.facts);
  let narrative = longTerm.narrativeSummary;

  for (const turn of toCondense) {
    if (turn.summary) newFacts.add(turn.summary);
  }

  const recentSummaries = recent.map((t) => t.summary).filter((s): s is string => Boolean(s));
  narrative = [narrative, ...recentSummaries].filter(Boolean).join('\n').slice(-4000);

  return {
    ...chatState,
    turnHistory: recent,
    longTermMemory: {
      facts: Array.from(newFacts).slice(-DEFAULT_FACTS_LIMIT),
      narrativeSummary: narrative,
      lastCondensedTurn: recent[recent.length - 1]?.turn_id,
    },
  };
}

// ---------------------------------------------------------------------------
// Construcao de contexto para prompt
// ---------------------------------------------------------------------------

export function buildMemoryContext(longTermMemory?: LongTermMemory | null): string {
  if (!longTermMemory) return '';
  const lines: string[] = [];

  if (longTermMemory.narrativeSummary) {
    lines.push('── NARRATIVE MEMORY ──');
    lines.push(longTermMemory.narrativeSummary);
    lines.push('');
  }

  if (longTermMemory.facts.length > 0) {
    lines.push('── KNOWN FACTS ──');
    for (const fact of longTermMemory.facts.slice(-30)) {
      lines.push(`• ${fact}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Extracao de fatos a partir de um estado
// ---------------------------------------------------------------------------

export function extractFactsFromState(state: ErosStatusState): string[] {
  const facts: string[] = [];
  const charName = state.character?.name;
  if (charName && charName !== 'Unknown') {
    facts.push(`${charName} is at ${state.location?.currentRoom || 'unknown location'}`);
    facts.push(`${charName} mood: ${state.character?.mood || 'unknown'}`);
    if (state.progressions?.affection !== undefined) {
      facts.push(`${charName} affection: ${state.progressions.affection}%`);
    }
  }
  for (const npc of state.npcs || []) {
    if (npc.name) facts.push(`NPC ${npc.name} (${npc.relation || 'unknown relation'})`);
  }
  for (const item of state.inventory?.items || []) {
    const name = typeof item === 'string' ? item : item.name;
    if (name) facts.push(`Item: ${name}`);
  }
  return facts;
}

// ---------------------------------------------------------------------------
// Cache local opcional (nao essencial)
// ---------------------------------------------------------------------------

const LOCAL_MEMORY_CACHE_KEY = 'eros_chat_memory_cache';

export function loadMemoryCache(): LongTermMemory | null {
  try {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(LOCAL_MEMORY_CACHE_KEY);
    return raw ? (JSON.parse(raw) as LongTermMemory) : null;
  } catch {
    return null;
  }
}

export function saveMemoryCache(memory: LongTermMemory): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LOCAL_MEMORY_CACHE_KEY, JSON.stringify(memory));
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// Estatisticas
// ---------------------------------------------------------------------------

export function getMemoryStats(chatState?: ErosChatState): {
  turnCount: number;
  factsCount: number;
  narrativeLength: number;
} {
  return {
    turnCount: chatState?.turnHistory?.length || 0,
    factsCount: chatState?.longTermMemory?.facts?.length || 0,
    narrativeLength: chatState?.longTermMemory?.narrativeSummary?.length || 0,
  };
}
