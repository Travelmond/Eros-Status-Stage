/**
 * Eros Status State Management
 * Handles state creation, validation, and updates
 */

import type {
    MessageStateType,
    ProgressionValues,
    SystemData,
    LocationData,
    ClothingState,
    BodyState,
    SexModuleState,
    NTRModuleState,
    CharacterCard,
    ExpressionPoseData,
    ImportantMoment,
    SettingsState,
} from '../types/eros-status';
import { SexSceneType, NTRType, ProgressBarStyle, ThemeMode, DisplayDensity, DEFAULT_SETTINGS_STATE, DEFAULT_PANEL_STATE } from '../types/eros-status';

/**
 * Default progression values (all stats at neutral)
 */
export const DEFAULT_PROGRESSION: ProgressionValues = {
    affection: 20,
    obedience: 50,
    libido: 30,
    arousal: 0,
    trust: 20,
    corruption: 0,
    submission: 0,
    jealousy: 10,
    embarrassment: 30,
    fatigue: 0,
    happiness: 50,
};

/**
 * Default system data
 */
export const DEFAULT_SYSTEM: SystemData = {
    day: 1,
    time: '08:00',
    weather: 'clear',
};

/**
 * Default location data
 */
export const DEFAULT_LOCATION: LocationData = {
    currentRoom: 'bedroom',
    building: 'home',
    visitedRooms: ['bedroom'],
};

/**
 * Default clothing state
 */
export const DEFAULT_CLOTHING: ClothingState = {
    upperBody: 'shirt',
    lowerBody: 'pants',
    underwear: 'underwear',
    accessories: 'none',
    makeup: 'natural',
};

/**
 * Default body state
 */
export const DEFAULT_BODY: BodyState = {
    expression: 'neutral',
    posture: 'standing',
    skin: 'healthy',
    bodyParts: 'covered',
};

/**
 * Default sex module state
 */
export const DEFAULT_SEX_MODULE: SexModuleState = {
    active: false,
    sceneType: SexSceneType.QUIET,
    position: 'none',
    pace: 'none',
    arousal: 0,
    orgasmCount: 0,
};

/**
 * Default NTR module state
 */
export const DEFAULT_NTR_MODULE: NTRModuleState = {
    enabled: false,
    type: NTRType.NONE,
    partner: '',
    humiliationLevel: 0,
};

/**
 * Default character card
 */
export const DEFAULT_CHARACTER_CARD: CharacterCard = {
    id: 'default',
    name: 'Character',
    role: 'companion',
    avatarUrl: '',
    quickStat: '20 affection',
    isInScene: false,
};

/**
 * Default expression/pose data
 */
export const DEFAULT_EXPRESSION_POSE: ExpressionPoseData = {
    currentExpression: 'neutral',
    poseDescription: 'standing',
    aiPrompt: '',
    tags: [],
};

/**
 * Default settings
 */
export const DEFAULT_SETTINGS: SettingsState = {
    progressBarStyle: ProgressBarStyle.EMOJI,
    theme: ThemeMode.DARK,
    displayDensity: DisplayDensity.COMFORTABLE,
    panelConfig: {
        showProgression: true,
        showClothing: true,
        showBody: true,
        showExpression: true,
        showLocation: true,
        showInventory: true,
        showMoments: true,
    },
    showProgression: true,
    showClothing: true,
    showBody: true,
    showExpression: true,
    showLocation: true,
    showInventory: true,
    notificationsEnabled: true,
    statLocks: {},
};

/**
 * Creates the default Eros Status state
 */
export function createDefaultState(): MessageStateType {
    return {
        version: '1.0',
        progressions: { ...DEFAULT_PROGRESSION },
        system: { ...DEFAULT_SYSTEM },
        location: { ...DEFAULT_LOCATION },
        clothing: { ...DEFAULT_CLOTHING },
        body: { ...DEFAULT_BODY },
        sexModule: { ...DEFAULT_SEX_MODULE },
        ntrModule: { ...DEFAULT_NTR_MODULE },
        character: { ...DEFAULT_CHARACTER_CARD },
        expressionPose: { ...DEFAULT_EXPRESSION_POSE },
        importantMoments: [],
        npcs: [],
        relationships: [],
        aiInstructions: [],
        commandHistory: [],
        inventory: {
            items: [],
            maxSlots: 20,
        },
        turnCount: 0,
        settings: DEFAULT_SETTINGS_STATE,
        panel: DEFAULT_PANEL_STATE,
    };
}

/**
 * Creates initial state from character card data
 */
export function createInitialState(
    characterName: string,
    characterId: string,
    avatarUrl?: string
): MessageStateType {
    const state = createDefaultState();
    state.character = {
        ...state.character,
        id: characterId,
        name: characterName,
        avatarUrl: avatarUrl || '',
        quickStat: `${state.progressions.affection} affection`,
    };
    return state;
}

