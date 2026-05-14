/**
 * Eros Status - SlideOutPanel Component
 * Detail panel that slides out from the right
 * Phase 1 - Core UI Components
 */

import { ReactElement, useState, useEffect, useCallback } from 'react';

export interface SlideOutPanelProps {
    /** Whether the panel is open */
    isOpen: boolean;
    /** Callback when panel closes */
    onClose?: () => void;
    /** Panel width in percentage (default 70%) */
    width?: number;
    /** Summary area width in percentage (default 30%) */
    summaryWidth?: number;
    /** Animation duration in ms */
    animationDuration?: number;
    /** Panel title */
    title?: string;
    /** Additional header content */
    headerContent?: React.ReactNode;
    /** Main panel content */
    children: React.ReactNode;
    /** Summary/compact content (always visible) */
    summaryContent?: React.ReactNode;
    /** Show close button */
    showCloseButton?: boolean;
    /** Close on overlay click */
    closeOnOverlayClick?: boolean;
    /** Close on escape key */
    closeOnEscape?: boolean;
    /** Additional CSS class names */
    className?: string;
}

/**
 * SlideOutPanel Component
 * A panel that slides out from the right, with a summary area remaining visible
 */
export function SlideOutPanel({
    isOpen,
    onClose,
    width = 70,
    summaryWidth = 30,
    animationDuration = 250,
    title = 'Details',
    headerContent,
    children,
    summaryContent,
    showCloseButton = true,
    closeOnOverlayClick = true,
    closeOnEscape = true,
    className = '',
}: SlideOutPanelProps): ReactElement {
    const [isAnimating, setIsAnimating] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Handle animation states
    useEffect(() => {
        if (isOpen && !isVisible) {
            setIsAnimating(true);
            setIsVisible(true);
        } else if (!isOpen && isVisible) {
            setIsAnimating(true);
            // Delay actual visibility change until animation completes
            const timer = setTimeout(() => {
                setIsVisible(false);
                setIsAnimating(false);
            }, animationDuration);
            return () => clearTimeout(timer);
        }
    }, [isOpen, isVisible, animationDuration]);

    // Handle escape key
    useEffect(() => {
        if (!closeOnEscape || !isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && onClose) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [closeOnEscape, isOpen, onClose]);

    // Prevent body scroll when panel is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleOverlayClick = useCallback(() => {
        if (closeOnOverlayClick && onClose) {
            onClose();
        }
    }, [closeOnOverlayClick, onClose]);

    const handleClose = useCallback(() => {
        if (onClose) {
            onClose();
        }
    }, [onClose]);

    const panelStyle: React.CSSProperties = {
        '--panel-width': `${width}%`,
        '--summary-width': `${summaryWidth}%`,
        '--animation-duration': `${animationDuration}ms`,
    } as React.CSSProperties;

    return (
        <div
            className={`eros-slideout-container ${isOpen ? 'open' : ''} ${className}`}
            style={panelStyle}
        >
            {/* Overlay */}
            {isOpen && (
                <div
                    className={`eros-slideout-overlay ${isAnimating ? 'animating' : ''}`}
                    onClick={handleOverlayClick}
                    role="presentation"
                />
            )}

            {/* Summary Area (Always visible) */}
            <div className="eros-slideout-summary">
                {summaryContent || (
                    <div className="eros-slideout-summary-default">
                        <span className="eros-summary-placeholder">Summary</span>
                    </div>
                )}
            </div>

            {/* Main Panel */}
            <div
                className={`eros-slideout-panel ${isOpen ? 'open' : ''} ${isAnimating ? 'animating' : ''}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="slideout-title"
            >
                {/* Panel Header */}
                <div className="eros-slideout-header">
                    <h2 id="slideout-title" className="eros-slideout-title">
                        {title}
                    </h2>
                    <div className="eros-slideout-header-content">
                        {headerContent}
                    </div>
                    {showCloseButton && (
                        <button
                            className="eros-slideout-close"
                            onClick={handleClose}
                            aria-label="Close panel"
                            type="button"
                        >
                            ×
                        </button>
                    )}
                </div>

                {/* Panel Content */}
                <div className="eros-slideout-content">
                    {children}
                </div>
            </div>
        </div>
    );
}

/**
 * SlideOutPanel Section - for organizing content within the panel
 */
export function SlideOutPanelSection({
    title,
    children,
    className = '',
}: {
    title: string;
    children: React.ReactNode;
    className?: string;
}): ReactElement {
    return (
        <div className={`eros-slideout-section ${className}`}>
            <h3 className="eros-slideout-section-title">{title}</h3>
            <div className="eros-slideout-section-content">
                {children}
            </div>
        </div>
    );
}

/**
 * SlideOutPanel Divider - visual separator
 */
export function SlideOutPanelDivider(): ReactElement {
    return <div className="eros-slideout-divider" />;
}

export default SlideOutPanel;