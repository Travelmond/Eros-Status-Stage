/**
 * Eros Status - StatCard Component
 * Game-style stat display card with icon, label, value, and progress bar
 * Phase 3 - Game-like UI for displaying character stats
 * Phase 4.1 - Added lock functionality
 */

import { ReactElement, useMemo } from 'react';
import { LockToggle } from './LockToggle';

export interface StatCardProps {
    /** Stat label */
    label: string;
    /** Current stat value (0-100) */
    value: number;
    /** Stat icon (emoji or text) */
    icon?: string;
    /** Stat type for color styling */
    statType?: 'affection' | 'obedience' | 'libido' | 'arousal' | 'trust' | 'corruption' | 'submission' | 'jealousy' | 'embarrassment' | 'fatigue' | 'happiness' | 'custom';
    /** Custom color (overrides statType) */
    customColor?: string;
    /** Show progress bar */
    showProgress?: boolean;
    /** Progress bar style */
    progressStyle?: 'segments' | 'fill' | 'glow' | 'none';
    /** Number of segments for segment style */
    segmentCount?: number;
    /** Show numeric value */
    showValue?: boolean;
    /** Value format */
    valueFormat?: 'number' | 'percentage' | 'text';
    /** Custom text values for text format */
    customText?: string;
    /** Clickable */
    clickable?: boolean;
    /** Disabled */
    disabled?: boolean;
    /** Hover effect */
    hoverable?: boolean;
    /** Animation */
    animated?: boolean;
    /** Callback when clicked */
    onClick?: () => void;
    /** Additional CSS class names */
    className?: string;
    // Phase 4.1 - Lock functionality
    /** Whether the stat is locked */
    isLocked?: boolean;
    /** Callback when lock state changes */
    onLockToggle?: (isLocked: boolean) => void;
    /** Stat key for lock identification */
    statKey?: string;
    /** Show lock toggle */
    showLockToggle?: boolean;
}

/**
 * Get stat color based on type
 */
function getStatColor(statType: StatCardProps['statType']): string {
    const colors: Record<string, string> = {
        affection: 'var(--eros-affection)',
        obedience: 'var(--eros-obedience)',
        libido: 'var(--eros-libido)',
        arousal: 'var(--eros-arousal)',
        trust: 'var(--eros-location)',
        corruption: 'var(--eros-interactive)',
        submission: 'var(--eros-obedience)',
        jealousy: 'var(--eros-danger)',
        embarrassment: 'var(--eros-warning)',
        fatigue: 'var(--eros-text-muted)',
        happiness: 'var(--eros-success)',
        custom: 'var(--eros-highlight)',
    };
    return colors[statType || 'custom'] || colors.custom;
}

/**
 * Get stat icon based on type
 */
function getDefaultIcon(statType: StatCardProps['statType']): string {
    const icons: Record<string, string> = {
        affection: '❤️',
        obedience: '✅',
        libido: '🔥',
        arousal: '💕',
        trust: '🤝',
        corruption: '😈',
        submission: '🙇',
        jealousy: '😤',
        embarrassment: '😳',
        fatigue: '😴',
        happiness: '😊',
    };
    return icons[statType || ''] || '📊';
}

/**
 * Format value based on format type
 */
function formatValue(value: number, format: StatCardProps['valueFormat'], customText?: string): string {
    switch (format) {
        case 'percentage':
            return `${value}%`;
        case 'text':
            return customText || getTextValue(value);
        case 'number':
        default:
            return value.toString();
    }
}

/**
 * Get text representation of value
 */
function getTextValue(value: number): string {
    if (value >= 90) return 'MAX';
    if (value >= 70) return 'HIGH';
    if (value >= 50) return 'MED';
    if (value >= 30) return 'LOW';
    if (value >= 10) return 'MIN';
    return 'EMPTY';
}

/**
 * Render progress segments
 */
function renderProgressSegments(
    value: number,
    segmentCount: number,
    color: string,
    style: StatCardProps['progressStyle']
): ReactElement {
    const segments = [];
    const filledCount = Math.round((value / 100) * segmentCount);
    
    for (let i = 0; i < segmentCount; i++) {
        const isFilled = i < filledCount;
        segments.push(
            <span
                key={i}
                className={`rpg-stat-segment ${isFilled ? 'filled' : 'empty'} ${style === 'glow' && isFilled ? 'glow' : ''}`}
                style={{
                    '--segment-color': color,
                } as React.CSSProperties}
            />
        );
    }
    
    return <>{segments}</>;
}

/**
 * StatCard Component
 * Game-style card for displaying character statistics
 * Phase 4.1 - Added lock support
 */
