import { ReactElement } from 'react';
import { StageBase, StageResponse, InitialData, Message, Character } from '@chub-ai/stages-ts';
import { LoadResponse } from '@chub-ai/stages-ts/dist/types/load';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

// Import Eros Status types
import type {
    MessageStateType as ErosStatusState,
    ProgressionValues,
    SystemData,
    LocationData,
    SexModuleState,
    NTRModuleState,
    SettingsState,
    PanelState,
} from './types/eros-status';

// Import enums as regular imports (for value usage)
import { SexSceneType, ThemeMode, ProgressBarStyle, DisplayDensity, NTRType } from './types/eros-status';

// Import ErosStatusApp component
import { ErosStatusApp } from './components/layout/ErosStatusApp';

// Import helper functions
import { isValidProgressionValue } from './types/eros-status';
import { isSexModuleActive as checkSexModuleActive, isNTREnabled as checkNTREnabled } from './types/eros-status';

// Config type - user settings for the stage
export type ConfigType = {
    progressBarStyle?: 'emoji' | 'text' | 'percentage' | 'bar';
    theme?: 'dark' | 'light' | 'sepia';
    showProgression?: boolean;
    showClothing?: boolean;
    showBody?: boolean;
    enableSexModule?: boolean;
    enableNTRModule?: boolean;
};

// Init state - persistent chat-level state
export type InitStateType = {
    characterId?: string;
    characterName?: string;
};

// Chat state - branch-level state
export type ChatStateType = null;

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

import {
    createDefaultState,
    createInitialState,
    validateStateIntegrity,
    sanitizeStateUpdate,
    serializeState,
    deserializeState,
    incrementProgression,
    validateProgressValue,
    getStatStage,
} from './core/state';

import {
    generateStageDirections,
    extractErosStatusCommands,
} from './systems/integration/stageHooks';

import {
    sanitizeInput,
} from './systems/validation/sanitizer';

import {
    renderProgressBar,
    renderEmojiHearts,
    renderEmojiFlames,
    formatPercentage,
    formatTime,
    formatDate,
    formatStatQuick,
    formatQuickStat,
    formatLocation,
    formatBodyState,
    STAT_COLORS,
} from './utils/formatters';

/**
 * Eros Status Stage Class
 * Implements the Chub Stage interface for the Eros Status system
 */
export class Stage extends StageBase<InitStateType, ChatStateType, ErosStatusState, ConfigType> {

    // Internal state for tracking Eros Status
    private erosState: ErosStatusState;

    // Current character data
    private currentCharacter: Character | null = null;

    // Config settings
    private stageConfig: ConfigType | null = null;

    /**
     * Default Eros Status state values per Eros Status System 3.0
     */
    private static readonly DEFAULT_PROGRESSION: ProgressionValues = {
        affection: 30,
        obedience: 30,
        libido: 20,
        arousal: 0,
        trust: 30,
        corruption: 0,
        submission: 50,
        jealousy: 0,
        embarrassment: 50,
        fatigue: 0,
        happiness: 50,
    };

    private static readonly DEFAULT_SYSTEM: SystemData = {
        day: 1,
        time: 'Morning',
        weather: 'Sunny',
        timeOfDay: 'morning',
    };

    private static readonly DEFAULT_LOCATION: LocationData = {
        currentRoom: 'home',
        building: 'Player Home',
        visitedRooms: ['home'],
        description: 'Your home',
        objectsInRoom: [],
    };

    // Initialize with default state
    constructor(data: InitialData<InitStateType, ChatStateType, ErosStatusState, ConfigType>) {
        super(data);

        const {
            characters,
            config,
            messageState,
            initState,
        } = data;

        // Store config for later use
        this.stageConfig = config || null;

        // Get the first character from the characters list
        const charList = Object.values(characters);
        this.currentCharacter = charList.length > 0 ? charList[0] : null;

        // Get character name for state
        const charName = this.currentCharacter?.name || 'Character';

        // Initialize state - either from persisted or create new
        if (messageState && this.validateState(messageState)) {
            this.erosState = messageState;
        } else if (initState && initState.characterId && initState.characterName) {
            // Create from init state (new chat)
            this.erosState = this.createInitialState(
                initState.characterName!,
                initState.characterId!
            );
        } else {
            // Create default state with character name
            this.erosState = this.createDefaultState();
            this.erosState.character.name = charName;
        }

        // Apply config settings
        if (config) {
            // Theme is applied via CSS - handled in render
            console.log('[ErosStatus] Config loaded:', config);
        }

        console.log('[ErosStatus] Stage initialized with state:', this.erosState.turnCount);
    }

