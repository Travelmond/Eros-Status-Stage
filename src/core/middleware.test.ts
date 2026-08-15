import { describe, it, expect } from 'vitest';
import { processIncomingState, enforceNTRGate, enforceSexGate, enforceReactionGate } from './middleware';
import { createInitialState, createDefaultChatState } from './state';
import type { ErosStatusState } from '../types/eros-status';

describe('processIncomingState', () => {
  it('preserves existing state when no new data overrides it', () => {
    const previous = createInitialState({
      character: { name: 'Hanako', mood: 'Flustered' },
      progressions: { affection: 70 },
    });
    const result = processIncomingState(previous, {}, { ntrEnabled: false });
    expect(result.messageState.character.name).toBe('Hanako');
    expect(result.messageState.character.mood).toBe('Flustered');
    expect(result.messageState.progressions.affection).toBe(70);
  });

  it('blocks NTR module when enableNTR is false', () => {
    const previous = createInitialState();
    const parsed: Partial<ErosStatusState> = {
      ntrModule: { active: true, enabled: true, jealousyLevel: 50, ntrPartner: 'Rival' },
    };
    const result = processIncomingState(previous, parsed, { ntrEnabled: false });
    expect(result.messageState.ntrModule.active).toBe(false);
    expect(result.messageState.ntrModule.enabled).toBe(false);
    expect(result.messageState.ntrModule.jealousyLevel).toBe(0);
    expect(result.invalidations).toContain('NTR_MODULE_BLOCKED (toggle=OFF)');
  });

  it('allows NTR module when enableNTR is true', () => {
    const previous = createInitialState();
    const parsed: Partial<ErosStatusState> = {
      ntrModule: { active: true, enabled: true, jealousyLevel: 50, ntrPartner: 'Rival' },
    };
    const result = processIncomingState(previous, parsed, { ntrEnabled: true });
    expect(result.messageState.ntrModule.active).toBe(true);
    expect(result.messageState.ntrModule.enabled).toBe(true);
    expect(result.messageState.ntrModule.jealousyLevel).toBe(50);
    expect(result.invalidations).not.toContain('NTR_MODULE_BLOCKED (toggle=OFF)');
  });

  it('coerces progressions out of range', () => {
    const previous = createInitialState();
    const parsed: Partial<ErosStatusState> = {
      progressions: { affection: 150, arousal: -10 },
    };
    const result = processIncomingState(previous, parsed, {});
    expect(result.messageState.progressions.affection).toBe(100);
    expect(result.messageState.progressions.arousal).toBe(0);
    expect(result.invalidations.some((i) => i.includes('progressions.affection'))).toBe(true);
    expect(result.invalidations.some((i) => i.includes('progressions.arousal'))).toBe(true);
  });

  it('increments totalTurns in chatState', () => {
    const previous = createInitialState();
    const previousChat = createDefaultChatState({ globalMeta: { totalTurns: 5, currentBranch: 0 } });
    const result = processIncomingState(previous, { system: { day: 2 } }, { previousChatState: previousChat });
    expect(result.chatState.globalMeta?.totalTurns).toBe(6);
  });

  it('blocks time rewind beyond threshold', () => {
    const previous = createInitialState({ system: { day: 2, time: '14:00' } });
    const parsed: Partial<ErosStatusState> = {
      system: { day: 2, time: '10:00' },
    };
    const result = processIncomingState(previous, parsed, {});
    expect(result.messageState.system.time).toBe('14:00');
    expect(result.invalidations.some((i) => i.includes('time:'))).toBe(true);
  });
});

describe('enforceNTRGate', () => {
  it('clears NTR notification and tab switch when disabled', () => {
    const state = createInitialState({
      ntrModule: { active: true, enabled: true },
      ui_commands: {
        suggested_tab: 'ntr',
        notification: { level: 'error', message: 'betrayal detected' },
        map_focus: '',
        map_reveal: [],
      },
    });
    const blocked = enforceNTRGate(state, false);
    expect(blocked).toContain('NTR_MODULE_BLOCKED (toggle=OFF)');
    expect(blocked).toContain('NTR_NOTIFICATION_BLOCKED');
    expect(blocked).toContain('NTR_TAB_SWITCH_BLOCKED');
    expect(state.ui_commands.suggested_tab).toBe('');
    expect(state.ui_commands.notification?.message).toBe('');
  });
});

