/**
 * Eros Status - StatusPanel Component
 * Main status display panel with progression values and location/time
 * Phase 1 - Core UI Components + Phase 2 Enhanced Emoji Styles
 */

import { ReactElement } from 'react';
import type { ProgressionValues, SystemData, LocationData, SexModuleState } from '../../types/eros-status';
import { ProgressBar, CompactProgressBar } from './ProgressBar';
import type { EmojiProgressStyle } from './ProgressBar';
import { ProgressBarStyle, SexSceneType } from '../../types/eros-status';

export interface StatusPanelProps {
    /** Core progression values */
    progressions: ProgressionValues;
    /** System data (day, time, weather) */
    system: SystemData;
    /** Location data */
    location: LocationData;
    /** Optional sex module state */
    sexModule?: SexModuleState;
    /** Show detailed labels */
    showLabels?: boolean;
    /** Display density */
    density?: 'compact' | 'comfortable' | 'expanded';
    /** Hide sections */
    hideSections?: {
        progression?: boolean;
        location?: boolean;
        time?: boolean;
        sexModule?: boolean;
    };
    /** Additional CSS class names */
    className?: string;
}

/**
 * Get stage label based on value ranges
 */
function getStageLabel(value: number, type: keyof ProgressionValues): string {
    const stages: Record<string, string[]> = {
        affection: ['Indifferent', 'Neutral', 'Interested', 'Fond', 'In Love', 'Obsessed'],
        obedience: ['Rebellious', 'Reluctant', 'Compliant', 'Obedient', 'Devoted', 'Submissive'],
        libido: ['Cold', 'Curious', 'Aroused', 'Passionate', 'Horny', 'Insatiable'],
        trust: ['Suspicious', 'Wary', 'Open', 'Trusting', 'Faithful', 'Devoted'],
        corruption: ['Pure', 'Curious', 'Exploring', 'Corrupted', 'Depraved', 'Twisted'],
        submission: ['Dominant', 'Equal', 'Yielding', 'Submissive', 'Enslaved', 'Broken'],
        happiness: [' Miserable', 'Sad', 'Neutral', 'Content', 'Happy', 'Ecstatic'],
        embarrassment: ['Confident', 'Awkward', 'Shy', 'Embarrassed', 'Mortified', 'Paralyzed'],
        fatigue: ['Energized', 'Normal', 'Tired', 'Exhausted', 'Weary', 'Collapsed'],
        jealousy: ['Secure', 'Calm', 'Uneasy', 'Jealous', 'Obsessed', 'Possessive'],
    };

    const typeStages = stages[type] || ['Low', 'Low', 'Medium', 'Medium', 'High', 'High'];
    const index = Math.min(Math.floor(value / 20), 5);
    return typeStages[index];
}

/**
 * Format time string for display
 */
function formatTimeDisplay(time: string | undefined): string {
    if (!time) return '---';
    return time;
}

/**
 * Format day for display
 */
function formatDayDisplay(day: number): string {
    if (day === 1) return 'Day 1';
    return `Day ${day}`;
}

/**
 * Format location for display
 */
function formatLocationDisplay(room: string, building: string): string {
    if (building && building !== 'Unknown') {
        return `${building}: ${room}`;
    }
    return room;
}

/**
 * Get scene type display text
 */
function getSceneTypeDisplay(sceneType: SexSceneType): string {
    const sceneLabels: Record<SexSceneType, string> = {
        [SexSceneType.QUIET]: 'Idle',
        [SexSceneType.CONVERSATION]: 'Chat',
        [SexSceneType.FLIRT]: 'Flirting',
        [SexSceneType.FOREPLAY]: 'Foreplay',
        [SexSceneType.SEX]: 'Active',
        [SexSceneType.AFTERCARE]: 'Aftercare',
    };
    return sceneLabels[sceneType] || 'Unknown';
}

/**
 * StatusPanel Component
 * Displays character progression stats, location, time, and optional sex module info
 */
