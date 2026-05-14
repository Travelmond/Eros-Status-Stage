/**
 * Eros Status - Character Components Index
 * Phase 3.2 - Character Management
 */

// Character Card
export { CharacterCard, CharacterCardSkeleton } from './CharacterCard';
export type { CharacterCardProps } from './CharacterCard';

// Character List
export { CharacterList } from './CharacterList';
export type { CharacterFilter, CharacterListProps } from './CharacterList';

// Character Detail Modal
export { CharacterDetailModal } from './CharacterDetailModal';
export type { CharacterDetailModalProps } from './CharacterDetailModal';

// Character Tab
export { CharacterTab, CharacterTabEmpty } from './CharacterTab';
export type { CharacterTabProps } from './CharacterTab';

// Re-export types
export type { NPCData, CharacterCard as CharacterCardData } from '../../types/eros-status';