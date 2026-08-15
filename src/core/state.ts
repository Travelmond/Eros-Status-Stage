/**
 * Estado padrão e helpers de imutabilidade do Eros Status Terminal.
 */

import type {
  ErosStatusState,
  ErosInitState,
  ErosChatState,
  Progressions,
  ClothingSlots,
  BodyState,
  LocationState,
  SexModule,
  ReactionModule,
  NTRModule,
  UICommands,
  MetaState,
  ImageModule,
  AuditState,
  SystemState,
  CharacterState,
  UserCharacterState,
} from '../types/eros-status';

/** Versão atual do schema de estado. */
export const STATE_SCHEMA_VERSION = '3.0.0';

/** Progressões zeradas (valores entre 0 e 100). */
export const DEFAULT_PROGRESSIONS: Progressions = {
  affection: 0,
  obedience: 0,
  libido: 0,
  arousal: 0,
  trust: 0,
  corruption: 0,
  happiness: 50,
  embarrassment: 0,
  fatigue: 0,
  love: 0,
  jealousy: 0,
  anxiety: 0,
  fear: 0,
  anger: 0,
  nervousness: 0,
  tension: 0,
  shame: 0,
  desire: 0,
  awe: 0,
  guilt: 0,
  excitement: 0,
  sadness: 0,
  submission: 0,
  health: 100,
};

/** Slots de vestuário vazios. */
export const DEFAULT_CLOTHING_SLOTS: ClothingSlots = {
  head: '',
  upper: '',
  lower: '',
  underwear: '',
  footwear: '',
  accessories: '',
};

/** Estado corporal padrão. */
export const DEFAULT_BODY: BodyState = {
  expression: 'neutral',
  posture: 'standing',
  thoughts: '',
  shamefulThought: '',
  description: {
    hair: '',
    eyes: '',
    face: '',
    neck: '',
    chest: '',
    bust: '',
    waist: '',
    hips: '',
    legs: '',
    feet: '',
    tail: '',
    horns: '',
    special: '',
  },
};

/** Localização padrão. */
export const DEFAULT_LOCATION: LocationState = {
  currentRoom: 'Unknown',
  building: 'Unknown',
  description: '',
  visitedRooms: [],
  knownRooms: [],
  objectsInRoom: [],
  miniMapData: [],
};

/** Módulo sexual padrão (inativo). */
export const DEFAULT_SEX_MODULE: SexModule = {
  active: false,
  phase: 'none',
  position: '',
  pace: '',
  orgasmCount: 0,
  sensory_metrics: { intensity: 0, threshold: 0 },
  marking_history: [],
  senses: {
    sight: '',
    sound: '',
    smell: '',
    touch: '',
    taste: '',
  },
  male: {},
  female: {
    arousalState: '',
    lubrication: '',
    vagina: '',
    cervix: '',
    uterus: '',
    ovaries: '',
    menstrualCycle: { day: 1, phase: 'follicular', fertile: false },
  },
  stimulusDescription: '',
};

/** Módulo de reações padrão. */
export const DEFAULT_REACTION_MODULE: ReactionModule = {
  active: false,
  character: '',
  stimulus: '',
  reactions: [],
};

/** Módulo NTR padrão (desativado). */
export const DEFAULT_NTR_MODULE: NTRModule = {
  enabled: false,
  active: false,
  ntrCharacter: '',
  ntrPartner: '',
  jealousyLevel: 0,
  betrayalStage: '',
  notes: '',
};

/** Comandos de UI padrão. */
export const DEFAULT_UI_COMMANDS: UICommands = {
  suggested_tab: '',
  notification: undefined,
  map_focus: '',
  map_reveal: [],
};

/** Metadados padrão. */
export const DEFAULT_META: MetaState = {
  turn_id: 't0_v0',
  parent_turn_id: '',
  branch_index: 0,
  validated: false,
  coerced_fields: [],
  schema_version: STATE_SCHEMA_VERSION,
};

/** Módulo de imagem padrão. */
export const DEFAULT_IMG_MODULE: ImageModule = {
  anchors: { char: '', user: '' },
  scene: {
    positive: '',
    negative: '',
    camera_suggestions: [],
  },
  params: {
    checkpoint: '',
    loras: [],
    sampler: 'DPM++ 2M Karras',
    steps: 25,
    cfg: 7,
    clip_skip: 2,
    hires_fix: { enabled: false, upscale: 1.5, denoise: 0.45 },
    aspect_ratio: '3:4',
    resolution: '768x1024',
  },
};

