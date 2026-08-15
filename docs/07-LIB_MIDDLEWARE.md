# 07 — src/lib/stateMiddleware.js (Middleware híbrido)

> Parte 7/10. Código-fonte COMPLETO do middleware híbrido — 536 linhas de JavaScript puro.

---

### `src/lib/stateMiddleware.js`

```js
/**
 * ═══════════════════════════════════════════════════════════════════
 * State Middleware — Eros Status Terminal (Modelo Híbrido)
 * ═══════════════════════════════════════════════════════════════════
 *
 * FUNÇÃO: Processa o estado recebido do parser ANTES de aplicá-lo
 * ao terminal, agindo como "juiz" entre os dados da IA e a UI.
 *
 * Responsabilidades:
 *   1. VALIDAR coerência temporal/espacial (day, time, location)
 *   2. AUTO-TRIGGER mudanças de aba baseadas em dados (não comandos)
 *   3. VALIDAR ui_commands da IA (rejeitar os inválidos)
 *   4. DETECTAR mudanças de progressão para feedback visual
 *   5. GERAR notificações automáticas baseadas em eventos de estado
 *
 * ── DEPLOY NO CHUB VENUS AI ─────────────────────────────────────
 * ✅ Este arquivo NÃO depende de Base44 ou React.
 *    É JavaScript puro — compatível com qualquer ambiente.
 * ═══════════════════════════════════════════════════════════════════
 */

import { runAudit } from './consistencyAuditor';

const MAX_DAY_ADVANCE = 7;
const MAX_TIME_REWIND_HOURS = 2;
const AFFECTION_CHANGE_THRESHOLD = 10;
const AROUSAL_CHANGE_THRESHOLD = 15;
const CORRUPTION_CHANGE_THRESHOLD = 10;

function validateTimeCoherence(prev, next) {
  const coerced = [];
  let day = next.system?.day;
  let time = next.system?.time;
  const prevDay = prev?.system?.day || 0;
  const prevTime = prev?.system?.time || '00:00';
  if (day !== undefined && prevDay > 0) {
    if (day < prevDay) { day = prevDay; coerced.push(`day:${next.system.day}→${prevDay} (rewind blocked)`); }
    if (day > prevDay + MAX_DAY_ADVANCE) { day = prevDay + 1; coerced.push(`day:${next.system.day}→${prevDay + 1} (excessive jump capped)`); }
  }
  if (time && prevTime && prevTime !== '??:??') {
    const [prevH, prevM] = prevTime.split(':').map(Number);
    const [nextH, nextM] = time.split(':').map(Number);
    if (!isNaN(prevH) && !isNaN(nextH)) {
      const prevTotal = prevH * 60 + prevM;
      const nextTotal = nextH * 60 + nextM;
      if (day === prevDay && nextTotal < prevTotal - MAX_TIME_REWIND_HOURS * 60 && prevTotal > 0) {
        time = prevTime; coerced.push(`time:${next.system.time}→${prevTime} (rewind blocked)`);
      }
    }
  }
  return { day, time, coerced };
}

function validateLocationCoherence(prev, next) {
  const coerced = [];
  const prevBuilding = prev?.location?.building?.toLowerCase();
  const nextBuilding = next?.location?.building?.toLowerCase();
  const prevRoom = prev?.location?.currentRoom?.toLowerCase();
  const nextRoom = next?.location?.currentRoom?.toLowerCase();
  if (prevBuilding && nextBuilding && prevBuilding !== nextBuilding && prevRoom === nextRoom) {
    coerced.push(`building:${next.location.building}→${prev.location.building}`);
  }
  return coerced;
}

function detectProgressionChanges(prevProg, nextProg) {
  const changes = [];
  const notifications = [];
  if (!prevProg || !nextProg) return { changes, notifications };
  const trackedStats = [
    { key: 'affection',   label: 'Affection',   emoji: '💕', threshold: AFFECTION_CHANGE_THRESHOLD, color: '#FF2D78' },
    { key: 'obedience',   label: 'Obedience',   emoji: '🎯', threshold: 10, color: '#00FFF5' },
    { key: 'libido',      label: 'Libido',      emoji: '🔥', threshold: 10, color: '#FF2D78' },
    { key: 'arousal',     label: 'Arousal',     emoji: '🍑', threshold: AROUSAL_CHANGE_THRESHOLD, color: '#FF2D78' },
    { key: 'corruption',  label: 'Corruption',  emoji: '☠️', threshold: CORRUPTION_CHANGE_THRESHOLD, color: '#BF5FFF' },
    { key: 'trust',       label: 'Trust',       emoji: '⭐', threshold: 10, color: '#FFD700' },
    { key: 'love',        label: 'Love',        emoji: '💗', threshold: 10, color: '#FF2D78' },
    { key: 'jealousy',    label: 'Jealousy',    emoji: '💚', threshold: 15, color: '#BF5FFF' },
    { key: 'embarrassment', label: 'Embarrassment', emoji: '😳', threshold: 15, color: '#FFD700' },
  ];
  for (const stat of trackedStats) {
    const from = prevProg[stat.key] ?? 0;
    const to = nextProg[stat.key] ?? 0;
    const delta = to - from;
    if (Math.abs(delta) >= stat.threshold) {
      changes.push({ key: stat.key, from, to, delta, emoji: stat.emoji, color: stat.color });
      const direction = delta > 0 ? '↑' : '↓';
      const level = stat.key === 'corruption' && delta > 15 ? 'critical' : stat.key === 'jealousy' && delta > 20 ? 'warning' : delta > 15 ? 'info' : 'info';
      notifications.push({ level, message: `${stat.emoji} ${stat.label} ${direction}${Math.abs(delta)}% (${from}% → ${to}%)`, statKey: stat.key, delta, color: stat.color });
    }
  }
  return { changes, notifications };
}

function detectPhaseChanges(prev, next) {
  const notifications = [];
  let tabSwitch = null;
  const prevSexActive = prev?.sexModule?.active;
  const nextSexActive = next?.sexModule?.active;
  const prevSexPhase = prev?.sexModule?.phase;
  const nextSexPhase = next?.sexModule?.phase;
  if (!prevSexActive && nextSexActive) {
    tabSwitch = 'sex';
    notifications.push({ level: nextSexPhase === 'sex' ? 'critical' : 'warning', message: nextSexPhase === 'sex' ? '🔥 Sex scene detected — switching to Sex panel' : '💋 Flirting detected — switching to Sex panel', phaseChange: 'sex_activated' });
  } else if (prevSexPhase !== nextSexPhase && nextSexActive) {
    if (nextSexPhase === 'post-sex') notifications.push({ level: 'info', message: '🌙 Post-sex afterglow — scene concluded', phaseChange: 'post_sex' });
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

function validateUICommands(commands, currentState) {
  const rejected = [];
  const validated = { ...commands };
  if (validated.suggested_tab) {
    const allowedTabs = ['status', 'inventory', 'character', 'location', 'npcs', 'raw', 'aiconfig', 'img'];
    if (validated.suggested_tab === 'sex') { if (currentState?.sexModule?.active) allowedTabs.push('sex'); else { rejected.push(`suggested_tab:sex (sexModule not active)`); validated.suggested_tab = ''; } }
    if (validated.suggested_tab === 'reaction') { if (currentState?.reactionModule?.active) allowedTabs.push('reaction'); else { rejected.push(`suggested_tab:reaction (reactionModule not active)`); validated.suggested_tab = ''; } }
    if (validated.suggested_tab === 'ntr') { if (currentState?.ntrModule?.active) allowedTabs.push('ntr'); else { rejected.push(`suggested_tab:ntr (ntrModule not active)`); validated.suggested_tab = ''; } }
    if (validated.suggested_tab && !allowedTabs.includes(validated.suggested_tab)) { rejected.push(`suggested_tab:${validated.suggested_tab} (not a valid tab)`); validated.suggested_tab = ''; }
  }
  if (validated.map_focus) {
    const knownRooms = [currentState?.location?.currentRoom, ...(currentState?.location?.visitedRooms || []), ...(currentState?.location?.knownRooms || [])].filter(Boolean).map(r => r.toLowerCase());
    const focusLower = validated.map_focus.toLowerCase();
    if (!knownRooms.some(r => r.includes(focusLower) || focusLower.includes(r))) { if (focusLower.length < 2) { rejected.push(`map_focus:${validated.map_focus} (invalid room name)`); validated.map_focus = ''; } }
  }
  if (validated.notification?.level && !['info', 'warning', 'critical'].includes(validated.notification.level)) validated.notification.level = 'info';
  return { validated, rejected };
}

function enforceSchema(state) {
  const coerced = [];
  if (!state.character?.name || state.character.name === '') { state.character = state.character || {}; state.character.name = 'Unknown'; coerced.push('character.name:empty→Unknown'); }
  if (state.progressions) {
    for (const [key, val] of Object.entries(state.progressions)) {
      if (typeof val !== 'number' || isNaN(val)) { state.progressions[key] = 0; coerced.push(`progressions.${key}:${val}→0 (type coercion)`); }
      else if (val < 0 || val > 100) { const clamped = Math.max(0, Math.min(100, val)); state.progressions[key] = clamped; coerced.push(`progressions.${key}:${val}→${clamped} (out of range)`); }
    }
  }
  if (state.system?.day !== undefined) { const d = parseInt(state.system.day); if (isNaN(d) || d < 1) { state.system.day = 1; coerced.push(`system.day:${state.system.day}→1`); } else state.system.day = d; }
  if (state.sexModule?.orgasmCount !== undefined) { const c = parseInt(state.sexModule.orgasmCount); state.sexModule.orgasmCount = isNaN(c) || c < 0 ? 0 : c; }
  if (state.ntrModule?.jealousyLevel !== undefined) { state.ntrModule.jealousyLevel = Math.max(0, Math.min(100, parseInt(state.ntrModule.jealousyLevel) || 0)); }
  if (state.sexModule?.sensory_metrics) {
    const sm = state.sexModule.sensory_metrics;
    if (sm.intensity !== undefined) sm.intensity = Math.max(0, Math.min(100, parseInt(sm.intensity) || 0));
    if (sm.threshold !== undefined) sm.threshold = Math.max(0, Math.min(100, parseInt(sm.threshold) || 0));
  }
  return coerced;
}

function enforceNTRGate(state, ntrEnabled) {
  if (ntrEnabled) return [];
  const blocked = [];
  if (state.ntrModule?.active || state.ntrModule?.enabled) {
    state.ntrModule = { enabled: false, active: false, ntrCharacter: '', ntrPartner: '', jealousyLevel: 0, betrayalStage: '', notes: '' };
    blocked.push('NTR_MODULE_BLOCKED (toggle=OFF)');
  }
  if (state.ui_commands?.notification?.message) {
    const msg = state.ui_commands.notification.message.toLowerCase();
    if (msg.includes('betrayal') || msg.includes('ntr') || msg.includes('traição')) { state.ui_commands.notification = { level: '', message: '' }; blocked.push('NTR_NOTIFICATION_BLOCKED'); }
  }
  if (state.ui_commands?.suggested_tab === 'ntr') { state.ui_commands.suggested_tab = ''; blocked.push('NTR_TAB_SWITCH_BLOCKED'); }
  return blocked;
}

export function processIncomingState(previousState, parsedState, options = {}) {
  const { ntrEnabled = false } = options;
  const invalidations = [];
  const allNotifications = [];
  const rejectedCommands = [];

  const ntrBlocked = enforceNTRGate(parsedState, ntrEnabled);
  invalidations.push(...ntrBlocked);

  const schemaCoerced = enforceSchema(parsedState);
  invalidations.push(...schemaCoerced);

  const timeResult = validateTimeCoherence(previousState, parsedState);
  if (timeResult.day !== parsedState.system?.day) parsedState.system.day = timeResult.day;
  if (timeResult.time !== parsedState.system?.time) parsedState.system.time = timeResult.time;
  invalidations.push(...timeResult.coerced);

  const locResult = validateLocationCoherence(previousState, parsedState);
  if (locResult.length > 0) { parsedState.location.building = previousState.location?.building; invalidations.push(...locResult); }

  const phaseResult = detectPhaseChanges(previousState, parsedState);
  const autoTabSwitch = phaseResult.tabSwitch;
  allNotifications.push(...phaseResult.notifications);

  const progResult = detectProgressionChanges(previousState.progressions, parsedState.progressions);
  const topProgNotifications = progResult.notifications.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta)).slice(0, 2);
  allNotifications.push(...topProgNotifications);

  if (parsedState.ui_commands) {
    const cmdResult = validateUICommands(parsedState.ui_commands, { ...previousState, ...parsedState });
    parsedState.ui_commands = cmdResult.validated;
    rejectedCommands.push(...cmdResult.rejected);
    if (cmdResult.validated.notification?.message) allNotifications.push(cmdResult.validated.notification);
  }

  const auditIssues = options.auditorEnabled !== false ? runAudit(previousState, parsedState, { imgAuditorEnabled: options.imgAuditorEnabled !== false }) : [];

  const finalTabSwitch = parsedState.ui_commands?.suggested_tab || autoTabSwitch;
  parsedState.meta.validated = invalidations.length === 0;
  parsedState.meta.coerced_fields = invalidations;
  parsedState.audit = { issues: auditIssues };

  return {
    state: parsedState,
    tabSwitch: finalTabSwitch,
    notifications: allNotifications,
    progressionChanges: progResult.changes,
    invalidations,
    rejectedCommands,
    auditIssues,
  };
}

export function validateInitialState(parsedState) {
  const invalidations = [];
  if (parsedState.system?.day !== undefined && parsedState.system.day < 1) { parsedState.system.day = 1; invalidations.push('day:<1→1'); }
  if (parsedState.progressions) {
    for (const [key, val] of Object.entries(parsedState.progressions)) {
      if (typeof val === 'number' && (val < 0 || val > 100)) { parsedState.progressions[key] = Math.max(0, Math.min(100, val)); invalidations.push(`progressions.${key}:${val}→${parsedState.progressions[key]}`); }
    }
  }
  parsedState.meta.validated = invalidations.length === 0;
  parsedState.meta.coerced_fields = invalidations;
  return { state: parsedState, invalidations };
}
```

---

*Próximo: `docs/08-LIB_SYSTEMS.md` — `memoryService`, `consistencyAuditor`, `relationshipSystem`, `sexPositionsLibrary` e demais libs.*