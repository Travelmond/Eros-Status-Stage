# Eros Status Stage - Technical Documentation

**Version:** 1.0  
**Status:** Technical Specification  
**Platform:** Chub Stage Framework  
**Date:** May 2026

---

## 1. Introduction

### 1.1 What is Eros Status Stage?

Eros Status Stage is a sophisticated visual novel interface built on the Chub Stage framework that transforms the Eros Status System 3.0 Lorebook framework into an immersive, interactive experience. While the traditional Eros Status System operates purely through text-based terminal displays within the Chub Venus AI chat interface, Eros Status Stage introduces a dedicated graphical user interface that renders character status, relationships, and narrative states in real-time.

The Stage serves as a multimedia layer that overlays the roleplaying experience with rich visual feedback, interactive controls, and persistent state management. Unlike conventional Lorebook implementations that rely solely on AI memory and text parsing, Eros Status Stage maintains authoritative state control, ensuring that character statistics, relationship dynamics, and narrative flags remain consistent across sessions. This eliminates the common problem of AI hallucination where the model forgets or misrepresents character states.

### 1.2 Purpose and Goals

The primary purpose of Eros Status Stage is to bridge the gap between text-based roleplaying and visual novel aesthetics. The system aims to achieve several critical objectives:

**State Integrity**: By decoupling state management from AI memory, Eros Status Stage ensures that character statistics, relationship values, and narrative flags maintain absolute consistency. Every update is recorded, validated, and displayed in real-time, eliminating contradictory state representations that plague traditional Lorebook implementations.

**Visual Immersion**: The Stage renders character status information through a modern, responsive interface that mimics visual novel conventions. Users can visualize relationship progression through progress bars, view character expressions through expression packs, and navigate story branches through interactive UI elements.

**Interactive Narrative Control**: Beyond passive display, Eros Status Stage provides users with direct control over narrative elements. Character status can be modified through UI interactions, scene flags can be toggled, and story progression can be influenced through gameplay mechanics rather than pure text commands.

**Cross-Platform Accessibility**: Built on the Chub Stage framework, the interface automatically deploys across web, iOS, Android, and Vision Pro platforms, ensuring that users can access their visual novel experience from any device without additional development effort.

### 1.3 Relationship to Eros Status System 3.0

Eros Status Stage does not replace the Eros Status System 3.0 Lorebook; rather, it extends and enhances it. The Lorebook remains the authoritative source of character context that the AI reads and writes, while the Stage provides the visual layer that makes this context tangible and interactive. The relationship follows a client-server pattern where the Lorebook serves as the backend data store and the Stage serves as the frontend presentation layer.

In practical implementation, the Stage maintains its own state synchronization with the Lorebook, reflecting changes made through AI commands while also providing alternative update mechanisms through direct user interaction. This dual-update capability ensures that the system remains flexible while maintaining state integrity.

---

## 2. Visual Novel Design Patterns

### 2.1 UI/UX Research Findings

The visual design of Eros Status Stage draws from extensive research into established visual novel conventions and modern interface design patterns. This research identified several key design principles that inform the Stage's architecture:

**Progressive Disclosure**: Visual novel interfaces must balance information density with cognitive load. Users should not be overwhelmed by statistics during normal gameplay, but detailed information should be accessible when needed. The design employs a layered approach where essential information displays prominently while advanced details remain one click away. This mirrors the condensed versus full status display pattern from the original Eros Status System, translated into a visual context.

**Contextual Relevance**: Information presentation adapts to the current narrative context. During quiet scenes, the interface emphasizes character expressions and environmental details. During intimate scenes, the interface shifts focus to relationship metrics and physical state indicators. This contextual adaptation ensures that the UI supports rather than distracts from the narrative experience.

**Color-Coded Information Architecture**: Drawing from the original terminal display color scheme, the Stage employs a consistent color coding system that allows users to quickly scan and parse information. Red indicates character names and romantic elements, deep sky blue identifies locations, lime green marks items and clothing, hotpink signals sexual content, and gold distinguishes time and date information. This color system creates visual coherence that transfers from text-based terminal displays to graphical UI elements.

