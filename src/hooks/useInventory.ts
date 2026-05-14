/**
 * useInventory Hook
 * React hook for inventory state management with messageState persistence
 */

import { useState, useCallback, useMemo } from 'react';
import type { InventoryItem, InventoryState } from '../types/eros-status';
import {
    addItem as addItemHelper,
    removeItem as removeItemHelper,
    updateItemQuantity as updateQuantityHelper,
    getItemByName as getItemHelper,
    getItemsByCategory as getByCategoryHelper,
    getAllCategories as getCategoriesHelper,
    isInventoryFull as checkFullHelper,
    getAvailableSlots as getSlotsHelper,
    toggleItemEquipped as toggleEquippedHelper,
    getTotalItemCount as getTotalCountHelper,
    createInventoryState,
} from '../utils/inventory';

export interface UseInventoryReturn {
    // State
    inventory: InventoryState;
    items: InventoryItem[];
    categories: string[];
    isFull: boolean;
    availableSlots: number;
    totalItemCount: number;

    // Actions
    addItem: (item: Omit<InventoryItem, 'id'>) => boolean;
    removeItem: (itemName: string) => boolean;
    updateQuantity: (itemName: string, quantity: number) => boolean;
    getItem: (itemName: string) => InventoryItem | undefined;
    getByCategory: (category: string) => InventoryItem[];
    toggleEquipped: (itemName: string) => boolean;
    selectItem: (itemId: string | undefined) => void;
    setCurrency: (amount: number) => void;
    resetInventory: () => void;
    setInventory: (inventory: InventoryState) => void;
}

export interface UseInventoryOptions {
    maxSlots?: number;
    initialCurrency?: number;
    onInventoryChange?: (inventory: InventoryState) => void;
}

/**
 * Create and manage inventory state with helper functions
 */
export function useInventory(
    initialInventory?: InventoryState,
    options: UseInventoryOptions = {}
): UseInventoryReturn {
    const {
        maxSlots = 20,
        initialCurrency = 0,
        onInventoryChange,
    } = options;

    // Initialize state
    const [inventory, setInventoryState] = useState<InventoryState>(() => {
        if (initialInventory) {
            return initialInventory;
        }
        return createInventoryState(maxSlots, initialCurrency);
    });

    // Derived state - memoized for performance
    const items = useMemo(() => inventory.items, [inventory.items]);
    const categories = useMemo(() => getCategoriesHelper(inventory.items), [inventory.items]);
    const isFull = useMemo(() => checkFullHelper(inventory), [inventory.items, inventory.maxSlots]);
    const availableSlots = useMemo(() => getSlotsHelper(inventory), [inventory.items, inventory.maxSlots]);
    const totalItemCount = useMemo(() => getTotalCountHelper(inventory.items), [inventory.items]);

    // Action: Add item
    const addItem = useCallback((newItem: Omit<InventoryItem, 'id'>): boolean => {
        // Check if inventory is full before adding new item (not existing)
        const existingItem = getItemHelper(inventory.items, newItem.name);
        if (!existingItem && isFull) {
            console.warn('[Inventory] Cannot add item - inventory full');
            return false;
        }

        const newItems = addItemHelper(inventory.items, newItem);
        const newInventory = { ...inventory, items: newItems };
        
        setInventoryState(newInventory);
        onInventoryChange?.(newInventory);
        
        return true;
    }, [inventory, isFull, onInventoryChange]);

    // Action: Remove item
    const removeItem = useCallback((itemName: string): boolean => {
        const newItems = removeItemHelper(inventory.items, itemName);
        
        // Check if item was actually removed (existed)
        if (newItems.length === inventory.items.length) {
            console.warn('[Inventory] Item not found:', itemName);
            return false;
        }

        const newInventory = { ...inventory, items: newItems };
        setInventoryState(newInventory);
        onInventoryChange?.(newInventory);
        
        return true;
    }, [inventory, onInventoryChange]);

    // Action: Update quantity
    const updateQuantity = useCallback((itemName: string, quantity: number): boolean => {
        const newItems = updateQuantityHelper(inventory.items, itemName, quantity);
        
        // Check if item was found
        const itemExists = getItemHelper(inventory.items, itemName);
        if (!itemExists && quantity > 0) {
            console.warn('[Inventory] Item not found:', itemName);
            return false;
        }

        const newInventory = { ...inventory, items: newItems };
        setInventoryState(newInventory);
        onInventoryChange?.(newInventory);
        
        return true;
    }, [inventory, onInventoryChange]);

    // Action: Get item by name
    const getItem = useCallback((itemName: string): InventoryItem | undefined => {
        return getItemHelper(inventory.items, itemName);
    }, [inventory.items]);

    // Action: Get items by category
    const getByCategory = useCallback((category: string): InventoryItem[] => {
        return getByCategoryHelper(inventory.items, category);
    }, [inventory.items]);

    // Action: Toggle equipped status
    const toggleEquipped = useCallback((itemName: string): boolean => {
        const newItems = toggleEquippedHelper(inventory.items, itemName);
        
        // Check if item was found
        const wasFound = getItemHelper(inventory.items, itemName);
        if (!wasFound) {
            console.warn('[Inventory] Item not found:', itemName);
            return false;
        }

        const newInventory = { ...inventory, items: newItems };
        setInventoryState(newInventory);
        onInventoryChange?.(newInventory);
        
        return true;
    }, [inventory, onInventoryChange]);

    // Action: Select item
    const selectItem = useCallback((itemId: string | undefined): void => {
        setInventoryState(prev => ({ ...prev, selectedItem: itemId }));
    }, []);

    // Action: Set currency
    const setCurrency = useCallback((amount: number): void => {
        const newInventory = { 
            ...inventory, 
            currency: Math.max(0, Math.round(amount)) 
        };
        setInventoryState(newInventory);
        onInventoryChange?.(newInventory);
    }, [inventory, onInventoryChange]);

    // Action: Reset inventory
    const resetInventory = useCallback((): void => {
        const newInventory = createInventoryState(maxSlots, initialCurrency);
        setInventoryState(newInventory);
        onInventoryChange?.(newInventory);
    }, [maxSlots, initialCurrency, onInventoryChange]);

    // Action: Set inventory from external (e.g., messageState)
    const setInventory = useCallback((newInventory: InventoryState): void => {
        setInventoryState(newInventory);
        onInventoryChange?.(newInventory);
    }, [onInventoryChange]);

    return {
        // State
        inventory,
        items,
        categories,
        isFull,
        availableSlots,
        totalItemCount,

        // Actions
        addItem,
        removeItem,
        updateQuantity,
        getItem,
        getByCategory,
        toggleEquipped,
        selectItem,
        setCurrency,
        resetInventory,
        setInventory,
    };
}

export default useInventory;