/**
 * Eros Status - CharacterList Component
 * Grid of NPC character cards with filtering
 * Phase 3.2 - Character Management
 */

import { ReactElement, useMemo, useCallback } from 'react';
import { NPCData } from '../../types/eros-status';
import { CharacterCard, CharacterCardSkeleton } from './CharacterCard';

export type CharacterFilter = 'all' | 'in-scene' | 'main' | 'secondary' | 'minor';

export interface CharacterListProps {
    /** Array of NPC characters to display */
    characters: NPCData[];
    /** Currently selected character */
    selectedCharacter?: NPCData | null;
    /** Callback when a character is selected */
    onCharacterSelect?: (character: NPCData) => void;
    /** Current filter */
    filter?: CharacterFilter;
    /** Callback when filter changes */
    onFilterChange?: (filter: CharacterFilter) => void;
    /** Whether data is loading */
    isLoading?: boolean;
    /** Empty state message */
    emptyMessage?: string;
    /** Additional CSS class names */
    className?: string;
}

/**
 * Filter characters based on current filter
 */
function filterCharacters(
    characters: NPCData[],
    filter: CharacterFilter
): NPCData[] {
    switch (filter) {
        case 'in-scene':
            return characters.filter((char) => char.isInScene);
        case 'main':
            return characters.filter((char) => char.importance === 'main');
        case 'secondary':
            return characters.filter((char) => char.importance === 'secondary');
        case 'minor':
            return characters.filter((char) => char.importance === 'minor');
        case 'all':
        default:
            return characters;
    }
}

/**
 * Get filter label
 */
function getFilterLabel(filter: CharacterFilter): string {
    switch (filter) {
        case 'all':
            return 'All NPCs';
        case 'in-scene':
            return 'In Scene';
        case 'main':
            return 'Main';
        case 'secondary':
            return 'Secondary';
        case 'minor':
            return 'Minor';
        default:
            return 'All';
    }
}

/**
 * CharacterList Component
 * Displays a grid of character cards with filter controls
 */
export function CharacterList({
    characters,
    selectedCharacter,
    onCharacterSelect,
    filter = 'all',
    onFilterChange,
    isLoading = false,
    emptyMessage = 'No characters found',
    className = '',
}: CharacterListProps): ReactElement {
    // Filter characters
    const filteredCharacters = useMemo(
        () => filterCharacters(characters, filter),
        [characters, filter]
    );

    // Handle filter change
    const handleFilterChange = useCallback(
        (newFilter: CharacterFilter) => {
            if (onFilterChange) {
                onFilterChange(newFilter);
            }
        },
        [onFilterChange]
    );

    // Handle character click
    const handleCharacterClick = useCallback(
        (character: NPCData) => {
            if (onCharacterSelect) {
                onCharacterSelect(character);
            }
        },
        [onCharacterSelect]
    );

    // Filter options
    const filterOptions: CharacterFilter[] = ['all', 'in-scene', 'main', 'secondary', 'minor'];

    // Loading state - show skeletons
    if (isLoading) {
        return (
            <div className={`character-list ${className}`}>
                <div className="character-list-header">
                    <h2 className="character-list-title">Characters</h2>
                    <div className="character-list-filters">
                        {filterOptions.map((option) => (
                            <button
                                key={option}
                                className={`filter-button ${filter === option ? 'active' : ''}`}
                                onClick={() => handleFilterChange(option)}
                                type="button"
                                disabled
                            >
                                {getFilterLabel(option)}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="character-list-grid">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <CharacterCardSkeleton key={index} />
                    ))}
                </div>
            </div>
        );
    }

    // Empty state
    if (filteredCharacters.length === 0) {
        return (
            <div className={`character-list ${className}`}>
                <div className="character-list-header">
                    <h2 className="character-list-title">Characters</h2>
                    <div className="character-list-filters">
                        {filterOptions.map((option) => (
                            <button
                                key={option}
                                className={`filter-button ${filter === option ? 'active' : ''}`}
                                onClick={() => handleFilterChange(option)}
                                type="button"
                            >
                                {getFilterLabel(option)}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="character-list-empty">
                    <span className="empty-icon">👥</span>
                    <p className="empty-message">{emptyMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`character-list ${className}`}>
            <div className="character-list-header">
                <h2 className="character-list-title">Characters</h2>
                <div className="character-list-filters">
                    {filterOptions.map((option) => (
                        <button
                            key={option}
                            className={`filter-button ${filter === option ? 'active' : ''}`}
                            onClick={() => handleFilterChange(option)}
                            type="button"
                        >
                            {getFilterLabel(option)}
                            {option === 'all' && characters.length > 0 && (
                                <span className="filter-count">({characters.length})</span>
                            )}
                            {option === 'in-scene' && characters.filter(c => c.isInScene).length > 0 && (
                                <span className="filter-count">
                                    ({characters.filter(c => c.isInScene).length})
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="character-list-grid">
                {filteredCharacters.map((character) => (
                    <CharacterCard
                        key={character.id}
                        character={character}
                        isSelected={selectedCharacter?.id === character.id}
                        onClick={handleCharacterClick}
                    />
                ))}
            </div>
        </div>
    );
}

export default CharacterList;