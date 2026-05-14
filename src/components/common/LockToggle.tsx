/**
 * Eros Status - LockToggle Component
 * Toggle button for per-stat lock functionality
 * Phase 4.1 - Prevent AI from overwriting specific values
 */

import { ReactElement, useState, useCallback, useMemo } from 'react';
import { LockIcon } from './LockIcon';

export interface LockToggleProps {
    /** Whether the stat is currently locked */
    isLocked: boolean;
    /** Callback when lock state changes */
    onToggle: (newLocked: boolean) => void;
    /** Stat key for identification */
    statKey?: string;
    /** Stat name for tooltip */
    statName?: string;
    /** Size variant */
    size?: 'sm' | 'md';
    /** Disable interaction */
    disabled?: boolean;
    /** Show label */
    showLabel?: boolean;
    /** Position */
    position?: 'left' | 'right';
    /** Additional CSS class */
    className?: string;
}

/**
 * LockToggle Component
 * Toggle button to lock/unlock a stat from AI modification
 */
export function LockToggle({
    isLocked,
    onToggle,
    statKey,
    statName = 'Stat',
    size = 'md',
    disabled = false,
    showLabel = false,
    position = 'right',
    className = '',
}: LockToggleProps): ReactElement {
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    // Handle toggle click
    const handleClick = useCallback(() => {
        if (!disabled) {
            onToggle(!isLocked);
        }
    }, [disabled, isLocked, onToggle]);

    // Handle keyboard interaction
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (disabled) return;
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onToggle(!isLocked);
            }
        },
        [disabled, isLocked, onToggle]
    );

    // Size class
    const sizeClass = useMemo(() => {
        return size === 'sm' ? 'lock-toggle-sm' : 'lock-toggle-md';
    }, [size]);

    // Tooltip text
    const tooltipText = useMemo(() => {
        const action = isLocked ? 'Unlock' : 'Lock';
        return `${action} ${statName} - Prevent AI from changing this value`;
    }, [isLocked, statName]);

    return (
        <div
            className={`
                lock-toggle-container
                ${position}
                ${className}
            `}
        >
            <button
                type="button"
                className={`
                    lock-toggle
                    ${sizeClass}
                    ${isLocked ? 'locked' : 'unlocked'}
                    ${isHovered ? 'hovered' : ''}
                    ${isPressed ? 'pressed' : ''}
                    ${disabled ? 'disabled' : ''}
                `}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                    setIsHovered(false);
                    setIsPressed(false);
                }}
                onMouseDown={() => !disabled && setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
                disabled={disabled}
                aria-label={tooltipText}
                title={tooltipText}
                role="switch"
                aria-checked={isLocked}
            >
                <LockIcon
                    isLocked={isLocked}
                    size={size === 'sm' ? 'xs' : 'sm'}
                    animated={true}
                />
                {showLabel && (
                    <span className="lock-toggle-label">
                        {isLocked ? 'Locked' : 'Unlock'}
                    </span>
                )}
            </button>

            {/* Tooltip on hover */}
            {isHovered && !disabled && (
                <div className="lock-toggle-tooltip">
                    <span className="tooltip-text">
                        {isLocked
                            ? `🔒 ${statName} is locked - AI cannot modify`
                            : `🔓 Click to lock ${statName}`}
                    </span>
                </div>
            )}
        </div>
    );
}

/**
 * LockToggleGroup - Multiple lock toggles for stat groups
 */
export function LockToggleGroup({
    locks,
    onToggle,
    statLabels,
    disabled = false,
    className = '',
}: {
    /** Record of stat locks { statKey: isLocked } */
    locks: Record<string, boolean>;
    /** Callback when any lock is toggled */
    onToggle: (statKey: string, isLocked: boolean) => void;
    /** Labels for each stat */
    statLabels: Record<string, string>;
    /** Disable all toggles */
    disabled?: boolean;
    /** Additional CSS class */
    className?: string;
}): ReactElement {
    const statKeys = Object.keys(locks);

    return (
        <div className={`lock-toggle-group ${className}`}>
            {statKeys.map((statKey) => (
                <LockToggle
                    key={statKey}
                    isLocked={locks[statKey] || false}
                    statKey={statKey}
                    statName={statLabels[statKey] || statKey}
                    onToggle={(isLocked) => onToggle(statKey, isLocked)}
                    size="sm"
                    disabled={disabled}
                    showLabel={false}
                />
            ))}
        </div>
    );
}

export default LockToggle;