export function StatCard({
    label,
    value,
    icon,
    statType = 'custom',
    customColor,
    showProgress = true,
    progressStyle = 'segments',
    segmentCount = 10,
    showValue = true,
    valueFormat = 'number',
    customText,
    clickable = false,
    disabled = false,
    hoverable = true,
    animated = true,
    onClick,
    className = '',
    // Lock props
    isLocked = false,
    onLockToggle,
    statKey,
    showLockToggle = false,
}: StatCardProps): ReactElement {
    // Calculate color
    const color = customColor || getStatColor(statType);
    
    // Get icon
    const displayIcon = icon || getDefaultIcon(statType);
    
    // Format value
    const displayValue = formatValue(value, valueFormat, customText);
    
    // Determine if interactive
    const isInteractive = clickable && !disabled && !isLocked;
    
    // Handle lock toggle
    const handleLockToggle = (locked: boolean) => {
        onLockToggle?.(locked);
    };
    
    return (
        <div
            className={`
                rpg-stat-card
                ${isInteractive ? 'interactive' : ''}
                ${disabled ? 'disabled' : ''}
                ${hoverable && !disabled ? 'hoverable' : ''}
                ${animated ? 'animated' : ''}
                ${isLocked ? 'locked' : ''}
                ${className}
            `}
            style={{
                '--stat-color': color,
            } as React.CSSProperties}
            onClick={isInteractive ? onClick : undefined}
            role={isInteractive ? 'button' : undefined}
            tabIndex={isInteractive ? 0 : undefined}
        >
            {/* Lock Toggle (if enabled) */}
            {showLockToggle && (
                <div className="rpg-stat-lock-indicator">
                    <LockToggle
                        isLocked={isLocked}
                        onToggle={handleLockToggle}
                        statKey={statKey}
                        statName={label}
                        size="sm"
                        disabled={disabled}
                    />
                </div>
            )}
            {/* Icon */}
            <div className="rpg-stat-icon">
                {displayIcon}
            </div>
            
            {/* Content */}
            <div className="rpg-stat-content">
                {/* Label */}
                <div className="rpg-stat-label">
                    {label}
                </div>
                
                {/* Progress Bar */}
                {showProgress && progressStyle !== 'none' && (
                    <div className={`rpg-stat-progress rpg-stat-progress-${progressStyle}`}>
                        {progressStyle === 'segments' && (
                            renderProgressSegments(value, segmentCount, color, progressStyle)
                        )}
                        {progressStyle === 'fill' && (
                            <div className="rpg-stat-progress-fill-container">
                                <div
                                    className="rpg-stat-progress-fill"
                                    style={{
                                        width: `${value}%`,
                                        backgroundColor: color,
                                    }}
                                />
                            </div>
                        )}
                        {progressStyle === 'glow' && (
                            <div className="rpg-stat-progress-glow-container">
                                <div
                                    className="rpg-stat-progress-glow"
                                    style={{
                                        width: `${value}%`,
                                        backgroundColor: color,
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )}
                
                {/* Value */}
                {showValue && (
                    <div className="rpg-stat-value">
                        {displayValue}
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * StatCard Compact - smaller version for summaries
 */
export function StatCardCompact({
    label,
    value,
    icon,
    statType = 'custom',
    customColor,
    className = '',
}: {
    label: string;
    value: number;
    icon?: string;
    statType?: StatCardProps['statType'];
    customColor?: string;
    className?: string;
}): ReactElement {
    const color = customColor || getStatColor(statType);
    const displayIcon = icon || getDefaultIcon(statType);
    
    return (
        <div
            className={`rpg-stat-card-compact ${className}`}
            style={{ '--stat-color': color } as React.CSSProperties}
            title={`${label}: ${value}%`}
        >
            <span className="rpg-stat-compact-icon">{displayIcon}</span>
            <span className="rpg-stat-compact-value">{value}</span>
        </div>
    );
}

/**
 * StatRow - horizontal row of stat cards
 */
export function StatCardRow({
    stats,
    layout = 'horizontal',
    className = '',
}: {
    stats: Array<{
        label: string;
        value: number;
        icon?: string;
        statType?: StatCardProps['statType'];
        customColor?: string;
    }>;
    layout?: 'horizontal' | 'vertical';
    className?: string;
}): ReactElement {
    return (
        <div className={`rpg-stat-row ${layout} ${className}`}>
            {stats.map((stat, index) => (
                <StatCard
                    key={stat.label.toLowerCase().replace(/\s+/g, '-') || index}
                    label={stat.label}
                    value={stat.value}
                    icon={stat.icon}
                    statType={stat.statType}
                    customColor={stat.customColor}
                    showValue={layout === 'vertical'}
                    progressStyle={layout === 'vertical' ? 'fill' : 'segments'}
                    segmentCount={5}
                />
            ))}
        </div>
    );
}

export default StatCard;