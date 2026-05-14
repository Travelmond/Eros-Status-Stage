/**
 * Eros Status - PoseDisplay Component
 * Displays current pose with description and modifiers
 * Phase 3.3 - Expression/Pose Section
 */

import { ReactElement, memo } from 'react';

export interface PoseModifier {
    /** Modifier name */
    name: string;
    /** Modifier value or weight */
    value?: number;
    /** Whether modifier is active */
    active?: boolean;
}

export interface PoseData {
    /** Pose name */
    name: string;
    /** Pose description */
    description: string;
    /** Pose modifiers */
    modifiers?: PoseModifier[];
    /** Pose category (standing, sitting, lying, etc.) */
    category?: string;
}

export interface PoseDisplayProps {
    /** Pose data to display */
    pose: PoseData;
    /** Additional CSS class names */
    className?: string;
}

/**
 * Get pose emoji based on category
 */
function getPoseEmoji(category?: string): string {
    if (!category) return '🧍';
    const emojiMap: Record<string, string> = {
        standing: '🧍',
        sitting: '🪑',
        lying: '🛏️',
        kneeling: '🙇',
        crouching: '🦵',
        dancing: '💃',
        walking: '🚶',
        running: '🏃',
        swimming: '🏊',
        fighting: '🥊'
    };
    return emojiMap[category.toLowerCase()] || '🧍';
}

/**
 * PoseDisplay Component
 * Shows current pose with description and modifiers
 */
export function PoseDisplay({
    pose,
    className = ''
}: PoseDisplayProps): ReactElement {
    const activeModifiers = pose.modifiers?.filter(m => m.active !== false) || [];

    return (
        <div className={`pose-display ${className}`}>
            {/* Header */}
            <div className="pose-display-header">
                <span className="pose-label">Pose</span>
                {pose.category && (
                    <span className="pose-category">{pose.category}</span>
                )}
            </div>

            {/* Main Content */}
            <div className="pose-display-content">
                {/* Pose Icon */}
                <div className="pose-icon">
                    <span className="pose-emoji">{getPoseEmoji(pose.category)}</span>
                </div>

                {/* Pose Details */}
                <div className="pose-details">
                    <h3 className="pose-name">{pose.name}</h3>
                    <p className="pose-description">{pose.description}</p>

                    {/* Modifiers */}
                    {activeModifiers.length > 0 && (
                        <div className="pose-modifiers">
                            <span className="modifiers-label">Modifiers:</span>
                            <div className="modifiers-list">
                                {activeModifiers.map((modifier, index) => (
                                    <span
                                        key={index}
                                        className="modifier-tag"
                                        style={
                                            modifier.value !== undefined
                                                ? { opacity: 0.5 + (modifier.value / 200) }
                                                : undefined
                                        }
                                    >
                                        {modifier.name}
                                        {modifier.value !== undefined && ` (${modifier.value}%)`}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * PoseDisplay Skeleton - Loading state
 */
export function PoseDisplaySkeleton({
    className = ''
}: {
    className?: string;
}): ReactElement {
    return (
        <div className={`pose-display-skeleton ${className}`}>
            <div className="skeleton-header" />
            <div className="skeleton-content">
                <div className="skeleton-icon" />
                <div className="skeleton-details">
                    <div className="skeleton-name" />
                    <div className="skeleton-description" />
                    <div className="skeleton-modifiers" />
                </div>
            </div>
        </div>
    );
}

export default PoseDisplay;