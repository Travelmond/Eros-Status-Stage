/**
 * Eros Status - NTRDisplay Component
 * Displays Netorare (NTR) module state from Lorebook Entry 11
 * Includes toggle, role display, partner info, humiliation level, and gene quality
 * Phase 3.3 - NTR & Advanced Relationship Module
 */

import { ReactElement, useMemo } from 'react';
import type { NTRModuleState } from '../../types/eros-status';
import { NTRType } from '../../types/eros-status';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface NTRDisplayProps {
    /** Full NTR module state from MessageStateType */
    ntrModule?: NTRModuleState | null;
    /** Additional CSS class names */
    className?: string;
    /** Callback when toggle changes (if you want to wire it up) */
    onToggle?: (enabled: boolean) => void;
}

// ============================================================================
// DISPLAY CONSTANTS
// ============================================================================

interface NTRTypeDisplay {
    label: string;
    icon: string;
    color: string;
    description: string;
}

/** Mapping from NTRType enum to display info */
const NTR_TYPE_DISPLAY: Record<NTRType, NTRTypeDisplay> = {
    [NTRType.NONE]: {
        label: 'None',
        icon: '⚪',
        color: 'var(--eros-text-muted)',
        description: 'No NTR dynamics active',
    },
    [NTRType.MILD]: {
        label: 'Mild',
        icon: '💔',
        color: 'var(--eros-warning)',
        description: 'Subtle teasing and jealousy play',
    },
    [NTRType.MODERATE]: {
        label: 'Moderate',
        icon: '💢',
        color: 'var(--eros-libido)',
        description: 'Active third-party involvement',
    },
    [NTRType.EXTREME]: {
        label: 'Extreme',
        icon: '🔥',
        color: 'var(--eros-arousal)',
        description: 'Intense degradation and cuckolding',
    },
};

/** Role display mapping */
const ROLE_DISPLAY: Record<string, { label: string; icon: string; description: string }> = {
    cuckold: {
        label: 'Cuckold',
        icon: '🛐',
        description: 'Derives arousal from partner\'s involvement with others',
    },
    bull: {
        label: 'Bull',
        icon: '🦁',
        description: 'The dominant third party in the dynamic',
    },
    hotwife: {
        label: 'Hotwife',
        icon: '👑',
        description: 'Wife/girlfriend who engages with others with partner\'s approval',
    },
};

/** Humiliation level thresholds and colors */
const HUMILIATION_LEVELS: { threshold: number; label: string; color: string }[] = [
    { threshold: 0, label: 'None', color: 'var(--eros-text-muted)' },
    { threshold: 20, label: 'Slight', color: 'var(--eros-obedience)' },
    { threshold: 40, label: 'Modest', color: 'var(--eros-warning)' },
    { threshold: 60, label: 'Significant', color: 'var(--eros-libido)' },
    { threshold: 80, label: 'Intense', color: 'var(--eros-arousal)' },
    { threshold: 100, label: 'Devastating', color: 'var(--eros-danger)' },
];

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Get humiliation stage label based on level
 */
function getHumiliationStage(level: number): { label: string; color: string } {
    const clamped = Math.max(0, Math.min(100, level));
    let result = HUMILIATION_LEVELS[0];
    for (const entry of HUMILIATION_LEVELS) {
        if (clamped >= entry.threshold) {
            result = entry;
        }
    }
    return { label: result.label, color: result.color };
}

/**
 * Get the role display info, falling back to deriving from NTR type
 */
function getRoleInfo(role: string | undefined, type: NTRType): { label: string; icon: string; description: string } | null {
    if (role && role.trim() !== '') {
        const lower = role.trim().toLowerCase();
        if (ROLE_DISPLAY[lower]) {
            return ROLE_DISPLAY[lower];
        }
        // If role exists but isn't in our known set, show it as-is
        return {
            label: role.trim(),
            icon: '🎭',
            description: 'Custom role',
        };
    }

    // Derive from type if no explicit role
    if (type === NTRType.NONE) return null;
    if (type === NTRType.MILD) return null; // Too subtle for a specific role

    // Default role indication
    return null;
}

/**
 * Format gene quality value for display
 */
function formatGeneQuality(value: number | undefined): string | null {
    if (value === undefined || value === null) return null;
    return `${value.toFixed(1)}%`;
}

