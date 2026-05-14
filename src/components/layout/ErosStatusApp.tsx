/**
 * Eros Status - ErosStatusApp Component
 * Main container component for the Eros Status Stage UI
 * Phase 1 - Core UI Components + Phase 2.3 Summary Terminal
 * Phase 3 - Full component integration with sub-tab navigation
 *
 * Wires all existing components into the main app:
 * - CharacterTab (NPC roster)
 * - ExpressionPoseSection (expression/pose & AI image gen)
 * - GenitaliaDisplay (genitalia/reproduction data)
 * - NTRDisplay (NTR module data)
 * - ImportantMomentsTimeline (story moments)
 */

import { ReactElement, useState, useCallback, useMemo } from 'react';
import {
    MessageStateType,
    ProgressionValues,
    SystemData,
    LocationData,
    SexModuleState,
    CategoryGroup,
} from '../../types/eros-status';
import { StatusPanel } from '../status/StatusPanel';
import { SlideOutPanel } from '../common/SlideOutPanel';
import { SummaryTerminal } from '../terminal/SummaryTerminal';
import { LiveTerminal } from '../terminal/LiveTerminal';
import { CharacterTab } from '../character/CharacterTab';
import { ExpressionPoseSection } from '../expression/ExpressionPoseSection';
import { GenitaliaDisplay } from '../detail/GenitaliaDisplay';
import { NTRDisplay } from '../detail/NTRDisplay';
import { ImportantMomentsTimeline } from '../detail/ImportantMomentsTimeline';
import type { Tag } from '../expression/TagBreakdownModal';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ErosStatusAppProps {
    /** Full eros status state */
    state: MessageStateType;
    /** Callback for state updates */
    onStateChange?: (newState: Partial<MessageStateType>) => void;
    /** Callback for panel close */
    onPanelClose?: () => void;
    /** Initial panel state */
    initialPanelOpen?: boolean;
    /** Active category group */
    activeCategory?: CategoryGroup;
    /** On category change */
    onCategoryChange?: (category: CategoryGroup) => void;
    /** Additional CSS class names */
    className?: string;
}

/** Scene sub-tab identifiers */
type SceneSubTab = 'scene' | 'genitalia' | 'ntr';

/** Extras sub-tab identifiers */
type ExtrasSubTab = 'inventory' | 'expressions' | 'moments' | 'characters';

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Category tab definitions — main navigation
 */
const CATEGORY_TABS: Array<{
    id: CategoryGroup;
    label: string;
    icon: string;
}> = [
    { id: CategoryGroup.PROGRESSION, label: 'Progression', icon: '📊' },
    { id: CategoryGroup.BODY_CLOTHING, label: 'Body', icon: '👤' },
    { id: CategoryGroup.SCENE, label: 'Scene', icon: '🎬' },
    { id: CategoryGroup.EXTRAS, label: 'Extras', icon: '✨' },
];

/**
 * Scene sub-tab definitions
 * Appears when SCENE category is active
 */
const SCENE_SUB_TABS: Array<{
    id: SceneSubTab;
    label: string;
    icon: string;
}> = [
    { id: 'scene', label: 'Scene', icon: '🎬' },
    { id: 'genitalia', label: 'Genitalia', icon: '🔞' },
    { id: 'ntr', label: 'NTR', icon: '💔' },
];

/**
 * Extras sub-tab definitions
 * Appears when EXTRAS category is active
 */
const EXTRAS_SUB_TABS: Array<{
    id: ExtrasSubTab;
    label: string;
    icon: string;
}> = [
    { id: 'inventory', label: 'Inventory', icon: '🎒' },
    { id: 'expressions', label: 'Expressions', icon: '😊' },
    { id: 'moments', label: 'Moments', icon: '📸' },
    { id: 'characters', label: 'Characters', icon: '👥' },
];

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Get quick stat summary for summary panel
 */
function getQuickStatSummary(progressions: ProgressionValues): string {
    const hearts = '❤️'.repeat(Math.round(progressions.affection / 20));
    const flames = '🔥'.repeat(Math.round(progressions.libido / 20));
    return `${hearts} ${flames}`;
}

/**
 * Format system info for summary
 */
function formatSystemSummary(system: SystemData): string {
    return `Day ${system.day} - ${system.time}`;
}

/**
 * Format location for summary
 */
function formatLocationSummary(location: LocationData): string {
    return location.building || location.currentRoom;
}

// ============================================================================
// EROS STATUS APP COMPONENT
// ============================================================================

/**
 * ErosStatusApp Component
 * Main application container that renders the Eros Status UI
 * with full sub-tab navigation and all components wired.
 */
