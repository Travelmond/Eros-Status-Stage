/**
 * Stage Lifecycle Hooks & Event Handlers
 * Handles integration with Chub Stage lifecycle methods
 */

import type { Message, Character, User } from '@chub-ai/stages-ts';
import type { MessageStateType, ErosCommand, ProgressionValues } from '../../types/eros-status';
import { createInitialState, sanitizeStateUpdate, incrementProgression } from '../../core/state';
import { SexSceneType, NTRType, ThemeMode, ProgressBarStyle, DisplayDensity, MomentType } from '../../types/eros-status';

/**
 * Stage lifecycle hooks interface
 */
export interface StageHooks {
    /**
     * Called when stage is initialized
     */
    onLoad(characters: Record<string, Character>): Promise<void>;

    /**
     * Called before LLM prompt is sent
     */
    onBeforePrompt(userMessage: Message): Promise<Partial<MessageStateType>>;

    /**
     * Called after LLM response is received
     */
    onAfterResponse(botMessage: Message, currentState: MessageStateType): Promise<Partial<MessageStateType>>;

    /**
     * Called when state is set (swipe/jump)
     */
    onStateSet(newState: MessageStateType): void;
}

/**
 * Creates the stage hooks implementation
 */
export function createStageHooks(): StageHooks {
    return {
        onLoad: async (characters: Record<string, Character>): Promise<void> => {
            // Initialize any character-specific data
            console.log('[ErosStatus] Stage loaded with characters:', Object.keys(characters));
        },

        onBeforePrompt: async (userMessage: Message): Promise<Partial<MessageStateType>> => {
            // Add any pre-prompt instructions based on current state
            // This is where you'd inject stage directions for the LLM
            return {};
        },

        onAfterResponse: async (
            botMessage: Message,
            currentState: MessageStateType
        ): Promise<Partial<MessageStateType>> => {
            // Parse AI response for Eros commands and update state
            const commands = extractErosStatusCommands(botMessage.content);
            const updates = processErosCommands(commands, currentState);

            // Increment turn count
            const turnUpdates = {
                ...updates,
                turnCount: currentState.turnCount + 1,
            };

            return turnUpdates;
        },

        onStateSet: (newState: MessageStateType): void => {
            // Handle state restoration on swipe/jump
            console.log('[ErosStatus] State set to:', newState.turnCount);
        },
    };
}

/**
 * Maps SillyTavern event patterns to Stage lifecycle
 * This allows the Eros Status system to respond to game events
 */
export function mapSillyTavernEventsToStageLifecycle(
    eventType: string,
    eventData: Record<string, unknown>
): Partial<MessageStateType> {
    // Default progression values
    const defaultProgression: ProgressionValues = {
        affection: 0,
        obedience: 0,
        libido: 0,
        arousal: 0,
        trust: 0,
        corruption: 0,
        submission: 0,
        jealousy: 0,
        embarrassment: 0,
        fatigue: 0,
        happiness: 50,
    };

    // Map common events to state updates
    switch (eventType) {
        case 'kiss':
            return {
                progressions: { ...defaultProgression, affection: 5, arousal: 2, embarrassment: 3 },
            };

        case 'hug':
            return {
                progressions: { ...defaultProgression, affection: 3, trust: 2 },
            };

        case 'touch':
            return {
                progressions: { ...defaultProgression, arousal: 5, embarrassment: 2 },
            };

        case 'command_obedied':
            return {
                progressions: { ...defaultProgression, obedience: 2, trust: 1 },
            };

        case 'command_refused':
            return {
                progressions: { ...defaultProgression, obedience: -3, trust: -1 },
            };

        case 'insult':
            return {
                progressions: { ...defaultProgression, affection: -2, trust: -1, jealousy: 1 },
            };

        case 'compliment':
            return {
                progressions: { ...defaultProgression, affection: 2, embarrassment: 1 },
            };

        case 'date':
            return {
                progressions: { ...defaultProgression, affection: 5, trust: 3 },
            };

        case 'gift':
            return {
                progressions: { ...defaultProgression, affection: 4, trust: 2 },
            };

        default:
            return {};
    }
}

/**
 * Handles message parsing for Eros Status data
 */
export function handleMessageParsing(
    message: Message,
    currentState: MessageStateType
): Partial<MessageStateType> {
    // Default progression values
    const defaultProgression: ProgressionValues = {
        affection: 0,
        obedience: 0,
        libido: 0,
        arousal: 0,
        trust: 0,
        corruption: 0,
        submission: 0,
        jealousy: 0,
        embarrassment: 0,
        fatigue: 0,
        happiness: 50,
    };

    const updates: Partial<MessageStateType> = {};
    const content = message.content.toLowerCase();

    // Simple keyword detection for basic state changes
    // In production, this would be more sophisticated

    // Affection indicators
    if (content.includes('love') || content.includes('love you')) {
        updates.progressions = { ...defaultProgression, affection: 3 };
    }

    // Trust indicators
    if (content.includes('trust') || content.includes('believe')) {
        const trustUpdate = incrementProgression(currentState, 'trust', 2);
        updates.progressions = { ...defaultProgression, trust: trustUpdate.progressions.trust };
    }

    return updates;
}

/**
 * Extracts Eros Status commands from AI response
 * Parses tags like <GET status>, <UPDATE affection +5>, <SET arousal 80>
 */
