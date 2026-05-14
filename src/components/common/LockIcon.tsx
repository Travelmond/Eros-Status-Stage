/**
 * Eros Status - LockIcon Component
 * Small animated icon showing lock state
 * Phase 4.1 - Per-stat lock functionality
 */

import { ReactElement, useMemo } from 'react';

export interface LockIconProps {
    /** Whether the stat is locked */
    isLocked: boolean;
    /** Size variant */
    size?: 'xs' | 'sm' | 'md';
    /** Show animation */
    animated?: boolean;
    /** Additional CSS class */
    className?: string;
}

/**
 * LockIcon Component
 * Small icon indicating lock state with optional animation
 */
export function LockIcon({
    isLocked,
    size = 'sm',
    animated = true,
    className = '',
}: LockIconProps): ReactElement {
    // Determine size class
    const sizeClass = useMemo(() => {
        switch (size) {
            case 'xs':
                return 'lock-icon-xs';
            case 'md':
                return 'lock-icon-md';
            case 'sm':
            default:
                return 'lock-icon-sm';
        }
    }, [size]);

    return (
        <span
            className={`lock-icon ${sizeClass} ${isLocked ? 'locked' : 'unlocked'} ${animated ? 'animated' : ''} ${className}`}
            role="img"
            aria-label={isLocked ? 'Stat is locked' : 'Stat is unlocked'}
            title={isLocked ? 'Locked - AI cannot change this value' : 'Unlocked - AI can modify this value'}
        >
            {isLocked ? (
                <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="lock-icon-svg"
                >
                    <path
                        d="M12 15V17M6 10V8C6 4.68629 8.68629 2 12 2C15.3137 2 18 4.68629 18 8V10H6ZM6 10H4C3.44772 10 3 10.4477 3 11V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V11C21 10.4477 20.5523 10 20 10H18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ) : (
                <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="lock-icon-svg"
                >
                    <path
                        d="M12 15V17M6 10V8C6 4.68629 8.68629 2 12 2C15.3137 2 18 4.68629 18 8V10M6 10H18M6 10H4C3.44772 10 3 10.4477 3 11V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V11C21 10.4477 20.5523 10 20 10H18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            )}
        </span>
    );
}

export default LockIcon;