export function ErosStatusApp({
    state,
    onStateChange,
    onPanelClose,
    initialPanelOpen = false,
    activeCategory = CategoryGroup.PROGRESSION,
    onCategoryChange,
    className = '',
}: ErosStatusAppProps): ReactElement {
    // Main panel open/close state
    const [panelOpen, setPanelOpen] = useState(initialPanelOpen);
    
    // Active top-level category
    const [currentCategory, setCurrentCategory] = useState<CategoryGroup>(activeCategory);
    
    // Sub-tab state for SCENE group
    const [activeSceneSubTab, setActiveSceneSubTab] = useState<SceneSubTab>('scene');
    
    // Sub-tab state for EXTRAS group
    const [activeExtrasSubTab, setActiveExtrasSubTab] = useState<ExtrasSubTab>('inventory');

    // ============================================================================
    // HANDLERS
    // ============================================================================

    const handlePanelToggle = useCallback(() => {
        setPanelOpen((prev) => !prev);
    }, []);

    const handlePanelClose = useCallback(() => {
        setPanelOpen(false);
        if (onPanelClose) {
            onPanelClose();
        }
    }, [onPanelClose]);

    const handleCategoryChange = useCallback((category: CategoryGroup) => {
        setCurrentCategory(category);
        if (onCategoryChange) {
            onCategoryChange(category);
        }
    }, [onCategoryChange]);

    const handleSceneSubTabChange = useCallback((subTab: SceneSubTab) => {
        setActiveSceneSubTab(subTab);
    }, []);

    const handleExtrasSubTabChange = useCallback((subTab: ExtrasSubTab) => {
        setActiveExtrasSubTab(subTab);
    }, []);

    /**
     * Handle NTR toggle — update state via onStateChange callback
     */
    const handleNTRToggle = useCallback((enabled: boolean) => {
        if (onStateChange) {
            onStateChange({
                ntrModule: {
                    ...state.ntrModule,
                    enabled,
                },
            });
        }
    }, [onStateChange, state.ntrModule]);

    /**
     * Handle tags change from ExpressionPoseSection
     */
    const handleTagsChange = useCallback((tags: Tag[]) => {
        if (onStateChange) {
            const enabledTagNames = tags
                .filter((t) => t.enabled)
                .map((t) => t.name);
            onStateChange({
                expressionPose: {
                    ...state.expressionPose,
                    tags: enabledTagNames,
                },
            });
        }
    }, [onStateChange, state.expressionPose]);

    // ============================================================================
    // DERIVED PROPS FOR COMPONENTS
    // ============================================================================

    /**
     * Build ExpressionPoseSection props from state
     */
    const expressionPoseSectionProps = useMemo(() => ({
        expression: {
            name: state.expressionPose.currentExpression || state.body.expression || 'neutral',
            description: state.body.expression || 'neutral expression',
            imageUrl: state.expressionPose.imageUrl,
            expressionPack: state.expressionPose.expressionPack,
        },
        intensity: state.progressions.arousal,
        pose: {
            name: state.body.posture || 'standing',
            description: state.expressionPose.poseDescription || state.body.posture || 'standing',
            category: state.body.posture || 'standing',
        },
        aiPrompt: state.expressionPose.aiPrompt || '',
        tags: state.expressionPose.tags || [],
        isApiAvailable: true,
        isGenerating: false,
        progress: 0,
        onGenerate: undefined,
        onTagsChange: handleTagsChange,
    }), [state.expressionPose, state.body, state.progressions.arousal, handleTagsChange]);

    // ============================================================================
    // MEMOIZED RENDER FRAGMENTS
    // ============================================================================

    /**
     * Summary content — always visible in the left sidebar
     */
    const summaryContent = useMemo(() => (
        <div className="eros-app-summary">
            <LiveTerminal
                state={state}
                density="condensed"
                showCharacterName={true}
                showNpcBlocks={false}
            />
            <button
                className="eros-summary-expand"
                onClick={handlePanelToggle}
                type="button"
            >
                {panelOpen ? 'Hide Details' : 'Show Details'}
            </button>
        </div>
    ), [state, handlePanelToggle, panelOpen]);

    /**
     * Category tabs — top-level navigation
     */
    const categoryTabs = useMemo(() => (
        <div className="eros-app-tabs">
            {CATEGORY_TABS.map((tab) => (
                <button
                    key={tab.id}
                    className={`eros-tab ${currentCategory === tab.id ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(tab.id)}
                    type="button"
                >
                    <span className="eros-tab-icon">{tab.icon}</span>
                    <span className="eros-tab-label">{tab.label}</span>
                </button>
            ))}
        </div>
    ), [currentCategory, handleCategoryChange]);

    /**
     * Sub-tab navigation for SCENE category
     */
    const sceneSubTabs = (
        <div className="eros-sub-tabs">
            {SCENE_SUB_TABS.map((subTab) => (
                <button
                    key={subTab.id}
                    className={`eros-sub-tab ${activeSceneSubTab === subTab.id ? 'active' : ''}`}
                    onClick={() => handleSceneSubTabChange(subTab.id)}
                    type="button"
                >
                    <span className="eros-sub-tab-icon">{subTab.icon}</span>
                    <span className="eros-sub-tab-label">{subTab.label}</span>
                </button>
            ))}
        </div>
    );

    /**
     * Sub-tab navigation for EXTRAS category
     */
    const extrasSubTabs = (
        <div className="eros-sub-tabs">
            {EXTRAS_SUB_TABS.map((subTab) => (
                <button
                    key={subTab.id}
                    className={`eros-sub-tab ${activeExtrasSubTab === subTab.id ? 'active' : ''}`}
                    onClick={() => handleExtrasSubTabChange(subTab.id)}
                    type="button"
                >
                    <span className="eros-sub-tab-icon">{subTab.icon}</span>
                    <span className="eros-sub-tab-label">{subTab.label}</span>
                </button>
            ))}
        </div>
    );

    // ============================================================================
    // CATEGORY CONTENT RENDERERS
    // ============================================================================

    /**
     * PROGRESSION content
     */
    const renderProgressionContent = () => (
        <div className="eros-category-content">
            {/* Additional progression details could go here */}
        </div>
    );

    /**
     * BODY_CLOTHING content
     */
    const renderBodyClothingContent = () => (
        <div className="eros-category-content eros-body-content">
            <div className="eros-clothing-display">
                <h4>Clothing</h4>
                <div className="eros-clothing-items">
                    <span>Top: {state.clothing.upperBody} ({state.clothing.upperBodyState || 'worn'})</span>
                    <span>Bottom: {state.clothing.lowerBody} ({state.clothing.lowerBodyState || 'worn'})</span>
                    <span>Underwear: {state.clothing.underwear} ({state.clothing.underwearState || 'worn'})</span>
                    <span>Accessories: {state.clothing.accessories}</span>
                    <span>Makeup: {state.clothing.makeup}</span>
                </div>
            </div>
            <div className="eros-body-display">
                <h4>Body State</h4>
                <div className="eros-body-items">
                    <span>Expression: {state.body.expression}</span>
                    <span>Posture: {state.body.posture}</span>
                    <span>Skin: {state.body.skin || 'normal'}</span>
                    <span>Wetness: {state.body.wetness || 0}%</span>
                    <span>Exposure: {state.body.exposureLevel}</span>
                    {state.body.isTrembling && <span>⚠️ Trembling</span>}
                </div>
            </div>
        </div>
    );

    /**
     * SCENE content with sub-tabs
     */
    const renderSceneContent = () => {
        let subContent: ReactElement;

        switch (activeSceneSubTab) {
            case 'scene':
                subContent = (
                    <div className="eros-category-content eros-scene-content">
                        {state.sexModule.active ? (
                            <div className="eros-active-scene">
                                <h4>Active Scene</h4>
                                <p>Type: {state.sexModule.sceneType}</p>
                                <p>Position: {state.sexModule.position}</p>
                                <p>Pace: {state.sexModule.pace}</p>
                                <p>Arousal: {state.sexModule.arousal}%</p>
                                <p>Orgasms: {state.sexModule.orgasmCount}</p>
                                {state.body.wetness !== undefined && (
                                    <p>Wetness: {state.body.wetness}%</p>
                                )}
                                {state.sexModule.cumLocation && (
                                    <p>Cum Location: {state.sexModule.cumLocation}</p>
                                )}
                                {state.sexModule.duration && (
                                    <p>Duration: {state.sexModule.duration}min</p>
                                )}
                            </div>
                        ) : (
                            <div className="eros-no-scene">
                                <p>No active scene</p>
                            </div>
                        )}
                    </div>
                );
                break;

            case 'genitalia':
                subContent = (
                    <div className="eros-category-content">
                        <GenitaliaDisplay
                            genitalia={state.genitalia}
                        />
                    </div>
                );
                break;

            case 'ntr':
                subContent = (
                    <div className="eros-category-content">
                        <NTRDisplay
                            ntrModule={state.ntrModule}
                            onToggle={handleNTRToggle}
                        />
                    </div>
                );
                break;

            default:
                subContent = <div className="eros-category-content" />;
        }

        return (
            <>
                {sceneSubTabs}
                {subContent}
            </>
        );
    };

    /**
     * EXTRAS content with sub-tabs
     */
    const renderExtrasContent = () => {
        let subContent: ReactElement;

        switch (activeExtrasSubTab) {
            case 'inventory':
                subContent = (
                    <div className="eros-category-content">
                        <div className="eros-extras-section">
                            <h4>Inventory</h4>
                            <p>Items: {state.inventory.items.length} / {state.inventory.maxSlots}</p>
                            {state.inventory.items.length > 0 && (
                                <ul className="eros-inventory-list">
                                    {state.inventory.items.map((item) => (
                                        <li key={item.id} className="eros-inventory-item">
                                            <span className="eros-item-name">{item.name}</span>
                                            {item.quantity > 1 && (
                                                <span className="eros-item-qty">x{item.quantity}</span>
                                            )}
                                            <span className="eros-item-category">{item.category}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="eros-extras-section">
                            <h4>Turn Count</h4>
                            <p>{state.turnCount}</p>
                        </div>
                    </div>
                );
                break;

            case 'expressions':
                subContent = (
                    <div className="eros-category-content">
                        <ExpressionPoseSection {...expressionPoseSectionProps} />
                    </div>
                );
                break;

            case 'moments':
                subContent = (
                    <div className="eros-category-content">
                        <ImportantMomentsTimeline
                            moments={state.importantMoments}
                            maxItems={0}
                        />
                    </div>
                );
                break;

            case 'characters':
                subContent = (
                    <div className="eros-category-content">
                        <CharacterTab
                            state={state}
                            onStateChange={onStateChange}
                        />
                    </div>
                );
                break;

            default:
                subContent = <div className="eros-category-content" />;
        }

        return (
            <>
                {extrasSubTabs}
                {subContent}
            </>
        );
    };

    /**
     * Route content based on current category
     */
    const currentContent = useMemo(() => {
        switch (currentCategory) {
            case CategoryGroup.PROGRESSION:
                return renderProgressionContent();
            case CategoryGroup.BODY_CLOTHING:
                return renderBodyClothingContent();
            case CategoryGroup.SCENE:
                return renderSceneContent();
            case CategoryGroup.EXTRAS:
                return renderExtrasContent();
            default:
                return null;
        }
        // Intentionally calling render functions inside useMemo
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        currentCategory,
        activeSceneSubTab,
        activeExtrasSubTab,
        state,
        handleNTRToggle,
        expressionPoseSectionProps,
        onStateChange,
    ]);

    // ============================================================================
    // MAIN RENDER
    // ============================================================================

    return (
        <div className={`eros-status-app ${className}`}>
            <SlideOutPanel
                isOpen={panelOpen}
                onClose={handlePanelClose}
                title={`${state.character.name || 'Character'} - Status`}
                width={70}
                summaryWidth={30}
                summaryContent={summaryContent}
            >
                <div className="eros-app-content">
                    {/* Live Terminal - Always visible at top */}
                    <LiveTerminal
                        state={state}
                        density="full"
                        showCharacterName={true}
                        showNpcBlocks={true}
                        npcBlocks={state.npcs?.map(n => ({
                            name: n.name,
                            species: n.species,
                            mood: n.mood || 'Neutral',
                            activity: n.activity || 'Present',
                            position: n.position,
                            thoughts: n.thoughts,
                        })) || []}
                    />

                    {/* Category Tabs */}
                    {categoryTabs}

                    {/* Status Panel — always visible */}
                    <StatusPanel
                        progressions={state.progressions}
                        system={state.system}
                        location={state.location}
                        sexModule={state.sexModule}
                        showLabels={true}
                        density="comfortable"
                    />

                    {/* Category-specific content */}
                    {currentContent}

                    {/* Turn Counter Footer */}
                    <div className="eros-app-footer">
                        <span className="eros-turn-counter">Turn {state.turnCount}</span>
                    </div>
                </div>
            </SlideOutPanel>
        </div>
    );
}

// ============================================================================
// COMPACT VARIANT
// ============================================================================

/**
 * Compact version for embedding in other UIs
 */
export function ErosStatusCompact({
    state,
    className = '',
}: {
    state: MessageStateType;
    className?: string;
}): ReactElement {
    return (
        <div className={`eros-status-compact ${className}`}>
            <div className="eros-compact-header">
                <span className="eros-compact-name">{state.character.name}</span>
                <span className="eros-compact-stats">
                    {getQuickStatSummary(state.progressions)}
                </span>
            </div>
            <StatusPanel
                progressions={state.progressions}
                system={state.system}
                location={state.location}
                showLabels={false}
                density="compact"
                hideSections={{
                    progression: false,
                    location: true,
                    time: true,
                    sexModule: true,
                }}
            />
        </div>
    );
}

export default ErosStatusApp;
