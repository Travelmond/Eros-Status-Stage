/**
 * Eros Status - ProgressBar Component
 * Reusable progress bar with multiple display styles
 * Phase 1 - Core UI Components + Phase 2 Enhanced Emoji Styling
 * Phase 4.1 - Added lock functionality
 */

import { ReactElement, Fragment, useCallback } from 'react';
import { ProgressBarStyle } from '../../types/eros-status';
import { LockToggle } from '../common/LockToggle';

/**
 * Extended progress bar style types for Phase 2 emoji enhancements
 */
export type EmojiProgressStyle = 
    | 'emoji-hearts'      // ❤️ full, 🤍 empty - for affection/love
    | 'emoji-fire'        // 🔥 full, 🧊 empty - for libido/arousal
    | 'emoji-star'        // ⭐ full, ☆ empty - for trust/obedience
    | 'emoji-check'       // ✅ full, ⭕ empty - for completion
    | 'percentage'        // Numeric display "75%"
    | 'bar';              // CSS bar style

export interface ProgressBarProps {
    /** Current value (0-100) */
    value: number;
    /** Display label */
    label?: string;
    /** Icon to display next to label */
    icon?: string;
    /** Progress bar style variant (legacy enum or new string types) */
    style?: ProgressBarStyle | EmojiProgressStyle;
    /** Status type for color theming (affection, arousal, etc.) */
    status?: 'affection' | 'obedience' | 'libido' | 'arousal' | 'location' | 'time' | 'trust' | 'corruption' | 'submission' | 'jealousy' | 'embarrassment' | 'fatigue' | 'happiness';
    /** Size variant */
    size?: 'sm' | 'md' | 'lg' | 'xl';
    /** Show percentage text */
    showPercentage?: boolean;
    /** Animation enabled */
    animated?: boolean;
    /** Number of emoji items to display (default 5 for hearts/stars, 10 for fire) */
    emojiCount?: number;
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
 * Get Unicode block characters based on value
 */
function getUnicodeBlocks(value: number, filled: boolean): string {
    const blocks = filled ? '█' : '░';
    const count = Math.max(1, Math.round(value / 10));
    return blocks.repeat(count);
}

/**
 * Phase 2: Emoji configurations for React-mapped rendering
 */
interface EmojiConfig {
    filledEmoji: string;
    emptyEmoji: string;
    count: number;
}

// Emoji style configurations
const EMOJI_CONFIGS: Record<string, EmojiConfig> = {
    'emoji-hearts': {
        filledEmoji: '❤️',  // Red heart
        emptyEmoji: '🤍',  // White heart
        count: 5,          // 5 hearts = 100%
    },
    'emoji-fire': {
        filledEmoji: '🔥',  // Fire
        emptyEmoji: '🧊',  // Ice
        count: 10,         // 10 flames = 100%
    },
    'emoji-star': {
        filledEmoji: '⭐',  // Gold star
        emptyEmoji: '☆',    // White star
        count: 5,          // 5 stars = 100%
    },
    'emoji-check': {
        filledEmoji: '✅',  // Green check
        emptyEmoji: '⭕',  // Red circle
        count: 5,          // 5 checks = 100%
    },
};

/**
 * Get emoji character based on status type (legacy)
 */
function getEmojiCharacter(status?: string): { filled: string; empty: string } {
    const emojiMap: Record<string, { filled: string; empty: string }> = {
        affection: { filled: '❤️', empty: '🖤' },
        obedience: { filled: '💚', empty: '🤍' },
        libido: { filled: '🔥', empty: '🖤' },
        arousal: { filled: '💋', empty: '🖤' },
        trust: { filled: '💙', empty: '🖤' },
        corruption: { filled: '💜', empty: '🤍' },
        submission: { filled: '🔒', empty: '🔓' },
        location: { filled: '📍', empty: '📍' },
        time: { filled: '⏱️', empty: '⏱️' },
    };
    return emojiMap[status || 'affection'] || emojiMap.affection;
}

/**
 * Get appropriate emoji style based on stat type
 */
function getStatEmojiStyle(statType?: string): string {
    const styleMap: Record<string, string> = {
        affection: 'emoji-hearts',
        love: 'emoji-hearts',
        trust: 'emoji-star',
        obedience: 'emoji-star',
        libido: 'emoji-fire',
        arousal: 'emoji-fire',
        corruption: 'emoji-check',
        submission: 'emoji-check',
        happiness: 'emoji-hearts',
        jealousy: 'emoji-fire',
        embarrassment: 'emoji-star',
        fatigue: 'emoji-star',
    };
    return styleMap[statType || ''] || 'emoji-hearts';
}

/**
 * Render emoji progress using React mapping (Phase 2 enhancement)
 * Uses CODE (React) instead of Unicode string repetition
 */
function renderEmojiProgress(
    value: number,
    style: EmojiProgressStyle,
    size: 'sm' | 'md' | 'lg' | 'xl' = 'md'
): ReactElement {
    const config = EMOJI_CONFIGS[style];
    
    // Handle percentage style
    if (style === 'percentage') {
        return (
            <span className={`eros-progress-percentage eros-progress-${size}`}>
                {value}%
            </span>
        );
    }
    
    // Handle bar style (CSS bar)
    if (style === 'bar' || !config) {
        return (
            <div className="eros-progress-bar" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
                <div className="eros-progress-fill" style={{ width: `${value}%` }} />
            </div>
        );
    }
    
    // Calculate filled and empty counts
    const filledCount = Math.round((value / 100) * config.count);
    const emptyCount = config.count - filledCount;
    
    // Size mapping for emoji
    const sizeStyles: Record<string, string> = {
        sm: '1rem',
        md: '1.25rem',
        lg: '1.5rem',
        xl: '2rem',
    };
    
    const emojiSize = sizeStyles[size];
    
    // React mapping - render each emoji individually (NOT Unicode string)
    return (
        <span className={`eros-emoji-progress eros-progress-${style}`}>
            {/* Filled emojis - using React Fragment for mapping */}
            {Array.from({ length: filledCount }).map((_, index) => (
                <span 
                    key={`filled-${index}`} 
                    className="eros-emoji-filled"
                    style={{ fontSize: emojiSize }}
                >
                    {config.filledEmoji}
                </span>
            ))}
            {/* Empty emojis - using React Fragment for mapping */}
            {Array.from({ length: emptyCount }).map((_, index) => (
                <span 
                    key={`empty-${index}`} 
                    className="eros-emoji-empty"
                    style={{ fontSize: emojiSize, opacity: 0.4 }}
                >
                    {config.emptyEmoji}
                </span>
            ))}
        </span>
    );
}

/**
 * Get CSS variable for status color
 */
function getStatusColor(status?: string): string {
    const colorMap: Record<string, string> = {
        affection: 'var(--eros-affection)',
        obedience: 'var(--eros-obedience)',
        libido: 'var(--eros-libido)',
        arousal: 'var(--eros-arousal)',
        location: 'var(--eros-location)',
        time: 'var(--eros-time)',
        trust: 'var(--eros-location)',
        corruption: 'var(--eros-arousal)',
        submission: 'var(--eros-obedience)',
    };
    return colorMap[status || 'affection'] || colorMap.affection;
}

/**
 * Render the appropriate progress bar based on style
 * Phase 2: Enhanced to support emoji styles with React mapping
 */
function renderProgressContent(
    value: number,
    style: ProgressBarStyle | EmojiProgressStyle,
    status?: string,
    size: 'sm' | 'md' | 'lg' | 'xl' = 'md'
): ReactElement {
    const sizeClass = `eros-progress-${size}`;

    // Handle ProgressBarStyle enum values (convert to string-based style)
    if (typeof style !== 'string') {
        // It's the enum
        switch (style) {
            case ProgressBarStyle.EMOJI: {
                const emojiStyle = getStatEmojiStyle(status);
                return renderEmojiProgress(value, emojiStyle as EmojiProgressStyle, size);
            }
            case ProgressBarStyle.UNICODE: {
                const filledBlocks = getUnicodeBlocks(value, true);
                const emptyBlocks = getUnicodeBlocks(100 - value, false);
                const fillColor = getStatusColor(status);
                return (
                    <span className={`eros-progress-unicode ${sizeClass}`} style={{ color: fillColor }}>
                        {filledBlocks}
                        <span style={{ opacity: 0.4 }}>{emptyBlocks}</span>
                    </span>
                );
            }
            case ProgressBarStyle.PERCENTAGE: {
                const fillColor = getStatusColor(status);
                return (
                    <span className={`eros-progress-percentage ${sizeClass}`} style={{ color: fillColor }}>
                        {value}%
                    </span>
                );
            }
            case ProgressBarStyle.BAR:
            case ProgressBarStyle.TEXT:
            default: {
                const fillColor = getStatusColor(status);
                return (
                    <div className="eros-progress-bar" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
                        <div className="eros-progress-fill" style={{ width: `${value}%`, backgroundColor: fillColor }} />
                    </div>
                );
            }
        }
    }

    // Handle string-based styles (Phase 2 emoji styles)
    if (style === 'emoji-hearts' || style === 'emoji-fire' || 
        style === 'emoji-star' || style === 'emoji-check' ||
        style === 'percentage' || style === 'bar') {
        return renderEmojiProgress(value, style, size);
    }
    
    // Handle legacy string 'emoji'
    if (style === 'emoji') {
        const emojiStyle = getStatEmojiStyle(status);
        return renderEmojiProgress(value, emojiStyle as EmojiProgressStyle, size);
    }

    // Default to bar
    const fillColor = getStatusColor(status);
    return (
        <div className="eros-progress-bar" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
            <div className="eros-progress-fill" style={{ width: `${value}%`, backgroundColor: fillColor }} />
        </div>
    );
}

/**
 * ProgressBar Component
 * A versatile progress bar with multiple display styles and color theming
 * Phase 2: Enhanced with emoji styles using React mapping
 * Phase 4.1: Added lock functionality
 */
export function ProgressBar({
    value,
    label,
    icon,
    style = 'emoji-hearts',  // Default to emoji-hearts (Phase 2 default)
    status = 'affection',
    size = 'md',
    showPercentage = true,
    animated = true,
    emojiCount,
    className = '',
    // Lock props
    isLocked = false,
    onLockToggle,
    statKey,
    showLockToggle = false,
}: ProgressBarProps): ReactElement {
    const clampedValue = Math.max(0, Math.min(100, value));
    
    // Handle lock toggle
    const handleLockToggle = useCallback((locked: boolean) => {
        onLockToggle?.(locked);
    }, [onLockToggle]);
    
    // Determine effective style - convert enum to string-based style
    let effectiveStyle: EmojiProgressStyle;
    
    if (typeof style === 'string') {
        // String-based styles (Phase 2)
        if (style === 'emoji-hearts' || style === 'emoji-fire' || 
            style === 'emoji-star' || style === 'emoji-check' ||
            style === 'percentage' || style === 'bar' || style === 'emoji') {
            effectiveStyle = style === 'emoji' ? getStatEmojiStyle(status) as EmojiProgressStyle : style;
        } else {
            // Unknown string, default to emoji based on status
            effectiveStyle = getStatEmojiStyle(status) as EmojiProgressStyle;
        }
    } else {
        // Handle enum (legacy)
        switch (style) {
            case ProgressBarStyle.EMOJI:
                effectiveStyle = getStatEmojiStyle(status) as EmojiProgressStyle;
                break;
            case ProgressBarStyle.BAR:
                effectiveStyle = 'bar';
                break;
            case ProgressBarStyle.PERCENTAGE:
                effectiveStyle = 'percentage';
                break;
            default:
                effectiveStyle = 'bar';
        }
    }

    const styleString = typeof effectiveStyle === 'string' ? effectiveStyle : 'bar';
    const progressClass = `eros-progress eros-progress-${styleString} eros-progress-${status} ${animated ? 'eros-progress-animated' : ''} ${className} ${isLocked ? 'locked-stat' : ''}`;

    return (
        <div className={`eros-stat-row ${isLocked ? 'locked-stat' : ''}`}>
            {(label || icon) && (
                <div className="eros-stat-icon">
                    {icon && <span className="progress-icon">{icon}</span>}
                </div>
            )}
            <div className="eros-stat-content">
                {label && (
                    <div className="eros-progress-label">
                        <span className="eros-progress-label-start">
                            {icon && <span className="eros-progress-icon">{icon}</span>}
                            <span className="eros-progress-text">{label}</span>
                        </span>
                        {showPercentage && styleString !== 'percentage' && (
                            <span className="eros-progress-percent">{clampedValue}%</span>
                        )}
                        {/* Lock Toggle */}
                        {showLockToggle && (
                            <LockToggle
                                isLocked={isLocked}
                                onToggle={handleLockToggle}
                                statKey={statKey}
                                statName={label}
                                size="sm"
                            />
                        )}
                    </div>
                )}
                <div className={progressClass}>
                    {renderProgressContent(clampedValue, effectiveStyle, status, size)}
                </div>
            </div>
        </div>
    );
}

/**
 * Compact Progress Bar - simpler display for inline use
 * Phase 2: Enhanced with React mapping for emoji rendering
 */
export function CompactProgressBar({
    value,
    status = 'affection',
    className = '',
}: {
    value: number;
    status?: 'affection' | 'obedience' | 'libido' | 'arousal' | 'trust' | 'corruption' | 'submission';
    className?: string;
}): ReactElement {
    // Get appropriate emoji style based on status
    const emojiStyle = getStatEmojiStyle(status) as EmojiProgressStyle;
    const config = EMOJI_CONFIGS[emojiStyle] || EMOJI_CONFIGS['emoji-hearts'];
    
    const filledCount = Math.round((value / 100) * config.count);
    const emptyCount = config.count - filledCount;
    const fillColor = getStatusColor(status);

    // React mapping - render each emoji individually instead of Unicode string
    return (
        <span className={`eros-compact-progress ${className}`} style={{ color: fillColor }}>
            {Array.from({ length: filledCount }).map((_, index) => (
                <span key={`filled-${index}`} className="eros-emoji-filled">
                    {config.filledEmoji}
                </span>
            ))}
            {Array.from({ length: emptyCount }).map((_, index) => (
                <span key={`empty-${index}`} className="eros-emoji-empty" style={{ opacity: 0.3 }}>
                    {config.emptyEmoji}
                </span>
            ))}
        </span>
    );
}

export default ProgressBar;