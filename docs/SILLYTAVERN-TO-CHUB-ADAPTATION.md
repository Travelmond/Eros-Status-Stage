# SillyTavern to Chub Venus AI Stage Adaptation Guide

**Version:** 1.0  
**Date:** May 2026  
**Purpose:** Guide for adapting SillyTavern extension architecture to Chub Venus AI Stage framework

---

## 1. Overview

This document provides the technical foundation for adapting the **RPG Companion for SillyTavern** extension architecture to the **Chub Venus AI Stage** framework. The goal is to leverage the proven patterns from the reference while properly mapping them to Chub's React-based Stage API.

### Reference Stage
- **Name:** RPG Companion
- **Version:** 3.7.4
- **Platform:** SillyTavern
- **Files:** 70+ modules
- **Lines:** ~15,000+ (including style.css)

### Target Stage
- **Name:** Eros Status Stage
- **Platform:** Chub Venus AI (Stage framework)
- **Tech Stack:** React, TypeScript, Vite

---

## 2. Architecture Mapping

### 2.1 File Structure Comparison

| SillyTavern (Reference) | Chub Stage (Target) | Adaptation Notes |
|-------------------------|---------------------|-------------------|
| `index.js` (1552 lines) | `Stage.tsx` | Entry point, event orchestration |
| `src/core/state.js` | `myInternalState` in Stage.tsx | Centralized state |
| `src/core/persistence.js` | Stage built-in (messageState) | Use Stage's persistence |
| `src/core/events.js` | Lifecycle hooks | Map to load/beforePrompt/afterResponse |
| `src/core/config.js` | Constants file | Static configuration |
| `src/systems/rendering/*.js` | React components | Rewrite as React |
| `style.css` (11910 lines) | SCSS modules | Port with CSS variables |
| `src/systems/ui/modals.js` | React modals | Slide-out panels |
| `src/systems/ui/theme.js` | React Context | Theme provider |

### 2.2 Key Differences

| Aspect | SillyTavern | Chub Stage |
|--------|-------------|------------|
| **Rendering** | jQuery DOM manipulation | React components |
| **State** | Module-level let + setters | Class property + messageState |
| **Events** | eventSource.on/off/emit | Lifecycle methods |
| **Persistence** | Custom persistence.js | Built-in messageState |
| **UI Framework** | Vanilla JS + jQuery | React 18 |
| **Styling** | Plain CSS | SCSS modules |
| **Build** | Browser-ready JS | Vite + TypeScript |

---

## 3. Core Adaptations

### 3.1 Lifecycle Mapping

#### SillyTavern Event System (Reference)
```javascript
// src/core/events.js
import { eventSource, event_types } from '../../../../script.js';

export function registerAllEvents(handlers) {
    Object.entries(handlers).forEach(([event, handler]) => {
        eventSource.on(event, handler);
    });
}

// Usage in index.js
registerAllEvents({
    [event_types.MESSAGE_SENT]: onMessageSent,
    [event_types.MESSAGE_RECEIVED]: onMessageReceived,
    [event_types.CHAT_CHANGED]: onChatLoaded,
    [event_types.CHARACTER_UPDATED]: onCharacterChanged,
    [event_types.MESSAGE_SWIPED]: onMessageSwiped
});
```

#### Chub Stage Lifecycle (Target)
```typescript
// Stage.tsx
export class Stage extends StageBase<InitStateType, ChatStateType, MessageStateType, ConfigType> {
    
    constructor(data: InitialData) {
        super(data);
        // Initialize state from data.characters, data.users, etc.
    }

    async load(): Promise<LoadResponse> {
        // Called once on initialization
        return { success: true };
    }

    async beforePrompt(userMessage: Message): Promise<StageResponse> {
        // Called before each user message
        // Can inject stage directions
        return { stageDirections: null, messageState: this.myInternalState };
    }

    async afterResponse(botMessage: Message): Promise<StageResponse> {
        // Called after each AI response
        // Parse response, update state
        return { messageState: this.myInternalState };
    }

    render(): ReactElement {
        // Return React component tree
        return <ErosStatusApp state={this.myInternalState} />;
    }
}
```

