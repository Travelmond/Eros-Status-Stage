/**
 * ═══════════════════════════════════════════════════════════════════
 * State Middleware — Eros Status Terminal v3.0
 *
 * Juiz entre o parser e o estado final exposto ao StageBase.
 * Aplica defaults, validacoes temporais/espaciais, gating NTR,
 * deteccao de mudancas de fase/progressao, validacao de ui_commands
 * e integra auditoria de consistencia.
 * ═══════════════════════════════════════════════════════════════════
 */

import type {
  ErosStatusState,
  ErosChatState,
  Progressions,
  ProgressionKey,
  AuditIssue,
  UICommands,
} from '../types/eros-status';
import type { ConfigType } from '../types/config';
import {
  createInitialState,
  createDefaultChatState,
  mergePartialState,
  DEFAULT_SEX_MODULE,
  DEFAULT_REACTION_MODULE,
  deepClone,
} from './state';
import { runAudit } from './audit';
import { appendTurnToHistory, buildMemoryContext } from '../systems/memory';

const MAX_DAY_ADVANCE = 7;
const MAX_TIME_REWIND_HOURS = 2;
const AFFECTION_CHANGE_THRESHOLD = 10;
const AROUSAL_CHANGE_THRESHOLD = 15;
const CORRUPTION_CHANGE_THRESHOLD = 10;

export interface Notification {
  level: 'info' | 'warning' | 'critical';
  message: string;
  statKey?: string;
  delta?: number;
  color?: string;
  phaseChange?: string;
}

export interface ProgressionChange {
  key: ProgressionKey;
  from: number;
  to: number;
  delta: number;
  emoji: string;
  color: string;
}

export interface ProcessOptions {
  ntrEnabled?: boolean;
  auditorEnabled?: boolean;
  imgAuditorEnabled?: boolean;
  config?: ConfigType | null;
  currentTurnId?: string;
  parentTurnId?: string;
  previousChatState?: ErosChatState;
}

export interface ProcessResult {
  /** Estado ESS completo resultante (usado internamente e como messageState). */
  state: ErosStatusState;
  /** Sugestao de troca de aba. */
  tabSwitch: string | null;
  /** Notificacoes a serem exibidas (toasts). */
  notifications: Notification[];
  /** Mudancas significativas em progressoes. */
  progressionChanges: ProgressionChange[];
  /** Lista de campos coercidos/bloqueados. */
  invalidations: string[];
  /** Comandos de UI rejeitados. */
  rejectedCommands: string[];
  /** Issues de auditoria passiva. */
  auditIssues: AuditIssue[];
  /** Estado a ser persistido como messageState pelo StageBase. */
  messageState: ErosStatusState;
  /** Estado a ser persistido como chatState (fog-of-war / memoria). */
  chatState: ErosChatState;
}

// ---------------------------------------------------------------------------
// Validacoes temporais / espaciais
// ---------------------------------------------------------------------------

function validateTimeCoherence(prev: ErosStatusState, next: ErosStatusState): { coerced: string[] } {
  const coerced: string[] = [];
  let day = next.system?.day;
  const time = next.system?.time;
  const prevDay = prev?.system?.day || 0;
  const prevTime = prev?.system?.time || '00:00';

  if (day !== undefined && prevDay > 0) {
    if (day < prevDay) {
      next.system.day = prevDay;
      coerced.push(`day:${day}->${prevDay} (rewind blocked)`);
      day = prevDay;
    }
    if (day > prevDay + MAX_DAY_ADVANCE) {
      const capped = prevDay + 1;
      next.system.day = capped;
      coerced.push(`day:${day}->${capped} (excessive jump capped)`);
      day = capped;
    }
  }

  if (time && prevTime && prevTime !== '??:??') {
    const [prevH, prevM] = prevTime.split(':').map(Number);
    const [nextH, nextM] = time.split(':').map(Number);
    if (!Number.isNaN(prevH) && !Number.isNaN(nextH)) {
      const prevTotal = (prevH || 0) * 60 + (prevM || 0);
      const nextTotal = (nextH || 0) * 60 + (nextM || 0);
      if (day === prevDay && nextTotal < prevTotal - MAX_TIME_REWIND_HOURS * 60 && prevTotal > 0) {
        next.system.time = prevTime;
        coerced.push(`time:${time}->${prevTime} (rewind blocked)`);
      }
    }
  }

  return { coerced };
}

