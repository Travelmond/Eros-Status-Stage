/**
 * Eros Status - ExpressionDisplay Component
 * Displays current expression with description, image placeholder, and intensity
 * Phase 3.3 - Expression/Pose Section
 */

import { ReactElement, memo } from 'react';

export interface ExpressionData {
    /** Expression name (e.g., "HAPPY", "SAD", "AROUSED") */
    name: string;
    /** Expression description */
    description: string;
    /** Expression image URL */
    imageUrl?: string;
    /** Expression pack name */
    expressionPack?: string;
}

export interface ExpressionDisplayProps {
    /** Expression data to display */
    expression: ExpressionData;
    /** Intensity level (0-100) */
    intensity: number;
    /** Whether to show the image */
    showImage?: boolean;
    /** Additional CSS class names */
    className?: string;
}

/**
 * Get intensity label based on value
 */
function getIntensityLabel(intensity: number): string {
    if (intensity < 20) return 'Subtle';
    if (intensity < 40) return 'Mild';
    if (intensity < 60) return 'Moderate';
    if (intensity < 80) return 'Intense';
    return 'Extreme';
}

/**
 * Get intensity color based on value
 */
function getIntensityColor(intensity: number): string {
    if (intensity < 30) return 'var(--eros-success)';
    if (intensity < 60) return 'var(--eros-warning)';
    return 'var(--eros-arousal)';
}

/**
 * Get expression emoji based on name
 */
function getExpressionEmoji(name: string): string {
    const emojiMap: Record<string, string> = {
        HAPPY: '😊',
        SAD: '😢',
        AROUSED: '😏',
        ANGRY: '😠',
        AFRAID: '😨',
        SURPRISED: '😲',
        NEUTRAL: '😐',
        EXCITED: '🤩',
        EMBARRASSED: '😳',
        CONFUSED: '😕',
        THINKING: '🤔',
        LOVING: '🥰',
        HORNY: '🔥',
        PAINED: '😣',
        DETERMINED: '😤',
        TIRED: '😴'
    };
    return emojiMap[name.toUpperCase()] || '😐';
}

/**
 * ExpressionDisplay Component
 * Shows current facial expression with details and intensity
 */
export function ExpressionDisplay({
    expression,
    intensity,
    showImage = true,
    className = ''
}: ExpressionDisplayProps): ReactElement {
    const intensityColor = getIntensityColor(intensity);

    return (
        <div className={`expression-display ${className}`}>
            {/* Header */}
            <div className="expression-display-header">
                <span className="expression-label">Expression</span>
                <span className="expression-pack">{expression.expressionPack || 'Default'}</span>
            </div>

            {/* Main Content */}
            <div className="expression-display-content">
                {/* Expression Image Placeholder */}
                {showImage && (
                    <div className="expression-image-container">
                        {expression.imageUrl ? (
                            <img
                                src={expression.imageUrl}
                                alt={`Expression: ${expression.name}`}
                                className="expression-image"
                            />
                        ) : (
                            <div className="expression-image-placeholder">
                                <span className="expression-emoji">
                                    {getExpressionEmoji(expression.name)}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Expression Details */}
                <div className="expression-details">
                    <h3 className="expression-name">{expression.name}</h3>
                    <p className="expression-description">{expression.description}</p>

                    {/* Intensity Bar */}
                    <div className="expression-intensity">
                        <div className="intensity-header">
                            <span className="intensity-label">Intensity</span>
                            <span
                                className="intensity-value"
                                style={{ color: intensityColor }}
                            >
                                {intensity}%
                            </span>
                        </div>
                        <div className="intensity-bar">
                            <div
                                className="intensity-fill"
                                style={{
                                    width: `${intensity}%`,
                                    backgroundColor: intensityColor
                                }}
                            />
                        </div>
                        <span className="intensity-label-text">
                            {getIntensityLabel(intensity)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * ExpressionDisplay Skeleton - Loading state
 */
export function ExpressionDisplaySkeleton({
    className = ''
}: {
    className?: string;
}): ReactElement {
    return (
        <div className={`expression-display-skeleton ${className}`}>
            <div className="skeleton-header" />
            <div className="skeleton-content">
                <div className="skeleton-image" />
                <div className="skeleton-details">
                    <div className="skeleton-name" />
                    <div className="skeleton-description" />
                    <div className="skeleton-intensity" />
                </div>
            </div>
        </div>
    );
}

export default ExpressionDisplay;