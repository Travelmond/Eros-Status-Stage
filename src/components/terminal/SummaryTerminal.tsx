/**
 * Eros Status - SummaryTerminal Component
 * Always-visible summary display for core stats
 * Phase 2.3 - Summary Terminal Display
 */

import { ReactElement, useMemo } from 'react';
import type { MessageStateType, ProgressionValues, SystemData, LocationData } from '../../types/eros-status';
import { CompactStatusDisplay } from '../status/CompactStatusDisplay';
import { TerminalFrame } from './TerminalFrame';

export interface SummaryTerminalProps {
    /** Full eros status state */
    state: MessageStateType;
    /** Callback when stats are clicked (to open detail panel) */
    onStatsClick?: () => void;
    /** Additional CSS class names */
    className?: string;
    /** Terminal variant style */
    variant?: 'default' | 'classic' | 'amber' | 'cyber';
    /** Display size */
    size?: 'sm' | 'md' | 'lg';
}

/**
 * Map weather string to emoji
 */
function getWeatherEmoji(weather: string): string {
    const weatherMap: Record<string, string> = {
        sunny: '☀️',
        clear: '☀️',
        cloudy: '☁️',
        overcast: '☁️',
        rainy: '🌧️',
        rain: '🌧️',
        stormy: '⛈️',
        thunderstorm: '⛈️',
        snowy: '❄️',
        snow: '❄️',
        foggy: '🌫️',
        fog: '🌫️',
        windy: '💨',
        night: '🌙',
        'partly cloudy': '⛅',
    };
    const key = (weather || '').toLowerCase().trim();
    return weatherMap[key] || '🌤️';
}

/**
 * Get time of day label
 */
function getTimeOfDayLabel(system: SystemData): string {
    const timeStr = system.time || '08:00';
    const hour = parseInt(timeStr.split(':')[0], 10);

    if (hour >= 5 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 17) return 'Afternoon';
    if (hour >= 17 && hour < 21) return 'Evening';
    return 'Night';
}

/**
 * Get mood indicator based on progressions
 */
function getMoodIndicator(progressions: ProgressionValues): string | null {
    const happiness = progressions.happiness || 50;

    if (happiness >= 80) return '😊';
    if (happiness >= 60) return '🙂';
    if (happiness >= 40) return '😐';
    if (happiness >= 20) return '😔';
    if (happiness > 0) return '😢';
    return null;
}

/**
 * SummaryTerminal Component
 * Displays a compact always-visible terminal with core stats
 */
export function SummaryTerminal({
    state,
    onStatsClick,
    className = '',
    variant = 'default',
    size = 'md',
}: SummaryTerminalProps): ReactElement {
    // Build the header info line
    const headerInfo = useMemo(() => {
        const dayLabel = `📅 Day ${state.system.day}`;
        const timeLabel = `🕐 ${getTimeOfDayLabel(state.system)}`;
        const weatherLabel = `${getWeatherEmoji(state.system.weather)} ${state.system.weather || 'Clear'}`;

        return [dayLabel, timeLabel, weatherLabel].join(' | ');
    }, [state.system]);

    // Build location line
    const locationInfo = useMemo(() => {
        const building = state.location.building || 'Unknown';
        const room = state.location.currentRoom || 'Unknown';
        return `📍 ${building} - ${room}`;
    }, [state.location]);

    // Create compact stat display content
    const statsContent = useMemo(() => (
        <CompactStatusDisplay
            progressions={state.progressions}
            onClick={onStatsClick}
        />
    ), [state.progressions, onStatsClick]);

    // Mood indicator
    const moodIndicator = useMemo(() => getMoodIndicator(state.progressions), [state.progressions]);

    return (
        <TerminalFrame
            variant={variant}
            size={size}
            className={`eros-summary-terminal ${className}`}
        >
            {/* Header with system info */}
            <div className="eros-summary-header-info">
                {headerInfo}
            </div>

            {/* Location */}
            <div className="eros-summary-location">
                {locationInfo}
            </div>

            {/* Stats line */}
            <div className="eros-summary-stats">
                {statsContent}

                {/* Mood indicator */}
                {moodIndicator && (
                    <span className="eros-summary-mood" title="Mood">
                        {moodIndicator}
                    </span>
                )}
            </div>
        </TerminalFrame>
    );
}

/**
 * Compact version for tight spaces
 */
export function SummaryTerminalCompact({
    state,
    className = '',
}: {
    state: MessageStateType;
    className?: string;
}): ReactElement {
    const compactDisplay = useMemo(() => {
        const day = `D${state.system.day}`;
        const weather = getWeatherEmoji(state.system.weather);
        const affection = Math.round(state.progressions.affection / 10);
        const libido = Math.round(state.progressions.libido / 10);
        const trust = Math.round(state.progressions.trust / 10);

        return `[${day} ${weather} | 💕${affection} 🔥${libido} 💙${trust}]`;
    }, [state]);

    return (
        <span className={`eros-summary-compact ${className}`}>
            {compactDisplay}
        </span>
    );
}

export default SummaryTerminal;