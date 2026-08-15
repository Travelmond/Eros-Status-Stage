/**
 * Estado completo do Eros Status Terminal (ESS) v3.0.
 * Espelha o contrato JSON Schema documentado em /docs/01-ARQUITETURA.md
 * e /docs/ARQUITETURA_COMPLETA.md.
 */

// ---------------------------------------------------------------------------
// Enums e union types
// ---------------------------------------------------------------------------

export type SceneType =
  | 'daily_life'
  | 'flirting'
  | 'sex'
  | 'post-sex'
  | 'conflict'
  | 'travel'
  | 'rest';

export type SexPhase = 'none' | 'flirting' | 'sex' | 'post-sex';

export type ImportanceLevel = 'high' | 'medium' | 'low';

export type NotificationLevel = 'info' | 'warn' | 'success' | 'error';

// ---------------------------------------------------------------------------
// Chaves de coleção
// ---------------------------------------------------------------------------

export type ProgressionKey =
  | 'affection'
  | 'obedience'
  | 'libido'
  | 'arousal'
  | 'trust'
  | 'corruption'
  | 'happiness'
  | 'embarrassment'
  | 'fatigue'
  | 'love'
  | 'jealousy'
  | 'anxiety'
  | 'fear'
  | 'anger'
  | 'nervousness'
  | 'tension'
  | 'shame'
  | 'desire'
  | 'awe'
  | 'guilt'
  | 'excitement'
  | 'sadness'
  | 'submission'
  | 'health';

export type ClothingSlotKey =
  | 'head'
  | 'upper'
  | 'lower'
  | 'underwear'
  | 'footwear'
  | 'accessories';

export type BodyPartKey =
  | 'hair'
  | 'eyes'
  | 'face'
  | 'neck'
  | 'chest'
  | 'bust'
  | 'waist'
  | 'hips'
  | 'legs'
  | 'feet'
  | 'tail'
  | 'horns'
  | 'special';

// ---------------------------------------------------------------------------
// Entidades auxiliares
// ---------------------------------------------------------------------------

export interface ProgressionValues {
  affection: number;
  obedience: number;
  libido: number;
  arousal: number;
  trust: number;
  corruption: number;
  happiness: number;
  embarrassment: number;
  fatigue: number;
  love: number;
  jealousy: number;
  anxiety: number;
  fear: number;
  anger: number;
  nervousness: number;
  tension: number;
  shame: number;
  desire: number;
  awe: number;
  guilt: number;
  excitement: number;
  sadness: number;
  submission: number;
  health: number;
}

export type Progressions = Partial<ProgressionValues>;

export interface ClothingSlots {
  head?: string;
  upper?: string;
  lower?: string;
  underwear?: string;
  footwear?: string;
  accessories?: string;
}

export interface BodyDescription {
  hair?: string;
  eyes?: string;
  face?: string;
  neck?: string;
  chest?: string;
  bust?: string;
  waist?: string;
  hips?: string;
  legs?: string;
  feet?: string;
  tail?: string;
  horns?: string;
  special?: string;
}

export interface BodyState {
  expression?: string;
  posture?: string;
  thoughts?: string;
  shamefulThought?: string;
  description?: BodyDescription;
}

export interface LocationState {
  currentRoom?: string;
  building?: string;
  description?: string;
  visitedRooms?: string[];
  knownRooms?: string[];
  objectsInRoom?: string[];
  /** Matriz 2D/3D opcional para renderização do mini-mapa. */
  miniMapData?: unknown[];
}

export interface Item {
  name: string;
  description?: string;
  emoji?: string;
  quantity?: number;
  [key: string]: unknown;
}

export interface RelationshipLink {
  targetName: string;
  relation?: string;
  affection?: number;
  familyTier?: string;
  affectionTier?: string;
  [key: string]: unknown;
}

