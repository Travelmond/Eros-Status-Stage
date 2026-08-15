/**
 * Adaptador de compatibilidade para o serviço de memória.
 *
 * A implementação real do memory service está em `src/systems/memory.ts`.
 * Este arquivo expõe uma API simplificada usada pelos componentes do terminal,
 * mantendo compatibilidade com a interface documentada original.
 */

import {
  buildMemoryContext,
  type MemoryConfig,
} from '@/systems/memory';

export interface MemoryState {
  mode: 'narrative' | 'entities' | 'hybrid';
  registerDiary: boolean;
  shortTerm: Array<{ turnId: string; state: unknown }>;
  longTerm: {
    facts: string[];
    diary: string[];
  };
}

export function loadMemory(): MemoryState {
  return {
    mode: 'hybrid',
    registerDiary: true,
    shortTerm: [],
    longTerm: { facts: [], diary: [] },
  };
}

export function getMemoryStats(memory: MemoryState | null) {
  return {
    shortTermCount: memory?.shortTerm.length || 0,
    shortTermLimit: 20,
    longTermFacts: memory?.longTerm.facts.length || 0,
    longTermDiary: memory?.longTerm.diary.length || 0,
  };
}

export function buildSystemPromptContext(memory: MemoryState | null): string {
  if (!memory) return '';
  return buildMemoryContext({
    facts: memory.longTerm.facts,
    narrativeSummary: memory.longTerm.diary.join('\n'),
  });
}

export function condenseNow(memory: MemoryState): MemoryState {
  // A condensação real opera sobre o chatState; aqui apenas simula localmente.
  const condensedFacts = memory.shortTerm.slice(-5).map((t) => `Turn ${t.turnId}: summary`);
  return {
    ...memory,
    shortTerm: [],
    longTerm: {
      facts: [...memory.longTerm.facts, ...condensedFacts],
      diary: [...memory.longTerm.diary, ...memory.shortTerm.map((t) => String(t.turnId))],
    },
  };
}

export function clearMemory(): MemoryState {
  return loadMemory();
}

export function addTurn(memory: MemoryState, turnId: string, state: unknown): MemoryState {
  return {
    ...memory,
    shortTerm: [...memory.shortTerm, { turnId, state }].slice(-20),
  };
}

export type { MemoryConfig };