### 3.2 State Management Mapping

#### SillyTavern State (Reference)
```javascript
// src/core/state.js
export let extensionSettings = {
    showUserStats: true,
    showInventory: true,
    theme: 'default',
    // ... 50+ settings
};

export let lastGeneratedData = {
    userStats: null,
    infoBox: null,
    inventory: null,
    // ...
};

export let committedTrackerData = { /* ... */ };

export function setExtensionSettings(newSettings) {
    extensionSettings = newSettings;
}

export function updateExtensionSettings(updates) {
    Object.assign(extensionSettings, updates);
}
```

#### Chub Stage State (Target)
```typescript
// src/types/eros-status.ts
interface ErosStatusState {
    version: string;
    progressions: ProgressionValues;
    system: SystemData;
    location: LocationData;
    clothing: ClothingState;
    body: BodyState;
    genitalia: GenitaliaState;
    sexModule: SexModuleState;
    ntrModule: NTRModuleState;
    inventory: InventoryState;
    expressionPose: ExpressionPoseData;
    characters: CharacterCard[];
    memories: ImportantMoment[];
    settings: SettingsState;
}

// In Stage.tsx
type MessageStateType = ErosStatusState;

this.myInternalState = messageState ?? {
    version: '1.0',
    progressions: { affection: 30, obedience: 30, libido: 20, /* ... */ },
    system: { day: 1, time: 'Morning', weather: 'Sunny' },
    // ... all other fields with defaults
};
```

### 3.3 Persistence Mapping

#### SillyTavern Persistence (Reference)
```javascript
// src/core/persistence.js (~1831 lines)
export function saveSettings() {
    const data = JSON.stringify(extensionSettings);
    localStorage.setItem('rpg-companion-settings', data);
}

export function loadSettings() {
    const data = localStorage.getItem('rpg-companion-settings');
    return JSON.parse(data);
}

export function saveChatData(chatId, data) {
    // Saves to chat metadata
    chat_metadata.rpg_companion = data;
}
```

#### Chub Stage Persistence (Target)
- **Built-in:** Stage automatically persists `messageState` between messages
- **No custom persistence needed:** The Stage framework handles save/load
- **Usage:** Update `this.myInternalState` and return in `StageResponse.messageState`

```typescript
async afterResponse(botMessage: Message): Promise<StageResponse> {
    // Update state
    this.myInternalState.progressions.affection += 5;
    
    // Stage automatically persists this
    return {
        messageState: this.myInternalState
    };
}
```

---

## 4. Component Adaptation

### 4.1 Rendering: jQuery to React

#### SillyTavern Rendering (Reference)
```javascript
// src/systems/rendering/userStats.js
export function renderUserStats() {
    if (!extensionSettings.showUserStats || !$userStatsContainer) return;
    
    let html = '<div class="rpg-stats-content">';
    
    // Build stats HTML
    const stats = extensionSettings.userStats;
    for (const stat of config.customStats) {
        if (stat.enabled) {
            const value = stats[stat.id] ?? 100;
            html += `
                <div class="rpg-stat-row">
                    <span class="rpg-stat-label">${stat.name}</span>
                    <div class="rpg-stat-bar">
                        <div class="rpg-stat-fill" style="width: ${value}%"></div>
                    </div>
                    <span class="rpg-stat-value">${value}%</span>
                </div>
            `;
        }
    }
    
    html += '</div>';
    
    // Direct DOM manipulation
    $userStatsContainer.html(html);
}
```