    // ============================================================================
    // STATE INITIALIZATION METHODS
    // ============================================================================

    /**
     * Creates the default Eros Status state with System 3.0 defaults
     */
    private createDefaultState(): ErosStatusState {
        return {
            version: '1.0',
            progressions: { ...Stage.DEFAULT_PROGRESSION },
            system: { ...Stage.DEFAULT_SYSTEM },
            location: { ...Stage.DEFAULT_LOCATION },
            clothing: {
                upperBody: 'shirt',
                lowerBody: 'pants',
                underwear: 'underwear',
                accessories: 'none',
                makeup: 'none',
                upperBodyState: 'worn',
                lowerBodyState: 'worn',
                underwearState: 'worn',
            },
            body: {
                expression: 'neutral',
                posture: 'standing',
                skin: 'healthy',
                bodyParts: 'normal',
                exposureLevel: 'covered',
                wetness: 0,
                isTrembling: false,
            },
            sexModule: {
                active: false,
                sceneType: SexSceneType.QUIET,
                position: 'none',
                pace: 'none',
                arousal: 0,
                orgasmCount: 0,
            },
            ntrModule: {
                enabled: false,
                type: NTRType.NONE,
                partner: '',
                humiliationLevel: 0,
            },
            inventory: {
                items: [],
                maxSlots: 20,
            },
            character: {
                id: '',
                name: 'Character',
                role: 'companion',
                avatarUrl: '',
                quickStat: '',
                isInScene: false,
            },
            expressionPose: {
                currentExpression: 'neutral',
                poseDescription: 'standing',
                aiPrompt: '',
                tags: [],
            },
            importantMoments: [],
            npcs: [],
            relationships: [],
            aiInstructions: [],
            commandHistory: [],
            turnCount: 0,
            settings: {
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
            },
            panel: {
                isOpen: false,
                activePanel: 'overview',
                panelWidth: 70,
                summaryWidth: 100,
                animationDuration: 250,
                isAnimating: false,
            },
        };
    }

