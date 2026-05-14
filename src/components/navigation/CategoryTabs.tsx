/**
 * Eros Status - CategoryTabs Component
 * Grouped category navigation tabs with color-coded groups
 * Phase 2.2 - Category Tabs Navigation
 */

import { ReactElement, useState } from 'react';
import { CategoryButton, CategoryButtonProps } from './CategoryButton';

export interface CategoryGroup {
    /** Group identifier */
    id: string;
    /** Display label */
    label: string;
    /** Group color theme */
    colorTheme: 'green' | 'blue' | 'red' | 'purple';
    /** Group icon */
    icon: string;
    /** Categories within this group */
    categories: Array<{
        id: string;
        label: string;
        icon?: string;
    }>;
}

export interface CategoryTabsProps {
    /** All category groups */
    groups: CategoryGroup[];
    /** Currently active group */
    activeGroup?: string;
    /** Currently active category within the group */
    activeCategory?: string;
    /** Callback when group changes */
    onGroupChange?: (groupId: string) => void;
    /** Callback when category changes */
    onCategoryChange?: (categoryId: string) => void;
    /** Whether to show category buttons */
    showCategories?: boolean;
    /** Additional CSS class */
    className?: string;
}

/**
 * Default category groups for Eros Status
 */
export const DEFAULT_CATEGORY_GROUPS: CategoryGroup[] = [
    {
        id: 'progression',
        label: 'PROGRESSION',
        colorTheme: 'green',
        icon: '🟢',
        categories: [
            { id: 'affection', label: 'Affection', icon: '💕' },
            { id: 'obedience', label: 'Obedience', icon: '🎯' },
            { id: 'libido', label: 'Libido', icon: '🔥' },
            { id: 'arousal', label: 'Arousal', icon: '💋' },
        ],
    },
    {
        id: 'body',
        label: 'BODY & CLOTHING',
        colorTheme: 'blue',
        icon: '🔵',
        categories: [
            { id: 'clothing', label: 'Clothing', icon: '👗' },
            { id: 'body-state', label: 'Body State', icon: '💫' },
            { id: 'genitalia', label: 'Genitalia', icon: '🌸' },
        ],
    },
    {
        id: 'scene',
        label: 'SCENE',
        colorTheme: 'red',
        icon: '🔴',
        categories: [
            { id: 'location', label: 'Location', icon: '📍' },
            { id: 'time', label: 'Time', icon: '⏰' },
            { id: 'sex-module', label: 'Sex Module', icon: '🎮' },
            { id: 'ntr', label: 'NTR', icon: '💔' },
        ],
    },
    {
        id: 'extras',
        label: 'EXTRAS',
        colorTheme: 'purple',
        icon: '🟣',
        categories: [
            { id: 'expressions', label: 'Expressions', icon: '😊' },
            { id: 'moments', label: 'Moments', icon: '📸' },
            { id: 'inventory', label: 'Inventory', icon: '🎒' },
            { id: 'characters', label: 'Characters', icon: '👥' },
        ],
    },
];

/**
 * CategoryTabs Component
 * Main navigation component with expandable groups
 */
export function CategoryTabs({
    groups = DEFAULT_CATEGORY_GROUPS,
    activeGroup,
    activeCategory,
    onGroupChange,
    onCategoryChange,
    showCategories = true,
    className = '',
}: CategoryTabsProps): ReactElement {
    const [expandedGroup, setExpandedGroup] = useState<string | null>(
        activeGroup || groups[0]?.id || null
    );

    const handleGroupClick = (groupId: string) => {
        // Toggle expansion
        if (expandedGroup === groupId) {
            setExpandedGroup(null);
        } else {
            setExpandedGroup(groupId);
        }

        // Notify parent
        if (onGroupChange) {
            onGroupChange(groupId);
        }
    };

    const handleCategoryClick = (categoryId: string) => {
        if (onCategoryChange) {
            onCategoryChange(categoryId);
        }
    };

    const getGroupColorClass = (colorTheme: CategoryButtonProps['colorTheme']) => {
        return `category-tabs__group--${colorTheme}`;
    };

    return (
        <div className={`category-tabs ${className}`} role="tablist">
            {groups.map((group) => {
                const isExpanded = expandedGroup === group.id;
                const isActive = activeGroup === group.id;

                return (
                    <div
                        key={group.id}
                        className={`category-tabs__group ${getGroupColorClass(group.colorTheme)} ${isExpanded ? 'expanded' : ''} ${isActive ? 'active' : ''}`}
                        role="group"
                        aria-labelledby={`group-label-${group.id}`}
                    >
                        {/* Group Header Button */}
                        <button
                            type="button"
                            id={`group-label-${group.id}`}
                            className={`category-tabs__group-header`}
                            onClick={() => handleGroupClick(group.id)}
                            aria-expanded={isExpanded}
                            aria-controls={`group-content-${group.id}`}
                        >
                            <span className="category-tabs__group-icon">{group.icon}</span>
                            <span className="category-tabs__group-label">{group.label}</span>
                            <span
                                className={`category-tabs__group-arrow ${isExpanded ? 'rotated' : ''}`}
                                aria-hidden="true"
                            >
                                ▼
                            </span>
                        </button>

                        {/* Group Content - Categories */}
                        {showCategories && (
                            <div
                                id={`group-content-${group.id}`}
                                className={`category-tabs__group-content ${isExpanded ? 'visible' : 'hidden'}`}
                                role="list"
                                aria-hidden={!isExpanded}
                            >
                                <div className="category-tabs__categories">
                                    {group.categories.map((category) => (
                                        <button
                                            key={category.id}
                                            type="button"
                                            className={`category-tabs__category ${activeCategory === category.id ? 'active' : ''}`}
                                            onClick={() => handleCategoryClick(category.id)}
                                            role="listitem"
                                            aria-selected={activeCategory === category.id}
                                        >
                                            {category.icon && (
                                                <span className="category-tabs__category-icon">
                                                    {category.icon}
                                                </span>
                                            )}
                                            <span className="category-tabs__category-label">
                                                {category.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

/**
 * Compact version of CategoryTabs - horizontal tabs without expandable content
 */
export function CategoryTabsCompact({
    groups = DEFAULT_CATEGORY_GROUPS,
    activeGroup,
    onGroupChange,
    className = '',
}: Omit<CategoryTabsProps, 'showCategories' | 'activeCategory' | 'onCategoryChange'>): ReactElement {
    return (
        <div className={`category-tabs-compact ${className}`} role="tablist">
            {groups.map((group) => {
                const isActive = activeGroup === group.id;

                return (
                    <button
                        key={group.id}
                        type="button"
                        className={`category-tabs-compact__tab ${getGroupColorClass(group.colorTheme)} ${isActive ? 'active' : ''}`}
                        onClick={() => onGroupChange?.(group.id)}
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={`panel-${group.id}`}
                    >
                        <span className="category-tabs-compact__tab-icon">{group.icon}</span>
                        <span className="category-tabs-compact__tab-label">{group.label}</span>
                    </button>
                );
            })}
        </div>
    );
}

function getGroupColorClass(colorTheme: CategoryButtonProps['colorTheme']) {
    return `category-tabs--${colorTheme}`;
}

export default CategoryTabs;