export function StatusPanel({
    progressions,
    system,
    location,
    sexModule,
    showLabels = true,
    density = 'comfortable',
    hideSections = {},
    className = '',
}: StatusPanelProps): ReactElement {
    const densityClass = `eros-status-density-${density}`;

    // Primary progression values to display with emoji styles (Phase 2)
    const primaryStats: Array<{
        key: keyof ProgressionValues;
        label: string;
        icon: string;
        status: 'affection' | 'obedience' | 'libido' | 'arousal' | 'trust' | 'corruption' | 'submission';
        style: EmojiProgressStyle;
    }> = [
        { key: 'affection', label: 'Affection', icon: '❤️', status: 'affection', style: 'emoji-hearts' },
        { key: 'trust', label: 'Trust', icon: '💙', status: 'trust', style: 'emoji-star' },
        { key: 'obedience', label: 'Obedience', icon: '💚', status: 'obedience', style: 'emoji-star' },
        { key: 'libido', label: 'Libido', icon: '🔥', status: 'libido', style: 'emoji-fire' },
    ];

    // Secondary stats (shown in expanded mode) with emoji styles (Phase 2)
    const secondaryStats: Array<{
        key: keyof ProgressionValues;
        label: string;
        icon: string;
        status: 'arousal' | 'corruption' | 'submission' | 'location';
        style: EmojiProgressStyle;
    }> = [
        { key: 'arousal', label: 'Arousal', icon: '💋', status: 'arousal', style: 'emoji-fire' },
        { key: 'submission', label: 'Submission', icon: '🔒', status: 'submission', style: 'emoji-check' },
        { key: 'corruption', label: 'Corruption', icon: '💜', status: 'corruption', style: 'emoji-check' },
    ];

    return (
        <div className={`eros-status-panel ${densityClass} ${className}`}>
            {/* Progression Section */}
            {!hideSections.progression && (
                <div className="eros-status-section eros-section-progression">
                    {showLabels && (
                        <h3 className="eros-section-title">Progression</h3>
                    )}

                    {/* Primary Stats Grid */}
                    <div className="eros-stats-primary">
                        {primaryStats.map((stat) => (
                            <div key={stat.key} className="eros-stat-item">
                                {showLabels && (
                                    <div className="eros-stat-header">
                                        <span className="eros-stat-icon">{stat.icon}</span>
                                        <span className="eros-stat-label">{stat.label}</span>
                                        <span className="eros-stat-stage">
                                            {getStageLabel(progressions[stat.key], stat.key)}
                                        </span>
                                    </div>
                                )}
                                <ProgressBar
                                    value={progressions[stat.key]}
                                    style={stat.style}
                                    status={stat.status}
                                    size={density === 'compact' ? 'sm' : 'md'}
                                    showPercentage={!showLabels}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Secondary Stats (Expanded Mode) */}
                    {density === 'expanded' && !hideSections.progression && (
                        <div className="eros-stats-secondary">
                            <h4 className="eros-stats-subtitle">Additional Stats</h4>
                            <div className="eros-stats-grid">
                                {secondaryStats.map((stat) => (
                                    <div key={stat.key} className="eros-stat-item-compact">
                                        <span className="eros-stat-icon-compact">{stat.icon}</span>
                                        <ProgressBar
                                            value={progressions[stat.key]}
                                            style={stat.style}
                                            status={stat.status}
                                            size="sm"
                                            showPercentage={true}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Location & Time Section */}
            {(!hideSections.location || !hideSections.time) && (
                <div className="eros-status-section eros-section-info">
                    {!hideSections.location && (
                        <div className="eros-info-item eros-location">
                            <span className="eros-info-icon">📍</span>
                            <span className="eros-info-label">Location:</span>
                            <span className="eros-info-value">
                                {formatLocationDisplay(location.currentRoom, location.building)}
                            </span>
                        </div>
                    )}

                    {(!hideSections.time) && (
                        <div className="eros-info-item eros-time">
                            <span className="eros-info-icon">⏰</span>
                            <span className="eros-info-label">Time:</span>
                            <span className="eros-info-value">
                                {formatDayDisplay(system.day)} - {formatTimeDisplay(system.time)}
                            </span>
                            {system.weather && (
                                <span className="eros-info-weather">
                                    ({system.weather})
                                </span>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Sex Module Section */}
            {sexModule && sexModule.active && !hideSections.sexModule && (
                <div className="eros-status-section eros-section-scene">
                    <div className="eros-scene-header">
                        <span className="eros-scene-label">Scene:</span>
                        <span className="eros-scene-type">
                            {getSceneTypeDisplay(sexModule.sceneType)}
                        </span>
                    </div>
                    <div className="eros-scene-details">
                        {sexModule.position && sexModule.position !== 'none' && (
                            <span className="eros-scene-position">
                                Position: {sexModule.position}
                            </span>
                        )}
                        {sexModule.pace && sexModule.pace !== 'none' && (
                            <span className="eros-scene-pace">
                                Pace: {sexModule.pace}
                            </span>
                        )}
                        <div className="eros-scene-arousal">
                            <span>Arousal:</span>
                            <CompactProgressBar value={sexModule.arousal} status="arousal" />
                            <span className="eros-scene-arousal-value">{sexModule.arousal}%</span>
                        </div>
                        {sexModule.orgasmCount > 0 && (
                            <span className="eros-scene-orgasms">
                                Orgasms: {sexModule.orgasmCount}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

/**
 * Compact Status Display - minimal inline version
 */
export function CompactStatusDisplay({
    progressions,
    className = '',
}: {
    progressions: ProgressionValues;
    className?: string;
}): ReactElement {
    return (
        <div className={`eros-compact-status ${className}`}>
            <CompactProgressBar value={progressions.affection} status="affection" />
            <CompactProgressBar value={progressions.trust} status="trust" />
            <CompactProgressBar value={progressions.libido} status="libido" />
            <CompactProgressBar value={progressions.arousal} status="arousal" />
        </div>
    );
}

export default StatusPanel;