export interface NPC {
  name: string;
  relation?: string;
  mood?: string;
  importance?: ImportanceLevel;
  summary?: string;
  relationships?: RelationshipLink[];
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Módulos especiais
// ---------------------------------------------------------------------------

export interface SensoryMetrics {
  intensity?: number;
  threshold?: number;
  [key: string]: unknown;
}

export interface SensesState {
  sight?: string;
  sound?: string;
  smell?: string;
  touch?: string;
  taste?: string;
}

export interface MenstrualCycle {
  day?: number;
  phase?: string;
  fertile?: boolean;
}

export interface FemaleAnatomy {
  arousalState?: string;
  lubrication?: string;
  vagina?: string;
  cervix?: string;
  uterus?: string;
  ovaries?: string;
  menstrualCycle?: MenstrualCycle;
  [key: string]: unknown;
}

export interface MaleAnatomy {
  seminalVolume?: string;
  ejaculationCount?: number;
  arousalState?: string;
  [key: string]: unknown;
}

export interface SexModule {
  active?: boolean;
  phase?: SexPhase;
  position?: string;
  pace?: string;
  orgasmCount?: number;
  sensory_metrics?: SensoryMetrics;
  marking_history?: unknown[];
  senses?: SensesState;
  male?: MaleAnatomy;
  female?: FemaleAnatomy;
  stimulusDescription?: string;
}

export interface ReactionEntry {
  emoji: string;
  label: string;
  text: string;
}

export interface ReactionModule {
  active?: boolean;
  character?: string;
  stimulus?: string;
  reactions?: ReactionEntry[];
}

export interface NTRModule {
  enabled?: boolean;
  active?: boolean;
  ntrCharacter?: string;
  ntrPartner?: string;
  jealousyLevel?: number;
  betrayalStage?: string;
  notes?: string;
}

// ---------------------------------------------------------------------------
// Comandos da UI e metadados
// ---------------------------------------------------------------------------

export interface UINotification {
  level?: NotificationLevel;
  message?: string;
}

export interface UICommands {
  suggested_tab?: string;
  notification?: UINotification;
  map_focus?: string;
  map_reveal?: string[];
}

export interface MetaState {
  turn_id?: string;
  parent_turn_id?: string;
  branch_index?: number;
  validated?: boolean;
  coerced_fields?: string[];
  /** Versão do schema para migrações futuras. */
  schema_version?: string;
}

// ---------------------------------------------------------------------------
// Módulo de imagem (ComfyUI / Civitai)
// ---------------------------------------------------------------------------

export interface ImageAnchors {
  char?: string;
  user?: string;
  [key: string]: string | undefined;
}

export interface ImageScene {
  positive?: string;
  negative?: string;
  camera_suggestions?: string[];
}

export interface HiResFix {
  enabled?: boolean;
  upscale?: number;
  denoise?: number;
}

export interface ImageParams {
  checkpoint?: string;
  loras?: string[];
  sampler?: string;
  steps?: number;
  cfg?: number;
  clip_skip?: number;
  hires_fix?: HiResFix;
  aspect_ratio?: string;
  resolution?: string;
}

export interface ImageModule {
  anchors?: ImageAnchors;
  scene?: ImageScene;
  params?: ImageParams;
}

// ---------------------------------------------------------------------------
// Auditoria
// ---------------------------------------------------------------------------

export type AuditSeverity = 'info' | 'warning' | 'error';

export interface AuditIssue {
  id: string;
  category:
    | 'location'
    | 'inventory'
    | 'clothing'
    | 'relationship'
    | 'narrative'
    | 'img'
    | 'schema';
  severity: AuditSeverity;
  field?: string;
  message: string;
  suggestedValue?: unknown;
  ignored?: boolean;
  corrected?: boolean;
}

export interface AuditState {
  issues: AuditIssue[];
  ignoredIds?: string[];
  correctedIds?: string[];
}

// ---------------------------------------------------------------------------
// Entidades principais
// ---------------------------------------------------------------------------

export interface SystemState {
  day?: number;
  time?: string;
  weather?: string;
  location?: string;
  sceneType?: SceneType;
  ambiance?: string;
}

export interface CharacterState {
  name?: string;
  role?: string;
  avatarUrl?: string;
  expression?: string;
  mood?: string;
  thoughts?: string;
  shamefulThought?: string;
  relationship?: string;
}

export interface UserCharacterState {
  name?: string;
  relation?: string;
  mood?: string;
  summary?: string;
  relationships?: RelationshipLink[];
}

// ---------------------------------------------------------------------------
// Estado raiz
// ---------------------------------------------------------------------------

export interface ErosStatusState {
  system: SystemState;
  character: CharacterState;
  userCharacter: UserCharacterState;
  progressions: Progressions;
  clothingSlots: ClothingSlots;
  body: BodyState;
  location: LocationState;
  inventory: { items: Item[] };
  goals: string[];
  npcs: NPC[];
  sexModule: SexModule;
  reactionModule: ReactionModule;
  ntrModule: NTRModule;
  ui_commands: UICommands;
  meta: MetaState;
  img_module: ImageModule;
  audit: AuditState;
  /** Instrucoes extraidas do bloco AI_INSTRUCTIONS da narrativa. */
  aiInstructions?: string[];
}

// ---------------------------------------------------------------------------
// Estados específicos do Chub Stage
// ---------------------------------------------------------------------------

/** Estado `init` — gerado uma única vez por chat. */
export interface ErosInitState {
  /** Versão do schema para migrações futuras. */
  schema_version: string;
  /** Seed/nome do mundo ou cenário fixo. */
  worldSeed?: string;
  /** Configuração inicial de salas conhecidas. */
  initialKnownRooms?: string[];
  /** Configuração inicial de NPCs recorrentes. */
  recurringNPCs?: NPC[];
  /** Timestamp de criação. */
  createdAt?: string;
}

/** Estado `chat` — persistente entre branches. */
export interface ErosChatState {
  /** Versão do schema para migrações futuras. */
  schema_version: string;
  /** Salas já visitadas pelo usuário/personagem. */
  visitedRooms: string[];
  /** Salas reveladas no mapa (fog-of-war). */
  revealedRooms: string[];
  /** Mapa completo do edifício/mundo, se conhecido. */
  knownMap?: {
    rooms: Record<string, { x: number; y: number; label?: string }>;
    connections: Array<[string, string]>;
  };
  /** Memória de longo prazo condensada. */
  longTermMemory?: {
    facts: string[];
    narrativeSummary: string;
    lastCondensedTurn?: string;
  };
  /** Histórico de turnos/branching. */
  turnHistory?: Array<{
    turn_id: string;
    parent_turn_id?: string;
    branch_index: number;
    timestamp: string;
    summary?: string;
  }>;
  /** Metadados globais do chat. */
  globalMeta?: {
    totalTurns: number;
    currentBranch: number;
  };
}