export function extractErosStatusCommands(aiResponse: string): ErosCommand[] {
    const commands: ErosCommand[] = [];

    // Regex patterns for different command types
    const patterns = [
        // <GET affection>
        /<GET\s+(\w+)>/gi,
        // <UPDATE affection +5> or <UPDATE affection -3>
        /<UPDATE\s+(\w+)\s+([+-]?\d+)>/gi,
        // <SET arousal 80>
        /<SET\s+(\w+)\s+(\d+)>/gi,
    ];

    // Process GET commands
    let match: RegExpExecArray | null;
    while ((match = patterns[0].exec(aiResponse)) !== null) {
        commands.push({
            type: 'GET',
            target: match[1].toLowerCase(),
            value: 0, // Use 0 as placeholder for GET (query only)
            rawCommand: match[0],
            isValid: true,
        });
    }

    // Process UPDATE commands
    patterns[1].lastIndex = 0;
    while ((match = patterns[1].exec(aiResponse)) !== null) {
        commands.push({
            type: 'UPDATE',
            target: match[1].toLowerCase(),
            value: parseInt(match[2], 10),
            rawCommand: match[0],
            isValid: true,
        });
    }

    // Process SET commands
    patterns[2].lastIndex = 0;
    while ((match = patterns[2].exec(aiResponse)) !== null) {
        commands.push({
            type: 'SET',
            target: match[1].toLowerCase(),
            value: parseInt(match[2], 10),
            rawCommand: match[0],
            isValid: true,
        });
    }

    return commands;
}

/**
 * Processes Eros commands and generates state updates
 */
function processErosCommands(
    commands: ErosCommand[],
    currentState: MessageStateType
): Partial<MessageStateType> {
    const stateUpdates: Record<string, unknown> = {};

    for (const cmd of commands) {
        const target = cmd.target;

        switch (cmd.type) {
            case 'SET':
                if (typeof cmd.value === 'number') {
                    // Direct set
                    if (!stateUpdates.progressions) {
                        stateUpdates.progressions = {};
                    }
                    (stateUpdates.progressions as Record<string, number>)[target] = cmd.value;
                }
                break;

            case 'UPDATE':
                if (typeof cmd.value === 'number') {
                    // Relative update - apply delta
                    const currentValue = currentState.progressions[target as keyof typeof currentState.progressions] ?? 0;
                    const newValue = Math.max(0, Math.min(100, currentValue + cmd.value));
                    if (!stateUpdates.progressions) {
                        stateUpdates.progressions = {};
                    }
                    (stateUpdates.progressions as Record<string, number>)[target] = newValue;
                }
                break;

            case 'GET':
                // GET commands don't modify state - they're queries
                // The response would be added to stageDirections instead
                break;
        }
    }

    return sanitizeStateUpdate(stateUpdates);
}

/**
 * Generates stage directions for the LLM based on current state
 * This is injected into the prompt to inform the AI about status
 */
export function generateStageDirections(state: MessageStateType): string {
    const parts: string[] = [];

    // Core stats summary
    const p = state.progressions;
    parts.push(`[Status: Affection ${p.affection}, Trust ${p.trust}, Arousal ${p.arousal}]`);

    // Scene context
    if (state.sexModule.active) {
        parts.push(`[Scene: ${state.sexModule.sceneType}, Arousal ${state.sexModule.arousal}]`);
    }

    // Location context
    parts.push(`[Location: ${state.location.currentRoom}]`);

    return parts.join(' ');
}

/**
 * Updates system time based on game progression
 */
export function advanceTime(
    currentState: MessageStateType,
    hours: number = 1
): MessageStateType {
    const [hoursStr, minutesStr] = currentState.system.time.split(':');
    let hour = parseInt(hoursStr, 10);
    let minute = parseInt(minutesStr, 10);

    hour = (hour + hours) % 24;

    const newTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

    // Advance day if crossing midnight
    let newDay = currentState.system.day;
    if (hour < parseInt(hoursStr, 10)) {
        newDay += 1;
    }

    return {
        ...currentState,
        system: {
            ...currentState.system,
            day: newDay,
            time: newTime,
        },
    };
}

/**
 * Moves character to a new location
 */
export function moveToLocation(
    currentState: MessageStateType,
    roomId: string,
    building?: string
): MessageStateType {
    const visited = currentState.location.visitedRooms.includes(roomId)
        ? currentState.location.visitedRooms
        : [...currentState.location.visitedRooms, roomId];

    return {
        ...currentState,
        location: {
            currentRoom: roomId,
            building: building || currentState.location.building,
            visitedRooms: visited,
        },
    };
}

/**
 * Records an important moment
 */
export function recordMoment(
    currentState: MessageStateType,
    type: MomentType,
    title: string,
    description: string
): MessageStateType {
    const moment = {
        id: `moment_${Date.now()}`,
        type,
        title,
        description,
        turn: currentState.turnCount,
    };

    return {
        ...currentState,
        importantMoments: [...currentState.importantMoments, moment],
    };
}

/**
 * Updates character expression/pose
 */
export function updateExpression(
    currentState: MessageStateType,
    expression: string,
    pose?: string,
    aiPrompt?: string
): MessageStateType {
    return {
        ...currentState,
        expressionPose: {
            ...currentState.expressionPose,
            currentExpression: expression,
            poseDescription: pose || currentState.expressionPose.poseDescription,
            aiPrompt: aiPrompt || currentState.expressionPose.aiPrompt,
        },
    };
}