function validateLocationCoherence(prev: ErosStatusState, next: ErosStatusState): string[] {
  const coerced: string[] = [];
  const prevBuilding = prev?.location?.building?.toLowerCase();
  const nextBuilding = next?.location?.building?.toLowerCase();
  const prevRoom = prev?.location?.currentRoom?.toLowerCase();
  const nextRoom = next?.location?.currentRoom?.toLowerCase();

  if (prevBuilding && nextBuilding && prevBuilding !== nextBuilding && prevRoom === nextRoom) {
    next.location.building = prev.location.building;
    coerced.push(`building:${nextBuilding}->${prevBuilding}`);
  }
  return coerced;
}

// ---------------------------------------------------------------------------
// Deteccao de mudancas
// ---------------------------------------------------------------------------

function detectProgressionChanges(prevProg: Progressions, nextProg: Progressions): { changes: ProgressionChange[]; notifications: Notification[] } {
  const changes: ProgressionChange[] = [];
  const notifications: Notification[] = [];
  if (!prevProg || !nextProg) return { changes, notifications };

  const trackedStats: { key: ProgressionKey; label: string; emoji: string; threshold: number; color: string }[] = [
    { key: 'affection', label: 'Affection', emoji: '💕', threshold: AFFECTION_CHANGE_THRESHOLD, color: '#FF2D78' },
    { key: 'obedience', label: 'Obedience', emoji: '🎯', threshold: 10, color: '#00FFF5' },
    { key: 'libido', label: 'Libido', emoji: '🔥', threshold: 10, color: '#FF2D78' },
    { key: 'arousal', label: 'Arousal', emoji: '🍑', threshold: AROUSAL_CHANGE_THRESHOLD, color: '#FF2D78' },
    { key: 'corruption', label: 'Corruption', emoji: '☠️', threshold: CORRUPTION_CHANGE_THRESHOLD, color: '#BF5FFF' },
    { key: 'trust', label: 'Trust', emoji: '⭐', threshold: 10, color: '#FFD700' },
    { key: 'love', label: 'Love', emoji: '💗', threshold: 10, color: '#FF2D78' },
    { key: 'jealousy', label: 'Jealousy', emoji: '💚', threshold: 15, color: '#BF5FFF' },
    { key: 'embarrassment', label: 'Embarrassment', emoji: '😳', threshold: 15, color: '#FFD700' },
  ];

  for (const stat of trackedStats) {
    const from = prevProg[stat.key] ?? 0;
    const to = nextProg[stat.key] ?? 0;
    const delta = to - from;
    if (Math.abs(delta) >= stat.threshold) {
      changes.push({ key: stat.key, from, to, delta, emoji: stat.emoji, color: stat.color });
      const direction = delta > 0 ? '↑' : '↓';
      const level = stat.key === 'corruption' && delta > 15
        ? 'critical'
        : stat.key === 'jealousy' && delta > 20
          ? 'warning'
          : 'info';
      notifications.push({
        level,
        message: `${stat.emoji} ${stat.label} ${direction}${Math.abs(delta)}% (${from}% -> ${to}%)`,
        statKey: stat.key,
        delta,
        color: stat.color,
      });
    }
  }
  return { changes, notifications };
}

