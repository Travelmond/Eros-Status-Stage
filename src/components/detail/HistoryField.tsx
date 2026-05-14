/**
 * Eros Status - HistoryField Component
 * Field 4: History - Last 5 changes with turn numbers
 * Phase 3.1 - Enhanced Category Detail Views
 */

import { ReactElement } from 'react';
import { HistoryChange, ProgressionValues } from '../../types/eros-status';

export interface HistoryFieldProps {
    /** History change data */
    history: HistoryChange[];
    /** Category type for context */
    categoryType?: keyof ProgressionValues;
    /** Maximum number of items to show */
    maxItems?: number;
    /** Show trigger events */
    showTriggers?: boolean;
    /** Clickable to see more details */
    clickable?: boolean;
    /** Callback for click event */
    onItemClick?: (change: HistoryChange, index: number) => void;
    /** Additional CSS class names */
    className?: string;
}

/**
 * Format turn number
 */
function formatTurnNumber(turn: number): string {
    if (turn === 0) return 'Start';
    return `Turn ${turn}`;
}

/**
 * Format change amount with sign
 */
function formatChangeAmount(previous?: number, newValue?: number): string {
    if (previous === undefined || newValue === undefined) return '';
    const diff = newValue - previous;
    if (diff > 0) return `+${diff}`;
    if (diff < 0) return `${diff}`;
    return '0';
}

/**
 * Get change amount color
 */
function getChangeColor(previous?: number, newValue?: number): string {
    if (previous === undefined || newValue === undefined) return '#6b7280';
    const diff = newValue - previous;
    if (diff > 0) return '#22c55e'; // Green
    if (diff < 0) return '#ef4444'; // Red
    return '#6b7280'; // Gray
}

/**
 * Get change icon based on value
 */
function getChangeIcon(previous?: number, newValue?: number): string {
    if (previous === undefined || newValue === undefined) return '📊';
    const diff = newValue - previous;
    if (diff > 0) return '↗️';
    if (diff < 0) return '↘️';
    return '➡️';
}

/**
 * Truncate trigger text
 */
function truncateTrigger(trigger: string, maxLength: number = 40): string {
    if (!trigger || trigger.length <= maxLength) return trigger;
    return trigger.slice(0, maxLength - 3) + '...';
}

/**
 * Format timestamp
 */
function formatTimestamp(timestamp: string): string {
    // If it's a simple turn number stored as string
    const turnMatch = timestamp.match(/^Turn (\d+)$/);
    if (turnMatch) {
        return `Turn ${turnMatch[1]}`;
    }

    // If it's a date string, try to format it
    try {
        const date = new Date(timestamp);
        if (!isNaN(date.getTime())) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    } catch {
        // Fall through to return original
    }

    return timestamp;
}

/**
 * HistoryField Component
 * Shows last N changes with turn numbers and trigger events
 */
export function HistoryField({
    history,
    categoryType,
    maxItems = 5,
    showTriggers = true,
    clickable = true,
    onItemClick,
    className = '',
}: HistoryFieldProps): ReactElement {
    const displayHistory = history.slice(-maxItems).reverse(); // Show newest first

    return (
        <div className={`eros-history-field ${className}`}>
            <div className="eros-history-header">
                <span className="eros-history-icon">📜</span>
                <span className="eros-history-title">History</span>
                <span className="eros-history-count">
                    {history.length} total
                </span>
            </div>

            {displayHistory.length > 0 ? (
                <ul className="eros-history-list">
                    {displayHistory.map((change, index) => {
                        const changeColor = getChangeColor(change.previousValue, change.newValue);
                        const changeAmount = formatChangeAmount(change.previousValue, change.newValue);
                        const changeIcon = getChangeIcon(change.previousValue, change.newValue);

                        return (
                            <li
                                key={change.turnNumber || index}
                                className={`eros-history-item ${clickable ? 'clickable' : ''}`}
                                onClick={() => clickable && onItemClick?.(change, index)}
                                role={clickable ? 'button' : undefined}
                                tabIndex={clickable ? 0 : undefined}
                            >
                                <div className="eros-history-turn">
                                    <span className="turn-icon">📅</span>
                                    <span className="turn-number">
                                        {formatTurnNumber(change.turnNumber)}
                                    </span>
                                </div>

                                <div className="eros-history-change">
                                    <span
                                        className="change-icon"
                                        style={{ color: changeColor }}
                                    >
                                        {changeIcon}
                                    </span>
                                    <span
                                        className="change-amount"
                                        style={{ color: changeColor }}
                                    >
                                        {changeAmount}
                                    </span>
                                    {change.newValue !== undefined && (
                                        <span className="change-value">
                                            ({change.newValue})
                                        </span>
                                    )}
                                </div>

                                {showTriggers && (
                                    <div className="eros-history-trigger">
                                        <span className="trigger-icon">🎯</span>
                                        <span className="trigger-text">
                                            {truncateTrigger(change.triggerEvent)}
                                        </span>
                                    </div>
                                )}

                                <div className="eros-history-timestamp">
                                    <span className="timestamp-text">
                                        {formatTimestamp(change.timestamp)}
                                    </span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <div className="eros-history-empty">
                    <span className="empty-icon">📭</span>
                    <span className="empty-text">No history recorded</span>
                </div>
            )}

            {history.length > maxItems && (
                <div className="eros-history-view-more">
                    <button className="view-more-button">
                        View {history.length - maxItems} more changes
                    </button>
                </div>
            )}
        </div>
    );
}

/**
 * CompactHistoryField - Minimal inline version
 */
export interface CompactHistoryFieldProps {
    /** History changes */
    history: HistoryChange[];
    /** Maximum items to show */
    maxItems?: number;
    /** Additional CSS class names */
    className?: string;
}

export function CompactHistoryField({
    history,
    maxItems = 3,
    className = '',
}: CompactHistoryFieldProps): ReactElement {
    const displayHistory = history.slice(-maxItems).reverse();

    return (
        <div className={`eros-compact-history ${className}`}>
            {displayHistory.map((change, index) => {
                const changeColor = getChangeColor(change.previousValue, change.newValue);
                const changeAmount = formatChangeAmount(change.previousValue, change.newValue);

                return (
                    <div key={change.turnNumber || index} className="eros-compact-history-item">
                        <span className="compact-turn">T{change.turnNumber}</span>
                        <span
                            className="compact-change"
                            style={{ color: changeColor }}
                        >
                            {changeAmount}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

export default HistoryField;