/** Estado de auditoria padrão. */
export const DEFAULT_AUDIT: AuditState = {
  issues: [],
  ignoredIds: [],
  correctedIds: [],
};

/** Estado raiz padrão do ESS. */
export const DEFAULT_STATE: ErosStatusState = {
  system: {
    day: 1,
    time: '08:00',
    weather: 'Clear',
    location: 'Home',
    sceneType: 'daily_life',
    ambiance: '',
  } as SystemState,
  character: {
    name: 'Character',
    role: '',
    avatarUrl: '',
    expression: 'neutral',
    mood: 'Neutral',
    thoughts: '',
    shamefulThought: '',
    relationship: '',
  } as CharacterState,
  userCharacter: {
    name: 'User',
    relation: '',
    mood: '',
    summary: '',
    relationships: [],
  } as UserCharacterState,
  progressions: { ...DEFAULT_PROGRESSIONS },
  clothingSlots: { ...DEFAULT_CLOTHING_SLOTS },
  body: deepClone(DEFAULT_BODY),
  location: deepClone(DEFAULT_LOCATION),
  inventory: { items: [] },
  goals: [],
  npcs: [],
  sexModule: deepClone(DEFAULT_SEX_MODULE),
  reactionModule: deepClone(DEFAULT_REACTION_MODULE),
  ntrModule: deepClone(DEFAULT_NTR_MODULE),
  ui_commands: deepClone(DEFAULT_UI_COMMANDS),
  meta: deepClone(DEFAULT_META),
  img_module: deepClone(DEFAULT_IMG_MODULE),
  audit: deepClone(DEFAULT_AUDIT),
};

/**
 * Cria uma nova instância do estado inicial.
 * Útil para evitar mutações acidentais do DEFAULT_STATE.
 */
export function createInitialState(overrides?: Partial<ErosStatusState>): ErosStatusState {
  const base = deepClone(DEFAULT_STATE);
  if (!overrides) return base;
  return mergePartialState(base, overrides);
}

/** Estado `init` padrão para StageBase.load(). */
export function createDefaultInitState(overrides?: Partial<ErosInitState>): ErosInitState {
  return {
    schema_version: STATE_SCHEMA_VERSION,
    worldSeed: `eros-world-${Date.now()}`,
    initialKnownRooms: ['Home'],
    recurringNPCs: [],
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

/** Estado `chat` padrão para StageBase. */
export function createDefaultChatState(overrides?: Partial<ErosChatState>): ErosChatState {
  return {
    schema_version: STATE_SCHEMA_VERSION,
    visitedRooms: ['Home'],
    revealedRooms: ['Home'],
    knownMap: { rooms: {}, connections: [] },
    longTermMemory: { facts: [], narrativeSummary: '', lastCondensedTurn: undefined },
    turnHistory: [],
    globalMeta: { totalTurns: 0, currentBranch: 0 },
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Helpers de imutabilidade
// ---------------------------------------------------------------------------

/** Clona profundamente um valor simples (objeto/array/primitivo). */
export function deepClone<T>(value: T): T {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(deepClone) as unknown as T;
  const cloned = {} as Record<string, unknown>;
  for (const key of Object.keys(value as Record<string, unknown>)) {
    cloned[key] = deepClone((value as Record<string, unknown>)[key]);
  }
  return cloned as T;
}

/**
 * Mescla parcialmente o estado do ESS, preservando imutabilidade.
 * Arrays em `source` substituem arrays em `target` (não concatenam).
 */
export function mergePartialState<T extends object>(
  target: T,
  source: Partial<T>,
): T {
  const result = deepClone(target) as Record<string, unknown>;
  for (const key of Object.keys(source) as Array<keyof T>) {
    const sourceValue = source[key];
    const targetValue = result[key as string];
    if (
      sourceValue !== null &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue !== null &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      result[key as string] = mergePartialState(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>,
      );
    } else if (sourceValue !== undefined) {
      result[key as string] = deepClone(sourceValue);
    }
  }
  return result as T;
}