#### React Rendering (Target)
```tsx
// src/components/status/StatusPanel.tsx
interface StatusPanelProps {
    progressions: ProgressionValues;
    onUpdate?: (key: string, value: number) => void;
}

export function StatusPanel({ progressions, onUpdate }: StatusPanelProps) {
    const stats = [
        { key: 'affection', label: 'Affection', icon: '💕', value: progressions.affection },
        { key: 'obedience', label: 'Obedience', icon: '🎯', value: progressions.obedience },
        { key: 'libido', label: 'Libido', icon: '🔥', value: progressions.libido },
        { key: 'arousal', label: 'Arousal', icon: '🍑', value: progressions.arousal },
    ];
    
    return (
        <div className="eros-status-panel">
            {stats.map(stat => (
                <div key={stat.key} className="eros-stat-row">
                    <span className="eros-stat-label">{stat.icon} {stat.label}</span>
                    <ProgressBar 
                        value={stat.value} 
                        max={100}
                        onClick={() => onUpdate?.(stat.key, stat.value)}
                    />
                    <span className="eros-stat-value">{stat.value}%</span>
                </div>
            ))}
        </div>
    );
}
```

### 4.2 Progress Bar Styling

#### SillyTavern CSS (Reference)
```css
/* style.css */
.rpg-stat-bar {
    height: clamp(9px, 1.3vh, 11px);
    border-radius: 0.375em;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: linear-gradient(to right, #cc3333, #33cc66);
}

.rpg-stat-fill {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
```

#### Target CSS (Chub Stage)
```scss
// styles/components/_progress-bar.scss
.eros-progress-bar {
    height: 12px;
    border-radius: 6px;
    background: var(--eros-stat-bar-bg, #1a1a2e);
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    position: relative;
    
    &.style-unicode {
        .eros-progress-fill {
            background: linear-gradient(to right, #ff6b6b, #4ecdc4);
        }
    }
    
    &.style-emoji {
        // Emoji-based rendering handled in React
    }
}

.eros-progress-fill {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    background: linear-gradient(to right, var(--eros-low-color), var(--eros-high-color));
    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 4.3 Modal System

#### SillyTavern Modals (Reference)
```javascript
// src/systems/ui/modals.js
export class DiceModal {
    constructor() {
        this.isOpen = false;
    }
    
    show() {
        this.isOpen = true;
        const html = this.render();
        $('body').append(html);
    }
    
    hide() {
        this.isOpen = false;
        $('.rpg-dice-modal').remove();
    }
}
```

#### React Modals (Target)
```tsx
// src/components/common/SlideOutPanel.tsx
interface SlideOutPanelProps {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    width?: number; // 70% default
}

export function SlideOutPanel({ isOpen, title, onClose, children, width = 70 }: SlideOutPanelProps) {
    if (!isOpen) return null;
    
    return (
        <div className="eros-slide-out-overlay" onClick={onClose}>
            <div 
                className="eros-slide-out-panel" 
                style={{ width: `${width}%` }}
                onClick={e => e.stopPropagation()}
            >
                <div className="eros-panel-header">
                    <h2>{title}</h2>
                    <button onClick={onClose} className="eros-close-btn">×</button>
                </div>
                <div className="eros-panel-content">
                    {children}
                </div>
            </div>
        </div>
    );
}
```

---

## 5. Security Adaptation

### 5.1 Input Sanitization

#### SillyTavern Security (Reference)
```javascript
// src/utils/security.js
const BLOCKED_PROPERTY_NAMES = [
    '__proto__', 'constructor', 'prototype',
    'eval', 'Function'
];

export function sanitizeLocationName(name) {
    if (!name || typeof name !== 'string') return null;
    
    // Check blocked names
    if (BLOCKED_PROPERTY_NAMES.includes(name.toLowerCase())) {
        console.warn('[Security] Blocked property name:', name);
        return null;
    }
    
    // Truncate long names
    const MAXLENGTH = 100;
    if (name.length > MAXLENGTH) {
        console.warn('[Security] Name too long, truncating:', name.length);
        return name.slice(0, MAXLENGTH);
    }
    
    return name.trim();
}
```

#### Target Security (Chub Stage)
```typescript
// src/systems/validation/sanitizer.ts
const BLOCKED_PROPERTY_NAMES = ['__proto__', 'constructor', 'prototype'];

