import { getClothingEmoji } from '@/lib/erosParser';
import type { ClothingSlots, ErosStatusState } from '@/types/eros-status';

interface InventoryPanelProps {
  clothingSlots?: ClothingSlots;
  inventory?: ErosStatusState['inventory'];
  characterName?: string;
}

const SLOTS = [
  { key: 'head', label: 'Head' },
  { key: 'upper', label: 'Upper' },
  { key: 'lower', label: 'Lower' },
  { key: 'underwear', label: 'Underwear' },
  { key: 'footwear', label: 'Footwear' },
  { key: 'accessories', label: 'Extras' },
];

export function InventoryPanel({ clothingSlots, inventory, characterName }: InventoryPanelProps) {
  const name = characterName || '?';
  return (
    <div
      className="mx-3 mb-2 rounded overflow-hidden"
      style={{ border: '1px solid var(--terminal-border)' }}
    >
      <div
        className="px-3 py-1.5"
        style={{ background: 'color-mix(in srgb, var(--neon-cyan) 10%, transparent)', borderBottom: '1px solid var(--terminal-border)' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs">🎒</span>
          <span className="text-xs font-mono font-bold neon-cyan tracking-widest">INVENTORY</span>
          <span className="text-xs font-mono text-gray-600">—</span>
          <span className="text-xs font-mono" style={{ color: 'var(--neon-cyan)AA' }}>
            {name}
          </span>
        </div>
      </div>
      <div className="px-3 py-1.5" style={{ background: 'var(--terminal-bg)' }}>
        {SLOTS.map(({ key, label }) => {
          const slotKey = key as keyof ClothingSlots;
          const value = clothingSlots?.[slotKey] || 'None';
          const emoji = getClothingEmoji(slotKey, value);
          const isEmpty = !value || value.toLowerCase() === 'none';
          return (
            <div
              key={key}
              className="flex items-start gap-2 py-0.5 text-xs font-mono border-b"
              style={{ borderColor: 'color-mix(in srgb, var(--neon-cyan) 8%, transparent)' }}
            >
              <span className="flex-shrink-0 text-sm w-5 text-center">{emoji}</span>
              <span className="w-20 flex-shrink-0" style={{ color: 'color-mix(in srgb, var(--neon-cyan) 70%, transparent)' }}>
                {label}:
              </span>
              <span style={{ color: isEmpty ? 'var(--terminal-text-faint)' : '#e2e8f0' }}>{value}</span>
            </div>
          );
        })}
        {inventory?.items && inventory.items.length > 0 && (
          <div className="flex items-start gap-2 py-0.5 text-xs font-mono mt-0.5">
            <span className="flex-shrink-0 text-sm w-5 text-center">🎒</span>
            <span className="w-20 flex-shrink-0" style={{ color: 'color-mix(in srgb, var(--neon-cyan) 70%, transparent)' }}>
              Items:
            </span>
            <span className="text-gray-300">{inventory.items.map((i) => i.name).join(', ')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
