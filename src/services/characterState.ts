/**
 * ═══════════════════════════════════════════════════════════════════
 * Character State Service — Eros Status Terminal v3.0
 *
 * Gerencia persistencia logica do personagem entre turnos.
 *  - Estado critico vive no messageState/chatState do StageBase.
 *  - localStorage e apenas cache opcional de backup.
 * ═══════════════════════════════════════════════════════════════════
 */

import type { ErosStatusState, ErosChatState } from '../types/eros-status';

const STORAGE_PREFIX = 'eros_char_cache_v3_';
const STORAGE_META = 'eros_char_cache_meta_v3';

// ---------------------------------------------------------------------------
// Deep merge generico
// ---------------------------------------------------------------------------

export function deepMerge<T extends object>(target: T, source: Record<string, unknown>): T {
  if (!source || typeof source !== 'object') return target;
  if (!target || typeof target !== 'object') return source as T;

  const result = { ...target } as Record<string, unknown>;
  for (const key of Object.keys(source)) {
    const sv = source[key];
    const tv = result[key];
    if (sv === null || sv === undefined) continue;
    if (Array.isArray(sv)) {
      result[key] = sv.length > 0 ? sv : tv || [];
    } else if (typeof sv === 'object' && !Array.isArray(sv)) {
      result[key] = deepMerge(
        (tv as Record<string, unknown>) || {},
        sv as Record<string, unknown>,
      );
    } else {
      result[key] = sv;
    }
  }
  return result as T;
}

// ---------------------------------------------------------------------------
// Merge de estado ESS
// ---------------------------------------------------------------------------

export function mergeCharacterState(
  previous: ErosStatusState | null | undefined,
  update: Partial<ErosStatusState>,
): ErosStatusState {
  if (!previous) return update as ErosStatusState;
  return deepMerge(
    previous as unknown as Record<string, unknown>,
    update as unknown as Record<string, unknown>,
  ) as unknown as ErosStatusState;
}

// ---------------------------------------------------------------------------
// Cache local opcional (backup apenas)
// ---------------------------------------------------------------------------

export function saveCharacterCache(charKey: string, state: ErosStatusState): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_PREFIX + charKey, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function loadCharacterCache(charKey: string): ErosStatusState | null {
  try {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_PREFIX + charKey);
    return raw ? (JSON.parse(raw) as ErosStatusState) : null;
  } catch {
    return null;
  }
}

export function deleteCharacterCache(charKey: string): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_PREFIX + charKey);
  } catch {
    // ignore
  }
}

export function listCachedCharacters(): Array<{ key: string; name: string; savedAt?: string }> {
  try {
    if (typeof window === 'undefined') return [];
    const metaRaw = localStorage.getItem(STORAGE_META);
    const meta = metaRaw ? (JSON.parse(metaRaw) as Record<string, { name?: string; savedAt?: string }>) : {};
    return Object.entries(meta).map(([key, info]) => ({ key, name: info.name || key, savedAt: info.savedAt }));
  } catch {
    return [];
  }
}