**Responsive Layout Patterns**: The interface employs grid-based layouts that adapt seamlessly across device form factors. Desktop displays leverage full-width panels with hover-reveal details, while mobile interfaces consolidate information into swipeable cards and bottom-sheet overlays. This responsive approach ensures that the visual novel experience maintains quality regardless of the access device.

### 2.2 Interface Component Patterns

The Stage implements several recurring component patterns that establish visual novel conventions:

**Status Panel Components**: Character statistics render as horizontal progress bars with percentage indicators and descriptive labels. Affection, obedience, libido, and other metrics follow a consistent visual format that allows users to compare multiple statistics at a glance. Color gradients within the progress bars indicate the qualitative meaning of values, with green representing positive states and red indicating problematic conditions.

**Character Card Components**: NPCs and main characters display in card-style components that show the character name, role tag, current expression image, and quick-stat summary. These cards serve as both navigation elements and at-a-glance reference points. Long-press or click interactions reveal detailed character sheets with full statistics, relationship history, and personal information.

**Scene Indicator Components**: Active scene type displays through prominent banner components that appear at the top of the interface. The scene indicator shows the current scene type (quiet, conversation, flirt, foreplay, sex, aftercare), intensity level, and relevant flags. This component provides constant awareness of the narrative context without requiring users to access detailed menus.

**Relationship Web Components**: When multiple characters interact, a relationship web visualization displays the connections between characters. Lines between character nodes indicate relationship type (romantic, familial, adversarial), with line thickness and color representing relationship strength and valence. This visualization helps users understand complex interpersonal dynamics at a glance.

### 2.3 Interaction Patterns

Beyond static display, the Stage implements interactive patterns that enable direct user manipulation of the narrative state:

**Tap-to-Update Interactions**: Tapping on specific UI elements triggers state updates. Clicking on a relationship meter might open an adjustment dialog, while tapping on an emotion indicator might cycle through available emotional states. These interactions provide alternatives to text commands for users who prefer graphical interfaces.

**Drag-and-Drop Mechanics**: Certain narrative elements support drag-and-drop manipulation. Moving characters between locations, rearranging inventory items, and adjusting scene composition use drag-and-drop patterns familiar from gaming interfaces. These interactions feel natural and tactile, increasing engagement with the narrative system.

**Gesture Navigation**: On touch devices, gesture patterns provide quick access to common functions. Swipe left or right between character cards, pull down to access the settings panel, and long-press to trigger contextual menus. These gestures create an intuitive interaction model that feels responsive and fluid.

---

## 3. Technical Architecture

### 3.1 System Architecture Overview

Eros Status Stage follows a modular architecture that separates concerns into distinct layers. The architecture comprises three primary layers: the State Management Layer, the UI Rendering Layer, and the Communication Layer. Each layer maintains clear interfaces that enable independent evolution and testing.

The State Management Layer handles all data operations, including reading from the Lorebook, processing updates, and synchronizing state across sessions. This layer implements the Eros Status System 3.0 data model and provides validation, transformation, and persistence services. The state manager serves as the single source of truth for all character and narrative data.

The UI Rendering Layer receives state snapshots from the management layer and transforms them into React components for display. This layer implements the visual novel design patterns and handles all user interactions, translating them into state update requests. The rendering layer is purely presentational and contains no business logic.

The Communication Layer mediates between the Stage and the external environment, including the Chub platform API, the Lorebook data store, and the AI model interaction pipeline. This layer handles authentication, data serialization, and error recovery, providing a stable interface regardless of external system changes.