/**
 * Validates a progression value (0-100)
 */
export function validateProgressValue(value: unknown): number {
    if (typeof value !== 'number') return 0;
    return Math.max(0, Math.min(100, Math.round(value)));
}

/**
 * Validates the complete state integrity
 */
export function validateStateIntegrity(state: unknown): state is MessageStateType {
    if (!state || typeof state !== 'object') return false;

    const s = state as Record<string, unknown>;

    // Check required top-level properties
    const required = ['progressions', 'system', 'location', 'clothing', 'body', 'sexModule', 'ntrModule', 'character'];
    for (const key of required) {
        if (!(key in s)) return false;
    }

    // Validate progression values
    if (typeof s.progressions === 'object' && s.progressions !== null) {
        const prog = s.progressions as Record<string, unknown>;
        const validKeys = ['affection', 'obedience', 'libido', 'arousal', 'trust', 'corruption', 'submission', 'jealousy', 'embarrassment', 'fatigue', 'happiness'];
        for (const key of validKeys) {
            if (typeof prog[key] !== 'number') return false;
        }
    } else {
        return false;
    }

    return true;
}

/**
 * Validates and sanitizes incoming state updates
 */
export function sanitizeStateUpdate(updates: Record<string, unknown>): Partial<MessageStateType> {
    const sanitized: Record<string, unknown> = {};

    // Handle progression updates
    if (updates.progressions && typeof updates.progressions === 'object') {
        const prog = updates.progressions as Record<string, unknown>;
        sanitized.progressions = {};
        for (const key of Object.keys(prog)) {
            if (key in DEFAULT_PROGRESSION) {
                (sanitized.progressions as Record<string, number>)[key] = validateProgressValue(prog[key]);
            }
        }
    }

    // Handle system updates
    if (updates.system && typeof updates.system === 'object') {
        const sys = updates.system as Record<string, unknown>;
        sanitized.system = {};
        if (typeof sys.day === 'number') {
            (sanitized.system as SystemData).day = Math.max(1, Math.round(sys.day));
        }
        if (typeof sys.time === 'string') {
            (sanitized.system as SystemData).time = sys.time.substring(0, 5);
        }
        if (typeof sys.weather === 'string') {
            (sanitized.system as SystemData).weather = sys.weather.substring(0, 50);
        }
    }

    // Handle location updates
    if (updates.location && typeof updates.location === 'object') {
        const loc = updates.location as Record<string, unknown>;
        sanitized.location = {};
        if (typeof loc.currentRoom === 'string') {
            (sanitized.location as LocationData).currentRoom = loc.currentRoom.substring(0, 50);
        }
        if (typeof loc.building === 'string') {
            (sanitized.location as LocationData).building = loc.building.substring(0, 50);
        }
    }

    // Handle sex module updates
    if (updates.sexModule && typeof updates.sexModule === 'object') {
        const sex = updates.sexModule as Record<string, unknown>;
        sanitized.sexModule = {};
        if (typeof sex.active === 'boolean') {
            (sanitized.sexModule as SexModuleState).active = sex.active;
        }
        if (typeof sex.arousal === 'number') {
            (sanitized.sexModule as SexModuleState).arousal = validateProgressValue(sex.arousal);
        }
        if (typeof sex.orgasmCount === 'number') {
            (sanitized.sexModule as SexModuleState).orgasmCount = Math.max(0, Math.round(sex.orgasmCount as number));
        }
    }

    return sanitized as Partial<MessageStateType>;
}

/**
 * Updates a single progression value
 */
export function updateProgressionValue(
    state: MessageStateType,
    key: keyof ProgressionValues,
    value: number
): MessageStateType {
    return {
        ...state,
        progressions: {
            ...state.progressions,
            [key]: validateProgressValue(value),
        },
    };
}

/**
 * Increments a progression value by a delta
 */
export function incrementProgression(
    state: MessageStateType,
    key: keyof ProgressionValues,
    delta: number
): MessageStateType {
    const currentValue = state.progressions[key];
    const newValue = Math.max(0, Math.min(100, currentValue + delta));
    return updateProgressionValue(state, key, newValue);
}

/**
 * Gets the stat stage label based on value
 */
export function getStatStage(value: number): string {
    if (value <= 20) return 'Cooling';
    if (value <= 40) return 'Neutral';
    if (value <= 60) return 'Warming';
    if (value <= 80) return 'Hot';
    return 'Blazing';
}

/**
 * Serializes state for storage
 */
export function serializeState(state: MessageStateType): string {
    return JSON.stringify(state);
}

/**
 * Deserializes state from storage
 */
export function deserializeState(data: string | null): MessageStateType | null {
    if (!data) return null;
    try {
        const parsed = JSON.parse(data);
        if (validateStateIntegrity(parsed)) {
            return parsed;
        }
        return null;
    } catch {
        return null;
    }
}