/**
 * Get color for gene quality
 */
function getGeneQualityColor(value: number | undefined): string {
    if (value === undefined || value === null) return 'var(--eros-text-muted)';
    if (value >= 90) return 'var(--eros-success)';
    if (value >= 70) return 'var(--eros-obedience)';
    if (value >= 50) return 'var(--eros-warning)';
    return 'var(--eros-danger)';
}

// ============================================================================
// PROGRESS BAR COMPONENT (inline)
// ============================================================================

interface HumiliationBarProps {
    level: number;
    color: string;
    size?: 'sm' | 'md' | 'lg';
}

/**
 * Inline progress bar for humiliation level
 */
function HumiliationBar({ level, color, size = 'md' }: HumiliationBarProps): ReactElement {
    const clampedLevel = Math.max(0, Math.min(100, level));
    return (
        <div
            className={`eros-ntr-bar eros-ntr-bar-${size}`}
            role="progressbar"
            aria-valuenow={clampedLevel}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Humiliation ${clampedLevel}%`}
        >
            <div
                className="eros-ntr-bar-fill"
                style={{
                    width: `${clampedLevel}%`,
                    backgroundColor: color,
                }}
            />
        </div>
    );
}

// ============================================================================
// TOGGLE SWITCH COMPONENT
// ============================================================================

interface ToggleSwitchProps {
    enabled: boolean;
    onToggle?: (enabled: boolean) => void;
}

/**
 * Custom toggle switch for enabling/disabling NTR mode
 */
function ToggleSwitch({ enabled, onToggle }: ToggleSwitchProps): ReactElement {
    const handleClick = () => {
        onToggle?.(!enabled);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle?.(!enabled);
        }
    };

    return (
        <button
            className={`eros-ntr-toggle ${enabled ? 'eros-ntr-toggle-active' : 'eros-ntr-toggle-inactive'}`}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role="switch"
            aria-checked={enabled}
            aria-label={`NTR mode ${enabled ? 'enabled' : 'disabled'}`}
            type="button"
        >
            <span className="eros-ntr-toggle-track">
                <span className="eros-ntr-toggle-thumb" />
            </span>
            <span className="eros-ntr-toggle-label">
                {enabled ? 'Enabled' : 'Disabled'}
            </span>
        </button>
    );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * NTRDisplay Component
 * Renders Netorare module data from the Lorebook Entry 11
 * Displays toggle, role, partner, humiliation level, and gene quality
 */
export function NTRDisplay({
    ntrModule,
    className = '',
    onToggle,
}: NTRDisplayProps): ReactElement {
    // Derive all display data with memoization
    const displayData = useMemo(() => {
        if (!ntrModule) {
            return { isEmpty: true as const };
        }

        const typeInfo = NTR_TYPE_DISPLAY[ntrModule.type] || NTR_TYPE_DISPLAY[NTRType.NONE];
        const roleInfo = getRoleInfo(ntrModule.role, ntrModule.type);
        const stageInfo = getHumiliationStage(ntrModule.humiliationLevel);
        const geneQualityFormatted = formatGeneQuality(ntrModule.geneQuality);

        return {
            isEmpty: false as const,
            enabled: ntrModule.enabled,
            typeInfo,
            roleInfo,
            partner: ntrModule.partner,
            humiliationLevel: ntrModule.humiliationLevel,
            stageInfo,
            geneQuality: ntrModule.geneQuality,
            geneQualityFormatted,
        };
    }, [ntrModule]);

    // ============================================================================
    // EMPTY STATE — no NTR module data at all
    // ============================================================================

    if (displayData.isEmpty) {
        return (
            <div className={`eros-ntr-display eros-ntr-empty ${className}`}>
                <div className="eros-ntr-empty-icon">💔</div>
                <div className="eros-ntr-empty-text">
                    No NTR module data available
                </div>
                <div className="eros-ntr-empty-hint">
                    Enable NTR in character settings or stage configuration
                </div>
            </div>
        );
    }

    // ============================================================================
    // DISABLED STATE — NTR is not active
    // ============================================================================

    if (!displayData.enabled) {
        return (
            <div className={`eros-ntr-display eros-ntr-disabled ${className}`}>
                {/* Header */}
                <div className="eros-ntr-display-header">
                    <span className="eros-ntr-display-icon">💔</span>
                    <h3 className="eros-ntr-display-title">NTR Status</h3>
                    <ToggleSwitch
                        enabled={displayData.enabled}
                        onToggle={onToggle}
                    />
                </div>

                {/* Disabled message */}
                <div className="eros-ntr-disabled-body">
                    <div className="eros-ntr-disabled-icon">🔒</div>
                    <div className="eros-ntr-disabled-text">NTR Module Disabled</div>
                    <div className="eros-ntr-disabled-hint">
                        Toggle the switch above or enable NTR in configuration to activate
                    </div>
                </div>
            </div>
        );
    }

    // ============================================================================
    // ACTIVE STATE — NTR is enabled
    // ============================================================================

    return (
        <div className={`eros-ntr-display eros-ntr-active ${className}`}>
            {/* Header */}
            <div className="eros-ntr-display-header">
                <span className="eros-ntr-display-icon">{displayData.typeInfo.icon}</span>
                <h3 className="eros-ntr-display-title">NTR Status</h3>
                <ToggleSwitch
                    enabled={displayData.enabled}
                    onToggle={onToggle}
                />
            </div>

            {/* Body */}
            <div className="eros-ntr-body">
                {/* NTR Type Badge */}
                <div className="eros-ntr-type-row">
                    <span
                        className="eros-ntr-type-badge"
                        style={{ borderColor: displayData.typeInfo.color }}
                    >
                        <span className="eros-ntr-type-icon">{displayData.typeInfo.icon}</span>
                        <span
                            className="eros-ntr-type-label"
                            style={{ color: displayData.typeInfo.color }}
                        >
                            {displayData.typeInfo.label}
                        </span>
                    </span>
                    <span className="eros-ntr-type-desc">
                        {displayData.typeInfo.description}
                    </span>
                </div>

                {/* Role Display */}
                {displayData.roleInfo && (
                    <div className="eros-ntr-field">
                        <div className="eros-ntr-field-header">
                            <span className="eros-ntr-field-icon">{displayData.roleInfo.icon}</span>
                            <span className="eros-ntr-field-label">Role</span>
                        </div>
                        <div className="eros-ntr-field-value-row">
                            <span className="eros-ntr-role-badge">
                                {displayData.roleInfo.label}
                            </span>
                            <span className="eros-ntr-role-desc">{displayData.roleInfo.description}</span>
                        </div>
                    </div>
                )}

                {/* Partner Info */}
                {displayData.partner && displayData.partner.trim() !== '' && (
                    <div className="eros-ntr-field">
                        <div className="eros-ntr-field-header">
                            <span className="eros-ntr-field-icon">👤</span>
                            <span className="eros-ntr-field-label">Partner</span>
                        </div>
                        <div className="eros-ntr-field-value-row">
                            <span className="eros-ntr-partner-name">
                                {displayData.partner}
                            </span>
                        </div>
                    </div>
                )}

                {/* Humiliation Level */}
                <div className="eros-ntr-field">
                    <div className="eros-ntr-field-header">
                        <span className="eros-ntr-field-icon">😈</span>
                        <span className="eros-ntr-field-label">Humiliation</span>
                        <span
                            className="eros-ntr-humiliation-value"
                            style={{ color: displayData.stageInfo.color }}
                        >
                            {displayData.humiliationLevel}%
                        </span>
                    </div>
                    <div className="eros-ntr-field-bar">
                        <div className="eros-ntr-bar-row">
                            <HumiliationBar
                                level={displayData.humiliationLevel}
                                color={displayData.stageInfo.color}
                                size="lg"
                            />
                            <span
                                className="eros-ntr-stage-label"
                                style={{ color: displayData.stageInfo.color }}
                            >
                                {displayData.stageInfo.label}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Gene Quality */}
                {displayData.geneQualityFormatted !== null && (
                    <div className="eros-ntr-field">
                        <div className="eros-ntr-field-header">
                            <span className="eros-ntr-field-icon">🧬</span>
                            <span className="eros-ntr-field-label">Gene Quality</span>
                            <span
                                className="eros-ntr-gene-value"
                                style={{ color: getGeneQualityColor(displayData.geneQuality) }}
                            >
                                {displayData.geneQualityFormatted}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default NTRDisplay;
