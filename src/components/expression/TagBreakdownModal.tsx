/**
 * Eros Status - TagBreakdownModal Component
 * Shows tags organized by category with toggle and copy functionality
 * Phase 3.3 - Expression/Pose Section
 */

import { ReactElement, memo, useState, useCallback, useMemo } from 'react';

export type TagCategory = 'Character' | 'Expression' | 'Pose' | 'Clothing' | 'Environment' | 'Quality';

export interface Tag {
    /** Tag name */
    name: string;
    /** Category */
    category: TagCategory;
    /** Whether tag is enabled */
    enabled: boolean;
}

export interface TagBreakdownModalProps {
    /** Array of tags */
    tags: Tag[];
    /** Whether modal is open */
    isOpen: boolean;
    /** Callback when modal is closed */
    onClose: () => void;
    /** Callback when tag enabled state changes */
    onToggleTag?: (tagName: string, enabled: boolean) => void;
    /** Additional CSS class names */
    className?: string;
}

/**
 * Get category icon
 */
function getCategoryIcon(category: TagCategory): string {
    const iconMap: Record<TagCategory, string> = {
        Character: '👤',
        Expression: '😊',
        Pose: '🧍',
        Clothing: '👗',
        Environment: '🌿',
        Quality: '✨'
    };
    return iconMap[category];
}

/**
 * Copy text to clipboard
 */
async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        return false;
    }
}

/**
 * TagBreakdownModal Component
 * Displays tags organized by category with toggle and copy functionality
 */
export function TagBreakdownModal({
    tags,
    isOpen,
    onClose,
    onToggleTag,
    className = ''
}: TagBreakdownModalProps): ReactElement {
    const [copiedType, setCopiedType] = useState<'selected' | 'all' | null>(null);

    // Group tags by category
    const tagsByCategory = useMemo(() => {
        const grouped: Record<TagCategory, Tag[]> = {
            Character: [],
            Expression: [],
            Pose: [],
            Clothing: [],
            Environment: [],
            Quality: []
        };

        tags.forEach(tag => {
            if (grouped[tag.category]) {
                grouped[tag.category].push(tag);
            }
        });

        return grouped;
    }, [tags]);

    // Get enabled tags
    const enabledTags = useMemo(() => {
        return tags.filter(tag => tag.enabled);
    }, [tags]);

    // Get all tags text
    const allTagsText = useMemo(() => {
        return tags.map(tag => tag.name).join(', ');
    }, [tags]);

    // Get selected tags text
    const selectedTagsText = useMemo(() => {
        return enabledTags.map(tag => tag.name).join(', ');
    }, [enabledTags]);

    const handleToggleTag = useCallback((tag: Tag) => {
        onToggleTag?.(tag.name, !tag.enabled);
    }, [onToggleTag]);

    const handleCopySelected = useCallback(async () => {
        const success = await copyToClipboard(selectedTagsText);
        if (success) {
            setCopiedType('selected');
            setTimeout(() => setCopiedType(null), 2000);
        }
    }, [selectedTagsText]);

    const handleCopyAll = useCallback(async () => {
        const success = await copyToClipboard(allTagsText);
        if (success) {
            setCopiedType('all');
            setTimeout(() => setCopiedType(null), 2000);
        }
    }, [allTagsText]);

    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    if (!isOpen) return <></>;

    const categories: TagCategory[] = ['Character', 'Expression', 'Pose', 'Clothing', 'Environment', 'Quality'];

    return (
        <>
            {/* Overlay */}
            <div
                className="tag-modal-overlay"
                onClick={handleClose}
                role="presentation"
            />

            {/* Modal */}
            <div className={`tag-breakdown-modal ${className}`} role="dialog" aria-modal="true" aria-labelledby="tag-modal-title">
                {/* Header */}
                <div className="tag-modal-header">
                    <h2 id="tag-modal-title" className="tag-modal-title">Tag Breakdown</h2>
                    <button
                        className="tag-modal-close"
                        onClick={handleClose}
                        type="button"
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>

                {/* Summary */}
                <div className="tag-modal-summary">
                    <span className="summary-text">
                        {enabledTags.length} of {tags.length} tags selected
                    </span>
                </div>

                {/* Content */}
                <div className="tag-modal-content">
                    {categories.map(category => {
                        const categoryTags = tagsByCategory[category];
                        if (categoryTags.length === 0) return null;

                        const enabledCount = categoryTags.filter(t => t.enabled).length;

                        return (
                            <div key={category} className="tag-category-section">
                                <div className="category-header">
                                    <span className="category-icon">{getCategoryIcon(category)}</span>
                                    <span className="category-name">{category}</span>
                                    <span className="category-count">
                                        {enabledCount}/{categoryTags.length}
                                    </span>
                                </div>
                                <div className="category-tags">
                                    {categoryTags.map(tag => (
                                        <button
                                            key={tag.name}
                                            className={`tag-toggle ${tag.enabled ? 'enabled' : 'disabled'}`}
                                            onClick={() => handleToggleTag(tag)}
                                            type="button"
                                            aria-pressed={tag.enabled}
                                        >
                                            <span className="tag-checkbox">
                                                {tag.enabled ? '✓' : ''}
                                            </span>
                                            <span className="tag-name">{tag.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer Actions */}
                <div className="tag-modal-actions">
                    <button
                        className={`tag-action-button ${copiedType === 'selected' ? 'success' : ''}`}
                        onClick={handleCopySelected}
                        type="button"
                        disabled={enabledTags.length === 0}
                    >
                        {copiedType === 'selected' ? '✓ Copied' : `Copy Selected (${enabledTags.length})`}
                    </button>
                    <button
                        className={`tag-action-button secondary ${copiedType === 'all' ? 'success' : ''}`}
                        onClick={handleCopyAll}
                        type="button"
                        disabled={tags.length === 0}
                    >
                        {copiedType === 'all' ? '✓ Copied' : `Copy All (${tags.length})`}
                    </button>
                </div>
            </div>
        </>
    );
}

/**
 * TagBreakdownModal Skeleton - Loading state
 */
export function TagBreakdownModalSkeleton(): ReactElement {
    return (
        <>
            <div className="tag-modal-overlay" />
            <div className="tag-breakdown-modal-skeleton">
                <div className="skeleton-header" />
                <div className="skeleton-content">
                    <div className="skeleton-category" />
                    <div className="skeleton-category" />
                    <div className="skeleton-category" />
                </div>
                <div className="skeleton-actions" />
            </div>
        </>
    );
}

export default TagBreakdownModal;