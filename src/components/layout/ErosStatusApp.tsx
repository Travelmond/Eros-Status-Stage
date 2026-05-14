/**
 * Eros Status - ErosStatusApp Component
 * Main container component for the Eros Status Stage UI
 * Phase 1 - Core UI Components + Phase 2.3 Summary Terminal
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

/**
 * Category tab definitions
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

/**
 * ErosStatusApp Component
 * Main application container that renders the Eros Status UI
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
    const [panelOpen, setPanelOpen] = useState(initialPanelOpen);
    const [currentCategory, setCurrentCategory] = useState<CategoryGroup>(activeCategory);

    // Handle panel open/close
    const handlePanelToggle = useCallback(() => {
        setPanelOpen((prev) => !prev);
    }, []);

    const handlePanelClose = useCallback(() => {
        setPanelOpen(false);
        if (onPanelClose) {
            onPanelClose();
        }
    }, [onPanelClose]);

    // Handle category change
    const handleCategoryChange = useCallback((category: CategoryGroup) => {
        setCurrentCategory(category);
        if (onCategoryChange) {
            onCategoryChange(category);
        }
    }, [onCategoryChange]);

    // Quick summary for always-visible area - Phase 2.3 uses SummaryTerminal
    const summaryContent = useMemo(() => (
        <div className="eros-app-summary">
            <SummaryTerminal
                state={state}
                onStatsClick={handlePanelToggle}
                size="sm"
                variant="default"
            />
            <button
                className="eros-summary-expand"
                onClick={handlePanelToggle}
                type="button"
            >
                {panelOpen ? 'Hide Details' : 'Show Details'}
            </button>
        </div>
    ), [state, handlePanelToggle]);

    // Category tabs
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

    // Main panel content
    const panelContent = useMemo(() => (
        <div className="eros-app-content">
            {/* Category Tabs */}
            {categoryTabs}

            {/* Status Panel based on category */}
            <StatusPanel
                progressions={state.progressions}
                system={state.system}
                location={state.location}
                sexModule={state.sexModule}
                showLabels={true}
                density="comfortable"
            />

            {/* Category-specific content */}
            {currentCategory === CategoryGroup.PROGRESSION && (
                <div className="eros-category-content">
                    {/* Additional progression details could go here */}
                </div>
            )}

            {currentCategory === CategoryGroup.BODY_CLOTHING && (
                <div className="eros-category-content eros-body-content">
                    <div className="eros-clothing-display">
                        <h4>Clothing</h4>
                        <div className="eros-clothing-items">
                            <span>Top: {state.clothing.upperBody}</span>
                            <span>Bottom: {state.clothing.lowerBody}</span>
                            <span>Underwear: {state.clothing.underwear}</span>
                        </div>
                    </div>
                    <div className="eros-body-display">
                        <h4>Body State</h4>
                        <div className="eros-body-items">
                            <span>Expression: {state.body.expression}</span>
                            <span>Posture: {state.body.posture}</span>
                            <span>Exposure: {state.body.exposureLevel}</span>
                        </div>
                    </div>
                </div>
            )}

            {currentCategory === CategoryGroup.SCENE && (
                <div className="eros-category-content eros-scene-content">
                    {state.sexModule.active ? (
                        <div className="eros-active-scene">
                            <h4>Active Scene</h4>
                            <p>Type: {state.sexModule.sceneType}</p>
                            <p>Position: {state.sexModule.position}</p>
                            <p>Pace: {state.sexModule.pace}</p>
                            <p>Arousal: {state.sexModule.arousal}%</p>
                            <p>Orgasms: {state.sexModule.orgasmCount}</p>
                        </div>
                    ) : (
                        <div className="eros-no-scene">
                            <p>No active scene</p>
                        </div>
                    )}
                </div>
            )}

            {currentCategory === CategoryGroup.EXTRAS && (
                <div className="eros-category-content eros-extras-content">
                    <div className="eros-extras-section">
                        <h4>Inventory</h4>
                        <p>Items: {state.inventory.items.length} / {state.inventory.maxSlots}</p>
                    </div>
                    <div className="eros-extras-section">
                        <h4>Turn Count</h4>
                        <p>{state.turnCount}</p>
                    </div>
                </div>
            )}

            {/* Turn Counter Footer */}
            <div className="eros-app-footer">
                <span className="eros-turn-counter">Turn {state.turnCount}</span>
            </div>
        </div>
    ), [categoryTabs, state, currentCategory]);

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
                {panelContent}
            </SlideOutPanel>
        </div>
    );
}

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