### 3.2 Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           EROS STATUS STAGE                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                        UI RENDERING LAYER                            │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │  │ StatusPanel │  │CharacterCard│  │ SceneBanner │  │ Relationship│  │  │
│  │  │  Component  │  │  Component  │  │  Component  │  │    Web      │  │  │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  │  │
│  │         │                │                │                │         │  │
│  │         └────────────────┴────────┬────────┴────────────────┘         │  │
│  │                                   │                                    │  │
│  │                          ┌────────▼────────┐                          │  │
│  │                          │   App.tsx       │                          │  │
│  │                          │   (Root)        │                          │  │
│  │                          └────────┬────────┘                          │  │
│  └──────────────────────────────────┼────────────────────────────────────┘  │
│                                     │                                       │
├─────────────────────────────────────┼───────────────────────────────────────┤
│                             STATE MANAGEMENT LAYER                         │
│                                     │                                       │
│                          ┌─────────▼─────────┐                            │
│  ┌──────────────────────┤   Stage.ts        ├──────────────────────────┐  │
│  │                      │   (Controller)    │                          │  │
│  │                      └─────────┬─────────┘                          │  │
│  │                                │                                     │  │
│  │         ┌──────────────────────┼──────────────────────┐             │  │
│  │         │                      │                      │             │  │
│  │  ┌──────▼──────┐      ┌───────▼──────┐      ┌──────▼──────┐        │  │
│  │  │ StateManager│      │ LorebookSync │      │EventHandler │        │  │
│  │  │             │      │   Service     │      │             │        │  │
│  │  └──────┬──────┘      └───────┬──────┘      └──────┬──────┘        │  │
│  │         │                     │                     │               │  │
│  └─────────┼─────────────────────┼─────────────────────┼───────────────┘  │
│            │                     │                     │                   │
├────────────┼─────────────────────┼─────────────────────┼───────────────────┤
│            │               COMMUNICATION LAYER         │                   │
│            │                     │                     │                   │
│  ┌─────────▼─────────────────────▼─────────────────────▼───────────────┐  │
│  │                    Chub Platform API                                   │  │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐  │  │
│  │  │  Characters API │  │  Users API      │  │   Messages API      │  │  │
│  │  └────────┬────────┘  └────────┬────────┘  └──────────┬──────────┘  │  │
│  │           │                    │                     │              │  │
│  │           └────────────────────┴─────────────────────┘              │  │
│  │                            │                                         │  │
│  └────────────────────────────┼────────────────────────────────────────┘  │
│                               │                                           │
│                    ┌──────────▼──────────┐                               │
│                    │  Lorebook Data Store │                              │
│                    │  (External Source)   │                              │
│                    └──────────────────────┘                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Data Flow Architecture

The Stage implements a unidirectional data flow pattern inspired by Flux architecture. Data flows through the system in a predictable sequence that enables clear debugging and testing:

**Initialization Flow**: When a chat initializes, the Stage receives configuration data including character information, user data, and any previously persisted state. The constructor instantiates the Stage class and initializes the internal state from the provided message state. The async load() method then performs any necessary preprocessing, such as loading expression packs or validating configuration. The initial state is synchronized with the Lorebook to ensure consistency with the AI's understanding of the character context.

**User Interaction Flow**: When a user interacts with the UI, the interaction triggers a state update request. The UI component dispatches an action through the event handler, which the Stage processes. The State Manager validates the requested update against business rules and applies the change if valid. The updated state is then serialized and persisted through the message state system. Finally, the render() method is invoked to reflect the new state in the UI.

**AI Response Flow**: When the AI generates a response, the afterResponse() hook processes the output. The system scans the response text for commands matching the Eros Status command pattern (e.g., `<UPDATE favorability:75>`, `<SET sex_active:true>`). Detected commands are parsed and executed against the state manager, updating the authoritative state. If commands modify the UI-relevant state, the render() method updates accordingly. Any system messages generated by state changes are injected into the chat log for user visibility.

**Synchronization Flow**: The Lorebook synchronization service maintains consistency between the Stage state and the external Lorebook. On initialization and after significant state changes, the service reads from the Lorebook to verify alignment. If discrepancies exist, the Stage state takes precedence for display purposes while flagging the inconsistency for user awareness. This ensures the UI always presents coherent information while preventing data loss.

### 3.4 Key Classes and Interfaces

The Stage implementation relies on several key classes and interfaces that define its behavior:

**Stage Class (Stage.tsx)**: The primary controller class extends StageBase and implements the stage lifecycle hooks. The class maintains internal state through myInternalState and implements the required async methods: load(), beforePrompt(), afterResponse(), and render(). Custom methods handle state management, command parsing, and UI event processing.

**StageBase Generic**: The base class provides type-safe access to initialization data, including characters, users, config, messageState, environment, initState, and chatState. The generic type parameters (<InitStateType, ChatStateType, MessageStateType, ConfigType>) define the shapes of persisted data structures.

