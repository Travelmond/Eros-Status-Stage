/**
 * Eros Status - GenitaliaDisplay Component
 * Displays complete genitalia state data from Lorebook Entry 10
 * Includes female, male, anal, menstrual, and pregnancy sections
 * Phase 3.2 - Genitalia & Intimate Details
 */

import { ReactElement, useMemo } from 'react';
import type { GenitaliaState } from '../../types/eros-status';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface GenitaliaDisplayProps {
    /** Full genitalia state object from MessageStateType */
    genitalia?: GenitaliaState | null;
    /** Additional CSS class names */
    className?: string;
}

interface ParsedField {
    label: string;
    value: string;
    icon: string;
    level?: number; // 0-100 for progress bar
}

interface SectionData {
    title: string;
    icon: string;
    fields: ParsedField[];
    messages?: string[];
}

// ============================================================================
// VALUE MAPPINGS FOR LEVEL CALCULATION
// ============================================================================

/** Wetness level map for progress bar visualization */
const WETNESS_LEVELS: Record<string, number> = {
    'dry': 15,
    'damp': 30,
    'wet': 50,
    'aroused': 65,
    'soaking': 80,
    'flooding': 100,
};

/** Sensitivity level map */
const SENSITIVITY_LEVELS: Record<string, number> = {
    'numb': 5,
    'desensitized': 15,
    'normal': 35,
    'sensitive': 55,
    'very sensitive': 75,
    'hypersensitive': 90,
};

/** Erection level map */
const ERECTION_LEVELS: Record<string, number> = {
    'none': 0,
    'flaccid': 5,
    'semi': 25,
    'half': 40,
    'erect': 60,
    'fully erect': 80,
    'throbbing': 95,
};

/** Balls fullness map */
const BALLS_FULLNESS: Record<string, number> = {
    'empty': 0,
    'low': 20,
    'normal': 40,
    'full': 60,
    'heavy': 80,
    'swollen': 95,
};

/** Menstrual fertility map */
const FERTILITY_LEVELS: Record<string, number> = {
    'none': 0,
    'low': 20,
    'medium': 50,
    'high': 75,
    'peak': 95,
};

// ============================================================================
// PARSING UTILITIES
// ============================================================================

/**
 * Parse a comma-separated key: value string into a record
 * Example: "Wetness: Aroused, Sensitivity: Normal" → {Wetness: "Aroused", Sensitivity: "Normal"}
 */
function parseKeyValuePairs(input: string | undefined | null): Record<string, string> {
    if (!input || input.trim() === '' || input.trim() === 'none') {
        return {};
    }

    const result: Record<string, string> = {};
    const parts = input.split(',').map((s) => s.trim());

    for (const part of parts) {
        const colonIndex = part.indexOf(':');
        if (colonIndex > 0) {
            const key = part.substring(0, colonIndex).trim();
            const value = part.substring(colonIndex + 1).trim();
            if (key && value) {
                result[key] = value;
            }
        }
    }

    return result;
}

/**
 * Try to extract a numeric level from a text value based on a mapping
 */
function getNumericLevel(value: string, levelMap: Record<string, number>): number | undefined {
    const lower = value.toLowerCase().trim();
    // Exact match
    if (levelMap[lower] !== undefined) {
        return levelMap[lower];
    }
    // Partial match
    for (const [key, level] of Object.entries(levelMap)) {
        if (lower.includes(key)) {
            return level;
        }
    }
    return undefined;
}

/**
 * Get appropriate icon for a field label
 */
function getFieldIcon(label: string): string {
    const iconMap: Record<string, string> = {
        'wetness': '💧',
        'sensitivity': '✨',
        'erection': '🍆',
        'balls': '⚾',
        'fullness': '🔵',
        'phase': '📅',
        'fertility': '🌱',
        'status': '🤰',
        'state': '📋',
        'tightness': '🔗',
        'prep': '🫧',
    };
    const lower = label.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
        if (lower.includes(key)) {
            return icon;
        }
    }
    return '•';
}

// ============================================================================
// STATUS BAR COMPONENT (inline, no external dependency)
// ============================================================================

interface StatusBarProps {
    level: number;
    color?: string;
    size?: 'sm' | 'md';
}

/**
 * Simple inline status bar using pure CSS
 */
