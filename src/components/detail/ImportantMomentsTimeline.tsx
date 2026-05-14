/**
 * Eros Status - ImportantMomentsTimeline Component
 * Vertical timeline display of important story moments/milestones
 * Renders timeline cards with type icons, title, description, and turn badge
 * Phase 3.4 - Important Moments & Timeline
 */

import { ReactElement, useMemo } from 'react';
import type { ImportantMoment } from '../../types/eros-status';
import { MomentType } from '../../types/eros-status';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ImportantMomentsTimelineProps {
    /** Array of important moments to display */
    moments?: ImportantMoment[] | null;
    /** Additional CSS class names */
    className?: string;
    /** Maximum number of moments to show (0 = no limit) */
    maxItems?: number;
    /** Callback when a moment card is clicked */
    onMomentClick?: (moment: ImportantMoment) => void;
}

// ============================================================================
// DISPLAY CONSTANTS
// ============================================================================

interface MomentTypeDisplay {
    icon: string;
    label: string;
    color: string;
}

/** Mapping from MomentType enum to display properties */
const MOMENT_TYPE_DISPLAY: Record<MomentType, MomentTypeDisplay> = {
    [MomentType.FIRST_KISS]: {
        icon: '💏',
        label: 'First Kiss',
        color: 'var(--eros-affection)',
    },
    [MomentType.FIRST_TIME]: {
        icon: '🔞',
        label: 'First Time',
        color: 'var(--eros-arousal)',
    },
    [MomentType.CONFESSION]: {
        icon: '💌',
        label: 'Confession',
        color: 'var(--eros-affection)',
    },
    [MomentType.PROPOSAL]: {
        icon: '💍',
        label: 'Proposal',
        color: 'var(--eros-highlight)',
    },
    [MomentType.BREAKUP]: {
        icon: '💔',
        label: 'Breakup',
        color: 'var(--eros-danger)',
    },
    [MomentType.BETRAYAL]: {
        icon: '🗡️',
        label: 'Betrayal',
        color: 'var(--eros-danger)',
    },
    [MomentType.REUNION]: {
        icon: '🤗',
        label: 'Reunion',
        color: 'var(--eros-obedience)',
    },
    [MomentType.BIRTH]: {
        icon: '👶',
        label: 'Birth',
        color: 'var(--eros-success)',
    },
    [MomentType.DEATH]: {
        icon: '💀',
        label: 'Death',
        color: 'var(--eros-text-muted)',
    },
    [MomentType.MILESTONE]: {
        icon: '🏆',
        label: 'Milestone',
        color: 'var(--eros-time)',
    },
    [MomentType.NSFW]: {
        icon: '🔞',
        label: 'NSFW',
        color: 'var(--eros-arousal)',
    },
    [MomentType.ROMANTIC]: {
        icon: '💕',
        label: 'Romantic',
        color: 'var(--eros-affection)',
    },
    [MomentType.DRAMATIC]: {
        icon: '🎭',
        label: 'Dramatic',
        color: 'var(--eros-libido)',
    },
};

/** Fallback for unknown/undefined moment types */
const FALLBACK_DISPLAY: MomentTypeDisplay = {
    icon: '📌',
    label: 'Moment',
    color: 'var(--eros-text-muted)',
};

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Get display info for a moment type
 */
function getMomentTypeDisplay(type: MomentType): MomentTypeDisplay {
    return MOMENT_TYPE_DISPLAY[type] || FALLBACK_DISPLAY;
}

/**
 * Format turn number for display badge
 */
function formatTurnNumber(turn: number): string {
    return `Turn ${turn}`;
}

// ============================================================================
// SUB-COMPONENT: Moment Card
// ============================================================================

interface MomentCardProps {
    moment: ImportantMoment;
    index: number;
    onClick?: (moment: ImportantMoment) => void;
}

/**
 * Individual timeline card for a single important moment
 */