**MessageStateType**: The data structure that persists between messages, including character statistics, relationship values, scene flags, and UI state. This structure mirrors the Eros Status System 3.0 data model with additional fields for Stage-specific display preferences.

**ConfigType**: The stage-specific configuration that users can customize, including theme selection, display density, notification preferences, and accessibility options. This configuration enables users to tailor the Stage experience to their preferences.

---

## 4. Features

### 4.1 Core Features

**Real-Time Status Display**: The Stage renders character status information in real-time, reflecting updates immediately as they occur. The display shows affection level, obedience, libido, mood, and other metrics through visual progress bars. Users can toggle between condensed view (essential stats only) and full view (complete statistics with history).

**Character Card System**: Each character in the scenario displays as an interactive card showing the character's current expression, name, role tag, and quick-stat summary. The cards serve as navigation elements that reveal detailed character sheets on interaction. The expression displayed updates based on the character's emotional state, providing visual feedback of the character's current disposition.

**Relationship Visualization**: The relationship web component displays connections between all characters in the scenario. Lines represent relationship types with visual properties indicating strength and valence. Users can see at a glance how characters relate to each other, understanding complex interpersonal dynamics without reading through text descriptions.

**Scene Type Indicator**: The current narrative scene type (quiet, conversation, flirt, foreplay, sex, aftercare) displays prominently at the top of the interface. The indicator also shows scene intensity and any active flags (e.g., NTR engaged, pregnancy imminent). This constant visibility keeps users aware of the narrative context.

**Location Display**: Current location renders with visual detail showing the room name, environmental description, and objects present. Users can see what items are available in the environment and their current states (dirty level, occupancy, etc.).

### 4.2 Advanced Features

**Sex Status Module**: When the sex_active flag is true, the interface expands to show detailed sexual statistics including position, arousal level, orgasm count, and cum location. The display adapts based on the scene type, showing appropriate information density for the current context. The module integrates with the personified genitalia feature to display entity messages when that feature is enabled.

**NTR Module Display**: When the ntr_enabled flag is true, the interface includes NTR-specific indicators showing the current role (cuckold, bull, hotwife), partner information, humiliation level, and gene quality comparison. Special visual styling distinguishes NTR content from standard content, providing awareness of the active module without disrupting the experience.

**Personified Genitalia Display**: When personified_genitalia is enabled, the interface displays entity messages from the womb, vagina, balls, and cock entities. These messages appear as floating text or in a dedicated panel, providing the narrative depth of personified genitalia in a visual format.

**Clothing and Body State**: The interface shows current clothing status and body state in a consolidated view. Users can see what the character is wearing, the state of each clothing item (removed, hiked up, dirty), and body part states (exposed, wet, trembling, etc.). This information supports immersion by providing constant visual reminder of the character's physical state.

**History Tracking**: The Stage maintains history of significant events, including affection changes, relationship progression, sexual encounters, and narrative milestones. This history displays in a timeline format that helps users understand the narrative arc and recall important moments.

### 4.3 User Experience Features

**Theme Support**: Users can select from multiple visual themes including Dark Mode (default), Light Mode, and Sepia Mode. Each theme adjusts colors, contrast, and visual effects to suit different preferences and lighting conditions. Theme selection persists across sessions.

**Display Density Options**: Users can choose between Compact, Normal, and Expanded display densities. Compact shows minimal information for maximum immersion, Normal provides balanced information, and Expanded shows complete detail for power users who want full awareness.

**Notification System**: The Stage provides visual notifications for significant events, such as affection changes, climax events, and relationship milestones. Users can configure which events trigger notifications and whether they appear as toast messages, badge updates, or both.

**Accessibility Features**: The interface supports screen readers with proper ARIA labels, keyboard navigation for all interactive elements, high contrast mode, and adjustable font sizes. These features ensure the Stage remains usable by users with diverse needs.

---

## 5. User Stories

### 5.1 Primary User Stories

