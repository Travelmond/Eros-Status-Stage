/**
 * Display Formatters
 * Utility functions for formatting values for UI display
 */

import { getStatStage, STAT_STAGES, STAT_COLORS } from './constants';

export { STAT_COLORS };

/**
 * Renders a progress bar using Unicode box characters
 * @param value - Value from 0-100
 * @param length - Total length of the bar (default: 10)
 * @returns Rendered progress bar string
 */
export function renderProgressBar(value: number, length: number = 10): string {
    const clamped = Math.max(0, Math.min(100, value));
    const filled = Math.round((clamped / 100) * length);
    const empty = length - filled;

    const filledChar = '█';
    const emptyChar = '░';

    return filledChar.repeat(filled) + emptyChar.repeat(empty);
}

/**
 * Renders emoji hearts based on value
 * @param value - Value from 0-100
 * @returns Emoji heart string (e.g., "❤️❤️❤️❤️♡")
 */
export function renderEmojiHearts(value: number): string {
    const clamped = Math.max(0, Math.min(100, value));
    const fullHearts = Math.floor(clamped / 20);
    const hasHalfHeart = (clamped % 20) >= 10;
    const emptyHearts = 5 - fullHearts - (hasHalfHeart ? 1 : 0);

    const full = '❤️';
    const half = '💗';
    const empty = '♡';

    return full.repeat(fullHearts) + (hasHalfHeart ? half : '') + empty.repeat(emptyHearts);
}

/**
 * Renders emoji flames for arousal (fire theme)
 * @param value - Value from 0-100
 * @returns Emoji flame string
 */
export function renderEmojiFlames(value: number): string {
    const clamped = Math.max(0, Math.min(100, value));
    const fullFlames = Math.floor(clamped / 25);
    const emptyFlames = 4 - fullFlames;

    const full = '🔥';
    const empty = '🧊';

    return full.repeat(fullFlames) + empty.repeat(emptyFlames);
}

/**
 * Formats a value as percentage
 * @param value - Value from 0-100
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number): string {
    const clamped = Math.max(0, Math.min(100, Math.round(value)));
    return `${clamped}%`;
}

/**
 * Formats time string (HH:MM)
 * @param time - Time string
 * @returns Formatted time (e.g., "8:00 AM")
 */
export function formatTime(time: string): string {
    const match = time.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return time;

    const hours = parseInt(match[1], 10);
    const minutes = match[2];
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

    return `${displayHours}:${minutes} ${period}`;
}

/**
 * Formats date (day number)
 * @param day - Day number
 * @returns Formatted date string
 */
export function formatDate(day: number): string {
    return `Day ${day}`;
}

/**
 * Formats system time with date
 * @param day - Day number
 * @param time - Time string
 * @returns Formatted date-time string
 */
export function formatDateTime(day: number, time: string): string {
    return `${formatDate(day)} ${formatTime(time)}`;
}

/**
 * Gets color for a stat based on its value
 * @param statName - Name of the stat
 * @param value - Value from 0-100
 * @returns CSS color string
 */
export function getStatColor(statName: keyof typeof STAT_COLORS, value: number): string {
    return STAT_COLORS[statName] || '#6b7280';
}

/**
 * Gets stat stage color
 * @param value - Value from 0-100
 * @returns CSS color string
 */
export function getStatStageColor(value: number): string {
    const stage = getStatStage(value);
    return STAT_STAGES[stage].color;
}

/**
 * Formats stat for quick display (e.g., "Affection: 45")
 * @param statName - Name of the stat
 * @param value - Value from 0-100
 * @returns Formatted stat string
 */
export function formatStatQuick(statName: string, value: number): string {
    const capitalized = statName.charAt(0).toUpperCase() + statName.slice(1);
    return `${capitalized}: ${Math.round(value)}`;
}

/**
 * Formats body expression for display
 * @param expression - Current expression
 * @param posture - Current posture
 * @returns Formatted body description
 */
export function formatBodyState(expression: string, posture: string): string {
    const exp = expression.charAt(0).toUpperCase() + expression.slice(1);
    const pos = posture.charAt(0).toUpperCase() + posture.slice(1);
    return `${exp}, ${pos}`;
}

/**
 * Formats clothing display
 * @param clothing - Clothing state object
 * @returns Formatted clothing string
 */
export function formatClothing(clothing: {
    upperBody: string;
    lowerBody: string;
    underwear: string;
}): string {
    return `${clothing.upperBody}, ${clothing.lowerBody}`;
}

/**
 * Formats location display
 * @param room - Current room
 * @param building - Current building
 * @returns Formatted location string
 */
export function formatLocation(room: string, building: string): string {
    if (building && building !== 'home') {
        return `${building} - ${room}`;
    }
    return room;
}

/**
 * Formats sex module state for display
 * @param active - Whether scene is active
 * @param sceneType - Type of scene
 * @param arousal - Current arousal level
 * @returns Formatted scene description
 */
export function formatSexScene(active: boolean, sceneType: string, arousal: number): string {
    if (!active) return 'Not in scene';

    const scene = sceneType.charAt(0).toUpperCase() + sceneType.slice(1);
    return `${scene} (Arousal: ${Math.round(arousal)}%)`;
}

/**
 * Formats character quick stat
 * @param affection - Affection level
 * @param arousal - Arousal level
 * @returns Quick stat string
 */
export function formatQuickStat(affection: number, arousal: number): string {
    const hearts = renderEmojiHearts(affection);
    const flames = renderEmojiFlames(arousal);
    return `${hearts} ${flames}`;
}

/**
 * Formats a list of items for display
 * @param items - Array of strings
 * @param separator - Separator (default: ", ")
 * @returns Formatted list string
 */
export function formatList(items: string[], separator: string = ', '): string {
    if (!items || items.length === 0) return 'None';
    return items.join(separator);
}

/**
 * Truncates text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number = 50): string {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
}

/**
 * Formats number with ordinal suffix
 * @param n - Number
 * @returns Formatted ordinal (e.g., "1st", "2nd", "3rd")
 */
export function formatOrdinal(n: number): string {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    const suffix = suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
    return `${n}${suffix}`;
}

/**
 * Formats time duration
 * @param minutes - Duration in minutes
 * @returns Formatted duration string
 */
export function formatDuration(minutes: number): string {
    if (minutes < 60) {
        return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) {
        return `${hours}h`;
    }
    return `${hours}h ${mins}m`;
}

/**
 * Creates a status summary string for AI injection
 * @param affection - Affection level
 * @param trust - Trust level
 * @param arousal - Arousal level
 * @returns Status summary string
 */
export function createStatusSummary(
    affection: number,
    trust: number,
    arousal: number
): string {
    const stage = getStatStage(affection);
    return `[Status: Affection ${affection} (${stage}), Trust ${trust}, Arousal ${arousal}]`;
}