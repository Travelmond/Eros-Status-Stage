/**
 * Eros Status - GamePanel Component
 * Main game-like panel container (replaces TerminalFrame)
 * Phase 3 - Game-like floating panel UI like SillyTavern
 */

import { ReactElement, ReactNode, useState, useCallback } from 'react';

export interface GamePanelProps {
    /** Panel content */
    children: ReactNode;
    /** Panel title */
    title?: string;
    /** Title icon */
    icon?: string;
    /** Panel position on screen */
    position?: 'left' | 'right' | 'center';
    /** Panel width (percentage or px) */
    width?: number | string;
    /** Initial collapsed state */
    collapsed?: boolean;
    /** Collapsible */
    collapsible?: boolean;
    /** Resizable */
    resizable?: boolean;
    /** Minimum width when resizing */
    minWidth?: number;
    /** Maximum width when resizing */
    maxWidth?: number;
    /** Show header */
    showHeader?: boolean;
    /** Custom accent color */
    accentColor?: string;
    /** Callback when collapsed state changes */
    onCollapseChange?: (collapsed: boolean) => void;
    /** Callback when width changes */
    onWidthChange?: (width: number) => void;
    /** Callback when panel is closed */
    onClose?: () => void;
    /** Additional CSS class names */
    className?: string;
}

/**
 * GamePanel Component
 * Fixed position floating panel with game-like styling
 * Inspired by SillyTavern RPG Companion interface
 */
export function GamePanel({
    children,
    title = 'EROS STATUS',
    icon = '🎮',
    position = 'right',
    width = '320px',
    collapsed = false,
    collapsible = true,
    resizable = false,
    minWidth = 240,
    maxWidth = 500,
    showHeader = true,
    accentColor,
    onCollapseChange,
    onWidthChange,
    onClose,
    className = '',
}: GamePanelProps): ReactElement {
    const [isCollapsed, setIsCollapsed] = useState(collapsed);
    const [currentWidth, setCurrentWidth] = useState(
        typeof width === 'number' ? width : parseInt(width as string, 10) || 320
    );
    const [isResizing, setIsResizing] = useState(false);
    const resizeStartX = useState(0)[0];
    const resizeStartWidth = useState(0)[0];

    // Handle collapse toggle
    const handleToggleCollapse = useCallback(() => {
        const newCollapsed = !isCollapsed;
        setIsCollapsed(newCollapsed);
        onCollapseChange?.(newCollapsed);
    }, [isCollapsed, onCollapseChange]);

    // Handle resize start
    const handleResizeStart = useCallback((e: React.MouseEvent) => {
        if (!resizable) return;
        
        e.preventDefault();
        setIsResizing(true);
        
        // Store initial values
        const startX = e.clientX;
        const startWidth = currentWidth;
        
        const handleMouseMove = (moveEvent: MouseEvent) => {
            const delta = position === 'right' || position === 'center'
                ? moveEvent.clientX - startX
                : startX - moveEvent.clientX;
            
            const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + delta));
            setCurrentWidth(newWidth);
            onWidthChange?.(newWidth);
        };
        
        const handleMouseUp = () => {
            setIsResizing(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [resizable, currentWidth, position, minWidth, maxWidth, onWidthChange]);

    // Position classes
    const positionClass = {
        left: 'rpg-panel-left',
        right: 'rpg-panel-right',
        center: 'rpg-panel-center',
    }[position];

    // Custom accent color style
    const accentStyle = accentColor
        ? { '--rpg-accent-color': accentColor } as React.CSSProperties
        : undefined;

    return (
        <div
            className={`rpg-panel-container ${positionClass} ${isCollapsed ? 'collapsed' : ''} ${isResizing ? 'resizing' : ''} ${className}`}
            style={{
                ...accentStyle,
                '--rpg-panel-width': typeof width === 'number' ? `${width}px` : width,
                '--rpg-panel-min-width': `${minWidth}px`,
                '--rpg-panel-max-width': `${maxWidth}px`,
            } as React.CSSProperties}
        >
            {/* Panel Header */}
            {showHeader && (
                <div className="rpg-panel-header">
                    <div className="rpg-panel-header-left">
                        <span className="rpg-panel-icon">{icon}</span>
                        <span className="rpg-panel-title">{title}</span>
                    </div>
                    
                    <div className="rpg-panel-header-right">
                        {collapsible && (
                            <button
                                className="rpg-panel-btn rpg-panel-btn-collapse"
                                onClick={handleToggleCollapse}
                                type="button"
                                aria-label={isCollapsed ? 'Expand panel' : 'Collapse panel'}
                            >
                                <span className="rpg-panel-btn-icon">
                                    {isCollapsed ? '▶' : '◀'}
                                </span>
                            </button>
                        )}
                        
                        {onClose && (
                            <button
                                className="rpg-panel-btn rpg-panel-btn-close"
                                onClick={onClose}
                                type="button"
                                aria-label="Close panel"
                            >
                                <span className="rpg-panel-btn-icon">×</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Panel Content */}
            {!isCollapsed && (
                <>
                    <div className="rpg-panel-content">
                        {children}
                    </div>

                    {/* Resize Handle */}
                    {resizable && (
                        <div
                            className="rpg-panel-resize-handle"
                            onMouseDown={handleResizeStart}
                            role="separator"
                            aria-orientation="vertical"
                            aria-valuenow={currentWidth}
                            aria-valuemin={minWidth}
                            aria-valuemax={maxWidth}
                        />
                    )}
                </>
            )}
        </div>
    );
}

/**
 * GamePanel Section - for grouping content inside a panel
 */
export function GamePanelSection({
    title,
    icon,
    children,
    collapsible = false,
    collapsed = false,
    onToggle,
    className = '',
}: {
    title?: string;
    icon?: string;
    children: ReactNode;
    collapsible?: boolean;
    collapsed?: boolean;
    onToggle?: () => void;
    className?: string;
}): ReactElement {
    return (
        <div className={`rpg-panel-section ${collapsed ? 'collapsed' : ''} ${className}`}>
            {title && (
                <div 
                    className="rpg-panel-section-header"
                    onClick={collapsible ? onToggle : undefined}
                    role={collapsible ? 'button' : undefined}
                    tabIndex={collapsible ? 0 : undefined}
                >
                    {icon && <span className="rpg-panel-section-icon">{icon}</span>}
                    <span className="rpg-panel-section-title">{title}</span>
                    {collapsible && (
                        <span className="rpg-panel-section-toggle">
                            {collapsed ? '▼' : '▲'}
                        </span>
                    )}
                </div>
            )}
            
            {!collapsed && (
                <div className="rpg-panel-section-content">
                    {children}
                </div>
            )}
        </div>
    );
}

export default GamePanel;