**US-STS-01**: As a user, I want to see character status at a glance so that I can understand the current relationship dynamic without reading through text descriptions. The system displays affection, obedience, and libido as prominent progress bars with color coding. Acceptance Criteria: Status bars update within 500ms of state changes, color reflects value meaning (green=positive, red=negative), percentage displays alongside bars.

**US-STS-02**: As a user, I want to modify character status through UI interactions so that I can adjust the narrative without complex text commands. The system provides tap targets on status meters that open adjustment dialogs. Acceptance Criteria: Tapping a meter opens a slider or input dialog, changes apply immediately to state, changes reflect in both UI and Lorebook.

**US-STS-03**: As a user, I want to see character expressions that match their emotional state so that I can visualize their reactions. The system updates expression images based on mood, scene type, and arousal level. Acceptance Criteria: Expression changes within 1 second of mood change, expressions are appropriate to scene context, fallback expression available if pack missing.

**US-STS-04**: As a user, I want to understand relationships between all characters so that I can navigate complex interpersonal dynamics. The system displays relationship web with lines indicating type and strength. Acceptance Criteria: Web renders for 2+ characters, line color and thickness reflect relationship properties, clicking on a connection reveals detail.

**US-STS-05**: As a user, I want to know what scene type is active so that I understand the narrative context. The system shows scene indicator banner at interface top. Acceptance Criteria: Banner updates on scene type change, indicator shows both type and intensity, styling distinguishes scene types visually.

**US-STS-06**: As a user, I want to access detailed information about any element by clicking on it so that I can explore data without cluttering the main view. The system implements progressive disclosure where detail views appear on interaction. Acceptance Criteria: Click/tap reveals detail panel or modal, detail view contains comprehensive information, closing returns to main view without losing context.

### 5.2 Narrative Control User Stories

**US-STS-07**: As a user, I want to enable NTR features through the UI so that I don't have to remember complex command syntax. The system provides toggle switches in the settings or quick-access panel. Acceptance Criteria: Toggle changes ntr_enabled flag, interface updates to show NTR-specific elements, change persists across sessions.

**US-STS-08**: As a user, I want to toggle personified genitalia mode through the UI so that I can enhance breeding scenes. The system provides a clear toggle with confirmation for mature content activation. Acceptance Criteria: Toggle shows confirmation for mature content, enabling reveals entity message panels, disabling hides entity elements.

**US-STS-09**: As a user, I want to see what the AI is doing with state through command parsing so that I understand state changes. The system parses commands from AI responses and displays a log of executed commands. Acceptance Criteria: Commands detected from AI output within 1 second, command log shows what changed and from what value to what value, log accessible through debug or advanced view.

**US-STS-10**: As a user, I want to reset state to defaults through the UI so that I can start fresh without editing the Lorebook directly. The system provides a reset option in settings with confirmation. Acceptance Criteria: Reset option clears all mutable state, confirmation prevents accidental reset, reset includes option to preserve character definitions.

### 5.3 Technical User Stories

**US-STS-11**: As a user, I want the interface to load quickly so that I can start interacting without delay. The system optimizes initial load time through lazy loading and code splitting. Acceptance Criteria: Initial render appears within 2 seconds on standard connections, progressive loading reveals content as available, cached assets serve from local storage.

**US-STS-12**: As a user, I want my settings to persist so that I don't have to reconfigure each session. The system stores configuration in messageState and sync with external storage. Acceptance Criteria: Settings survive page refresh, settings sync across devices where supported, default values apply for new sessions.

**US-STS-13**: As a developer, I want to extend the Stage with new features so that I can customize the experience. The system implements a plugin architecture with clear extension points. Acceptance Criteria: Custom components can register with the Stage, lifecycle hooks support custom logic, documentation describes extension APIs.

---

## 6. Implementation Steps

### 6.1 Phase 1: Foundation Implementation

The first phase establishes the core infrastructure required to run the Stage and render basic UI:

**Step 1.1 - Project Setup**: Initialize the Stage project using the Chub Stage template. Install dependencies, configure TypeScript, and verify the empty shell compiles and runs. Set up linting rules and code formatting to maintain consistency. Configure the build system for multi-platform deployment.

```bash
git clone https://github.com/CharHubAI/stage-template
cd stage-template
yarn install
yarn dev
```