function detectPhaseChanges(prev: ErosStatusState, next: ErosStatusState): { tabSwitch: string | null; notifications: Notification[] } {
  const notifications: Notification[] = [];
  let tabSwitch: string | null = null;

  const prevSexActive = prev?.sexModule?.active;
  const nextSexActive = next?.sexModule?.active;
  const prevSexPhase = prev?.sexModule?.phase;
  const nextSexPhase = next?.sexModule?.phase;

  if (!prevSexActive && nextSexActive) {
    tabSwitch = 'sex';
    notifications.push({
      level: nextSexPhase === 'sex' ? 'critical' : 'warning',
      message: nextSexPhase === 'sex' ? '🔥 Sex scene detected — switching to Sex panel' : '💋 Flirting detected — switching to Sex panel',
      phaseChange: 'sex_activated',
    });
  } else if (prevSexPhase !== nextSexPhase && nextSexActive) {
    if (nextSexPhase === 'post-sex') {
      notifications.push({ level: 'info', message: '🌙 Post-sex afterglow — scene concluded', phaseChange: 'post_sex' });
    }
  }

  const prevReactionActive = prev?.reactionModule?.active;
  const nextReactionActive = next?.reactionModule?.active;
  if (!prevReactionActive && nextReactionActive) {
    tabSwitch = tabSwitch || 'reaction';
    notifications.push({ level: 'info', message: '🧠 Reaction module triggered — emotional response detected', phaseChange: 'reaction_activated' });
  }

  const prevNTRActive = prev?.ntrModule?.active;
  const nextNTRActive = next?.ntrModule?.active;
  if (!prevNTRActive && nextNTRActive) {
    notifications.push({ level: 'critical', message: '💔 NTR event triggered — betrayal detected', phaseChange: 'ntr_activated' });
  }

  return { tabSwitch, notifications };
}

// ---------------------------------------------------------------------------
// Validacao de comandos da UI
// ---------------------------------------------------------------------------

function validateUICommands(commands: UICommands, currentState: ErosStatusState): { validated: UICommands; rejected: string[] } {
  const rejected: string[] = [];
  const validated: UICommands = { ...commands };

  if (validated.suggested_tab) {
    const allowedTabs = ['status', 'inventory', 'character', 'location', 'npcs', 'raw', 'aiconfig', 'img'];
    if (validated.suggested_tab === 'sex') {
      if (currentState?.sexModule?.active) allowedTabs.push('sex');
      else { rejected.push(`suggested_tab:sex (sexModule not active)`); validated.suggested_tab = ''; }
    }
    if (validated.suggested_tab === 'reaction') {
      if (currentState?.reactionModule?.active) allowedTabs.push('reaction');
      else { rejected.push(`suggested_tab:reaction (reactionModule not active)`); validated.suggested_tab = ''; }
    }
    if (validated.suggested_tab === 'ntr') {
      if (currentState?.ntrModule?.active) allowedTabs.push('ntr');
      else { rejected.push(`suggested_tab:ntr (ntrModule not active)`); validated.suggested_tab = ''; }
    }
    if (validated.suggested_tab && !allowedTabs.includes(validated.suggested_tab)) {
      rejected.push(`suggested_tab:${validated.suggested_tab} (not a valid tab)`);
      validated.suggested_tab = '';
    }
  }

  if (validated.map_focus) {
    const knownRooms = [
      currentState?.location?.currentRoom,
      ...(currentState?.location?.visitedRooms || []),
      ...(currentState?.location?.knownRooms || []),
    ].filter((r): r is string => Boolean(r)).map((r) => r.toLowerCase());
    const focusLower = validated.map_focus.toLowerCase();
    if (!knownRooms.some((r) => r.includes(focusLower) || focusLower.includes(r))) {
      if (focusLower.length < 2) {
        rejected.push(`map_focus:${validated.map_focus} (invalid room name)`);
        validated.map_focus = '';
      }
    }
  }

  if (validated.notification?.level && !['info', 'warn', 'success', 'error'].includes(validated.notification.level)) {
    validated.notification.level = 'info';
  }

  return { validated, rejected };
}

// ---------------------------------------------------------------------------
// Schema / NTR gating
// ---------------------------------------------------------------------------

