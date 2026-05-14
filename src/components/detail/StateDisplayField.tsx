/**
 * Eros Status - StateDisplayField Component
 * Field 1: Current State - Shows value, progress bar, stage/trend
 * Phase 3.1 - Enhanced Category Detail Views
 */

import { ReactElement } from 'react';
import {
    StateDisplay,
    TrendDirection,
    ProgressionValues,
} from '../../types/eros-status';
import { ProgressBar } from '../status/ProgressBar';
import type { EmojiProgressStyle } from '../status/ProgressBar';
import { getStatStage, STAT_COLORS } from '../../utils/constants';
import { formatPercentage } from '../../utils/formatters';

export interface StateDisplayFieldProps {
    /** State display data */
    stateDisplay: StateDisplay;
    /** Category type for styling */
    categoryType: keyof ProgressionValues;
    /** Show change indicator */
    showChange?: boolean;
    /** Additional CSS class names */
    className?: string;
}

/**
 * Get trend arrow symbol
 */
function getTrendSymbol(trend: TrendDirection): string {
    switch (trend) {
        case TrendDirection.UP:
            return '↗';
        case TrendDirection.DOWN:
            return '↘';
        case TrendDirection.STABLE:
        default:
            return '→';
    }
}

/**
 * Get trend color
 */
function getTrendColor(trend: TrendDirection): string {
    switch (trend) {
        case TrendDirection.UP:
            return '#22c55e'; // Green
        case TrendDirection.DOWN:
            return '#ef4444'; // Red
        case TrendDirection.STABLE:
        default:
            return '#6b7280'; // Gray
    }
}

/**
 * Get emoji style based on category type
 */
function getEmojiStyle(categoryType: keyof ProgressionValues): EmojiProgressStyle {
    const styleMap: Record<string, EmojiProgressStyle> = {
        affection: 'emoji-hearts',
        trust: 'emoji-star',
        obedience: 'emoji-star',
        libido: 'emoji-fire',
        arousal: 'emoji-fire',
        corruption: 'emoji-check',
        submission: 'emoji-check',
        happiness: 'emoji-hearts',
        jealousy: 'emoji-fire',
        embarrassment: 'emoji-star',
        fatigue: 'emoji-star',
    };
    return styleMap[categoryType] || 'emoji-hearts';
}

/**
 * Get category icon
 */
function getCategoryIcon(categoryType: keyof ProgressionValues): string {
    const iconMap: Record<keyof ProgressionValues, string> = {
        affection: '❤️',
        trust: '💙',
        obedience: '💚',
        libido: '🔥',
        arousal: '💋',
        corruption: '💜',
        submission: '🔒',
        happiness: '😊',
        jealousy: '😠',
        embarrassment: '😳',
        fatigue: '😴',
    };
    return iconMap[categoryType] || '📊';
}

/**
 * Get category label
 */
function getCategoryLabel(categoryType: keyof ProgressionValues): string {
    const labelMap: Record<string, string> = {
        affection: 'Affection',
        trust: 'Trust',
        obedience: 'Obedience',
        libido: 'Libido',
        arousal: 'Arousal',
        corruption: 'Corruption',
        submission: 'Submission',
        happiness: 'Happiness',
        jealousy: 'Jealousy',
        embarrassment: 'Embarrassment',
        fatigue: 'Fatigue',
    };
    return labelMap[categoryType] || 'Status';
}

/**
 * StateDisplayField Component
 * Displays current state with value, progress bar, stage, and trend
 */
export function StateDisplayField({
    stateDisplay,
    categoryType,
    showChange = true,
    className = '',
}: StateDisplayFieldProps): ReactElement {
    const { value, stage, trend, changeSince } = stateDisplay;
    const emojiStyle = getEmojiStyle(categoryType);
    const categoryIcon = getCategoryIcon(categoryType);
    const categoryLabel = getCategoryLabel(categoryType);
    const statColor = STAT_COLORS[categoryType] || '#6b7280';
    const statStage = getStatStage(value);

    return (
        <div className={`eros-state-display-field ${className}`}>
            <div className="eros-state-header">
                <span className="eros-state-icon">{categoryIcon}</span>
                <span className="eros-state-label">{categoryLabel}</span>
                <span
                    className="eros-state-stage"
                    style={{ color: statColor }}
                >
                    {stage}
                </span>
            </div>

            <div className="eros-state-content">
                <div className="eros-state-value-row">
                    <span
                        className="eros-state-value"
                        style={{ color: statColor }}
                    >
                        {Math.round(value)}
                    </span>
                    <span className="eros-state-percentage">
                        {formatPercentage(value)}
                    </span>
                </div>

                <ProgressBar
                    value={value}
                    style={emojiStyle}
                    status={categoryType as 'affection' | 'obedience' | 'libido' | 'arousal' | 'trust' | 'corruption' | 'submission'}
                    size="md"
                    showPercentage={false}
                    animated={true}
                />
            </div>

            <div className="eros-state-footer">
                <div className="eros-state-trend">
                    <span
                        className="eros-trend-symbol"
                        style={{ color: getTrendColor(trend) }}
                    >
                        {getTrendSymbol(trend)}
                    </span>
                    <span className="eros-trend-label">
                        {trend === TrendDirection.UP && 'Rising'}
                        {trend === TrendDirection.DOWN && 'Falling'}
                        {trend === TrendDirection.STABLE && 'Stable'}
                    </span>
                </div>

                {showChange && changeSince !== 0 && (
                    <div className={`eros-state-change ${changeSince > 0 ? 'positive' : 'negative'}`}>
                        <span className="eros-change-symbol">
                            {changeSince > 0 ? '+' : ''}
                        </span>
                        <span className="eros-change-value">
                            {changeSince}
                        </span>
                    </div>
                )}

                <div className="eros-state-stage-badge" style={{ backgroundColor: `${statColor}20`, color: statColor }}>
                    {statStage}
                </div>
            </div>
        </div>
    );
}

export default StateDisplayField;