**Step 1.2 - State Manager Implementation**: Create the State Manager class that implements the Eros Status System 3.0 data model. Implement state validation, update methods, and persistence serialization. Create TypeScript interfaces for all data structures defined in the DATA-MODEL.md specification.

**Step 1.3 - Basic UI Components**: Implement the initial set of UI components including StatusPanel, CharacterCard, and SceneBanner. Style components according to the visual design specifications in UI-DESIGN.md. Connect components to State Manager for initial data binding.

**Step 1.4 - Stage Lifecycle Integration**: Implement the required Stage lifecycle methods (load, beforePrompt, afterResponse, render). Connect the lifecycle methods to the State Manager. Test state persistence across message boundaries.

**Phase 1 Deliverables**: Functional Stage that renders basic character status, responds to lifecycle events, and persists state. Target completion: Core UI renders within 4 weeks.

### 6.2 Phase 2: Advanced Features

The second phase adds advanced functionality that differentiates the Stage:

**Step 2.1 - Command Parser**: Implement the AI command detection system that parses Eros Status commands from AI responses. Create regex patterns for command formats (<GET>, <UPDATE>, <SET>, <INSERT>, <RESET>). Implement command execution against State Manager with validation and logging.

**Step 2.2 - Sex Module Display**: Build the sex status visualization that activates when sex_active is true. Show position, arousal, orgasm count, and cum indicators. Implement the NTR display when ntr_enabled is true. Add the personified genitalia entity message panel.

**Step 2.3 - Relationship Web**: Implement the relationship visualization component. Create the node-link diagram showing character connections. Add interactivity to reveal relationship details on click. Optimize rendering for performance with many characters.

**Step 2.4 - Location and Objects**: Implement the location display system showing current room, environmental description, and objects. Add object interaction capabilities. Implement room navigation and state changes.

**Phase 2 Deliverables**: Stage with full Eros Status feature support including command parsing, sex module display, and relationship visualization. Target completion: Advanced features functional within 8 weeks.

### 6.3 Phase 3: Polish and Optimization

The third phase focuses on user experience refinement and performance:

**Step 3.1 - Theme System**: Implement the theming system supporting Dark Mode, Light Mode, and Sepia Mode. Create theme configuration with CSS variables. Implement theme persistence and switching. Ensure accessibility across themes.

**Step 3.2 - Display Options**: Implement display density options (Compact, Normal, Expanded). Add progressive disclosure for detailed information. Implement responsive layouts for mobile, tablet, and desktop.

**Step 3.3 - Performance Optimization**: Profile and optimize rendering performance. Implement lazy loading for complex components. Add caching for frequently accessed data. Optimize state update cycles to minimize re-renders.

**Step 3.4 - User Preferences**: Implement the settings panel with all customization options. Add notification configuration. Implement history and timeline features. Polish animations and transitions.

**Phase 3 Deliverables**: Production-ready Stage with polished UI, responsive design, and optimized performance. Target completion: Release-ready within 12 weeks.

### 6.4 Phase 4: Extension and Ecosystem

The final phase enables extensibility and builds the contributor ecosystem:

**Step 4.1 - Plugin Architecture**: Define extension points for custom components. Create plugin interface specifications. Implement plugin loading and lifecycle management.

**Step 4.2 - Expression Pack System**: Implement expression pack loading and management. Create default expression sets. Define format for custom expression packs.

**Step 4.3 - Documentation and Examples**: Create developer documentation for extension points. Build example plugins demonstrating capabilities. Create user guides for customization.

**Phase 4 Deliverables**: Extensible Stage platform with community contribution support. Target completion: Ecosystem ready within 16 weeks.

---

## 7. File Structure

### 7.1 Project Directory Layout

The Eros Status Stage project follows a standard React/TypeScript project structure with additional organization for stage-specific components:

