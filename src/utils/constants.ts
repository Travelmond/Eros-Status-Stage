/**
 * Eros Status Constants
 * Static configuration values
 */

// ============================================================================
// STAT STAGES - Value ranges for progression stats
// ============================================================================

/** Stat stage definitions with value ranges */
export const STAT_STAGES = {
    Cooling: { min: 0, max: 20, color: '#6b7280' },
    Neutral: { min: 21, max: 40, color: '#3b82f6' },
    Warming: { min: 41, max: 60, color: '#f59e0b' },
    Hot: { min: 61, max: 80, color: '#ef4444' },
    Blazing: { min: 81, max: 100, color: '#dc2626' },
} as const;

/** Stat stage labels */
export type StatStageKey = keyof typeof STAT_STAGES;

/**
 * Gets the stat stage for a value
 */
export function getStatStage(value: number): StatStageKey {
    if (value <= 20) return 'Cooling';
    if (value <= 40) return 'Neutral';
    if (value <= 60) return 'Warming';
    if (value <= 80) return 'Hot';
    return 'Blazing';
}

// ============================================================================
// SCENE TYPES - Sex module scene types
// ============================================================================

/** Valid scene types */
export const SCENE_TYPES = [
    'quiet',
    'conversation',
    'flirt',
    'foreplay',
    'sex',
    'aftercare',
] as const;

export type SceneType = typeof SCENE_TYPES[number];

/** Scene type descriptions */
export const SCENE_TYPE_DESCRIPTIONS: Record<SceneType, string> = {
    quiet: 'No intimate activity',
    conversation: 'Talking intimately',
    flirt: 'Flirting and teasing',
    foreplay: 'Physical foreplay',
    sex: 'Sexual activity',
    aftercare: 'Post-intimacy care',
};

// ============================================================================
// POSITION TYPES - Sex module positions
// ============================================================================

/** Common sex positions */
export const POSITION_TYPES = [
    'missionary',
    'doggy',
    'cowgirl',
    'reverse_cowgirl',
    'spooning',
    'standing',
    '69',
    'oral',
    'anal',
    'other',
] as const;

export type PositionType = typeof POSITION_TYPES[number];

// ============================================================================// PACE TYPES - Sex module paces
// ============================================================================

/** Movement pace types */
export const PACE_TYPES = [
    'none',
    'slow',
    'medium',
    'fast',
    'vigorous',
    'rhythmic',
] as const;

export type PaceType = typeof PACE_TYPES[number];

// ============================================================================
// DEFAULT STATE VALUES
// ============================================================================

/** Default progression values */
export const DEFAULT_PROGRESSION = {
    affection: 20,
    obedience: 50,
    libido: 30,
    arousal: 0,
    trust: 20,
    corruption: 0,
    submission: 0,
    jealousy: 10,
    embarrassment: 30,
} as const;

/** Default system values */
export const DEFAULT_SYSTEM = {
    day: 1,
    time: '08:00',
    weather: 'clear',
} as const;

/** Default location values */
export const DEFAULT_LOCATION = {
    currentRoom: 'bedroom',
    building: 'home',
    visitedRooms: ['bedroom'],
} as const;

/** Default clothing values */
export const DEFAULT_CLOTHING = {
    upperBody: 'shirt',
    lowerBody: 'pants',
    underwear: 'underwear',
    accessories: 'none',
    makeup: 'natural',
} as const;

/** Default body values */
export const DEFAULT_BODY = {
    expression: 'neutral',
    posture: 'standing',
    skin: 'healthy',
    bodyParts: 'covered',
} as const;

// ============================================================================
// UI CONFIGURATION
// ============================================================================

/** Progress bar styles */
export const PROGRESS_BAR_STYLES = ['emoji', 'text', 'percentage', 'bar'] as const;
export type ProgressBarStyle = typeof PROGRESS_BAR_STYLES[number];

/** Theme options */
export const THEMES = ['dark', 'light', 'sepia'] as const;
export type Theme = typeof THEMES[number];

/** Display density options */
export const DISPLAY_DENSITIES = ['compact', 'comfortable', 'expanded'] as const;
export type DisplayDensity = typeof DISPLAY_DENSITIES[number];

// ============================================================================
// STAT COLORS
// ============================================================================

/** Color mapping for each progression stat */
export const STAT_COLORS = {
    affection: '#ef4444',    // Red
    obedience: '#22c55e',   // Green
    libido: '#f97316',       // Orange
    arousal: '#ec4899',      // Pink
    trust: '#3b82f6',       // Blue
    corruption: '#7c3aed',   // Purple
    submission: '#8b5cf6',   // Violet
    jealousy: '#eab308',      // Yellow
    embarrassment: '#06b6d4', // Cyan
    fatigue: '#6366f1',      // Indigo
    happiness: '#f59e0b',   // Amber
} as const;

// ============================================================================
// AI COMMAND PATTERNS
// ============================================================================

/** Regex patterns for parsing AI commands */
export const COMMAND_PATTERNS = {
    GET: /<GET\s+(\w+)>/gi,
    UPDATE: /<UPDATE\s+(\w+)\s+([+-]?\d+)>/gi,
    SET: /<SET\s+(\w+)\s+(\d+)>/gi,
} as const;

// ============================================================================
// MAXIMUM VALUES
// ============================================================================

/** Maximum values for various fields */
export const MAX_VALUES = {
    PROGRESS: 100,
    ORGASM_COUNT: 50,
    TURN_COUNT: 99999,
    ROOM_NAME_LENGTH: 50,
    EXPRESSION_LENGTH: 100,
    DESCRIPTION_LENGTH: 500,
} as const;

// ============================================================================
// WEATHER OPTIONS
// ============================================================================

/** Valid weather conditions */
export const WEATHER_OPTIONS = [
    'clear',
    'cloudy',
    'rainy',
    'stormy',
    'snowy',
    'foggy',
    'windy',
    'hot',
    'cold',
] as const;

export type WeatherType = typeof WEATHER_OPTIONS[number];

// ============================================================================
// EXPRESSIONS
// ============================================================================

/** Common facial expressions */
export const EXPRESSIONS = [
    'neutral',
    'happy',
    'sad',
    'angry',
    'surprised',
    'scared',
    'embarrassed',
    'aroused',
    'confused',
    'excited',
    'sleepy',
    'annoyed',
] as const;

export type Expression = typeof EXPRESSIONS[number];

// ============================================================================
// POSTURES
// ============================================================================

/** Common body postures */
export const POSTURES = [
    'standing',
    'sitting',
    'lying',
    'kneeling',
    'crouching',
    'walking',
    'running',
] as const;

export type Posture = typeof POSTURES[number];