/**
 * Eros Status - GenerateImageButton Component
 * Primary action buttons for AI image generation
 * Phase 3.3 - Expression/Pose Section
 */

import { ReactElement, memo, useState, useCallback } from 'react';

export interface GenerateImageButtonProps {
    /** Whether image generation is available */
    isApiAvailable?: boolean;
    /** Whether generation is in progress */
    isGenerating?: boolean;
    /** Progress percentage (0-100) */
    progress?: number;
    /** Callback when Generate Image is clicked */
    onGenerate?: () => void;
    /** Callback when Copy Tags is clicked */
    onCopyTags?: () => void;
    /** Callback when View Tags is clicked */
    onViewTags?: () => void;
    /** Whether tags are available */
    hasTags?: boolean;
    /** Additional CSS class names */
    className?: string;
}

/**
 * Get progress message based on percentage
 */
function getProgressMessage(progress: number): string {
    if (progress < 20) return 'Initializing...';
    if (progress < 40) return 'Generating prompt...';
    if (progress < 60) return 'Creating image...';
    if (progress < 80) return 'Refining...';
    return 'Finalizing...';
}

/**
 * GenerateImageButton Component
 * Provides Generate Image, Copy Tags, and View Tags actions
 */
export function GenerateImageButton({
    isApiAvailable = true,
    isGenerating = false,
    progress = 0,
    onGenerate,
    onCopyTags,
    onViewTags,
    hasTags = true,
    className = ''
}: GenerateImageButtonProps): ReactElement {
    const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');

    const handleGenerate = useCallback(() => {
        if (!isGenerating && isApiAvailable) {
            onGenerate?.();
        }
    }, [isGenerating, isApiAvailable, onGenerate]);

    const handleCopyTags = useCallback(async () => {
        onCopyTags?.();
        // The parent component should handle the actual copy
        // Here we just show feedback after a short delay
        setCopyState('copied');
        setTimeout(() => setCopyState('idle'), 2000);
    }, [onCopyTags]);

    const handleViewTags = useCallback(() => {
        onViewTags?.();
    }, [onViewTags]);

    return (
        <div className={`generate-image-buttons ${className}`}>
            {/* API Not Available Warning */}
            {!isApiAvailable && (
                <div className="api-not-available">
                    <span className="warning-icon">⚠️</span>
                    <span className="warning-text">
                        Image generation API not configured
                    </span>
                </div>
            )}

            {/* Main Generate Button */}
            <button
                className={`generate-button primary ${isGenerating ? 'generating' : ''} ${!isApiAvailable ? 'disabled' : ''}`}
                onClick={handleGenerate}
                type="button"
                disabled={isGenerating || !isApiAvailable}
                aria-busy={isGenerating}
            >
                {isGenerating ? (
                    <>
                        <span className="button-spinner" />
                        <span className="button-progress">{progress}%</span>
                    </>
                ) : (
                    <>
                        <span className="button-icon">🎨</span>
                        <span>Generate Image</span>
                    </>
                )}
            </button>

            {/* Progress Bar (when generating) */}
            {isGenerating && (
                <div className="generate-progress">
                    <div
                        className="generate-progress-fill"
                        style={{ width: `${progress}%` }}
                    />
                    <span className="generate-progress-text">
                        {getProgressMessage(progress)}
                    </span>
                </div>
            )}

            {/* Secondary Actions */}
            <div className="secondary-actions">
                {/* Copy Tags Button */}
                <button
                    className={`generate-button secondary ${copyState === 'copied' ? 'success' : ''}`}
                    onClick={handleCopyTags}
                    type="button"
                    disabled={!hasTags}
                >
                    <span className="button-icon">
                        {copyState === 'copied' ? '✓' : '📋'}
                    </span>
                    <span>
                        {copyState === 'copied' ? 'Copied!' : 'Copy Tags'}
                    </span>
                </button>

                {/* View Tags Button */}
                <button
                    className="generate-button tertiary"
                    onClick={handleViewTags}
                    type="button"
                    disabled={!hasTags}
                >
                    <span className="button-icon">🏷️</span>
                    <span>View Tags</span>
                </button>
            </div>

            {/* Help Text */}
            <p className="button-help-text">
                {isApiAvailable
                    ? 'Generate an AI image based on current expression and pose'
                    : 'Configure API settings to enable image generation'}
            </p>
        </div>
    );
}

/**
 * GenerateImageButton Skeleton - Loading state
 */
export function GenerateImageButtonSkeleton({
    className = ''
}: {
    className?: string;
}): ReactElement {
    return (
        <div className={`generate-image-buttons-skeleton ${className}`}>
            <div className="skeleton-primary-button" />
            <div className="skeleton-secondary-buttons">
                <div className="skeleton-button" />
                <div className="skeleton-button" />
            </div>
            <div className="skeleton-help-text" />
        </div>
    );
}

export default GenerateImageButton;