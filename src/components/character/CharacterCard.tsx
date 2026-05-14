/**
 * Eros Status - CharacterCard Component
 * NPC character card for the CHARACTERS tab
 * Phase 3.2 - Character Management
 */

import { ReactElement, memo } from 'react';
import { NPCData } from '../../types/eros-status';

export interface CharacterCardProps {
    /** NPC data to display */
    character: NPCData;
    /** Callback when card is clicked */
    onClick?: (character: NPCData) => void;
    /** Whether the card is selected */
    isSelected?: boolean;
    /** Additional CSS class names */
    className?: string;
}

/**
 * Get importance indicator color
 */
function getImportanceColor(importance: NPCData['importance']): string {
    switch (importance) {
        case 'main':
            return 'var(--eros-affection)';
        case 'secondary':
            return 'var(--eros-libido)';
        case 'minor':
            return 'var(--eros-text-muted)';
        default:
            return 'var(--eros-text-secondary)';
    }
}

/**
 * Get importance label
 */
function getImportanceLabel(importance: NPCData['importance']): string {
    switch (importance) {
        case 'main':
            return 'Main';
        case 'secondary':
            return 'Secondary';
        case 'minor':
            return 'Minor';
        default:
            return 'NPC';
    }
}

/**
 * Get affection display (hearts)
 */
function getAffectionDisplay(affection: number): string {
    const hearts = Math.round(affection / 20);
    return '❤️'.repeat(hearts) + '♡'.repeat(5 - hearts);
}

/**
 * CharacterCard Component
 * Displays a single NPC with avatar, name, role, and quick stats
 */
export function CharacterCard({
    character,
    onClick,
    isSelected = false,
    className = '',
}: CharacterCardProps): ReactElement {
    const handleClick = () => {
        if (onClick) {
            onClick(character);
        }
    };

    const importanceColor = getImportanceColor(character.importance);

    return (
        <button
            className={`character-card ${isSelected ? 'selected' : ''} ${character.isInScene ? 'in-scene' : ''} ${className}`}
            onClick={handleClick}
            type="button"
            aria-pressed={isSelected}
        >
            {/* Avatar */}
            <div className="character-card-avatar">
                {character.avatarUrl ? (
                    <img
                        src={character.avatarUrl}
                        alt={`${character.name}'s avatar`}
                        className="character-avatar-image"
                    />
                ) : (
                    <div className="character-avatar-placeholder">
                        <span className="avatar-initial">
                            {character.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}
                {/* In-Scene Indicator */}
                {character.isInScene && (
                    <span className="character-scene-indicator" title="Currently in scene">
                        🎬
                    </span>
                )}
            </div>

            {/* Card Content */}
            <div className="character-card-content">
                {/* Name */}
                <h3 className="character-card-name">{character.name}</h3>

                {/* Role */}
                <span className="character-card-role">{character.role}</span>

                {/* Importance Badge */}
                <span
                    className="character-card-importance"
                    style={{ color: importanceColor }}
                >
                    {getImportanceLabel(character.importance)}
                </span>

                {/* Quick Stat - Affection */}
                <div className="character-card-stat">
                    <span className="stat-label">Affection:</span>
                    <span className="stat-value">{getAffectionDisplay(character.affection)}</span>
                </div>
            </div>

            {/* Hover Glow Effect */}
            <div className="character-card-glow" />
        </button>
    );
}

/**
 * CharacterCard Skeleton - Loading state
 */
export function CharacterCardSkeleton({
    className = '',
}: {
    className?: string;
}): ReactElement {
    return (
        <div className={`character-card-skeleton ${className}`}>
            <div className="skeleton-avatar" />
            <div className="skeleton-content">
                <div className="skeleton-name" />
                <div className="skeleton-role" />
                <div className="skeleton-stat" />
            </div>
        </div>
    );
}

export default CharacterCard;