export function enforceSchema(state: ErosStatusState): string[] {
  const coerced: string[] = [];

  if (!state.character?.name || state.character.name === '') {
    state.character = { ...(state.character || {}), name: 'Unknown' } as ErosStatusState['character'];
    coerced.push('character.name:empty->Unknown');
  }

  if (state.progressions) {
    for (const [key, val] of Object.entries(state.progressions)) {
      if (typeof val !== 'number' || Number.isNaN(val)) {
        (state.progressions as Record<string, number>)[key] = 0;
        coerced.push(`progressions.${key}:${val}->0 (type coercion)`);
      } else if (val < 0 || val > 100) {
        const clamped = Math.max(0, Math.min(100, val));
        (state.progressions as Record<string, number>)[key] = clamped;
        coerced.push(`progressions.${key}:${val}->${clamped} (out of range)`);
      }
    }
  }

  if (state.system?.day !== undefined) {
    const d = parseInt(String(state.system.day), 10);
    if (Number.isNaN(d) || d < 1) {
      state.system.day = 1;
      coerced.push(`system.day:${state.system.day}->1`);
    } else {
      state.system.day = d;
    }
  }

  if (state.sexModule?.orgasmCount !== undefined) {
    const c = parseInt(String(state.sexModule.orgasmCount), 10);
    state.sexModule.orgasmCount = Number.isNaN(c) || c < 0 ? 0 : c;
  }

  if (state.ntrModule?.jealousyLevel !== undefined) {
    state.ntrModule.jealousyLevel = Math.max(0, Math.min(100, parseInt(String(state.ntrModule.jealousyLevel), 10) || 0));
  }

  if (state.sexModule?.sensory_metrics) {
    const sm = state.sexModule.sensory_metrics;
    if (sm.intensity !== undefined) sm.intensity = Math.max(0, Math.min(100, parseInt(String(sm.intensity), 10) || 0));
    if (sm.threshold !== undefined) sm.threshold = Math.max(0, Math.min(100, parseInt(String(sm.threshold), 10) || 0));
  }

  return coerced;
}

export function enforceNTRGate(state: ErosStatusState, ntrEnabled: boolean): string[] {
  if (ntrEnabled) return [];
  const blocked: string[] = [];

  if (state.ntrModule?.active || state.ntrModule?.enabled) {
    state.ntrModule = {
      enabled: false,
      active: false,
      ntrCharacter: '',
      ntrPartner: '',
      jealousyLevel: 0,
      betrayalStage: '',
      notes: '',
    };
    blocked.push('NTR_MODULE_BLOCKED (toggle=OFF)');
  }

  if (state.ui_commands?.notification?.message) {
    const msg = state.ui_commands.notification.message.toLowerCase();
    if (msg.includes('betrayal') || msg.includes('ntr') || msg.includes('traicao')) {
      state.ui_commands.notification = { level: undefined, message: '' };
      blocked.push('NTR_NOTIFICATION_BLOCKED');
    }
  }

  if (state.ui_commands?.suggested_tab === 'ntr') {
    state.ui_commands.suggested_tab = '';
    blocked.push('NTR_TAB_SWITCH_BLOCKED');
  }

  return blocked;
}

export function enforceSexGate(state: ErosStatusState, sexEnabled: boolean): string[] {
  if (sexEnabled) return [];
  const blocked: string[] = [];

  if (state.sexModule?.active || state.sexModule?.phase !== 'none') {
    state.sexModule = deepClone(DEFAULT_SEX_MODULE);
    blocked.push('SEX_MODULE_BLOCKED (toggle=OFF)');
  }

  if (state.ui_commands?.suggested_tab === 'sex') {
    state.ui_commands.suggested_tab = '';
    blocked.push('SEX_TAB_SWITCH_BLOCKED');
  }

  return blocked;
}

export function enforceReactionGate(state: ErosStatusState, reactionEnabled: boolean): string[] {
  if (reactionEnabled) return [];
  const blocked: string[] = [];

  if (state.reactionModule?.active || (state.reactionModule?.reactions?.length || 0) > 0) {
    state.reactionModule = deepClone(DEFAULT_REACTION_MODULE);
    blocked.push('REACTION_MODULE_BLOCKED (toggle=OFF)');
  }

  if (state.ui_commands?.suggested_tab === 'reaction') {
    state.ui_commands.suggested_tab = '';
    blocked.push('REACTION_TAB_SWITCH_BLOCKED');
  }

  return blocked;
}