function MomentCard({ moment, index, onClick }: MomentCardProps): ReactElement {
    const typeDisplay = getMomentTypeDisplay(moment.type);
    const isNSFW = moment.isNSFW === true;

    const handleClick = () => {
        onClick?.(moment);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.(moment);
        }
    };

    return (
        <div
            className={`eros-moment-card ${isNSFW ? 'eros-moment-nsfw' : ''}`}
            style={{ '--moment-color': typeDisplay.color } as React.CSSProperties}
            role="article"
            aria-label={`${typeDisplay.label}: ${moment.title}`}
            tabIndex={onClick ? 0 : undefined}
            onClick={onClick ? handleClick : undefined}
            onKeyDown={onClick ? handleKeyDown : undefined}
        >
            {/* Timeline Dot */}
            <div
                className="eros-moment-dot"
                style={{ backgroundColor: typeDisplay.color }}
                aria-hidden="true"
            />

            {/* Card Content */}
            <div className="eros-moment-card-body">
                {/* Header Row */}
                <div className="eros-moment-header">
                    <span
                        className="eros-moment-type-icon"
                        style={{ color: typeDisplay.color }}
                        aria-hidden="true"
                    >
                        {typeDisplay.icon}
                    </span>
                    <span
                        className="eros-moment-type-label"
                        style={{ color: typeDisplay.color }}
                    >
                        {typeDisplay.label}
                    </span>
                    <span className="eros-moment-turn-badge">
                        {formatTurnNumber(moment.turn)}
                    </span>
                    {isNSFW && (
                        <span className="eros-moment-nsfw-badge" aria-label="NSFW content">
                            NSFW
                        </span>
                    )}
                </div>

                {/* Title */}
                <h4 className="eros-moment-title">{moment.title}</h4>

                {/* Description */}
                {moment.description && (
                    <p className="eros-moment-description">{moment.description}</p>
                )}

                {/* Screenshot */}
                {moment.screenshotUrl && (
                    <div className="eros-moment-screenshot">
                        <img
                            src={moment.screenshotUrl}
                            alt={`Screenshot for ${moment.title}`}
                            className="eros-moment-screenshot-img"
                            loading="lazy"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================================================
// SUB-COMPONENT: Empty State
// ============================================================================

/**
 * Empty state displayed when no moments exist
 */
function EmptyState(): ReactElement {
    return (
        <div className="eros-moments-empty" role="status">
            <div className="eros-moments-empty-icon" aria-hidden="true">📸</div>
            <div className="eros-moments-empty-text">
                No important moments recorded yet
            </div>
            <div className="eros-moments-empty-hint">
                Significant events will appear here as your story progresses
            </div>
        </div>
    );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * ImportantMomentsTimeline Component
 * Renders a vertical timeline of important story moments
 * with type-based icons, color coding, and staggered entry animations
 */
export function ImportantMomentsTimeline({
    moments,
    className = '',
    maxItems = 0,
    onMomentClick,
}: ImportantMomentsTimelineProps): ReactElement {
    // Derive display data with memoization
    const displayData = useMemo(() => {
        if (!moments || moments.length === 0) {
            return { isEmpty: true as const };
        }

        // Sort by turn number (ascending)
        const sorted = [...moments].sort((a, b) => a.turn - b.turn);

        // Apply max items limit (if set > 0)
        const limited = maxItems > 0 ? sorted.slice(-maxItems) : sorted;

        return {
            isEmpty: false as const,
            items: limited,
            totalCount: moments.length,
            displayCount: limited.length,
            hasMore: moments.length > limited.length,
        };
    }, [moments, maxItems]);

    // ============================================================================
    // EMPTY STATE
    // ============================================================================

    if (displayData.isEmpty) {
        return (
            <div className={`eros-moments-timeline ${className}`}>
                <EmptyState />
            </div>
        );
    }

    // ============================================================================
    // TIMELINE RENDER
    // ============================================================================

    return (
        <div
            className={`eros-moments-timeline ${className}`}
            role="feed"
            aria-label="Important moments timeline"
            aria-live="polite"
        >
            {/* Header */}
            <div className="eros-moments-header">
                <h3 className="eros-moments-title">Important Moments</h3>
                <span className="eros-moments-count" aria-label={`${displayData.totalCount} total moments`}>
                    {displayData.totalCount}
                </span>
            </div>

            {/* Timeline */}
            <div className="eros-moments-list" role="list">
                {displayData.items.map((moment, index) => (
                    <div
                        key={moment.id}
                        className="eros-moment-wrapper"
                        role="listitem"
                        style={{ '--moment-index': index } as React.CSSProperties}
                    >
                        <MomentCard
                            moment={moment}
                            index={index}
                            onClick={onMomentClick}
                        />
                    </div>
                ))}
            </div>

            {/* "Show more" indicator if truncated */}
            {displayData.hasMore && (
                <div className="eros-moments-more">
                    <span className="eros-moments-more-text">
                        +{displayData.totalCount - displayData.displayCount} more moment{displayData.totalCount - displayData.displayCount !== 1 ? 's' : ''}
                    </span>
                </div>
            )}
        </div>
    );
}

export default ImportantMomentsTimeline;