function StatusBar({ level, color = 'var(--eros-highlight)', size = 'sm' }: StatusBarProps): ReactElement {
    const clampedLevel = Math.max(0, Math.min(100, level));
    return (
        <div
            className={`eros-genitalia-bar eros-genitalia-bar-${size}`}
            role="progressbar"
            aria-valuenow={clampedLevel}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${clampedLevel}%`}
        >
            <div
                className="eros-genitalia-bar-fill"
                style={{
                    width: `${clampedLevel}%`,
                    backgroundColor: color,
                }}
            />
        </div>
    );
}

// ============================================================================
// FIELD VALUE COLOR HELPERS
// ============================================================================

/**
 * Get a color for a value based on its level and type
 */
function getFieldColor(value: string, type: 'wetness' | 'sensitivity' | 'erection' | 'fullness' | 'fertility'): string {
    const lower = value.toLowerCase();
    const levelMap: Record<string, Record<string, number>> = {
        wetness: WETNESS_LEVELS,
        sensitivity: SENSITIVITY_LEVELS,
        erection: ERECTION_LEVELS,
        fullness: BALLS_FULLNESS,
        fertility: FERTILITY_LEVELS,
    };
    const map = levelMap[type];
    if (!map) return 'var(--eros-text)';

    const level = getNumericLevel(lower, map);

    if (level === undefined) return 'var(--eros-text-secondary)';
    if (level >= 80) return 'var(--eros-arousal)';
    if (level >= 60) return 'var(--eros-libido)';
    if (level >= 40) return 'var(--eros-warning)';
    if (level >= 20) return 'var(--eros-obedience)';
    return 'var(--eros-text-muted)';
}

// ============================================================================
// SECTION BUILDERS
// ============================================================================

/**
 * Build female genitalia section data
 */
function buildFemaleSection(female: string | undefined | null): SectionData | null {
    if (!female || female.trim() === '' || female.trim() === 'none') {
        return null;
    }

    const pairs = parseKeyValuePairs(female);
    const fields: ParsedField[] = [];

    // Wetness
    if (pairs['Wetness']) {
        const value = pairs['Wetness'];
        const level = getNumericLevel(value, WETNESS_LEVELS);
        fields.push({
            label: 'Wetness',
            value,
            icon: '💧',
            level: level ?? 50,
        });
    }

    // Sensitivity
    if (pairs['Sensitivity']) {
        const value = pairs['Sensitivity'];
        const level = getNumericLevel(value, SENSITIVITY_LEVELS);
        fields.push({
            label: 'Sensitivity',
            value,
            icon: '✨',
            level: level ?? 50,
        });
    }

    // Any remaining fields not yet captured
    for (const [key, value] of Object.entries(pairs)) {
        if (key !== 'Wetness' && key !== 'Sensitivity') {
            fields.push({
                label: key,
                value,
                icon: getFieldIcon(key),
            });
        }
    }

    if (fields.length === 0) {
        // No key-value pairs found; show raw text
        return {
            title: 'Female Genitalia',
            icon: '🌸',
            fields: [{ label: 'State', value: female, icon: '📋' }],
        };
    }

    return {
        title: 'Female Genitalia',
        icon: '🌸',
        fields,
    };
}

/**
 * Build male genitalia section data
 */
function buildMaleSection(male: string | undefined | null): SectionData | null {
    if (!male || male.trim() === '' || male.trim() === 'none') {
        return null;
    }

    const pairs = parseKeyValuePairs(male);
    const fields: ParsedField[] = [];

    // Erection
    if (pairs['Erection']) {
        const value = pairs['Erection'];
        const level = getNumericLevel(value, ERECTION_LEVELS);
        fields.push({
            label: 'Erection',
            value,
            icon: '🍆',
            level: level ?? 50,
        });
    }

    // Balls / Fullness
    if (pairs['Balls']) {
        const value = pairs['Balls'];
        const level = getNumericLevel(value, BALLS_FULLNESS);
        fields.push({
            label: 'Balls',
            value,
            icon: '⚾',
            level: level ?? 50,
        });
    }

    if (pairs['Fullness']) {
        const value = pairs['Fullness'];
        const level = getNumericLevel(value, BALLS_FULLNESS);
        fields.push({
            label: 'Fullness',
            value,
            icon: '🔵',
            level: level ?? 50,
        });
    }

    // Remaining fields
    for (const [key, value] of Object.entries(pairs)) {
        if (key !== 'Erection' && key !== 'Balls' && key !== 'Fullness') {
            fields.push({
                label: key,
                value,
                icon: getFieldIcon(key),
            });
        }
    }

    if (fields.length === 0) {
        return {
            title: 'Male Genitalia',
            icon: '🍆',
            fields: [{ label: 'State', value: male, icon: '📋' }],
        };
    }

    return {
        title: 'Male Genitalia',
        icon: '🍆',
        fields,
    };
}

/**
 * Build anal state section data
 */
function buildAnalSection(anal: string | undefined | null): SectionData | null {
    if (!anal || anal.trim() === '' || anal.trim() === 'none') {
        return null;
    }

    const pairs = parseKeyValuePairs(anal);
    const fields: ParsedField[] = [];

    // Wetness
    if (pairs['Wetness']) {
        const value = pairs['Wetness'];
        const level = getNumericLevel(value, WETNESS_LEVELS);
        fields.push({
            label: 'Wetness',
            value,
            icon: '💧',
            level: level ?? 50,
        });
    }

    // State / Prep
    if (pairs['State']) {
        fields.push({ label: 'State', value: pairs['State'], icon: '📋' });
    }
    if (pairs['Prep']) {
        fields.push({ label: 'Prep', value: pairs['Prep'], icon: '🫧' });
    }
    if (pairs['Tightness']) {
        fields.push({ label: 'Tightness', value: pairs['Tightness'], icon: '🔗' });
    }

    // Any remaining
    for (const [key, value] of Object.entries(pairs)) {
        if (key !== 'Wetness' && key !== 'State' && key !== 'Prep' && key !== 'Tightness') {
            fields.push({ label: key, value, icon: getFieldIcon(key) });
        }
    }

    if (fields.length === 0) {
        return {
            title: 'Anal State',
            icon: '🔄',
            fields: [{ label: 'State', value: anal, icon: '📋' }],
        };
    }

    return {
        title: 'Anal State',
        icon: '🔄',
        fields,
    };
}

/**
 * Build menstrual cycle section data
 */
function buildMenstrualSection(menstrual: string | undefined | null): SectionData | null {
    if (!menstrual || menstrual.trim() === '' || menstrual.trim() === 'none') {
        return null;
    }

    const pairs = parseKeyValuePairs(menstrual);
    const fields: ParsedField[] = [];

    // Phase
    if (pairs['Phase']) {
        fields.push({ label: 'Phase', value: pairs['Phase'], icon: '📅' });
    }

    // Fertility
    if (pairs['Fertility']) {
        const value = pairs['Fertility'];
        const level = getNumericLevel(value, FERTILITY_LEVELS);
        fields.push({
            label: 'Fertility',
            value,
            icon: '🌱',
            level: level ?? 50,
        });
    }

    // Remaining
    for (const [key, value] of Object.entries(pairs)) {
        if (key !== 'Phase' && key !== 'Fertility') {
            fields.push({ label: key, value, icon: getFieldIcon(key) });
        }
    }

    if (fields.length === 0) {
        return {
            title: 'Menstrual Cycle',
            icon: '🩸',
            fields: [{ label: 'Status', value: menstrual, icon: '📋' }],
        };
    }

    return {
        title: 'Menstrual Cycle',
        icon: '🩸',
        fields,
    };
}

/**
 * Build pregnancy section data
 */
function buildPregnancySection(
    pregnancy: string | undefined | null,
    wombMessages?: string[]
): SectionData | null {
    if (!pregnancy || pregnancy.trim() === '' || pregnancy.trim().toLowerCase() === 'none') {
        return null;
    }

    const pairs = parseKeyValuePairs(pregnancy);
    const fields: ParsedField[] = [];

    // Status
    if (pairs['Status']) {
        fields.push({ label: 'Status', value: pairs['Status'], icon: '🤰' });
    }

    // Remaining fields
    for (const [key, value] of Object.entries(pairs)) {
        if (key !== 'Status') {
            fields.push({ label: key, value, icon: getFieldIcon(key) });
        }
    }

    // If no parsed pairs, treat whole string as status
    if (fields.length === 0) {
        fields.push({ label: 'Status', value: pregnancy, icon: '🤰' });
    }

    return {
        title: 'Pregnancy',
        icon: '🤰',
        fields,
        messages: wombMessages,
    };
}

// ============================================================================
// SECTION RENDERER
// ============================================================================

interface SectionRendererProps {
    section: SectionData;
}

/**
 * Render a single genitalia section with header and fields
 */
function SectionRenderer({ section }: SectionRendererProps): ReactElement {
    return (
        <div className="eros-genitalia-section">
            {/* Section Header */}
            <div className="eros-genitalia-section-header">
                <span className="eros-genitalia-section-icon">{section.icon}</span>
                <h4 className="eros-genitalia-section-title">{section.title}</h4>
            </div>

            {/* Section Fields */}
            <div className="eros-genitalia-section-body">
                {section.fields.map((field, index) => (
                    <div key={`${field.label}-${index}`} className="eros-genitalia-field">
                        <div className="eros-genitalia-field-row">
                            <span className="eros-genitalia-field-icon">{field.icon}</span>
                            <span className="eros-genitalia-field-label">{field.label}</span>
                            <span
                                className="eros-genitalia-field-value"
                                style={
                                    field.level !== undefined
                                        ? { color: getFieldColor(field.value, getFieldType(field.label)) }
                                        : undefined
                                }
                            >
                                {field.value}
                            </span>
                        </div>
                        {field.level !== undefined && (
                            <div className="eros-genitalia-field-bar">
                                <StatusBar
                                    level={field.level}
                                    color={getFieldColor(field.value, getFieldType(field.label))}
                                    size="sm"
                                />
                            </div>
                        )}
                    </div>
                ))}

                {/* Entity Messages (wombMessages, etc.) */}
                {section.messages && section.messages.length > 0 && (
                    <div className="eros-genitalia-messages">
                        {section.messages.map((msg, idx) => (
                            <div key={`msg-${idx}`} className="eros-genitalia-message">
                                <span className="eros-message-icon">💬</span>
                                <span className="eros-message-text">{msg}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * Determine the field type for color mapping based on label
 */
function getFieldType(label: string): 'wetness' | 'sensitivity' | 'erection' | 'fullness' | 'fertility' {
    const lower = label.toLowerCase();
    if (lower.includes('wetness')) return 'wetness';
    if (lower.includes('sensitivity')) return 'sensitivity';
    if (lower.includes('erection')) return 'erection';
    if (lower.includes('ball') || lower.includes('fullness')) return 'fullness';
    if (lower.includes('fertility')) return 'fertility';
    return 'wetness';
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * GenitaliaDisplay Component
 * Renders all genitalia data from the Lorebook Entry 10
 * Sections: Female, Male, Anal, Menstrual, Pregnancy
 */
export function GenitaliaDisplay({
    genitalia,
    className = '',
}: GenitaliaDisplayProps): ReactElement {
    // Build all sections with memoization
    const sections = useMemo(() => {
        if (!genitalia) return [];

        const result: SectionData[] = [];

        // Female section (always visible if data exists)
        const femaleSection = buildFemaleSection(genitalia.female);
        if (femaleSection) result.push(femaleSection);

        // Male section (only if male data exists)
        const maleSection = buildMaleSection(genitalia.male);
        if (maleSection) result.push(maleSection);

        // Anal section (always visible if data exists)
        const analSection = buildAnalSection(genitalia.anal);
        if (analSection) result.push(analSection);

        // Menstrual section (always visible if data exists)
        const menstrualSection = buildMenstrualSection(genitalia.menstrual);
        if (menstrualSection) result.push(menstrualSection);

        // Pregnancy section (only if pregnancy != 'none')
        const pregnancySection = buildPregnancySection(
            genitalia.pregnancy,
            genitalia.wombMessages
        );
        if (pregnancySection) result.push(pregnancySection);

        return result;
    }, [genitalia]);

    // Empty state
    if (sections.length === 0) {
        return (
            <div className={`eros-genitalia-display eros-genitalia-empty ${className}`}>
                <div className="eros-genitalia-empty-icon">🔒</div>
                <div className="eros-genitalia-empty-text">
                    No genitalia data available
                </div>
                <div className="eros-genitalia-empty-hint">
                    Enable intimate body tracking in character settings
                </div>
            </div>
        );
    }

    return (
        <div className={`eros-genitalia-display ${className}`}>
            {/* Header */}
            <div className="eros-genitalia-display-header">
                <span className="eros-genitalia-display-icon">🔞</span>
                <h3 className="eros-genitalia-display-title">Intimate Status</h3>
            </div>

            {/* Sections */}
            <div className="eros-genitalia-sections">
                {sections.map((section, index) => (
                    <SectionRenderer
                        key={`${section.title}-${index}`}
                        section={section}
                    />
                ))}
            </div>
        </div>
    );
}

export default GenitaliaDisplay;