    /**
     * Creates initial state from character card data
     */
    private createInitialState(characterName: string, characterId: string, avatarUrl?: string): ErosStatusState {
        const state = this.createDefaultState();
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
     * Validates state integrity
     */
    private validateState(state: unknown): state is ErosStatusState {
        if (!state || typeof state !== 'object') return false;

        const s = state as Record<string, unknown>;

        // Check required top-level properties
        const required = ['progressions', 'system', 'location', 'clothing', 'body', 'sexModule', 'ntrModule', 'character'];
        for (const key of required) {
            if (!(key in s)) return false;
        }

        // Validate progressions values
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

    // ============================================================================
    // STATE HELPER METHODS
    // ============================================================================

    /**
     * Get a specific progression value
     */
    public getProgressionValue(key: keyof ProgressionValues): number {
        return this.erosState.progressions[key] ?? 0;
    }

    /**
     * Update a progression value with validation (0-100)
     */
    public updateProgressionValue(key: keyof ProgressionValues, value: number): void {
        const validatedValue = isValidProgressionValue(value) ? value : Math.max(0, Math.min(100, Math.round(value)));
        this.erosState.progressions[key] = validatedValue;
    }

    /**
     * Get system data (day, time, weather)
     */
    public getSystemData(): SystemData {
        return {
            day: this.erosState.system.day,
            time: this.erosState.system.time,
            weather: this.erosState.system.weather,
            timeOfDay: this.erosState.system.timeOfDay,
        };
    }

    /**
     * Get current location
     */
    public getLocation(): LocationData {
        return {
            currentRoom: this.erosState.location.currentRoom,
            building: this.erosState.location.building,
            visitedRooms: [...this.erosState.location.visitedRooms],
            description: this.erosState.location.description,
            objectsInRoom: this.erosState.location.objectsInRoom ? [...this.erosState.location.objectsInRoom] : [],
        };
    }

    /**
     * Check if sex module is active
     */
    public isSexModuleActive(): boolean {
        return checkSexModuleActive(this.erosState.sexModule);
    }

    /**
     * Check if NTR is enabled
     */
    public isNTREnabled(): boolean {
        return checkNTREnabled(this.erosState.ntrModule);
    }

    /**
     * Get current state (for messageState persistence)
     */
    public getState(): ErosStatusState {
        return this.erosState;
    }

    /**
     * Update state from external source
     */
    public updateErosState(newState: ErosStatusState): void {
        if (this.validateState(newState)) {
            this.erosState = newState;
        }
    }

    /**
     * Increment a progression value by delta
     */
    public incrementProgression(key: keyof ProgressionValues, delta: number): void {
        const currentValue = this.erosState.progressions[key];
        const newValue = Math.max(0, Math.min(100, currentValue + delta));
        this.erosState.progressions[key] = newValue;
    }

    // ============================================================================
    // INVENTORY MANAGEMENT METHODS
    // ============================================================================

    /**
     * Get current inventory state
     */
    public getInventory(): typeof this.erosState.inventory {
        return this.erosState.inventory;
    }

    /**
     * Add an item to inventory
     */
    public addInventoryItem(item: {
        name: string;
        description?: string;
        category: string;
        quantity: number;
        equipped?: boolean;
        flags?: Record<string, boolean>;
    }): boolean {
        const existingItem = this.erosState.inventory.items.find(
            i => i.name.toLowerCase() === item.name.toLowerCase()
        );

        if (existingItem) {
            // Update quantity of existing item
            this.erosState.inventory.items = this.erosState.inventory.items.map(i =>
                i.name.toLowerCase() === item.name.toLowerCase()
                    ? { ...i, quantity: i.quantity + item.quantity }
                    : i
            );
        } else {
            // Check if inventory is full
            if (this.erosState.inventory.items.length >= this.erosState.inventory.maxSlots) {
                console.warn('[Stage] Inventory is full, cannot add item:', item.name);
                return false;
            }

            // Add new item
            this.erosState.inventory.items = [
                ...this.erosState.inventory.items,
                {
                    id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                    ...item,
                },
            ];
        }
        return true;
    }

    /**
     * Remove an item from inventory
     */
    public removeInventoryItem(itemName: string): boolean {
        const itemIndex = this.erosState.inventory.items.findIndex(
            i => i.name.toLowerCase() === itemName.toLowerCase()
        );

        if (itemIndex === -1) {
            console.warn('[Stage] Item not found:', itemName);
            return false;
        }

        const item = this.erosState.inventory.items[itemIndex];
        
        if (item.quantity > 1) {
            // Decrease quantity instead of removing
            this.erosState.inventory.items = this.erosState.inventory.items.map((i, idx) =>
                idx === itemIndex ? { ...i, quantity: i.quantity - 1 } : i
            );
        } else {
            // Remove completely
            this.erosState.inventory.items = this.erosState.inventory.items.filter(
                (_, idx) => idx !== itemIndex
            );
        }

        return true;
    }

    /**
     * Update item quantity in inventory
     */
    public updateInventoryItemQuantity(itemName: string, quantity: number): boolean {
        const item = this.erosState.inventory.items.find(
            i => i.name.toLowerCase() === itemName.toLowerCase()
        );

        if (!item) {
            console.warn('[Stage] Item not found:', itemName);
            return false;
        }

        if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            this.erosState.inventory.items = this.erosState.inventory.items.filter(
                i => i.name.toLowerCase() !== itemName.toLowerCase()
            );
        } else {
            // Update quantity
            this.erosState.inventory.items = this.erosState.inventory.items.map(i =>
                i.name.toLowerCase() === itemName.toLowerCase()
                    ? { ...i, quantity }
                    : i
            );
        }

        return true;
    }

    /**
     * Get item by name
     */
    public getInventoryItem(itemName: string): typeof this.erosState.inventory.items[0] | undefined {
        return this.erosState.inventory.items.find(
            i => i.name.toLowerCase() === itemName.toLowerCase()
        );
    }

    /**
     * Get items by category
     */
    public getInventoryItemsByCategory(category: string): typeof this.erosState.inventory.items {
        return this.erosState.inventory.items.filter(
            i => i.category.toLowerCase() === category.toLowerCase()
        );
    }

    /**
     * Toggle item equipped status
     */
    public toggleInventoryItemEquipped(itemName: string): boolean {
        const item = this.erosState.inventory.items.find(
            i => i.name.toLowerCase() === itemName.toLowerCase()
        );

        if (!item) {
            console.warn('[Stage] Item not found:', itemName);
            return false;
        }

        this.erosState.inventory.items = this.erosState.inventory.items.map(i =>
            i.name.toLowerCase() === itemName.toLowerCase()
                ? { ...i, equipped: !i.equipped }
                : i
        );

        return true;
    }

    /**
     * Check if inventory is full
     */
    public isInventoryFull(): boolean {
        return this.erosState.inventory.items.length >= this.erosState.inventory.maxSlots;
    }

    /**
     * Get available inventory slots
     */
    public getAvailableInventorySlots(): number {
        return Math.max(0, this.erosState.inventory.maxSlots - this.erosState.inventory.items.length);
    }

    /**
     * Called immediately after constructor for async initialization
     */
    async load(): Promise<Partial<LoadResponse<InitStateType, ChatStateType, ErosStatusState>>> {
        console.log('[ErosStatus] Load called');

        // Update character info if available
        if (this.currentCharacter) {
            this.erosState = {
                ...this.erosState,
                character: {
                    ...this.erosState.character,
                    name: this.currentCharacter.name || this.erosState.character.name,
                },
            };
        }

        return {
            success: true,
            error: null,
            initState: {
                characterId: this.erosState.character.id,
                characterName: this.erosState.character.name,
            },
            chatState: null,
        };
    }

    /**
     * Called when state is set (swipe/jump operations)
     */
    async setState(state: ErosStatusState): Promise<void> {
        if (state && this.validateState(state)) {
            this.erosState = state;
            console.log('[ErosStatus] State set to turn:', this.erosState.turnCount);
        }
    }

    /**
     * Called after user sends a message but before LLM receives it
     */
    async beforePrompt(userMessage: Message): Promise<Partial<StageResponse<ChatStateType, ErosStatusState>>> {
        // Generate stage directions based on current state for LLM context
        const directions = generateStageDirections(this.erosState);

        return {
            stageDirections: directions,
            messageState: this.erosState,
            modifiedMessage: null,
            systemMessage: null,
            error: null,
            chatState: null,
        };
    }

    /**
     * Called immediately after LLM response
     */
    async afterResponse(botMessage: Message): Promise<Partial<StageResponse<ChatStateType, ErosStatusState>>> {
        // Parse AI response for Eros Status commands
        const commands = extractErosStatusCommands(botMessage.content);

        // Process commands to generate state updates
        const updates = this.processErosCommands(commands);

        // Apply updates to state
        this.erosState = {
            ...this.erosState,
            ...updates,
            turnCount: this.erosState.turnCount + 1,
        };

        // Store AI instructions if any commands were found
        if (commands.length > 0) {
            this.erosState = {
                ...this.erosState,
                aiInstructions: [
                    ...this.erosState.aiInstructions,
                    ...commands.map(c => `<${c.type} ${c.target} ${c.value}>`),
                ].slice(-50), // Keep last 50
            };
        }

        console.log('[ErosStatus] After response - turn:', this.erosState.turnCount);

        return {
            stageDirections: null,
            messageState: this.erosState,
            modifiedMessage: null,
            systemMessage: null,
            error: null,
            chatState: null,
        };
    }

    /**
     * Process Eros Status commands from AI response
     */
    private processErosCommands(commands: Array<{ type: string; target: string; value: unknown }>): Partial<ErosStatusState> {
        const stateUpdates: Record<string, unknown> = {};

        for (const cmd of commands) {
            const target = cmd.target.toLowerCase();
            const value = cmd.value;

            // Handle different command types
            switch (cmd.type.toUpperCase()) {
                case 'SET':
                    if (typeof value === 'number') {
                        // Direct set
                        if (!stateUpdates.progressions) {
                            stateUpdates.progressions = {};
                        }
                        (stateUpdates.progressions as Record<string, number>)[target] = validateProgressValue(value);
                    }
                    break;

                case 'UPDATE':
                    if (typeof value === 'number') {
                        // Relative update
                        const currentValue = this.erosState.progressions[target as keyof typeof this.erosState.progressions] || 0;
                        const delta = typeof value === 'number' ? value : 0;
                        if (!stateUpdates.progressions) {
                            stateUpdates.progressions = {};
                        }
                        (stateUpdates.progressions as Record<string, number>)[target] = validateProgressValue(currentValue + delta);
                    }
                    break;

                case 'GET':
                    // GET commands don't modify state - they're queries
                    break;
            }
        }

        return sanitizeStateUpdate(stateUpdates as Partial<ErosStatusState>);
    }

    /**
     * Render the Eros Status panel UI
     */
    render(): ReactElement {
        return (
            <ErosStatusApp
                state={this.erosState}
                initialPanelOpen={true}
                onStateChange={(newState) => {
                    // Handle state updates from UI
                    if (newState) {
                        this.erosState = {
                            ...this.erosState,
                            ...newState,
                        };
                    }
                }}
                onPanelClose={() => {
                    console.log('[ErosStatus] Panel closed');
                }}
            />
        );
    }
}