export function updateCacheMeta(charKey: string, name: string): void {
  try {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem(STORAGE_META);
    const meta = raw ? (JSON.parse(raw) as Record<string, { name: string; savedAt: string }>) : {};
    meta[charKey] = { name, savedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_META, JSON.stringify(meta));
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// Chave de personagem
// ---------------------------------------------------------------------------

export function normalizeCharKey(name?: string): string {
  return (name || 'unknown').toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 32);
}

// ---------------------------------------------------------------------------
// Contexto para prompt
// ---------------------------------------------------------------------------

export function getContextForPrompt(state: ErosStatusState | null | undefined): string {
  if (!state) return '';
  const p = state.progressions || {};
  const c = state.character || {};
  const loc = state.location || {};
  const uc = state.userCharacter || {};

  const stats = Object.entries(p)
    .filter(([, v]) => typeof v === 'number' && v > 0)
    .map(([k, v]) => `${k}:${v}`)
    .join(', ');

  const npcSummary = (state.npcs || []).map((n) => `${n.name}(${n.relation || 'npc'})`).join(', ');
  const clothingStr = [state.clothingSlots?.upper, state.clothingSlots?.lower]
    .filter((v): v is string => Boolean(v) && v !== 'None')
    .join(', ');

  const lines = [
    '[PERSISTENT STATE]',
    `Character: ${c.name || '?'} | Role: ${c.role || '?'} | Mood: ${c.mood || '?'}`,
    `User: ${uc.name || 'User'} | Relation: ${uc.relation || '?'}`,
    `Location: ${loc.currentRoom || '?'} -> ${loc.building || '?'}`,
    stats ? `Stats: ${stats}` : '',
    clothingStr ? `Wearing: ${clothingStr}` : '',
    npcSummary ? `NPCs: ${npcSummary}` : '',
    `Day: ${state.system?.day || 1} | Time: ${state.system?.time || '??:??'} | Weather: ${state.system?.weather || '?'}`,
    '[MAINTAIN all unlisted values from this context unless narrative explicitly changes them]',
  ].filter(Boolean);

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Branching / turn versioning em chatState
// ---------------------------------------------------------------------------

export interface TurnVersion {
  turnId: string;
  parentTurnId?: string;
  savedAt: string;
  state: ErosStatusState;
}

export function buildTurnId(branchIndex: number, turnNumber: number): string {
  return `t${turnNumber}_v${branchIndex}`;
}

export function parseTurnId(turnId: string): { turnNumber: number; branchIndex: number } {
  const m = turnId.match(/t(\d+)_v(\d+)/);
  if (!m) return { turnNumber: 0, branchIndex: 0 };
  return { turnNumber: parseInt(m[1], 10), branchIndex: parseInt(m[2], 10) };
}

export function incrementTurnId(chatState?: ErosChatState | null, branchIndex = 0): string {
  const total = chatState?.globalMeta?.totalTurns || 0;
  return buildTurnId(branchIndex, total + 1);
}

export function saveTurnVersion(
  chatState: ErosChatState,
  turnId: string,
  parentTurnId: string | undefined,
  state: ErosStatusState,
): ErosChatState {
  const versions = chatState.turnHistory || [];
  const existingIndex = versions.findIndex((v) => v.turn_id === turnId);
  const entry = {
    turn_id: turnId,
    parent_turn_id: parentTurnId,
    branch_index: state.meta?.branch_index || 0,
    timestamp: new Date().toISOString(),
    summary: buildTurnSummary(state),
  };

  const newHistory = existingIndex >= 0
    ? versions.map((v, idx) => (idx === existingIndex ? entry : v))
    : [...versions, entry];

  return {
    ...chatState,
    turnHistory: newHistory,
    globalMeta: {
      ...chatState.globalMeta,
      totalTurns: Math.max(chatState.globalMeta?.totalTurns || 0, parseTurnId(turnId).turnNumber),
      currentBranch: state.meta?.branch_index || chatState.globalMeta?.currentBranch || 0,
    },
  };
}

export function listTurnVersions(chatState: ErosChatState): TurnVersion[] {
  return (chatState.turnHistory || []).map((entry) => ({
    turnId: entry.turn_id,
    parentTurnId: entry.parent_turn_id,
    savedAt: entry.timestamp,
    state: {} as ErosStatusState,
  }));
}

export function getBranchTree(
  chatState: ErosChatState,
): Record<string, { parentTurnId?: string; branchIndex: number; savedAt: string; branches: string[] }> {
  const versions = chatState.turnHistory || [];
  const tree: Record<string, { parentTurnId?: string; branchIndex: number; savedAt: string; branches: string[] }> = {};

  for (const v of versions) {
    tree[v.turn_id] = {
      parentTurnId: v.parent_turn_id,
      branchIndex: v.branch_index,
      savedAt: v.timestamp,
      branches: [],
    };
  }
  for (const v of versions) {
    if (v.parent_turn_id && tree[v.parent_turn_id]) {
      tree[v.parent_turn_id].branches.push(v.turn_id);
    }
  }
  return tree;
}

function buildTurnSummary(state: ErosStatusState): string {
  const c = state.character;
  const loc = state.location;
  const p = state.progressions;
  return `Day ${state.system?.day || '?'} ${state.system?.time || ''} | ${c?.name || '?'} @ ${loc?.currentRoom || '?'} | mood:${c?.mood || '?'} aff:${p?.affection ?? 0}%`;
}