```
eros-status-stage/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions deployment
├── public/
│   ├── characters/                  # Character assets
│   │   └── susan.yaml              # Example character config
│   ├── chub_meta.yaml              # Stage metadata
│   └── scenario.yaml               # Default scenario configuration
├── src/
│   ├── assets/
│   │   ├── expressions/            # Expression images
│   │   ├── backgrounds/            # Scene backgrounds
│   │   └── icons/                  # UI icons
│   ├── components/
│   │   ├── common/                 # Shared components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── Toast.tsx
│   │   ├── status/                 # Status display components
│   │   │   ├── StatusPanel.tsx
│   │   │   ├── AffectionMeter.tsx
│   │   │   ├── ObedienceMeter.tsx
│   │   │   ├── LibidoMeter.tsx
│   │   │   └── MoodIndicator.tsx
│   │   ├── character/              # Character display components
│   │   │   ├── CharacterCard.tsx
│   │   │   ├── CharacterDetail.tsx
│   │   │   ├── ExpressionDisplay.tsx
│   │   │   └── RelationshipWeb.tsx
│   │   ├── scene/                  # Scene management components
│   │   │   ├── SceneBanner.tsx
│   │   │   ├── LocationDisplay.tsx
│   │   │   └── ObjectList.tsx
│   │   ├── sex/                    # Sex module components
│   │   │   ├── SexStatusPanel.tsx
│   │   │   ├── PositionIndicator.tsx
│   │   │   ├── OrgasmCounter.tsx
│   │   │   ├── PersonifiedGenitalia.tsx
│   │   │   └── NTRIndicator.tsx
│   │   └── settings/               # Settings components
│   │       ├── SettingsPanel.tsx
│   │       ├── ThemeSelector.tsx
│   │       └── DisplayDensityControl.tsx
│   ├── context/
│   │   ├── ThemeContext.tsx        # Theme state provider
│   │   ├── StageContext.tsx        # Stage data provider
│   │   └── SettingsContext.tsx     # User preferences provider
│   ├── hooks/
│   │   ├── useStateManager.ts      # State operations hook
│   │   ├── useCommandParser.ts     # AI command detection hook
│   │   ├── useCharacter.ts         # Character data hook
│   │   └── useScene.ts             # Scene data hook
│   ├── services/
│   │   ├── StateManager.ts         # State management class
│   │   ├── LorebookSync.ts         # Lorebook synchronization
│   │   ├── CommandParser.ts        # AI command parsing
│   │   └── EventBus.ts             # Internal event system
│   ├── types/
│   │   ├── index.ts                # Main type exports
│   │   ├── character.ts            # Character types
│   │   ├── state.ts                # State types
│   │   └── config.ts               # Configuration types
│   ├── utils/
│   │   ├── formatters.ts           # Data formatting utilities
│   │   ├── validators.ts          # Data validation utilities
│   │   └── constants.ts            # Constant definitions
│   ├── styles/
│   │   ├── themes/                 # Theme definitions
│   │   │   ├── dark.css
│   │   │   ├── light.css
│   │   │   └── sepia.css
│   │   ├── components/             # Component-specific styles
│   │   └── global.css              # Global style definitions
│   ├── App.tsx                     # Root component
│   ├── main.tsx                    # Entry point
│   ├── Stage.tsx                   # Stage implementation
│   └── TestRunner.tsx              # Development test runner
├── index.html                      # HTML entry point
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite bundler configuration
├── .eslintrc.cjs                   # ESLint configuration
└── README.md                       # Project documentation
```

### 7.2 Key File Responsibilities

Understanding the purpose of key files helps developers navigate the codebase:

**Stage.tsx**: The primary Stage class that extends StageBase. This file implements the required lifecycle methods and serves as the controller for the entire application. All state management flows through this class, and all UI rendering originates from its render() method.

**services/StateManager.ts**: The central data management class that implements the Eros Status System 3.0 data model. This class handles all state mutations, validations, and serialization. It provides methods for reading and updating all game state including character stats, relationships, clothing, body state, genitalia, and scene flags.

**services/CommandParser.ts**: The AI command detection and execution system. This service scans AI responses for Eros Status commands and executes them against the State Manager. It provides logging and debugging capabilities for understanding state changes.

