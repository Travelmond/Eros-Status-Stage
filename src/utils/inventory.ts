/**
 * Inventory Management Helper Functions
 * Pure functions for inventory CRUD operations
 */

import type { InventoryItem, InventoryState } from '../types/eros-status';

/**
 * Generate a unique ID for inventory items
 */
export function generateItemId(): string {
    return `item_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Add a new item to the inventory
 * If item with same name exists, increases quantity instead
 */
export function addItem(
    items: InventoryItem[],
    newItem: Omit<InventoryItem, 'id'>
): InventoryItem[] {
    // Check if item with same name already exists
    const existingIndex = items.findIndex(
        item => item.name.toLowerCase() === newItem.name.toLowerCase()
    );

    if (existingIndex >= 0) {
        // Increase quantity of existing item
        return items.map((item, index) =>
            index === existingIndex
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
        );
    }

    // Add new item with generated ID
    return [...items, { ...newItem, id: generateItemId() }];
}

/**
 * Remove an item from inventory by name
 */
export function removeItem(items: InventoryItem[], itemName: string): InventoryItem[] {
    const targetItem = items.find(
        item => item.name.toLowerCase() === itemName.toLowerCase()
    );

    if (!targetItem) {
        return items;
    }

    // If quantity > 1, decrease by 1 instead of removing
    if (targetItem.quantity > 1) {
        return items.map(item =>
            item.id === targetItem.id
                ? { ...item, quantity: item.quantity - 1 }
                : item
        );
    }

    // Otherwise remove completely
    return items.filter(item => item.id !== targetItem.id);
}

/**
 * Update the quantity of a specific item
 * If quantity <= 0, removes the item
 */
export function updateItemQuantity(
    items: InventoryItem[],
    itemName: string,
    quantity: number
): InventoryItem[] {
    const targetItem = items.find(
        item => item.name.toLowerCase() === itemName.toLowerCase()
    );

    if (!targetItem) {
        return items;
    }

    // If new quantity is <= 0, remove the item
    if (quantity <= 0) {
        return items.filter(item => item.id !== targetItem.id);
    }

    // Update quantity
    return items.map(item =>
        item.id === targetItem.id
            ? { ...item, quantity }
            : item
    );
}

/**
 * Find an item in inventory by name
 */
export function getItemByName(
    items: InventoryItem[],
    itemName: string
): InventoryItem | undefined {
    return items.find(
        item => item.name.toLowerCase() === itemName.toLowerCase()
    );
}

/**
 * Filter items by category
 */
export function getItemsByCategory(
    items: InventoryItem[],
    category: string
): InventoryItem[] {
    return items.filter(
        item => item.category.toLowerCase() === category.toLowerCase()
    );
}

/**
 * Get all unique categories in inventory
 */
export function getAllCategories(items: InventoryItem[]): string[] {
    const categories = new Set<string>();
    items.forEach(item => categories.add(item.category));
    return Array.from(categories).sort();
}

/**
 * Check if inventory is full
 */
export function isInventoryFull(inventory: InventoryState): boolean {
    return inventory.items.length >= inventory.maxSlots;
}

/**
 * Get available slot count
 */
export function getAvailableSlots(inventory: InventoryState): number {
    return Math.max(0, inventory.maxSlots - inventory.items.length);
}

/**
 * Create a complete inventory state
 */
export function createInventoryState(
    maxSlots: number = 20,
    currency: number = 0
): InventoryState {
    return {
        items: [],
        maxSlots,
        currency,
    };
}

/**
 * Toggle equipped status of an item
 */
export function toggleItemEquipped(
    items: InventoryItem[],
    itemName: string
): InventoryItem[] {
    const targetItem = items.find(
        item => item.name.toLowerCase() === itemName.toLowerCase()
    );

    if (!targetItem) {
        return items;
    }

    return items.map(item =>
        item.id === targetItem.id
            ? { ...item, equipped: !item.equipped }
            : item
    );
}

/**
 * Get total item count (sum of all quantities)
 */
export function getTotalItemCount(items: InventoryItem[]): number {
    return items.reduce((total, item) => total + item.quantity, 0);
}