export function sanitizeInput(input: string, maxLength: number = 500): string | null {
    if (!input || typeof input !== 'string') return null;
    
    if (BLOCKED_PROPERTY_NAMES.some(blocked => 
        input.toLowerCase().includes(blocked)
    )) {
        console.warn('[Eros Status] Blocked input:', input);
        return null;
    }
    
    return input.trim().slice(0, maxLength);
}

export function validateProgressValue(value: number): number {
    return Math.max(0, Math.min(100, Math.round(value)));
}
```

---

## 6. Features to Keep vs Remove

### 6.1 Features to Adapt

| Feature | Reference Module | Target Implementation | Priority |
|---------|-----------------|----------------------|----------|
| Stats Display | userStats.js | StatusPanel + ProgressBar | HIGH |
| Inventory | inventory.js | InventoryPanel | HIGH |
| Progress Bars | userStats.js | ProgressBar component | HIGH |
| Location/Time | infoBox.js | LocationDisplay | HIGH |
| Character Details | thoughts.js | CharacterVoice component | MEDIUM |
| Theming | theme.js | ThemeContext | MEDIUM |
| Lock System | lockManager.js | Per-stat lock toggle | MEDIUM |
| Expression/Image | N/A (new) | ExpressionPoseSection | HIGH |
| CHARACTERS Tab | N/A (new) | CharacterTab component | HIGH |

### 6.2 Features to Remove

| Feature | Reason |
|---------|--------|
| Dice Roller | Not relevant to Eros Status |
| Quest Tracking | Not in Eros Status scope |
| Music Player | Not in Eros Status scope |
| Encounter System | Not in Eros Status scope |
| Chapter Checkpoints | Not in Eros Status scope |
| Plot Progression | Not in Eros Status scope |
| i18n (5 languages) | Start English only |

---

## 7. New Eros Status Features

### 7.1 Enhanced Detail Views (4-Field Structure)

Each detail category includes:
1. **Current State** - Value, progress bar, stage/trend
2. **Explanation** - Narrative text (WHY character is in this state)
3. **Character Voice** - Dialogue OR thought (Option C: both tracked + auto-generated)
4. **History** - Last 5 changes with turn numbers

### 7.2 Category Groups

- 🟢 **PROGRESSION**: Affection, Obedience, Libido, Arousal
- 🔵 **BODY & CLOTHING**: Clothing, Body State, Genitalia
- 🔴 **SCENE**: Location, Time, Sex Module, NTR
- 🟣 **EXTRAS**: Expressions, Moments, Inventory, CHARACTERS

### 7.3 Expression/Pose Section (AI Image Generation)

- Current expression + pose display
- Auto-generated AI prompt from state
- Buttons: Generate Image, Copy Tags, View Tags

### 7.4 CHARACTERS Tab

- NPC roster grid
- Character detail modal with: Relationship, Description, Appearance, Current Status

---

## 8. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
1. Set up Stage project structure
2. Create TypeScript types (eros-status.ts)
3. Adapt state management (myInternalState)
4. Implement lifecycle hooks

### Phase 2: Core UI (Weeks 3-4)
1. Create base CSS with variables
2. Build progress bar component
3. Create summary terminal
4. Implement category navigation
5. Build slide-out panel system

### Phase 3: Detail Views (Weeks 5-6)
1. Create enhanced category views (4-field)
2. Build CHARACTERS tab
3. Implement expression/pose section
4. Add progress bar style toggle
5. Create settings panel

### Phase 4: Advanced Features (Weeks 7-8)
1. Implement lock system
2. Build inventory management
3. Add location/time display
4. Integrate expression API
5. Mobile responsive

### Phase 5: Polish (Weeks 9-10)
1. Theme system finalization
2. Accessibility audit
3. Error handling
4. Performance optimization
5. Documentation

---

## 9. CSS Variable Mapping

### SillyTavern to Stage Variables

| SillyTavern Variable | Stage Variable | Purpose |
|---------------------|----------------|---------|
| `--rpg-bg` | `--eros-bg` | Panel background |
| `--rpg-accent` | `--eros-accent` | Accent surfaces |
| `--rpg-text` | `--eros-text` | Primary text |
| `--rpg-highlight` | `--eros-highlight` | Interactive elements |
| `--rpg-border` | `--eros-border` | Borders |
| `--rpg-shadow` | `--eros-shadow` | Shadows |

### Default Theme (Dark)
```css
:root {
    --eros-bg: rgba(26, 26, 46, 0.95);
    --eros-accent: rgba(22, 33, 62, 0.95);
    --eros-text: #eaeaea;
    --eros-highlight: #e94560;
    --eros-border: #4a7ba7;
    --eros-shadow: rgba(0, 0, 0, 0.5);
    
    /* Status Colors */
    --eros-affection: #ff6b81;
    --eros-obedience: #7bed9f;
    --eros-libido: #ffa502;
    --eros-arousal: #ff4757;
    --eros-location: #00d2d3;
    --eros-time: #feca57;
}
```

---

## 10. API Reference

### 10.1 Stage Lifecycle Methods

```typescript
interface StageLifecycle {
    // Constructor - initialize state
    constructor(data: InitialData): void;
    