**components/status/**: The collection of status display components that render character statistics. These components receive state from the Stage and render visual representations of the data. They implement the color coding and progress bar patterns described in the UI design specification.

**components/character/**: The character display components including the CharacterCard, CharacterDetail, and RelationshipWeb. These components handle the visual representation of characters and their relationships.

**components/sex/**: The sex module display components that render when sex_active is true. These include the SexStatusPanel, PersonifiedGenitalia, and NTRIndicator components.

### 7.3 Configuration Files

Several configuration files manage the project's build and deployment:

**package.json**: Defines the project dependencies including @chub-ai/stages-ts, React, TypeScript, and build tooling. Scripts define development (yarn dev), build (yarn build), and deployment commands.

**tsconfig.json**: Configures TypeScript compiler options including module resolution, strict type checking, and JSX support. The configuration ensures type safety across the codebase.

**vite.config.ts**: Configures the Vite bundler for development and production builds. Sets up hot module replacement for development and code splitting for production.

**.eslintrc.cjs**: Configures ESLint rules for code quality and consistency. Ensures consistent formatting and catches common errors before runtime.

### 7.4 Asset Organization

The project organizes assets by type and purpose:

**public/characters/**: Contains character configuration files in YAML format. Each character file defines the character's appearance, personality, relationships, and initial state. These files are loaded at runtime to configure the scenario.

**src/assets/expressions/**: Contains expression images for character emotional states. Files are organized by character and state type (happy, sad, aroused, etc.). The naming convention follows character_state.format (nagisa_happy.png).

**src/assets/backgrounds/**: Contains background images for different locations. Files are organized by location identifier (bedroom.png, kitchen.png).

**src/styles/themes/**: Contains CSS theme definitions. Each theme file defines CSS custom properties for colors, spacing, and typography. The theme system enables runtime theme switching without component changes.

---

## Appendix A: Data Model Reference

### A.1 Root Structure

The complete data model follows the Eros Status System 3.0 specification:

```typescript
interface StageState {
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
}
```

### A.2 Key State Properties

| Property | Type | Description |
|----------|------|-------------|
| system.date | string | Current narrative day |
| system.time | string | Current narrative time |
| character.name | string | Character display name |
| progressions.affection.value | number | 0-100 affection level |
| progressions.obedience.value | number | 0-100 obedience level |
| progressions.libido.value | number | 0-100 libido level |
| sexStatus.active | boolean | Whether sex scene is active |
| ntrModule.enabled | boolean | Whether NTR features are enabled |
| personifiedGenitalia.enabled | boolean | Whether genitalia are personified |

---

## Appendix B: Command Reference

### B.1 Available Commands

| Command | Format | Description |
|---------|--------|-------------|
| GET | `<GET status>` | Retrieve full status |
| GET | `<GET status:condensed>` | Retrieve minimal status |
| UPDATE | `<UPDATE field:value>` | Update single value |
| SET | `<SET module:value>` | Enable/disable module |
| INSERT | `<INSERT npc:name:importance:main>` | Add new NPC |
| RESET | `<RESET>` | Reset all values |

### B.2 Command Processing Flow

1. AI generates response containing commands
2. afterResponse() hook receives response
3. CommandParser scans for command patterns
4. Commands parsed into action objects
5. StateManager validates and executes actions
6. UI updates to reflect new state
7. System messages injected for user awareness

---

## Appendix C: Theme Definitions

### C.1 CSS Custom Properties

Each theme defines the following custom properties:

```css
:root {
  /* Colors */
  --color-primary: #ff4757;
  --color-secondary: #2ed573;
  --color-accent: #ffa502;
  --color-background: #1e272e;
  --color-surface: #2f3640;
  --color-text: #f1f2f6;
  --color-text-muted: #808e9b;
  
  /* Status Colors */
  --color-affection: #ff6b81;
  --color-obedience: #7bed9f;
  --color-libido: #ffa502;
  --color-arousal: #ff4757;
  --color-location: #00d2d3;
  --color-time: #feca57;
  --color-warning: #ff0000;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Typography */
  --font-family: 'Segoe UI', system-ui, sans-serif;
  --font-size-sm: 12px;
  --font-size-md: 14px;
  --font-size-lg: 18px;
  --font-size-xl: 24px;
}
```

---

**Document Version:** 1.0  
**Last Updated:** May 2026  
**Author:** Eros Status Stage Development Team