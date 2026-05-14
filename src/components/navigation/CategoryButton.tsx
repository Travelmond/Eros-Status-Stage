/**
 * Eros Status - CategoryButton Component
 * Individual category button for navigation
 * Phase 2.2 - Category Tabs Navigation
 */

import { ReactElement } from 'react';

export interface CategoryButtonProps {
    /** Category identifier */
    id: string;
    /** Display label */
    label: string;
    /** Icon emoji or text */
    icon?: string;
    /** Whether the button is active/selected */
    isActive?: boolean;
    /** Click handler */
    onClick?: (id: string) => void;
    /** Group color theme: 'green' | 'blue' | 'red' | 'purple' */
    colorTheme?: 'green' | 'blue' | 'red' | 'purple';
    /** Disabled state */
    disabled?: boolean;
    /** Additional CSS class */
    className?: string;
}

/**
 * CategoryButton Component
 * Individual clickable category button with icon and label
 */
export function CategoryButton({
    id,
    label,
    icon,
    isActive = false,
    onClick,
    colorTheme = 'green',
    disabled = false,
    className = '',
}: CategoryButtonProps): ReactElement {
    const handleClick = () => {
        if (!disabled && onClick) {
            onClick(id);
        }
    };

    const colorThemeClass = `category-btn--${colorTheme}`;

    return (
        <button
            type="button"
            className={`category-btn ${colorThemeClass} ${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''} ${className}`}
            onClick={handleClick}
            disabled={disabled}
            aria-pressed={isActive}
            data-category-id={id}
        >
            {icon && <span className="category-btn__icon">{icon}</span>}
            <span className="category-btn__label">{label}</span>
        </button>
    );
}

/**
 * CategoryButtonGroup - Container for multiple category buttons
 */
export function CategoryButtonGroup({
    categories,
    activeCategory,
    onCategoryClick,
    colorTheme = 'green',
    className = '',
}: {
    categories: Array<{ id: string; label: string; icon?: string }>;
    activeCategory?: string;
    onCategoryClick: (id: string) => void;
    colorTheme?: 'green' | 'blue' | 'red' | 'purple';
    className?: string;
}): ReactElement {
    return (
        <div className={`category-btn-group category-btn-group--${colorTheme} ${className}`}>
            {categories.map((category) => (
                <CategoryButton
                    key={category.id}
                    id={category.id}
                    label={category.label}
                    icon={category.icon}
                    colorTheme={colorTheme}
                    isActive={activeCategory === category.id}
                    onClick={onCategoryClick}
                />
            ))}
        </div>
    );
}

export default CategoryButton;