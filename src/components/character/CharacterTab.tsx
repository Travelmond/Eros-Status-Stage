/**
 * Eros Status - CharacterTab Component
 * Tab container for CHARACTERS tab in Eros Status App
 * Phase 3.2 - Character Management
 */

import { ReactElement, useState, useCallback, useMemo } from 'react';
import { NPCData, RelationshipData, MessageStateType } from '../../types/eros-status';
import { CharacterList, CharacterFilter } from './CharacterList';
import { CharacterDetailModal } from './CharacterDetailModal';

export interface CharacterTabProps {
    /** Full state containing NPCs */
    state: MessageStateType;
    /** Callback for state updates */
    onStateChange?: (newState: Partial<MessageStateType>) => void;
    /** Additional CSS class names */
    className?: string;
}

/**
 * CharacterTab Component
 * Container for the CHARACTERS tab content
 */
export function CharacterTab({
    state,
    onStateChange,
    className = '',
}: CharacterTabProps): ReactElement {
    // Current filter
    const [currentFilter, setCurrentFilter] = useState<CharacterFilter>('all');

    // Selected character for detail view
    const [selectedCharacter, setSelectedCharacter] = useState<NPCData | null>(null);

    // Modal open state
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Handle filter change
    const handleFilterChange = useCallback((filter: CharacterFilter) => {
        setCurrentFilter(filter);
    }, []);

    // Handle character selection
    const handleCharacterSelect = useCallback((character: NPCData) => {
        setSelectedCharacter(character);
        setIsModalOpen(true);
    }, []);

    // Handle modal close
    const handleModalClose = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    // Handle edit
    const handleEdit = useCallback((character: NPCData) => {
        // TODO: Implement edit functionality
        console.log('Edit character:', character);
    }, []);

    // Get relationships for selected character
    const selectedCharacterRelationships = useMemo((): RelationshipData[] => {
        if (!selectedCharacter) return [];
        return state.relationships.filter(
            (rel) =>
                rel.character1Id === selectedCharacter.id ||
                rel.character2Id === selectedCharacter.id
        );
    }, [selectedCharacter, state.relationships]);

    // Get NPCs from state
    const npcs: NPCData[] = state.npcs || [];

    return (
        <div className={`character-tab ${className}`}>
            {/* Character List */}
            <CharacterList
                characters={npcs}
                selectedCharacter={selectedCharacter}
                onCharacterSelect={handleCharacterSelect}
                filter={currentFilter}
                onFilterChange={handleFilterChange}
                isLoading={false}
                emptyMessage="No NPCs in this scene yet"
            />

            {/* Character Detail Modal */}
            <CharacterDetailModal
                character={selectedCharacter}
                relationships={selectedCharacterRelationships}
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onEdit={handleEdit}
            />
        </div>
    );
}

/**
 * CharacterTab Empty State - when no NPCs exist
 */
export function CharacterTabEmpty({
    className = '',
}: {
    className?: string;
}): ReactElement {
    return (
        <div className={`character-tab-empty ${className}`}>
            <span className="empty-icon">👥</span>
            <h3 className="empty-title">No Characters Yet</h3>
            <p className="empty-description">
                NPCs will appear here when the story introduces them.
            </p>
        </div>
    );
}

export default CharacterTab;