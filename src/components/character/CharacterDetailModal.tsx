/**
 * Eros Status - CharacterDetailModal Component
 * Slide-out panel showing full character details
 * Phase 3.2 - Character Management
 */

import { ReactElement, useCallback, useMemo, useEffect } from 'react';
import { NPCData, RelationshipData } from '../../types/eros-status';

export interface CharacterDetailModalProps {
    /** Character to display */
    character: NPCData | null;
    /** Relationship data for this character */
    relationships?: RelationshipData[];
    /** Whether modal is open */
    isOpen: boolean;
    /** Callback when modal closes */
    onClose?: () => void;
    /** Callback for edit action */
    onEdit?: (character: NPCData) => void;
    /** Additional CSS class names */
    className?: string;
}

/**
 * Get importance label with color
 */
function getImportanceInfo(importance: NPCData['importance']): { label: string; color: string } {
    switch (importance) {
        case 'main':
            return { label: 'Main Character', color: 'var(--eros-affection)' };
        case 'secondary':
            return { label: 'Secondary Character', color: 'var(--eros-libido)' };
        case 'minor':
            return { label: 'Minor Character', color: 'var(--eros-text-muted)' };
        default:
            return { label: 'NPC', color: 'var(--eros-text-secondary)' };
    }
}

/**
 * Get affection stage label
 */
function getAffectionStage(affection: number): string {
    if (affection >= 80) return 'Deeply in Love';
    if (affection >= 60) return 'Very Fond';
    if (affection >= 40) return 'Interested';
    if (affection >= 20) return 'Neutral';
    return 'Cold';
}

/**
 * Get affection color based on value
 */
function getAffectionColor(affection: number): string {
    if (affection >= 80) return 'var(--eros-affection)';
    if (affection >= 60) return 'var(--eros-affection-light)';
    if (affection >= 40) return 'var(--eros-libido)';
    if (affection >= 20) return 'var(--eros-time)';
    return 'var(--eros-text-muted)';
}

/**
 * Render hearts based on affection value
 */
function renderAffectionHearts(affection: number): string {
    const filledHearts = Math.floor(affection / 20);
    const emptyHearts = 5 - filledHearts;
    return '❤️'.repeat(filledHearts) + '♡'.repeat(emptyHearts);
}

/**
 * CharacterDetailModal Component
 * Full detail view for a selected NPC
 */
export function CharacterDetailModal({
    character,
    relationships = [],
    isOpen,
    onClose,
    onEdit,
    className = '',
}: CharacterDetailModalProps): ReactElement {
    // Handle close
    const handleClose = useCallback(() => {
        if (onClose) {
            onClose();
        }
    }, [onClose]);

    // Handle edit
    const handleEdit = useCallback(() => {
        if (character && onEdit) {
            onEdit(character);
        }
    }, [character, onEdit]);

    // Handle overlay click
    const handleOverlayClick = useCallback(() => {
        handleClose();
    }, [handleClose]);

    // Handle escape key
    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, handleClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Get importance info
    const importanceInfo = useMemo(
        () => character ? getImportanceInfo(character.importance) : { label: '', color: '' },
        [character]
    );

    // If no character, return null
    if (!character) {
        return <div className={`character-detail-modal ${className}`} />;
    }

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="character-modal-overlay"
                    onClick={handleOverlayClick}
                    role="presentation"
                />
            )}

            {/* Modal Panel */}
            <div className={`character-detail-modal ${isOpen ? 'open' : ''} ${className}`}>
                {/* Header */}
                <div className="character-modal-header">
                    <div className="character-modal-title-section">
                        <h2 className="character-modal-title">{character.name}</h2>
                        <span
                            className="character-modal-importance"
                            style={{ color: importanceInfo.color }}
                        >
                            {importanceInfo.label}
                        </span>
                    </div>
                    <div className="character-modal-actions">
                        {onEdit && (
                            <button
                                className="character-modal-edit"
                                onClick={handleEdit}
                                type="button"
                            >
                                ✏️ Edit
                            </button>
                        )}
                        <button
                            className="character-modal-close"
                            onClick={handleClose}
                            aria-label="Close"
                            type="button"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="character-modal-content">
                    {/* Avatar Section */}
                    <div className="character-modal-avatar-section">
                        <div className="character-modal-avatar">
                            {character.avatarUrl ? (
                                <img
                                    src={character.avatarUrl}
                                    alt={`${character.name}'s avatar`}
                                    className="avatar-image"
                                />
                            ) : (
                                <div className="avatar-placeholder">
                                    <span className="avatar-initial">
                                        {character.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            {character.isInScene && (
                                <span className="avatar-scene-badge" title="Currently in scene">
                                    🎬 In Scene
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Basic Info Section */}
                    <div className="character-modal-section">
                        <h3 className="section-title">Basic Information</h3>
                        <div className="section-content">
                            <div className="info-row">
                                <span className="info-label">Role:</span>
                                <span className="info-value">{character.role}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Relationship:</span>
                                <span className="info-value">{character.relationship}</span>
                            </div>
                        </div>
                    </div>

                    {/* Affection Section */}
                    <div className="character-modal-section">
                        <h3 className="section-title">Relationship Status</h3>
                        <div className="section-content">
                            <div className="affection-display">
                                <div className="affection-hearts">
                                    {renderAffectionHearts(character.affection)}
                                </div>
                                <div className="affection-bar">
                                    <div
                                        className="affection-bar-fill"
                                        style={{
                                            width: `${character.affection}%`,
                                            backgroundColor: getAffectionColor(character.affection),
                                        }}
                                    />
                                </div>
                                <span
                                    className="affection-value"
                                    style={{ color: getAffectionColor(character.affection) }}
                                >
                                    {character.affection}% - {getAffectionStage(character.affection)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Notes Section */}
                    {character.notes && (
                        <div className="character-modal-section">
                            <h3 className="section-title">Notes</h3>
                            <div className="section-content">
                                <p className="notes-content">{character.notes}</p>
                            </div>
                        </div>
                    )}

                    {/* Relationships Section */}
                    {relationships.length > 0 && (
                        <div className="character-modal-section">
                            <h3 className="section-title">Relationships</h3>
                            <div className="section-content">
                                {relationships.map((rel, index) => (
                                    <div key={index} className="relationship-item">
                                        <span className="relationship-type">{rel.type}</span>
                                        <span className="relationship-strength">
                                            Strength: {rel.strength}%
                                        </span>
                                        {rel.isRomantic && (
                                            <span className="relationship-romantic">💕</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default CharacterDetailModal;