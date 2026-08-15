import { useState } from 'react';
import type { BodyState, CharacterState } from '@/types/eros-status';

interface BodyDescPanelProps {
  body?: BodyState;
  character?: CharacterState;
}

const BODY_PARTS = [
  { key: 'hair', label: 'Hair', emoji: '💇' },
  { key: 'eyes', label: 'Eyes', emoji: '👁️' },
  { key: 'face', label: 'Face', emoji: '😊' },
  { key: 'neck', label: 'Neck', emoji: '🫀' },
  { key: 'chest', label: 'Chest', emoji: '🫁' },
  { key: 'bust', label: 'Bust', emoji: '👙' },
  { key: 'waist', label: 'Waist', emoji: '📏' },
  { key: 'hips', label: 'Hips', emoji: '🍑' },
  { key: 'legs', label: 'Legs', emoji: '🦵' },
  { key: 'feet', label: 'Feet', emoji: '🦶' },
  { key: 'tail', label: 'Tail', emoji: '🐄' },
  { key: 'horns', label: 'Horns', emoji: '🐮' },
  { key: 'special', label: 'Special', emoji: '✨' },
];

export function BodyDescPanel({ body, character }: BodyDescPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const desc = body?.description || {};
  const parts = BODY_PARTS.filter((p) => desc[p.key as keyof typeof desc]);
  if (parts.length === 0) return null;

  return (
    <div
      className="mx-3 mb-2 rounded overflow-hidden"
      style={{ border: '1px solid color-mix(in srgb, var(--neon-gold) 30%, transparent)' }}
    >
      <div
        className="px-3 py-1.5 flex items-center justify-between cursor-pointer"
        style={{
          background: 'color-mix(in srgb, var(--neon-gold) 8%, transparent)',
          borderBottom: expanded ? '1px solid color-mix(in srgb, var(--neon-gold) 20%, transparent)' : 'none',
        }}
        onClick={() => setExpanded((e) => !e)}
      >
        <span className="text-xs font-mono font-bold neon-gold tracking-widest">🧬 BODY DESCRIPTION</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">{character?.name || ''}</span>
          <span className="text-xs font-mono" style={{ color: 'color-mix(in srgb, var(--neon-gold) 60%, transparent)' }}>
            {expanded ? '▲' : '▼'}
          </span>
        </div>
      </div>
      {expanded && (
        <div className="px-3 py-1.5" style={{ background: 'var(--terminal-bg)' }}>
          {parts.map(({ key, label, emoji }) => (
            <div
              key={key}
              className="flex items-start gap-2 py-0.5 text-xs font-mono border-b"
              style={{ borderColor: 'color-mix(in srgb, var(--neon-gold) 8%, transparent)' }}
            >
              <span className="flex-shrink-0 text-sm w-5 text-center">{emoji}</span>
              <span className="w-16 flex-shrink-0" style={{ color: 'color-mix(in srgb, var(--neon-gold) 70%, transparent)' }}>
                {label}:
              </span>
              <span className="text-gray-300 leading-relaxed">{desc[key as keyof typeof desc]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
