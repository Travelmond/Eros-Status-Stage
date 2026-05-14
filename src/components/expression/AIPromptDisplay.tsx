/**
 * Eros Status - AIPromptDisplay Component
 * Displays auto-generated AI prompt with copy and expand functionality
 * Phase 3.3 - Expression/Pose Section
 */

import { ReactElement, memo, useState, useCallback } from 'react';

export interface AIPromptDisplayProps {
    /** The AI prompt text */
    prompt: string;
    /** Number of tags in the prompt */
    tagCount?: number;
    /** Whether the prompt is loading */
    isLoading?: boolean;
    /** Callback when tags are viewed */
    onViewTags?: () => void;
    /** Additional CSS class names */
    className?: string;
}

/**
 * Truncate prompt for display
 */
function truncatePrompt(prompt: string, maxLength: number = 150): string {
    if (prompt.length <= maxLength) return prompt;
    return prompt.substring(0, maxLength) + '...';
}

/**
 * Copy text to clipboard
 */
async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch {
            document.body.removeChild(textArea);
            return false;
        }
    }
}

/**
 * AIPromptDisplay Component
 * Shows AI-generated prompt with copy and expand functionality
 */
export function AIPromptDisplay({
    prompt,
    tagCount = 0,
    isLoading = false,
    onViewTags,
    className = ''
}: AIPromptDisplayProps): ReactElement {
    const [isExpanded, setIsExpanded] = useState(false);
    const [copied, setCopied] = useState(false);
    const [copyFailed, setCopyFailed] = useState(false);

    const handleCopy = useCallback(async () => {
        const success = await copyToClipboard(prompt);
        if (success) {
            setCopied(true);
            setCopyFailed(false);
            setTimeout(() => setCopied(false), 2000);
        } else {
            setCopyFailed(true);
            setTimeout(() => setCopyFailed(false), 2000);
        }
    }, [prompt]);

    const toggleExpand = useCallback(() => {
        setIsExpanded(prev => !prev);
    }, []);

    const handleViewTags = useCallback(() => {
        onViewTags?.();
    }, [onViewTags]);

    if (isLoading) {
        return (
            <div className={`ai-prompt-display loading ${className}`}>
                <div className="prompt-header">
                    <span className="prompt-label">AI Prompt</span>
                </div>
                <div className="prompt-loading">
                    <div className="loading-spinner" />
                    <span>Generating prompt...</span>
                </div>
            </div>
        );
    }

    if (!prompt) {
        return (
            <div className={`ai-prompt-display empty ${className}`}>
                <div className="prompt-header">
                    <span className="prompt-label">AI Prompt</span>
                </div>
                <div className="prompt-empty">
                    <span className="empty-icon">🎨</span>
                    <span className="empty-message">No prompt generated yet</span>
                </div>
            </div>
        );
    }

    const displayPrompt = isExpanded ? prompt : truncatePrompt(prompt);
    const hasMoreContent = prompt.length > 150;

    return (
        <div className={`ai-prompt-display ${className}`}>
            {/* Header */}
            <div className="prompt-header">
                <span className="prompt-label">AI Prompt</span>
                {tagCount > 0 && (
                    <span className="tag-count">{tagCount} tags</span>
                )}
            </div>

            {/* Prompt Content */}
            <div className="prompt-content">
                <pre className="prompt-text">{displayPrompt}</pre>

                {/* Expand/Collapse Button */}
                {hasMoreContent && (
                    <button
                        className="expand-button"
                        onClick={toggleExpand}
                        type="button"
                        aria-expanded={isExpanded}
                    >
                        {isExpanded ? 'Show less' : 'Show more'}
                    </button>
                )}
            </div>

            {/* Actions */}
            <div className="prompt-actions">
                {/* Copy Button */}
                <button
                    className={`action-button copy-button ${copied ? 'success' : ''}`}
                    onClick={handleCopy}
                    type="button"
                    title={copied ? 'Copied!' : 'Copy to clipboard'}
                >
                    {copied ? (
                        <>
                            <span className="action-icon">✓</span>
                            <span>Copied</span>
                        </>
                    ) : copyFailed ? (
                        <>
                            <span className="action-icon">✗</span>
                            <span>Failed</span>
                        </>
                    ) : (
                        <>
                            <span className="action-icon">📋</span>
                            <span>Copy</span>
                        </>
                    )}
                </button>

                {/* View Tags Button */}
                {onViewTags && (
                    <button
                        className="action-button view-tags-button"
                        onClick={handleViewTags}
                        type="button"
                    >
                        <span className="action-icon">🏷️</span>
                        <span>View Tags</span>
                    </button>
                )}
            </div>
        </div>
    );
}

/**
 * AIPromptDisplay Skeleton - Loading state
 */
export function AIPromptDisplaySkeleton({
    className = ''
}: {
    className?: string;
}): ReactElement {
    return (
        <div className={`ai-prompt-display-skeleton ${className}`}>
            <div className="skeleton-header" />
            <div className="skeleton-prompt" />
            <div className="skeleton-actions">
                <div className="skeleton-button" />
                <div className="skeleton-button" />
            </div>
        </div>
    );
}

export default AIPromptDisplay;