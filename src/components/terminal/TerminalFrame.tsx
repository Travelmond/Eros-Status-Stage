/**
 * Eros Status - TerminalFrame Component
 * Box character frame terminal container
 * Phase 2.3 - Terminal Frame
 */

import { ReactElement, ReactNode } from 'react';

export interface TerminalFrameProps {
    /** Terminal content */
    children: ReactNode;
    /** Terminal title/header */
    title?: string;
    /** Title icon */
    icon?: string;
    /** Terminal variant style */
    variant?: 'default' | 'classic' | 'amber' | 'cyber' | 'inverted';
    /** Display size */
    size?: 'sm' | 'md' | 'lg';
    /** Show window controls (close, minimize, maximize buttons) */
    showControls?: boolean;
    /** Footer content */
    footer?: ReactNode;
    /** Additional CSS class names */
    className?: string;
}

/**
 * Box character dimensions for different sizes
 */
const BOX_DIMENSIONS = {
    sm: { width: 40, charWidth: 40 },
    md: { width: 50, charWidth: 50 },
    lg: { width: 60, charWidth: 60 },
};

/**
 * Generate top border string
 */
function generateTopBorder(width: number): string {
    return '╔' + '═'.repeat(width - 2) + '╗';
}

/**
 * Generate bottom border string
 */
function generateBottomBorder(width: number): string {
    return '╚' + '═'.repeat(width - 2) + '╝';
}

/**
 * Generate side borders for content lines
 */
function generateSideBorder(): string {
    return '║';
}

/**
 * TerminalFrame Component
 * Provides a retro terminal-style box frame with box drawing characters
 */
export function TerminalFrame({
    children,
    title = 'EROS STATUS',
    icon = '📟',
    variant = 'default',
    size = 'md',
    showControls = true,
    footer,
    className = '',
}: TerminalFrameProps): ReactElement {
    const boxConfig = BOX_DIMENSIONS[size];
    const topBorder = generateTopBorder(boxConfig.width);
    const bottomBorder = generateBottomBorder(boxConfig.width);

    // Determine variant class
    const variantClass = variant !== 'default'
        ? `eros-terminal-${variant}`
        : '';

    return (
        <div className={`eros-terminal-frame-container ${variantClass} ${className}`}>
            {/* Top border */}
            <div className="eros-terminal-border-top" role="presentation">
                {topBorder}
            </div>

            {/* Main content area */}
            <div className="eros-terminal-body">
                {/* Side border left */}
                <span className="eros-terminal-side" role="presentation">
                    {generateSideBorder()}
                </span>

                {/* Inner content */}
                <div className="eros-terminal-inner">
                    {/* Header */}
                    <div className="eros-terminal-header-custom">
                        <div className="eros-terminal-title-area">
                            <span className="eros-terminal-title-icon">{icon}</span>
                            <span className="eros-terminal-title-text">{title}</span>
                        </div>

                        {showControls && (
                            <div className="eros-terminal-controls-custom">
                                <button
                                    className="eros-terminal-btn-custom eros-terminal-btn-min"
                                    type="button"
                                    aria-label="Minimize"
                                />
                                <button
                                    className="eros-terminal-btn-custom eros-terminal-btn-max"
                                    type="button"
                                    aria-label="Maximize"
                                />
                                <button
                                    className="eros-terminal-btn-custom eros-terminal-btn-close"
                                    type="button"
                                    aria-label="Close"
                                />
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="eros-terminal-divider-custom" role="presentation">
                        {'─'.repeat(boxConfig.charWidth - 4)}
                    </div>

                    {/* Content */}
                    <div className="eros-terminal-content-custom">
                        {children}
                    </div>

                    {/* Footer */}
                    {footer && (
                        <>
                            <div className="eros-terminal-divider-custom" role="presentation">
                                {'─'.repeat(boxConfig.charWidth - 4)}
                            </div>
                            <div className="eros-terminal-footer-custom">
                                {footer}
                            </div>
                        </>
                    )}
                </div>

                {/* Side border right */}
                <span className="eros-terminal-side" role="presentation">
                    {generateSideBorder()}
                </span>
            </div>

            {/* Bottom border */}
            <div className="eros-terminal-border-bottom" role="presentation">
                {bottomBorder}
            </div>
        </div>
    );
}

/**
 * Simple inline terminal frame (without full borders)
 */
export function TerminalFrameInline({
    children,
    className = '',
}: {
    children: ReactNode;
    className?: string;
}): ReactElement {
    return (
        <div className={`eros-terminal-inline-frame ${className}`}>
            <span className="eros-terminal-inline-prompt">&gt;</span>
            <span className="eros-terminal-inline-content">{children}</span>
        </div>
    );
}

export default TerminalFrame;