export function validateInitialState(parsedState: ErosStatusState): { state: ErosStatusState; invalidations: string[] } {
  const invalidations: string[] = [];
  if (parsedState.system?.day !== undefined && parsedState.system.day < 1) {
    parsedState.system.day = 1;
    invalidations.push('day:<1->1');
  }
  if (parsedState.progressions) {
    for (const [key, val] of Object.entries(parsedState.progressions)) {
      if (typeof val === 'number' && (val < 0 || val > 100)) {
        (parsedState.progressions as Record<string, number>)[key] = Math.max(0, Math.min(100, val));
        invalidations.push(`progressions.${key}:${val}->${parsedState.progressions[key as keyof Progressions]}`);
      }
    }
  }
  parsedState.meta.validated = invalidations.length === 0;
  parsedState.meta.coerced_fields = invalidations;
  return { state: parsedState, invalidations };
}

// ---------------------------------------------------------------------------
// Processamento principal
// ---------------------------------------------------------------------------

export function processIncomingState(
  previousState: ErosStatusState,
  parsedState: Partial<ErosStatusState>,
  options: ProcessOptions = {},
): ProcessResult {
  const {
    ntrEnabled = false,
    auditorEnabled = true,
    imgAuditorEnabled = true,
    config,
    currentTurnId = 't0_v0',
    parentTurnId = '',
    previousChatState,
  } = options;

  const invalidations: string[] = [];
  const allNotifications: Notification[] = [];
  const rejectedCommands: string[] = [];

  // Garante um previousState valido
  const prev = previousState || createInitialState();

  // Merge incremental: prev + parsed -> candidato
  const candidate = mergePartialState(prev, parsedState as Partial<ErosStatusState>);

  // NTR gate
  const ntrBlocked = enforceNTRGate(candidate, ntrEnabled);
  invalidations.push(...ntrBlocked);

  // Sex / Reaction gates (driven by config toggles)
  const sexBlocked = enforceSexGate(candidate, config?.enableSexModule ?? true);
  const reactionBlocked = enforceReactionGate(candidate, config?.enableReactionModule ?? true);
  invalidations.push(...sexBlocked, ...reactionBlocked);

  // Schema enforcement
  const schemaCoerced = enforceSchema(candidate);
  invalidations.push(...schemaCoerced);

  // Coerencia temporal / espacial
  const timeResult = validateTimeCoherence(prev, candidate);
  invalidations.push(...timeResult.coerced);

  const locResult = validateLocationCoherence(prev, candidate);
  invalidations.push(...locResult);

  // Mudancas de fase (auto-tab)
  const phaseResult = detectPhaseChanges(prev, candidate);
  const autoTabSwitch = phaseResult.tabSwitch;
  allNotifications.push(...phaseResult.notifications);

  // Mudancas de progressao
  const progResult = detectProgressionChanges(prev.progressions, candidate.progressions);
  const topProgNotifications = progResult.notifications
    .sort((a, b) => Math.abs(b.delta || 0) - Math.abs(a.delta || 0))
    .slice(0, 2);
  allNotifications.push(...topProgNotifications);

  // Validacao de ui_commands
  if (candidate.ui_commands) {
    const cmdResult = validateUICommands(candidate.ui_commands, candidate);
    candidate.ui_commands = cmdResult.validated;
    rejectedCommands.push(...cmdResult.rejected);
    if (cmdResult.validated.notification?.message) {
      allNotifications.push({
        level: (cmdResult.validated.notification.level as 'info' | 'warning' | 'critical') || 'info',
        message: cmdResult.validated.notification.message,
      });
    }
  }

  // Auditoria passiva
  const auditIssues = auditorEnabled ? runAudit(prev, candidate, { imgAuditorEnabled }) : [];

  // Metadados
  const finalTabSwitch = candidate.ui_commands?.suggested_tab || autoTabSwitch || null;
  candidate.meta.validated = invalidations.length === 0;
  candidate.meta.coerced_fields = invalidations;
  // Preserva correctedIds/ignoredIds entre turnos, a menos que explicitamente alterados pelo usuario.
  candidate.audit = {
    issues: auditIssues,
    ignoredIds: prev.audit?.ignoredIds ? [...prev.audit.ignoredIds] : [],
    correctedIds: prev.audit?.correctedIds ? [...prev.audit.correctedIds] : [],
  };
  candidate.meta.turn_id = currentTurnId;
  candidate.meta.parent_turn_id = parentTurnId;

  // Estado do chat (fog-of-war / memoria)
  const chatState = buildChatStateUpdate(candidate, currentTurnId, parentTurnId, previousChatState);

  return {
    state: candidate,
    tabSwitch: finalTabSwitch,
    notifications: allNotifications,
    progressionChanges: progResult.changes,
    invalidations,
    rejectedCommands,
    auditIssues,
    messageState: candidate,
    chatState,
  };
}

