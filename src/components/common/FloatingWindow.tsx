/**
 * Eros Status - FloatingWindow Component
 * Game-like floating window container with title bar and controls
 * Phase 3 - Game-like UI (replaces terminal frames)
 */

import { ReactElement, ReactNode, useState, useRef, useCallback } from 'react';

export interface FloatingWindowProps {
    /** Window content */
    children: ReactNode;
    /** Window title */
    title?: string;
    /** Title icon */
    icon?: string;
    /** Window variant (affects accent color) */
    variant?: 'default' | 'affection' | 'obedience' | 'libido' | 'arousal' | 'scene' | 'inventory';
    /** Show minimize button */
    showMinimize?: boolean;
    /** Show maximize button */
    showMaximize?: boolean;
    /** Show close button */
    showClose?: boolean;
    /** Initial collapsed state */
    collapsed?: boolean;
    /** Custom width */
    width?: number | string;
    /** Custom height */
    height?: number | string;
    /** Minimum width */
    minWidth?: number;
    /** Minimum height */
    minHeight?: number;
    /** Enable drag (optional feature) */
    draggable?: boolean;
    /** Initial position (x, y) */
    initialPosition?: { x: number; y: number };
    /** Callback when close is clicked */
    onClose?: () => void;
    /** Callback when minimize is clicked */
    onMinimize?: () => void;
    /** Callback when maximize is clicked */
    onMaximize?: () => void;
    /** Footer content */
    footer?: ReactNode;
    /** Additional CSS class names */
    className?: string;
}

/**
 * Get variant accent color
 */
function getVariantAccent(variant: FloatingWindowProps['variant']): string {
    const accents: Record<string, string> = {
        default: 'var(--eros-highlight)',
        affection: 'var(--eros-affection)',
        obedience: 'var(--eros-obedience)',
        libido: 'var(--eros-libido)',
        arousal: 'var(--eros-arousal)',
        scene: 'var(--eros-interactive)',
        inventory: 'var(--eros-time)',
    };
    return accents[variant || 'default'] || accents.default;
}

/**
 * FloatingWindow Component
 * A draggable floating window with title bar, controls, and content area
 * Inspired by SillyTavern RPG Companion game-like UI
 */
export function FloatingWindow({
    children,
    title = 'Window',
    icon = '📦',
    variant = 'default',
    showMinimize = true,
    showMaximize = true,
    showClose = true,
    collapsed = false,
    width = 'auto',
    height = 'auto',
    minWidth = 200,
    minHeight = 100,
    draggable = false,
    initialPosition,
    onClose,
    onMinimize,
    onMaximize,
    footer,
    className = '',
}: FloatingWindowProps): ReactElement {
    const [isCollapsed, setIsCollapsed] = useState(collapsed);
    const [position, setPosition] = useState(initialPosition || { x: 20, y: 20 });
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    // Handle collapse toggle
    const handleToggleCollapse = useCallback(() => {
        setIsCollapsed((prev) => !prev);
    }, []);

    // Handle drag start
    const handleDragStart = useCallback((e: React.MouseEvent) => {
        if (!draggable) return;
        
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        dragOffset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
        setIsDragging(true);
    }, [draggable]);

    // Handle drag move
    const handleDragMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !draggable) return;
        
        setPosition({
            x: e.clientX - dragOffset.current.x,
            y: e.clientY - dragOffset.current.y,
        });
    }, [isDragging, draggable]);

    // Handle drag end
    const handleDragEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Add/remove global drag listeners
    useState(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleDragMove);
            document.addEventListener('mouseup', handleDragEnd);
            return () => {
                document.removeEventListener('mousemove', handleDragMove);
                document.removeEventListener('mouseup', handleDragEnd);
            };
        }
    });

    const accentColor = getVariantAccent(variant);

    return (
        <div
            className={`rpg-floating-window ${isCollapsed ? 'collapsed' : ''} ${isDragging ? 'dragging' : ''} ${className}`}
            style={{
                '--rpg-accent': accentColor,
                '--rpg-window-width': typeof width === 'number' ? `${width}px` : width,
                '--rpg-window-height': typeof height === 'number' ? `${height}px` : height,
                '--rpg-min-width': `${minWidth}px`,
                '--rpg-min-height': `${minHeight}px`,
                left: draggable ? `${position.x}px` : undefined,
                top: draggable ? `${position.y}px` : undefined,
            } as React.CSSProperties}
        >
            {/* Title Bar */}
            <div
                className="rpg-window-title-bar"
                onMouseDown={handleDragStart}
                role="banner"
            >
                <div className="rpg-window-title">
                    <span className="rpg-window-icon">{icon}</span>
                    <span className="rpg-window-title-text">{title}</span>
                </div>
                
                <div className="rpg-window-controls">
                    {showMinimize && (
                        <button
                            className="rpg-window-btn rpg-window-btn-minimize"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleToggleCollapse();
                                onMinimize?.();
                            }}
                            type="button"
                            aria-label={isCollapsed ? 'Expand' : 'Minimize'}
                        >
                            <span className="rpg-window-btn-icon">
                                {isCollapsed ? '▼' : '─'}
                            </span>
                        </button>
                    )}
                    
                    {showMaximize && (
                        <button
                            className="rpg-window-btn rpg-window-btn-maximize"
                            onClick={(e) => {
                                e.stopPropagation();
                                onMaximize?.();
                            }}
                            type="button"
                            aria-label="Maximize"
                        >
                            <span className="rpg-window-btn-icon">□</span>
                        </button>
                    )}
                    
                    {showClose && (
                        <button
                            className="rpg-window-btn rpg-window-btn-close"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose?.();
                            }}
                            type="button"
                            aria-label="Close"
                        >
                            <span className="rpg-window-btn-icon">×</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Window Content */}
            {!isCollapsed && (
                <>
                    <div className="rpg-window-content">
                        {children}
                    </div>

                    {/* Window Footer */}
                    {footer && (
                        <div className="rpg-window-footer">
                            {footer}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

/**
 * FloatingWindow Inline (simpler version without full frame)
 */
export function FloatingWindowInline({
    children,
    className = '',
}: {
    children: ReactNode;
    className?: string;
}): ReactElement {
    return (
        <div className={`rpg-floating-inline ${className}`}>
            {children}
        </div>
    );
}

export default FloatingWindow;