describe('enforceSexGate', () => {
  it('clears sex module and tab switch when disabled', () => {
    const state = createInitialState({
      sexModule: { active: true, phase: 'sex', position: 'missionary' },
      ui_commands: { suggested_tab: 'sex' },
    });
    const blocked = enforceSexGate(state, false);
    expect(blocked).toContain('SEX_MODULE_BLOCKED (toggle=OFF)');
    expect(blocked).toContain('SEX_TAB_SWITCH_BLOCKED');
    expect(state.sexModule.active).toBe(false);
    expect(state.sexModule.phase).toBe('none');
    expect(state.ui_commands.suggested_tab).toBe('');
  });

  it('does nothing when sex module is enabled', () => {
    const state = createInitialState({
      sexModule: { active: true, phase: 'sex' },
      ui_commands: { suggested_tab: 'sex' },
    });
    const blocked = enforceSexGate(state, true);
    expect(blocked).toHaveLength(0);
    expect(state.sexModule.active).toBe(true);
    expect(state.ui_commands.suggested_tab).toBe('sex');
  });
});

describe('enforceReactionGate', () => {
  it('clears reaction module and tab switch when disabled', () => {
    const state = createInitialState({
      reactionModule: {
        active: true,
        character: 'Hanako',
        reactions: [{ emoji: '😳', label: 'Blush', text: 'My cheeks burn...' }],
      },
      ui_commands: { suggested_tab: 'reaction' },
    });
    const blocked = enforceReactionGate(state, false);
    expect(blocked).toContain('REACTION_MODULE_BLOCKED (toggle=OFF)');
    expect(blocked).toContain('REACTION_TAB_SWITCH_BLOCKED');
    expect(state.reactionModule.active).toBe(false);
    expect(state.reactionModule.reactions).toHaveLength(0);
    expect(state.ui_commands.suggested_tab).toBe('');
  });

  it('does nothing when reaction module is enabled', () => {
    const state = createInitialState({
      reactionModule: { active: true, reactions: [{ emoji: '😳', label: 'Blush', text: 'My cheeks burn...' }] },
      ui_commands: { suggested_tab: 'reaction' },
    });
    const blocked = enforceReactionGate(state, true);
    expect(blocked).toHaveLength(0);
    expect(state.reactionModule.active).toBe(true);
    expect(state.ui_commands.suggested_tab).toBe('reaction');
  });
});

describe('audit correctedIds / ignoredIds persistence', () => {
  it('preserves correctedIds and ignoredIds from previous state', () => {
    const previous = createInitialState({
      audit: {
        issues: [],
        correctedIds: ['corr-1'],
        ignoredIds: ['ign-1'],
      },
    });
    const result = processIncomingState(previous, { system: { day: 2 } }, {});
    expect(result.messageState.audit.correctedIds).toContain('corr-1');
    expect(result.messageState.audit.ignoredIds).toContain('ign-1');
  });

  it('does not lose ids across multiple turns', () => {
    let state = createInitialState({
      audit: {
        issues: [],
        correctedIds: ['corr-1'],
        ignoredIds: ['ign-1'],
      },
    });
    state = processIncomingState(state, { system: { day: 2 } }, {}).messageState;
    state = processIncomingState(state, { system: { day: 3 } }, {}).messageState;
    state = processIncomingState(state, { system: { day: 4 } }, {}).messageState;
    expect(state.audit.correctedIds).toContain('corr-1');
    expect(state.audit.ignoredIds).toContain('ign-1');
  });

  it('keeps empty arrays when previous audit has no ids', () => {
    const previous = createInitialState();
    const result = processIncomingState(previous, { system: { day: 2 } }, {});
    expect(result.messageState.audit.correctedIds).toEqual([]);
    expect(result.messageState.audit.ignoredIds).toEqual([]);
  });

  it('applies sex/reaction gating through config toggles', () => {
    const previous = createInitialState();
    const parsed: Partial<ErosStatusState> = {
      sexModule: { active: true, phase: 'sex' },
      reactionModule: { active: true, reactions: [{ emoji: '😳', label: 'Blush', text: '' }] },
      ui_commands: { suggested_tab: 'sex' },
    };
    const result = processIncomingState(previous, parsed, {
      config: { enableSexModule: false, enableReactionModule: false },
    });
    expect(result.messageState.sexModule.active).toBe(false);
    expect(result.messageState.reactionModule.active).toBe(false);
    expect(result.invalidations).toContain('SEX_MODULE_BLOCKED (toggle=OFF)');
    expect(result.invalidations).toContain('REACTION_MODULE_BLOCKED (toggle=OFF)');
  });
});