function buildChatStateUpdate(
  next: ErosStatusState,
  currentTurnId: string,
  parentTurnId: string,
  previousChat?: ErosChatState,
): ErosChatState {
  const base = previousChat || createDefaultChatState();

  const currentRoom = next.location?.currentRoom;
  const visitedRooms = new Set(base.visitedRooms);
  const revealedRooms = new Set(base.revealedRooms);

  if (currentRoom) {
    visitedRooms.add(currentRoom);
    revealedRooms.add(currentRoom);
  }

  for (const room of next.ui_commands?.map_reveal || []) {
    if (room) revealedRooms.add(room);
  }

  const summary = buildTurnSummary(next);
  const updatedHistory = appendTurnToHistory(base, {
    turn_id: currentTurnId,
    parent_turn_id: parentTurnId || undefined,
    branch_index: next.meta?.branch_index || 0,
    summary,
  });

  const memoryContext = buildMemoryContext(base.longTermMemory);
  const longTermMemory = condenseIfNeeded(base.longTermMemory, updatedHistory.turnHistory, memoryContext);

  return {
    ...base,
    visitedRooms: Array.from(visitedRooms),
    revealedRooms: Array.from(revealedRooms),
    turnHistory: updatedHistory.turnHistory,
    longTermMemory,
    globalMeta: {
      totalTurns: (base.globalMeta?.totalTurns || 0) + 1,
      currentBranch: next.meta?.branch_index || base.globalMeta?.currentBranch || 0,
    },
  };
}

function buildTurnSummary(state: ErosStatusState): string {
  const c = state.character;
  const loc = state.location;
  const p = state.progressions;
  return `Day ${state.system?.day || '?'} ${state.system?.time || ''} | ${c?.name || '?'} @ ${loc?.currentRoom || '?'} | mood:${c?.mood || '?'} aff:${p?.affection ?? 0}%`;
}

function condenseIfNeeded(
  longTermMemory: ErosChatState['longTermMemory'],
  turnHistory: ErosChatState['turnHistory'],
  existingContext: string,
): NonNullable<ErosChatState['longTermMemory']> {
  const base = longTermMemory || { facts: [], narrativeSummary: '', lastCondensedTurn: undefined };
  const facts = new Set(base.facts);

  // Mantem ultimos 20 turnos no historico; condensa o restante em fatos/resumo
  if (turnHistory && turnHistory.length > 20) {
    const oldTurns = turnHistory.slice(0, turnHistory.length - 20);
    for (const turn of oldTurns) {
      if (turn.summary) facts.add(turn.summary);
    }
  }

  const recentSummaries = (turnHistory || []).slice(-20).map((t) => t.summary).filter((s): s is string => Boolean(s));
  const narrativeSummary = [existingContext, ...recentSummaries].join('\n').slice(-4000);

  return {
    facts: Array.from(facts).slice(-200),
    narrativeSummary,
    lastCondensedTurn: turnHistory?.[turnHistory.length - 1]?.turn_id,
  };
}
