# Eros Status Stage - Documentation Addendum

**Version:** 1.1
**Status:** Technical Specification Addendum
**Date:** May 2026

---

## Table of Contents

1. [Enhanced Detail View Architecture](#1-enhanced-detail-view-architecture)
2. [Category Organization](#2-category-organization)
3. [New CHARACTERS Tab](#3-new-characters-tab)
4. [Expression/Pose Section for AI Image Generation](#4-expressionpose-section-for-ai-image-generation)
5. [Progress Bar Style Toggle](#5-progress-bar-style-toggle)
6. [Modal Style: Slide-Out Panel](#6-modal-style-slide-out-panel)
7. [New TypeScript Interfaces](#7-new-typescript-interfaces)
8. [Updated Component Architecture](#8-updated-component-architecture)
9. [Updated User Stories](#9-updated-user-stories)
10. [File Structure Updates](#10-file-structure-updates)

---

## 1. Enhanced Detail View Architecture

### 1.1 New Field Structure

Each detail category (Affection, Mood, Obedience, Libido, Arousal, etc.) now includes four distinct sub-components:

| Field | Type | Description |
|-------|------|-------------|
| **Current State** | `StateDisplay` | Numeric value (0-100), progress bar visualization, stage/trend indicator |
| **Explanation** | `ExplanationText` | Narrative text explaining WHY the character is in this state |
| **Character Voice** | `CharacterVoice` | Dialogue OR thought from {{char}} or other characters (Option C: both tracked quotes AND auto-generated suggestions) |
| **History/Recent Changes** | `HistoryList` | Last 5 changes with turn numbers |

### 1.2 UI Mockup: Enhanced Status Category

```
┌─────────────────────────────────────────────────────────────────────┐
│  ❤️ AFFECTION                                                       │
├─────────────────────────────────────────────────────────────────────┤
│  CURRENT STATE                                                      │
│  ████████████░░░░░░░░  65%  [🔥 Warming]  ↗ +5 since turn 42       │
│                                                                      │
│  EXPLANATION                                                        │
│  "She feels drawn to you after the late night conversation in      │
│  the garden. Your openness about your past made her trust you      │
│  more deeply."                                                      │
│                                                                      │
│  CHARACTER VOICE                                                    │
│  ┌─ Direct Quote ────────────────────────────────────────────┐     │
│  │ "I... I don't usually open up to people like this."       │     │
│  │  — Nagisa, turn 42                                        │     │
│  └───────────────────────────────────────────────────────────┘     │
│  ┌─ Auto-Generated Suggestion ─────────────────────────────────┐  │
│  │ 💭 "Maybe I should be more honest with my feelings..."    │     │
│  └───────────────────────────────────────────────────────────┘     │
│                                                                      │
│  RECENT HISTORY                                                     │
│  • Turn 42: +5 (Garden conversation)                                │
│  • Turn 40: +3 (Helped with training)                              │
│  • Turn 38: -2 (Forgot her birthday)                               │
│  • Turn 35: +10 (Saved her from danger)                            │
│  • Turn 32: +2 (Complimented her new dress)                        │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.3 State Display Component

```typescript
interface StateDisplay {
  value: number;           // 0-100
  maxValue: number;        // Usually 100, can be higher
  percentage: number;      // Calculated percentage
  stage: StatusStage;      // Enum: Cooling | Neutral | Warming | Hot | Blazing
  trend: TrendDirection;   // Enum: Down | Stable | Up
  changeSince: number;     // Numeric change
  turnNumber: number;      // Last updated turn
  color: string;           // Calculated color based on value
}

enum StatusStage {
  Cooling = "cooling",      // 0-20
  Neutral = "neutral",      // 21-40
  Warming = "warming",      // 41-60
  Hot = "hot",              // 61-80
  Blazing = "blazing"       // 81-100
}

enum TrendDirection {
  Down = "down",            // -10 or more
  Stable = "stable",        // -9 to +9
  Up = "up"                 // +10 or more
}
```

### 1.4 Explanation Component

```typescript
interface ExplanationText {
  content: string;          // The narrative explanation
  source: ExplanationSource; // How it was generated
  contextTurn: number;     // Which turn triggered this
  confidence: number;       // 0-1 confidence score
}

enum ExplanationSource {
  AI_GENERATED = "ai_generated",    // Generated from recent context
  EXTRACTED = "extracted",          // Extracted from character dialogue
  MANUAL = "manual",                // User manually set
  DEFAULT = "default"              // Generic default text
}
```

### 1.5 Character Voice Component

Option C implementation: Both tracked quotes AND auto-generated suggestions are displayed.

```typescript
interface CharacterVoice {
  type: VoiceType;          // DIALOGUE | THOUGHT | SUGGESTION
  content: string;         // The actual text
  speaker: string;         // Character name who said/thought this
  turnNumber: number;     // When this was recorded
  isTracked: boolean;      // True = user/AI explicitly tracked
  isAutoGenerated: boolean; // True = system generated from context
}

enum VoiceType {
  DIALOGUE = "dialogue",   // Spoken by character
  THOUGHT = "thought",     // Internal monologue
  SUGGESTION = "suggestion" // AI-generated suggestion for context
}
```

### 1.6 History/Recent Changes Component

```typescript
interface HistoryChange {
  turnNumber: number;
  change: number;          // Positive or negative delta
  triggerEvent: string;   // Brief description of what caused it
  timestamp: Date;
}

interface HistoryList {
  changes: HistoryChange[];
  maxItems: number;        // Default: 5
  sortOrder: 'newest' | 'oldest' | 'largest';
}
```

---

## 2. Category Organization

### 2.1 Option B: Grouped Categories

The status categories are now organized into four color-coded groups:

### 🟢 PROGRESSION Group
| Category | Color Code | Description |
|----------|------------|-------------|
| Affection | 🔴 Red (#ff6b81) | Love/attachment level |
| Obedience | 🟢 Green (#7bed9f) | Compliance/willingness |
| Libido | 🟠 Orange (#ffa502) | Sexual desire level |
| Arousal | 🔴 Red (#ff4757) | Current sexual excitation |

### 🔵 BODY & CLOTHING Group
| Category | Color Code | Description |
|----------|------------|-------------|
| Clothing | 🟢 Lime (#2ed573) | Current outfit state |
| Body State | 🔵 Blue (#00d2d3) | Physical condition |
| Genitalia | 🔴 Hotpink (#ff6b8a) | Sexual organ status |

### 🔴 SCENE Group
| Category | Color Code | Description |
|----------|------------|-------------|
| Location | 🔵 Deep Sky (#00d2d3) | Current environment |
| Time | 🟡 Gold (#feca57) | Time of day |
| Sex Module | 🔴 Hotpink (#ff6b8a) | Sexual scene status |
| NTR | 🔴 Red (#ff4757) | NTR module state |

### 🟣 EXTRAS Group
| Category | Color Code | Description |
|----------|------------|-------------|
| Expressions | 🟣 Purple (#a55eea) | Image generation data |
| Moments | 🟣 Purple (#a55eea) | Key moments/memories |
| Inventory | 🟢 Lime (#2ed573) | Items possessed |
| **CHARACTERS** | 🔵 Blue (#00d2d3) | **NPC roster** |

### 2.2 UI Mockup: Category Tabs

```
┌─────────────────────────────────────────────────────────────────────┐
│  EROS STATUS STAGE                                      [⚙️] [×]   │
├─────────────────────────────────────────────────────────────────────┤
│  [🟢 PROGRESSION] [🔵 BODY] [🔴 SCENE] [🟣 EXTRAS]                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │
│  │ ❤️ Affection    │  │ 💚 Obedience     │  │ 🍊 Libido       │    │
│  │ ██████░░░░ 60%  │  │ ████████░░ 80%  │  │ ████░░░░░░ 40%  │    │
│  │ ↗ +5            │  │ → Stable         │  │ ↘ -3            │    │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. New CHARACTERS Tab

### 3.1 Overview

The CHARACTERS tab displays all NPCs currently present in the scene, providing quick access to character information and relationships.

### 3.2 Main Character List View

```
┌─────────────────────────────────────────────────────────────────────┐
│  👥 CHARACTERS                                        [+ Add NPC]   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │
│  │  [Avatar]   │  │  [Avatar]   │  │  [Avatar]   │                │
│  │             │  │             │  │             │                │
│  │   RIN        │  │   AKIRA     │  │   MIKU      │                │
│  │   Rival     │  │   Friend    │  │   Student   │                │
│  │   ❤️ 45     │  │   💚 80     │  │   💜 30     │                │
│  └─────────────┘  └─────────────┘  └─────────────┘                │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.3 Character Card Component

```typescript
interface CharacterCard {
  id: string;
  name: string;
  role: string;                    // e.g., "Rival", "Friend", "Student"
  avatarUrl: string;               // Placeholder or uploaded image
  quickStat: QuickStatDisplay;    // At-a-glance stat
  isInScene: boolean;              // Currently present
  location?: string;               // Current location if in scene
}

interface QuickStatDisplay {
  type: 'affection' | 'obedience' | 'libido' | 'custom';
  value: number;
  color: string;
  icon: string;                    // Emoji or icon identifier
}
```

### 3.4 Character Detail Modal

When clicking a character card, a slide-out panel reveals full details:

```
┌────────────────────────────────────────┬──────────────────────────┐
│  ← Back to Characters                  │ CHARACTERS        [×]   │
├────────────────────────────────────────┼──────────────────────────┤
│                                        │                          │
│         [ Large Avatar ]               │                          │
│                                        │  RIN                    │
│        ─────────────────              │  Role: Rival            │
│                                        │  Status: In Scene       │
│  RIN                                   │  Location: School       │
│  Rival                                 │                          │
│                                        │  ────────────────────   │
│  ───────────────────                   │  RELATIONSHIP           │
│                                        │  Affection: 45 (Cool)   │
│  RELATIONSHIP TO MAIN CHARACTER       │  Trust: Medium          │
│  Affection: 45 (Cool)                 │  History: 3 encounters  │
│  Trust: Medium                         │                          │
│  History: 3 encounters                │  ────────────────────   │
│                                        │  DESCRIPTION            │
│  ───────────────────                   │  "The student council   │
│                                        │  president who sees     │
│  DESCRIPTION                            │  you as a rival..."     │
│  "The student council president       │                          │
│  who sees you as a rival in both      │  ────────────────────   │
│  academics and romance. She has      │  APPEARANCE             │
│  a tsundere personality but           │  Height: 165cm          │
│  deep feelings she hides."            │  Build: Slim            │
│                                        │  Hair: Brown, long      │
│  ───────────────────                   │  Eyes: Hazel            │
│                                        │  Distinctive: Glasses   │
│  APPEARANCE                            │                          │
│  • Height: 165cm                      │  ────────────────────   │
│  • Build: Slim                         │  CURRENT STATUS         │
│  • Hair: Brown, long                   │  Activity: Studying     │
│  • Eyes: Hazel                         │  Mood: Focused          │
│  • Distinctive: Glasses                │  Last Action: Looking    │
│                                        │  at you suspiciously    │
│  ───────────────────                   │                          │
│                                        │                          │
│  CURRENT STATUS                       │                          │
│  • Location: School Library            │                          │
│  • Activity: Studying                  │                          │
│  • Mood: Focused                       │                          │
│  • Last Action: Looking at you         │                          │
│    suspiciously                        │                          │
│                                        │                          │
└────────────────────────────────────────┴──────────────────────────┘
```

### 3.5 Character Detail TypeScript Interface

```typescript
interface CharacterDetail {
  id: string;
  basicInfo: BasicCharacterInfo;
  relationship: RelationshipInfo;
  description: CharacterDescription;
  appearance: AppearanceInfo;
  currentStatus: CurrentStatusInfo;
}

interface BasicCharacterInfo {
  name: string;
  role: string;
  avatarUrl: string;
  isInScene: boolean;
  sceneId?: string;
}

interface RelationshipInfo {
  type: 'main' | 'npc' | 'secondary';
  affection: number;
  trust: number;
  familiarity: number;
  history: string;           // Summary text
  customMetrics?: Record<string, number>;
}

interface CharacterDescription {
  personality: string;       // Brief personality summary
  background: string;       // Character backstory
  goals: string;            // Character goals/motivations
  voice: string;            // Speaking style notes
}

interface AppearanceInfo {
  height: string;            // e.g., "165cm" or "5'5\""
  build: string;             // e.g., "Slim", "Athletic", "Curvy"
  hair: HairDescription;
  eyes: string;
  distinctiveFeatures: string[];
  clothing: ClothingSummary;
}

interface HairDescription {
  color: string;
  length: string;           // e.g., "Long", "Short", "Bob"
  style: string;            // e.g., "Straight", "Wavy", "Ponytail"
}

interface ClothingSummary {
  current: string;          // Current outfit description
  style: string;           // Fashion preference
  accessories: string[];
}

interface CurrentStatusInfo {
  location: string;
  activity: string;
  mood: string;
  lastAction: string;
  emotionalState: string;
  availability: 'available' | 'busy' | 'unavailable';
}
```

---

## 4. Expression/Pose Section for AI Image Generation

### 4.1 Overview

The Expression/Pose section provides AI image generation support by displaying current expression, generating prompts, and offering utility buttons.

### 4.2 UI Mockup

```
┌─────────────────────────────────────────────────────────────────────┐
│  🎭 EXPRESSION & POSE                          [Expand]             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  CURRENT EXPRESSION                                                │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                                                                │ │
│  │              [Expression Image Placeholder]                   │ │
│  │                                                                │ │
│  │   "Flustered smile, looking away, hands clasped"             │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  AI IMAGE PROMPT                                                   │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  1girl, solo, masterpiece, best quality, detailed,           │ │
│  │  flustered expression, smiling shyly, looking away,         │ │
│  │  hands clasped in front, school uniform, brown hair,         │ │
│  │  long hair, hazel eyes, beautiful girl, soft lighting...    │ │
│  │                                        [📋 Copy] [👁️ View]    │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ACTIONS                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ 🖼️ Generate  │  │ 📋 Copy Tags │  │ 👁️ View Tags │              │
│  │    Image     │  │              │  │              │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.3 TypeScript Interfaces

```typescript
interface ExpressionPoseData {
  currentExpression: ExpressionDescription;
  poseDescription: string;
  aiPrompt: AIPromptData;
  tags: ImageGenerationTags;
}

interface ExpressionDescription {
  name: string;             // e.g., "Flustered", "Happy", "Surprised"
  description: string;      // Visual description
  intensity: number;        // 0-100
  imageUrl?: string;        // If expression image available
}

interface AIPromptData {
  positiveTags: string[];   // Tags to include
  negativeTags: string[];  // Tags to exclude
  fullPrompt: string;       // Generated full prompt
  style: PromptStyle;      // e.g., "anime", "realistic", "illustration"
  quality: PromptQuality;  // e.g., "masterpiece", "high quality"
}

enum PromptStyle {
  ANIME = "anime",
  REALISTIC = "realistic",
  ILLUSTRATION = "illustration",
  MANGA = "manga",
  CHIBI = "chibi"
}

enum PromptQuality {
  LOW = "low",
  STANDARD = "standard",
  HIGH = "high",
  MASTERPIECE = "masterpiece"
}

interface ImageGenerationTags {
  character: string[];       // Character-specific tags
  expression: string[];     // Expression tags
  pose: string[];           // Pose tags
  clothing: string[];       // Clothing tags
  environment: string[];    // Environment tags
  lighting: string[];       // Lighting tags
  quality: string[];        // Quality tags
  artist?: string[];        // Artist references (optional)
}
```

### 4.4 Button Functionality

| Button | Action | Behavior |
|--------|--------|-----------|
| **Generate Image** | Trigger AI image generation | Opens API integration or shows placeholder if no API configured |
| **Copy Tags** | Copy to clipboard | Copies formatted tags to system clipboard, shows success toast |
| **View Tags** | Open tag breakdown modal | Shows detailed tag categories with individual toggles for manual AI generation |

### 4.5 Tag Breakdown Modal

```
┌─────────────────────────────────────────────────────────────────────┐
│  Tag Breakdown                                         [Copy All]  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  CHARACTER TAGS                                                    │
│  [✓] 1girl  [✓] solo  [ ] multiple  [ ] group                       │
│                                                                      │
│  EXPRESSION TAGS                                                   │
│  [✓] flustered  [ ] blushing  [ ] smiling  [ ] surprised           │
│                                                                      │
│  POSE TAGS                                                         │
│  [✓] hands clasped  [ ] arms behind back  [ ] crossing arms       │
│                                                                      │
│  CLOTHING TAGS                                                     │
│  [✓] school uniform  [ ] sailor uniform  [ ] casual               │
│                                                                      │
│  ENVIRONMENT TAGS                                                  │
│  [✓] simple background  [ ] classroom  [ ] outdoor                 │
│                                                                      │
│  QUALITY TAGS                                                      │
│  [✓] masterpiece  [✓] best quality  [ ] official art              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Progress Bar Style Toggle

### 5.1 Option C: Toggle Between Styles

Users can switch between three progress bar visualization styles:

### Style Options

| Style | Example | Rendering |
|-------|---------|-----------|
| **Unicode Boxes** | `██████░░░░░` | Uses █ and ░ characters |
| **Emoji Hearts** | `❤️❤️❤️❤️❤️♡` | Uses ❤️ and ❤️ or 💜 emojis |
| **Both** | `❤️ ❤️ ████░░` | Toggle in settings to switch |

### 5.2 UI Mockup: Settings Panel

```
┌─────────────────────────────────────────────────────────────────────┐
│  ⚙️ SETTINGS                                                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  PROGRESS BAR STYLE                                               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  (•) Unicode Boxes    [ ████████░░ 80% ]                    │   │
│  │  ( ) Emoji Hearts     [ ❤️❤️❤️❤️❤️♡♡♡♡ 80% ]                  │   │
│  │  ( ) Both (Toggle)   [ Toggle in panel ]                    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  CURRENT PREVIEW:                                                 │
│  Affection: ████████░░░░░░░░  75%                                  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.3 TypeScript Configuration

```typescript
interface ProgressBarStyleConfig {
  style: ProgressBarStyle;
  emojiType: 'hearts' | 'stars' | 'fire';  // For emoji style
  showPercentage: boolean;
  showNumericValue: boolean;
}

enum ProgressBarStyle {
  UNICODE_BOXES = "unicode_boxes",
  EMOJI = "emoji",
  BOTH_TOGGLE = "both_toggle"
}

interface SettingsState {
  progressBarStyle: ProgressBarStyleConfig;
  // ... other settings
}
```

### 5.4 Rendering Implementation

```typescript
// Example rendering functions

function renderUnicodeBoxes(value: number, max: number = 100): string {
  const filled = Math.round((value / max) * 10);
  const empty = 10 - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

function renderEmojiHearts(value: number, max: number = 100, type: 'hearts' | 'stars' | 'fire' = 'hearts'): string {
  const filled = Math.round((value / max) * 5);
  const emojis = {
    hearts: ['❤️', '🤍'],
    stars: ['⭐', '☆'],
    fire: ['🔥', '🧊']
  };
  return emojis[type][0].repeat(filled) + emojis[type][1].repeat(5 - filled);
}
```

---

## 6. Modal Style: Slide-Out Panel

### 6.1 Option B: 70% Width Slide-Out

The detail view now uses a slide-out panel from the right side, leaving the summary terminal visible at 30% width.

### 6.2 Layout Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│  EROS STATUS STAGE                    [⚙️] [?] [Fullscreen]        │
├────────────────────────────────┬────────────────────────────────────┤
│                                │                                    │
│     SUMMARY TERMINAL           │      DETAIL SLIDE-OUT              │
│        (30% width)            │         (70% width)                 │
│                                │                                    │
│  ┌────────────────────────┐   │   ┌────────────────────────────┐    │
│  │ ❤️ Affection: 75%     │   │   │  ❤️ AFFECTION DETAIL     │    │
│  │ 💚 Obedience: 60%     │   │   │                            │    │
│  │ 🍊 Libido: 45%        │   │   │  [Close X]                 │    │
│  │ 🔥 Arousal: 80%       │   │   │                            │    │
│  └────────────────────────┘   │   │  Current State...         │    │
│                                │   │  Explanation...           │    │
│  📍 Location: Classroom       │   │  Character Voice...        │    │
│  ⏰ Time: 14:30              │   │  History...                 │    │
│                                │   │                            │    │
│  ─────────────────────────    │   │  [Save] [Cancel]           │    │
│                                │   └────────────────────────────┘    │
│  Quick Actions:              │                                    │
│  [View Characters]          │                                    │
│  [View Expressions]          │                                    │
│                                │                                    │
└────────────────────────────────┴────────────────────────────────────┘
```

### 6.3 Animation Specification

```css
/* Slide-out animation */
.slide-out-panel {
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  width: 70%;
  z-index: 1000;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
}

.slide-out-panel.open {
  transform: translateX(0);
}

/* Summary terminal remains visible */
.summary-terminal {
  width: 30%;
  transition: width 0.3s ease-in-out;
}

.summary-terminal.expanded {
  width: 100%;
}
```

### 6.4 State Management

```typescript
interface PanelState {
  isOpen: boolean;
  activePanel: 'none' | 'character' | 'expression' | 'category' | 'settings';
  panelWidth: number;       // Default: 70%
  summaryWidth: number;     // Default: 30%
  animationDuration: number; // Default: 300ms
  closeOnOutsideClick: boolean;
}

interface PanelActions {
  openPanel: (panel: PanelType) => void;
  closePanel: () => void;
  togglePanel: (panel: PanelType) => void;
  resizePanel: (width: number) => void;
}
```

---

## 7. New TypeScript Interfaces

### 7.1 Complete Type Definitions

```typescript
// src/types/index.ts additions

// ===== Enhanced Status Category =====
export interface EnhancedStatusCategory {
  id: string;
  name: string;
  icon: string;
  group: CategoryGroup;
  currentState: StateDisplay;
  explanation: ExplanationText;
  characterVoice: CharacterVoice[];
  history: HistoryList;
}

export type CategoryGroup = 'progression' | 'body_clothing' | 'scene' | 'extras';

// ===== State Display =====
export interface StateDisplay {
  value: number;
  maxValue: number;
  percentage: number;
  stage: StatusStage;
  trend: TrendDirection;
  changeSince: number;
  turnNumber: number;
  color: string;
}

export enum StatusStage {
  Cooling = "cooling",
  Neutral = "neutral",
  Warming = "warming",
  Hot = "hot",
  Blazing = "blazing"
}

export enum TrendDirection {
  Down = "down",
  Stable = "stable",
  Up = "up"
}

// ===== Explanation =====
export interface ExplanationText {
  content: string;
  source: ExplanationSource;
  contextTurn: number;
  confidence: number;
}

export enum ExplanationSource {
  AI_GENERATED = "ai_generated",
  EXTRACTED = "extracted",
  MANUAL = "manual",
  DEFAULT = "default"
}

// ===== Character Voice =====
export interface CharacterVoice {
  type: VoiceType;
  content: string;
  speaker: string;
  turnNumber: number;
  isTracked: boolean;
  isAutoGenerated: boolean;
}

export enum VoiceType {
  DIALOGUE = "dialogue",
  THOUGHT = "thought",
  SUGGESTION = "suggestion"
}

// ===== History =====
export interface HistoryChange {
  turnNumber: number;
  change: number;
  triggerEvent: string;
  timestamp: Date;
}

export interface HistoryList {
  changes: HistoryChange[];
  maxItems: number;
  sortOrder: 'newest' | 'oldest' | 'largest';
}

// ===== Character Tab =====
export interface CharacterCard {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  quickStat: QuickStatDisplay;
  isInScene: boolean;
  location?: string;
}

export interface QuickStatDisplay {
  type: 'affection' | 'obedience' | 'libido' | 'custom';
  value: number;
  color: string;
  icon: string;
}

export interface CharacterDetail {
  id: string;
  basicInfo: BasicCharacterInfo;
  relationship: RelationshipInfo;
  description: CharacterDescription;
  appearance: AppearanceInfo;
  currentStatus: CurrentStatusInfo;
}

export interface BasicCharacterInfo {
  name: string;
  role: string;
  avatarUrl: string;
  isInScene: boolean;
  sceneId?: string;
}

export interface RelationshipInfo {
  type: 'main' | 'npc' | 'secondary';
  affection: number;
  trust: number;
  familiarity: number;
  history: string;
  customMetrics?: Record<string, number>;
}

export interface CharacterDescription {
  personality: string;
  background: string;
  goals: string;
  voice: string;
}

export interface AppearanceInfo {
  height: string;
  build: string;
  hair: HairDescription;
  eyes: string;
  distinctiveFeatures: string[];
  clothing: ClothingSummary;
}

export interface HairDescription {
  color: string;
  length: string;
  style: string;
}

export interface ClothingSummary {
  current: string;
  style: string;
  accessories: string[];
}

export interface CurrentStatusInfo {
  location: string;
  activity: string;
  mood: string;
  lastAction: string;
  emotionalState: string;
  availability: 'available' | 'busy' | 'unavailable';
}

// ===== Expression/Pose =====
export interface ExpressionPoseData {
  currentExpression: ExpressionDescription;
  poseDescription: string;
  aiPrompt: AIPromptData;
  tags: ImageGenerationTags;
}

export interface ExpressionDescription {
  name: string;
  description: string;
  intensity: number;
  imageUrl?: string;
}

export interface AIPromptData {
  positiveTags: string[];
  negativeTags: string[];
  fullPrompt: string;
  style: PromptStyle;
  quality: PromptQuality;
}

export enum PromptStyle {
  ANIME = "anime",
  REALISTIC = "realistic",
  ILLUSTRATION = "illustration",
  MANGA = "manga",
  CHIBI = "chibi"
}

export enum PromptQuality {
  LOW = "low",
  STANDARD = "standard",
  HIGH = "high",
  MASTERPIECE = "masterpiece"
}

export interface ImageGenerationTags {
  character: string[];
  expression: string[];
  pose: string[];
  clothing: string[];
  environment: string[];
  lighting: string[];
  quality: string[];
  artist?: string[];
}

// ===== Panel/Slide-Out =====
export interface PanelState {
  isOpen: boolean;
  activePanel: PanelType;
  panelWidth: number;
  summaryWidth: number;
  animationDuration: number;
  closeOnOutsideClick: boolean;
}

export type PanelType = 'none' | 'character' | 'expression' | 'category' | 'settings';

export interface ProgressBarStyleConfig {
  style: ProgressBarStyle;
  emojiType: 'hearts' | 'stars' | 'fire';
  showPercentage: boolean;
  showNumericValue: boolean;
}

export enum ProgressBarStyle {
  UNICODE_BOXES = "unicode_boxes",
  EMOJI = "emoji",
  BOTH_TOGGLE = "both_toggle"
}

// ===== Updated MessageStateType =====
export interface MessageStateType {
  version: string;
  system: SystemData;
  character: CharacterData;
  progressions: ProgressionsData;
  relationships: RelationshipsData;
  clothing: ClothingData;
  body: BodyData;
  genitalia: GenitaliaData;
  sexStatus: SexStatusData;
  ntrModule: NTRModuleData;
  personifiedGenitalia: PersonifiedGenitaliaData;
  location: LocationData;
  objects: ObjectsData;
  npcs: NPCsData;
  memories: MemoriesData;
  history: HistoryEntry[];
  // NEW: Enhanced categories with full details
  enhancedCategories?: Record<string, EnhancedStatusCategory>;
  // NEW: Characters tab data
  characterRoster?: CharacterCard[];
  // NEW: Expression/Pose data
  expressionPose?: ExpressionPoseData;
  // NEW: Settings
  settings: SettingsState;
}

export interface SettingsState {
  progressBarStyle: ProgressBarStyleConfig;
  theme: ThemeType;
  displayDensity: 'compact' | 'normal' | 'expanded';
  panelConfig: PanelState;
}
```

---

## 8. Updated Component Architecture

### 8.1 New Component Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── ProgressBar.tsx          # Updated with style toggle
│   │   ├── Toast.tsx
│   │   └── SlideOutPanel.tsx        # NEW: Slide-out panel
│   │
│   ├── status/
│   │   ├── StatusPanel.tsx
│   │   ├── CategoryTabs.tsx         # NEW: Grouped tabs
│   │   ├── EnhancedCategoryView.tsx # NEW: With all 4 fields
│   │   ├── StateDisplay.tsx        # NEW: Progress + stage + trend
│   │   ├── ExplanationBlock.tsx    # NEW: Narrative text
│   │   ├── CharacterVoiceBlock.tsx # NEW: Quotes + suggestions
│   │   ├── HistoryList.tsx         # NEW: Last 5 changes
│   │   ├── AffectionMeter.tsx
│   │   ├── ObedienceMeter.tsx
│   │   ├── LibidoMeter.tsx
│   │   ├── ArousalMeter.tsx
│   │   └── MoodIndicator.tsx
│   │
│   ├── character/                    # REORGANIZED
│   │   ├── CharacterTab.tsx         # NEW: Main CHARACTERS tab
│   │   ├── CharacterCard.tsx        # Updated: Quick stat display
│   │   ├── CharacterList.tsx        # NEW: Grid of cards
│   │   ├── CharacterDetail.tsx      # NEW: Full detail modal
│   │   ├── CharacterQuickStat.tsx   # NEW: At-a-glance stat
│   │   ├── ExpressionDisplay.tsx
│   │   ├── RelationshipWeb.tsx
│   │   └── RelationshipLine.tsx      # NEW: Visual connection
│   │
│   ├── expression/                   # NEW: AI Image Gen section
│   │   ├── ExpressionPoseSection.tsx
│   │   ├── ExpressionDisplay.tsx
│   │   ├── AIPromptDisplay.tsx
│   │   ├── TagBreakdown.tsx         # NEW: Detailed tags modal
│   │   ├── TagCategory.tsx          # NEW: Tag category component
│   │   └── GenerateImageButton.tsx  # NEW: API integration
│   │
│   ├── scene/
│   │   ├── SceneBanner.tsx
│   │   ├── LocationDisplay.tsx
│   │   └── ObjectList.tsx
│   │
│   ├── sex/
│   │   ├── SexStatusPanel.tsx
│   │   ├── PositionIndicator.tsx
│   │   ├── OrgasmCounter.tsx
│   │   ├── PersonifiedGenitalia.tsx
│   │   └── NTRIndicator.tsx
│   │
│   └── settings/
│       ├── SettingsPanel.tsx
│       ├── ThemeSelector.tsx
│       ├── DisplayDensityControl.tsx
│       ├── ProgressBarStyleToggle.tsx # NEW: Style selector
│       └── PanelConfig.tsx         # NEW: Slide-out config
│       │
│   ├── contexts/
│   │   ├── ThemeContext.tsx
│   │   ├── StageContext.tsx
│   │   ├── SettingsContext.tsx
│   │   └── PanelContext.tsx        # NEW: Panel state
│   │
│   ├── hooks/
│   │   ├── useStateManager.ts
│   │   ├── useCommandParser.ts
│   │   ├── useCharacter.ts
│   │   ├── useScene.ts
│   │   ├── useProgressBarStyle.ts   # NEW: Style toggle logic
│   │   ├── useCharacterVoice.ts     # NEW: Voice extraction
│   │   ├── useExplanation.ts        # NEW: Explanation generation
│   │   └── useExpressionTags.ts      # NEW: AI prompt generation
│   │
│   └── utils/
│       ├── formatters.ts
│       ├── validators.ts
│       ├── constants.ts
│       ├── progressBarRenderer.ts   # NEW: Multi-style renderer
│       ├── promptGenerator.ts       # NEW: AI prompt builder
│       └── tagExtractor.ts          # NEW: Tag parsing
```

### 8.2 Component Hierarchy

```
App.tsx
└── Stage.tsx (Root)
    ├── StatusContainer
    │   ├── CategoryTabs (PROGRESSION | BODY | SCENE | EXTRAS)
    │   └── CategoryContent
    │       ├── ProgressionGroup
    │       │   ├── AffectionCategory (EnhancedCategoryView)
    │       │   ├── ObedienceCategory (EnhancedCategoryView)
    │       │   ├── LibidoCategory (EnhancedCategoryView)
    │       │   └── ArousalCategory (EnhancedCategoryView)
    │       ├── BodyClothingGroup
    │       │   ├── ClothingCategory
    │       │   ├── BodyStateCategory
    │       │   └── GenitaliaCategory
    │       ├── SceneGroup
    │       │   ├── LocationDisplay
    │       │   ├── TimeDisplay
    │       │   ├── SexModuleDisplay
    │       │   └── NTRDisplay
    │       └── ExtrasGroup
    │           ├── ExpressionPoseSection (NEW)
    │           ├── MomentsList
    │           ├── InventoryList
    │           └── CharactersTab (NEW)
    │               └── CharacterList
    │                   └── CharacterCard
    │                       └── CharacterDetail (Slide-out)
    │
    ├── SummaryTerminal (30% width)
    │   ├── QuickStatsList
    │   ├── LocationTimeDisplay
    │   └── QuickActions
    │
    └── SettingsPanel
        ├── ProgressBarStyleToggle (NEW)
        ├── ThemeSelector
        └── PanelConfig (NEW)
```

### 8.3 Slide-Out Panel Integration

```typescript
// Slide-out panel component logic

interface SlideOutPanelProps {
  isOpen: boolean;
  width?: number;           // Default: 70%
  position?: 'left' | 'right';
  closeOnOverlay?: boolean;
  children: React.ReactNode;
  onClose: () => void;
}

function SlideOutPanel({
  isOpen,
  width = 70,
  position = 'right',
  closeOnOverlay = true,
  children,
  onClose
}: SlideOutPanelProps) {
  // Animation with transform
  // Overlay with click-to-close
  // Content area with scroll
  // Close button in header

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="panel-overlay"
          onClick={closeOnOverlay ? onClose : undefined}
        />
      )}

      {/* Panel */}
      <div
        className={`slide-out-panel ${position} ${isOpen ? 'open' : ''}`}
        style={{ width: `${width}%` }}
      >
        <div className="panel-header">
          <button onClick={onClose}>✕</button>
        </div>
        <div className="panel-content">
          {children}
        </div>
      </div>
    </>
  );
}
```

---

## 9. Updated User Stories

### 9.1 Enhanced Detail View Stories

**US-STS-14**: As a user, I want to see WHY a character is in their current state so that I understand the narrative context behind statistics.

- **Acceptance Criteria**: Explanation text appears below each status value, explains the narrative reason for current state, generated from recent context, shows confidence indicator, can be manually edited

**US-STS-15**: As a user, I want to see character dialogue and thoughts related to each status so that I feel connected to their voice.

- **Acceptance Criteria**: Character voice block shows direct quotes from character, shows AI-generated suggestions for context, distinguishes between tracked and auto-generated, includes turn number

**US-STS-16**: As a user, I want to see the history of changes for each status so that I can track progression over time.

- **Acceptance Criteria**: History list shows last 5 changes, includes turn numbers, shows trigger event for each change, sortable by newest/oldest/largest

### 9.2 Category Organization Stories

**US-STS-17**: As a user, I want to navigate grouped categories so that I can find relevant information faster.

- **Acceptance Criteria**: Four tab groups visible (Progression, Body, Scene, Extras), tabs have color coding, active tab highlighted, category icons visible

### 9.3 CHARACTERS Tab Stories

**US-STS-18**: As a user, I want to see all NPCs in the current scene so that I know who is available.

- **Acceptance Criteria**: CHARACTERS tab shows grid of character cards, each card shows avatar placeholder, name, role, quick stat, indicates if in scene

**US-STS-19**: As a user, I want to view detailed information about any NPC so that I understand their relationship and status.

- **Clicking a character card opens slide-out panel showing: relationship to main character, description, appearance details (height, build, hair, eyes, distinctive features), current status (location, activity, mood)**

**US-STS-20**: As a user, I want to add new NPCs to the character roster so that I can track more people.

- **Acceptance Criteria**: "+ Add NPC" button in Characters tab header, opens form to add new character, validates required fields, adds to roster immediately

### 9.4 Expression/Pose Section Stories

**US-STS-21**: As a user, I want to see the current character expression and pose so that I can visualize them.

- **Acceptance Criteria**: Expression display shows current expression name and description, shows expression image placeholder, updates when mood/arousal changes

**US-STS-22**: As a user, I want an AI-generated image prompt so that I can create artwork of the character.

- **Acceptance Criteria**: AI prompt auto-generated from current state, includes positive and negative tags, "Copy" button copies to clipboard, shows success confirmation

**US-STS-23**: As a user, I want to view and customize tags so that I can create custom AI image prompts.

- **Acceptance Criteria**: "View Tags" button opens breakdown modal, shows tags by category, allows toggling individual tags, "Copy All" copies selected tags

**US-STS-24**: As a user, I want to generate AI images directly from the Stage so that I can see my character visualized.

- **Acceptance Criteria**: "Generate Image" button triggers API call (or shows placeholder if not configured), shows loading state, displays result or error

### 9.5 Progress Bar Style Stories

**US-STS-25**: As a user, I want to choose my preferred progress bar style so that the interface matches my taste.

- **Acceptance Criteria**: Settings panel shows three options (Unicode Boxes, Emoji Hearts, Both), selecting option updates all progress bars immediately, preference persists across sessions

### 9.6 Slide-Out Panel Stories

**US-STS-26**: As a user, I want detail views to slide out so that I can see the summary while browsing details.

- **Acceptance Criteria**: Detail views open as 70% width slide-out from right, summary terminal remains visible at 30% width, smooth animation (300ms), close button returns to summary view

**US-STS-27**: As a user, I want to resize the slide-out panel so that I can see more or less detail.

- **Acceptance Criteria**: Panel width adjustable via drag handle or settings, minimum 50%, maximum 90%, width preference persists

### 9.7 Updated Technical Stories

**US-STS-28**: As a developer, I want TypeScript interfaces for all new features so that I can implement type-safely.

- **Acceptance Criteria**: All new types defined in src/types/index.ts, interfaces documented, examples provided, no 'any' types used

**US-STS-29**: As a developer, I want the component architecture documented so that I can extend the system.

- **Acceptance Criteria**: Component hierarchy documented, file structure updated, new components follow existing patterns

---

## 10. File Structure Updates

### 10.1 Updated Project Structure

```diff
 eros-status-stage/
+├── .github/
+│   └── workflows/
+│       └── deploy.yml
  ├── public/
  │   ├── characters/
  │   │   └── susan.yaml
  │   ├── chub_meta.yaml
  │   └── scenario.yaml
  ├── src/
  │   ├── assets/
  │   │   ├── expressions/
  │   │   ├── backgrounds/
  │   │   └── icons/
  │   ├── components/
  │   │   ├── common/
  │   │   │   ├── Button.tsx
  │   │   │   ├── Card.tsx
  │   │   │   ├── Modal.tsx
  │   │   │   ├── ProgressBar.tsx
  │   │   │   ├── Toast.tsx
+│   │   │   └── SlideOutPanel.tsx      # NEW
  │   │   ├── status/
  │   │   │   ├── StatusPanel.tsx
+│   │   │   ├── CategoryTabs.tsx       # NEW
+│   │   │   ├── EnhancedCategoryView.tsx # NEW
+│   │   │   ├── StateDisplay.tsx       # NEW
+│   │   │   ├── ExplanationBlock.tsx    # NEW
+│   │   │   ├── CharacterVoiceBlock.tsx # NEW
+│   │   │   ├── HistoryList.tsx         # NEW
  │   │   │   ├── AffectionMeter.tsx
  │   │   │   ├── ObedienceMeter.tsx
  │   │   │   ├── LibidoMeter.tsx
  │   │   │   ├── ArousalMeter.tsx
  │   │   │   └── MoodIndicator.tsx
  │   │   ├── character/
+│   │   │   ├── CharacterTab.tsx        # NEW
  │   │   │   ├── CharacterCard.tsx
+│   │   │   ├── CharacterList.tsx       # NEW
  │   │   │   ├── CharacterDetail.tsx   # UPDATED
+│   │   │   ├── CharacterQuickStat.tsx  # NEW
  │   │   │   ├── ExpressionDisplay.tsx
  │   │   │   ├── RelationshipWeb.tsx
+│   │   │   └── RelationshipLine.tsx    # NEW
+│   │   ├── expression/                  # NEW SECTION
+│   │   │   ├── ExpressionPoseSection.tsx
+│   │   │   ├── ExpressionDisplay.tsx
+│   │   │   ├── AIPromptDisplay.tsx
+│   │   │   ├── TagBreakdown.tsx
+│   │   │   ├── TagCategory.tsx
+│   │   │   └── GenerateImageButton.tsx
  │   │   ├── scene/
  │   │   │   ├── SceneBanner.tsx
  │   │   │   ├── LocationDisplay.tsx
  │   │   │   └── ObjectList.tsx
  │   │   ├── sex/
  │   │   │   ├── SexStatusPanel.tsx
  │   │   │   ├── PositionIndicator.tsx
  │   │   │   ├── OrgasmCounter.tsx
  │   │   │   ├── PersonifiedGenitalia.tsx
  │   │   │   └── NTRIndicator.tsx
  │   │   └── settings/
  │   │       ├── SettingsPanel.tsx
  │   │       ├── ThemeSelector.tsx
  │   │       ├── DisplayDensityControl.tsx
+│   │   │   ├── ProgressBarStyleToggle.tsx # NEW
+│   │   │   └── PanelConfig.tsx          # NEW
  │   ├── context/
  │   │   ├── ThemeContext.tsx
  │   │   ├── StageContext.tsx
  │   │   ├── SettingsContext.tsx
+│   │   └── PanelContext.tsx             # NEW
  │   ├── hooks/
  │   │   ├── useStateManager.ts
  │   │   ├── useCommandParser.ts
  │   │   ├── useCharacter.ts
  │   │   ├── useScene.ts
+│   │   ├── useProgressBarStyle.ts       # NEW
+│   │   ├── useCharacterVoice.ts        # NEW
+│   │   ├── useExplanation.ts           # NEW
+│   │   └── useExpressionTags.ts         # NEW
  │   ├── services/
  │   │   ├── StateManager.ts
  │   │   ├── LorebookSync.ts
  │   │   ├── CommandParser.ts
  │   │   └── EventBus.ts
  │   ├── types/
  │   │   ├── index.ts
  │   │   ├── character.ts
  │   │   ├── state.ts
  │   │   └── config.ts
  │   ├── utils/
  │   │   ├── formatters.ts
  │   │   ├── validators.ts
  │   │   ├── constants.ts
+│   │   ├── progressBarRenderer.ts       # NEW
+│   │   ├── promptGenerator.ts          # NEW
+│   │   └── tagExtractor.ts             # NEW
  │   ├── styles/
  │   │   ├── themes/
  │   │   │   ├── dark.css
  │   │   │   ├── light.css
  │   │   │   └── sepia.css
  │   │   ├── components/
  │   │   │   └── slide-out.css          # NEW
  │   │   └── global.css
  │   ├── App.tsx
  │   ├── main.tsx
  │   ├── Stage.tsx
  │   └── TestRunner.tsx
  ├── index.html
  ├── package.json
  ├── tsconfig.json
  ├── vite.config.ts
  ├── .eslintrc.cjs
  └── README.md
```

### 10.2 New Files to Create

| File | Purpose |
|------|---------|
| `src/components/common/SlideOutPanel.tsx` | Reusable slide-out panel component |
| `src/components/status/CategoryTabs.tsx` | Tab navigation for category groups |
| `src/components/status/EnhancedCategoryView.tsx` | Full detail view with 4 fields |
| `src/components/status/StateDisplay.tsx` | Progress bar + stage + trend |
| `src/components/status/ExplanationBlock.tsx` | Narrative explanation display |
| `src/components/status/CharacterVoiceBlock.tsx` | Quote + suggestion display |
| `src/components/status/HistoryList.tsx` | Last 5 changes display |
| `src/components/character/CharacterTab.tsx` | Main CHARACTERS tab container |
| `src/components/character/CharacterList.tsx` | Grid of character cards |
| `src/components/character/CharacterQuickStat.tsx` | Quick stat badge |
| `src/components/character/RelationshipLine.tsx` | Visual relationship connection |
| `src/components/expression/*.tsx` | Expression/Pose section components |
| `src/components/settings/ProgressBarStyleToggle.tsx` | Style selector |
| `src/components/settings/PanelConfig.tsx` | Slide-out panel settings |
| `src/context/PanelContext.tsx` | Panel state management |
| `src/hooks/useProgressBarStyle.ts` | Style toggle logic |
| `src/hooks/useCharacterVoice.ts` | Voice extraction |
| `src/hooks/useExplanation.ts` | Explanation generation |
| `src/hooks/useExpressionTags.ts` | AI prompt generation |
| `src/utils/progressBarRenderer.ts` | Multi-style renderer |
| `src/utils/promptGenerator.ts` | AI prompt builder |
| `src/utils/tagExtractor.ts` | Tag parsing |
| `src/styles/components/slide-out.css` | Slide-out panel styles |

### 10.3 Implementation Priority

| Priority | Components | Estimated Effort |
|----------|------------|------------------|
| **P0** | SlideOutPanel, PanelContext, CategoryTabs, ProgressBarStyleToggle | High |
| **P1** | EnhancedCategoryView, StateDisplay, HistoryList | Medium |
| **P2** | CharacterTab, CharacterList, CharacterDetail (expanded) | Medium |
| **P3** | ExpressionPoseSection, AIPromptDisplay, TagBreakdown | Medium |
| **P4** | GenerateImageButton, PanelConfig | Low |

---

## Appendix D: Migration Notes

### D.1 Backward Compatibility

The new features are additive and do not break existing functionality:

- Existing status categories remain functional without enhancement
- Existing character display continues to work
- Settings are optional with sensible defaults
- If `enhancedCategories` is not present in state, fall back to basic display

### D.2 Data Migration

When updating existing installations:

1. Add new types to `src/types/index.ts`
2. Add new components following the structure above
3. Update `Stage.tsx` to include new contexts
4. Test with existing data to ensure fallbacks work
5. Enable new features via settings

---

**Addendum Version:** 1.1  
**Last Updated:** May 2026  
**Changes:** Added enhanced detail views, category organization, CHARACTERS tab, expression/pose section, progress bar toggle, and slide-out panel