    // Called once on load
    load(): Promise<LoadResponse>;
    
    // Called before each user message
    beforePrompt(message: Message): Promise<StageResponse>;
    
    // Called after each AI response
    afterResponse(message: Message): Promise<StageResponse>;
    
    // Return React component tree
    render(): ReactElement;
}
```

### 10.2 Data Access

```typescript
// Access character data
this.characters;        // Record<string, Character>
this.users;             // Record<string, User>
this.environment;       // string

// Access state
this.myInternalState;   // ErosStatusState
messageState;           // Persisted state from constructor

// Response methods
return { 
    stageDirections: string | null,
    messageState: ErosStatusState,
    modifiedMessage: string | null,
    systemMessage: string | null,
    error: string | null
};
```

---

## 11. Testing Strategy

### 11.1 Development Testing
- Use `yarn dev --host --mode staging` for local development
- Test in browser against mock character data
- Use TestRunner.tsx for unit testing components

### 11.2 Integration Testing
- Deploy to Chub Stage staging
- Test with real character in Chub Venus AI
- Verify state persistence across messages

### 11.3 Edge Cases
- Empty character data
- Invalid state values
- Long-running sessions
- Multiple character switches

---

## 12. Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| State not persisting | Ensure messageState is returned in afterResponse |
| Components not updating | Use React state management, not direct DOM |
| Styles not applied | Check SCSS module import and CSS variables |
| TypeScript errors | Ensure proper type definitions in types/index.ts |
| Event handlers not firing | Verify lifecycle method returns proper StageResponse |

---

## Appendix A: File Conversion Checklist

- [ ] `index.js` → `Stage.tsx` (lifecycle methods)
- [ ] `src/core/state.js` → Types in `src/types/`
- [ ] `src/core/events.js` → Integrated into lifecycle
- [ ] `src/core/config.js` → `src/utils/constants.ts`
- [ ] `src/core/persistence.js` → Remove (built-in)
- [ ] `src/systems/rendering/*.js` → `src/components/*`
- [ ] `src/systems/ui/theme.js` → `src/context/ThemeContext.tsx`
- [ ] `src/systems/ui/modals.js` → `src/components/common/*`
- [ ] `style.css` → SCSS modules in `styles/`
- [ ] `src/utils/security.js` → `src/systems/validation/`

---

## Appendix B: Key Differences Summary

| Aspect | SillyTavern | Chub Stage |
|--------|-------------|------------|
| Framework | Vanilla JS + jQuery | React 18 |
| State | Module-level let | Class property + messageState |
| Events | eventSource.on/off | Lifecycle methods |
| Persistence | Custom (localStorage) | Built-in messageState |
| Build | Browser-ready | Vite + TypeScript |
| UI | Direct DOM | React components |

---

**Document Version:** 1.0  
**Last Updated:** May 2026  
**Based on:** RPG Companion v3.7.4 analysis + Eros Status Stage requirements