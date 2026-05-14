/**
 * Eros Status - CompactStatusDisplay Component
 * Condensed stat line with emoji icons and percentages
 * Phase 2.3 - Compact Status Display
 */

import { ReactElement, useMemo } from 'react';
import type { ProgressionValues } from '../../types/eros-status';

export interface CompactStatusDisplayProps {
    /** Core progression values */
    progressions: ProgressionValues;
    /** Callback when stats are clicked */
    onClick?: () => void;
    /** Show specific stats only */
    stats?: Array<keyof ProgressionValues>;
    /** Additional CSS class names */
    className?: string;
}

/**
 * Stat configuration with icons and colors
 */
const STAT_CONFIG: Array<{
    key: keyof ProgressionValues;
    icon: string;
    colorVar: string;
}> = [
    { key: 'affection', icon: '💕', colorVar: '--eros-affection' },
    { key: 'libido', icon: '🔥', colorVar: '--eros-libido' },
    { key: 'trust', icon: '💙', colorVar: '--eros-location' },
    { key: 'arousal', icon: '💋', colorVar: '--eros-arousal' },
    { key: 'obedience', icon: '💚', colorVar: '--eros-obedience' },
    { key: 'happiness', icon: '😊', colorVar: '--eros-time' },
];

/**
 * Get color for stat based on value
 */
function getStatColor(value: number, colorVar: string): string {
    if (value < 30) return `color-muted`;
    if (value < 70) return colorVar;
    return colorVar;
}

/**
 * CompactStatusDisplay Component
 * Displays progression stats in a compact inline format
 * [💕65% 🔥50% 🎯40%]
 */
export function CompactStatusDisplay({
    progressions,
    onClick,
    stats,
    className = '',
}: CompactStatusDisplayProps): ReactElement {
    // Determine which stats to display
    const displayStats = useMemo(() => {
        if (stats && stats.length > 0) {
            return stats.map(statKey => {
                const config = STAT_CONFIG.find(c => c.key === statKey);
                return config || { key: statKey, icon: '•', colorVar: '--eros-text' };
            });
        }
        // Default: affection, libido, trust
        return STAT_CONFIG.filter(c =>
            c.key === 'affection' || c.key === 'libido' || c.key === 'trust'
        );
    }, [stats]);

    // Build stat items
    const statItems = useMemo(() => {
        return displayStats.map((stat) => {
            const value = progressions[stat.key] ?? 0;
            const percentage = Math.round(value);
            const isLow = percentage < 30;
            const isHigh = percentage >= 70;

            return (
                <span
                    key={stat.key}
                    className={`eros-compact-stat-item ${isLow ? 'low' : ''} ${isHigh ? 'high' : ''}`}
                    style={{ '--stat-color': `var(${stat.colorVar})` } as React.CSSProperties}
                >
                    <span className="eros-compact-stat-icon">{stat.icon}</span>
                    <span className="eros-compact-stat-value">{percentage}%</span>
                </span>
            );
        });
    }, [displayStats, progressions]);

    return (
        <div
            className={`eros-compact-status-display ${onClick ? 'clickable' : ''} ${className}`}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
        >
            <span className="eros-compact-stats-bracket">[</span>
            {statItems}
            <span className="eros-compact-stats-bracket">]</span>
        </div>
    );
}

/**
 * Alternative inline version for tighter spaces
 * Just shows the raw emoji+percentage without brackets
 */
export function CompactStatusInline({
    progressions,
    className = '',
}: {
    progressions: ProgressionValues;
    className?: string;
}): ReactElement {
    const inlineStats = useMemo(() => {
        const affection = Math.round(progressions.affection / 10);
        const libido = Math.round(progressions.libido / 10);
        const trust = Math.round(progressions.trust / 10);

        return `💕${affection} 🔥${libido} 💙${trust}`;
    }, [progressions]);

    return (
        <span className={`eros-compact-status-inline ${className}`}>
            {inlineStats}
        </span>
    );
}

export default CompactStatusDisplay;