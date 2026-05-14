/**
 * Eros Status - ExplanationField Component
 * Field 2: Explanation - Narrative text explaining WHY
 * Phase 3.1 - Enhanced Category Detail Views
 */

import { ReactElement } from 'react';
import { ExplanationText } from '../../types/eros-status';

export interface ExplanationFieldProps {
    /** Explanation text data */
    explanation: ExplanationText;
    /** Maximum length for truncation */
    maxLength?: number;
    /** Show related events */
    showRelatedEvents?: boolean;
    /** Expandable for long text */
    expandable?: boolean;
    /** Additional CSS class names */
    className?: string;
}

/**
 * Get source label and color
 */
function getSourceInfo(source: 'ai' | 'user' | 'system'): {
    label: string;
    color: string;
    icon: string;
} {
    const sourceMap = {
        ai: { label: 'AI Generated', color: '#8b5cf6', icon: '🤖' },
        user: { label: 'Manual', color: '#3b82f6', icon: '👤' },
        system: { label: 'System', color: '#6b7280', icon: '⚙️' },
    };
    return sourceMap[source];
}

/**
 * Get confidence level label and color
 */
function getConfidenceInfo(confidence: number): {
    label: string;
    color: string;
    percentage: string;
} {
    if (confidence >= 0.8) {
        return { label: 'High', color: '#22c55e', percentage: `${Math.round(confidence * 100)}%` };
    }
    if (confidence >= 0.5) {
        return { label: 'Medium', color: '#f59e0b', percentage: `${Math.round(confidence * 100)}%` };
    }
    return { label: 'Low', color: '#ef4444', percentage: `${Math.round(confidence * 100)}%` };
}

/**
 * Format context turn for display
 */
function formatContextTurn(turn: number): string {
    if (turn === 0) return 'Initial';
    return `Turn ${turn}`;
}

/**
 * Truncate text with ellipsis
 */
function truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
}

/**
 * ExplanationField Component
 * Displays narrative explanation with source and confidence indicators
 */
export function ExplanationField({
    explanation,
    maxLength = 200,
    showRelatedEvents = true,
    expandable = true,
    className = '',
}: ExplanationFieldProps): ReactElement {
    const { content, source, contextTurn, confidence, relatedEvents } = explanation;
    const sourceInfo = getSourceInfo(source);
    const confidenceInfo = getConfidenceInfo(confidence);
    const isLongText = content.length > maxLength;

    return (
        <div className={`eros-explanation-field ${className}`}>
            <div className="eros-explanation-header">
                <span className="eros-explanation-icon">📝</span>
                <span className="eros-explanation-title">Explanation</span>
            </div>

            <div className="eros-explanation-content">
                {expandable && isLongText ? (
                    <details className="eros-explanation-details">
                        <summary className="eros-explanation-summary">
                            {truncateText(content, maxLength)}
                            <span className="eros-explanation-expand-hint">Click to expand</span>
                        </summary>
                        <p className="eros-explanation-full-text">{content}</p>
                    </details>
                ) : (
                    <p className="eros-explanation-text">{content}</p>
                )}
            </div>

            <div className="eros-explanation-metadata">
                <div className="eros-explanation-source">
                    <span className="metadata-icon">{sourceInfo.icon}</span>
                    <span
                        className="metadata-label"
                        style={{ color: sourceInfo.color }}
                    >
                        {sourceInfo.label}
                    </span>
                </div>

                <div className="eros-explanation-confidence">
                    <span className="metadata-icon">🎯</span>
                    <span
                        className="metadata-label"
                        style={{ color: confidenceInfo.color }}
                    >
                        {confidenceInfo.label}
                    </span>
                    <span className="metadata-value">
                        ({confidenceInfo.percentage})
                    </span>
                </div>

                <div className="eros-explanation-turn">
                    <span className="metadata-icon">📅</span>
                    <span className="metadata-value">
                        {formatContextTurn(contextTurn)}
                    </span>
                </div>
            </div>

            {showRelatedEvents && relatedEvents && relatedEvents.length > 0 && (
                <div className="eros-explanation-events">
                    <span className="eros-events-label">Related Events:</span>
                    <ul className="eros-events-list">
                        {relatedEvents.slice(0, 3).map((event, index) => (
                            <li key={index} className="eros-event-item">
                                {event}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default ExplanationField;