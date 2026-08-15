import { useState } from 'react';
import type { BodyState, CharacterState } from '@/types/eros-status';

interface BodyDescCharPanelProps {
  body?: BodyState;
  character?: CharacterState;
}

const BODY_SECTIONS = [
  {
    key: 'face_section',
    label: 'Face',
    emoji: '😊',
    fields: [
      { key: 'eyes', label: 'Eyes', emoji: '👁️' },
      { key: 'face', label: 'Face', emoji: '😊' },
      { key: 'hair', label: 'Hair', emoji: '💇' },
    ],
  },
  {
    key: 'chest_section',
    label: 'Chest',
    emoji: '👙',
    fields: [
      { key: 'chest', label: 'Chest/Bust', emoji: '🫁' },
      { key: 'bust', label: 'Bust Size', emoji: '📐' },
    ],
  },
  {
    key: 'abdomen_section',
    label: 'Abdomen',
    emoji: '🫁',
    fields: [{ key: 'waist', label: 'Waist/Abs', emoji: '📏' }],
  },
  {
    key: 'hips_section',
    label: 'Hips',
    emoji: '🍑',
    fields: [{ key: 'hips', label: 'Hips', emoji: '🍑' }],
  },
  {
    key: 'legs_feet',
    label: 'Legs & Feet',
    emoji: '🦵',
    fields: [
      { key: 'legs', label: 'Legs', emoji: '🦵' },
      { key: 'feet', label: 'Feet', emoji: '🦶' },
    ],
  },
  {
    key: 'special_section',
    label: 'Special Traits',
    emoji: '✨',
    fields: [
      { key: 'tail', label: 'Tail', emoji: '🐄' },
      { key: 'horns', label: 'Horns', emoji: '🐮' },
      { key: 'special', label: 'Special', emoji: '✨' },
    ],
  },
];

function DescField({ emoji, label, value }: { emoji: string; label: string; value?: string }) {
  if (!value) return null;
  return (
    <div
      className="flex items-start gap-2 py-0.5 text-xs font-mono border-b"
      style={{ borderColor: 'color-mix(in srgb, var(--neon-gold) 8%, transparent)' }}
    >
      <span className="flex-shrink-0 text-sm w-5 text-center">{emoji}</span>
      <span className="w-20 flex-shrink-0" style={{ color: 'color-mix(in srgb, var(--neon-gold) 70%, transparent)' }}>
        {label}:
      </span>
      <span className="text-gray-300 leading-relaxed">{value}</span>
    </div>
  );
}

export function BodyDescCharPanel({ body, character }: BodyDescCharPanelProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ face_section: true });
  const desc = body?.description || {};
  const toggleSection = (key: string) => setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  const visibleSections = BODY_SECTIONS.filter((section) => section.fields.some((f) => desc[f.key as keyof typeof desc]));

  if (visibleSections.length === 0) {
    return (
      <div
        className="mx-3 mb-2 rounded p-3 text-center"
        style={{ border: '1px solid color-mix(in srgb, var(--neon-gold) 20%, transparent)', background: 'var(--terminal-bg)' }}
      >
        <div className="text-xs font-mono text-gray-700">
          <div className="text-lg mb-1">🧬</div>
          No physical description data detected.
          <br />
          <span className="text-gray-800">AI must include body description fields.</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="mx-3 mb-2 rounded overflow-hidden"
      style={{ border: '1px solid color-mix(in srgb, var(--neon-gold) 30%, transparent)' }}
    >
      <div
        className="px-3 py-1.5"
        style={{ background: 'color-mix(in srgb, var(--neon-gold) 8%, transparent)', borderBottom: '1px solid color-mix(in srgb, var(--neon-gold) 20%, transparent)' }}
      >
        <span className="text-xs font-mono font-bold neon-gold tracking-widest">🧬 PHYSICAL DESCRIPTION</span>
        {character?.name && <span className="text-xs text-gray-600 ml-2 font-mono">— {character.name}</span>}
      </div>
      <div style={{ background: 'var(--terminal-bg)' }}>
        {visibleSections.map((section) => {
          const isOpen = openSections[section.key];
          return (
            <div key={section.key} style={{ borderBottom: '1px solid color-mix(in srgb, var(--neon-gold) 10%, transparent)' }}>
              <div
                className="flex items-center justify-between px-3 py-1.5 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => toggleSection(section.key)}
                style={{ background: isOpen ? 'color-mix(in srgb, var(--neon-gold) 8%, transparent)' : 'transparent' }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{section.emoji}</span>
                  <span className="text-xs font-mono font-bold" style={{ color: 'var(--neon-gold)AA' }}>
                    {section.label}
                  </span>
                </div>
                <span className="text-xs font-mono" style={{ color: 'color-mix(in srgb, var(--neon-gold) 40%, transparent)' }}>
                  {isOpen ? '▲' : '▼'}
                </span>
              </div>
              {isOpen && (
                <div className="px-3 pb-1">
                  {section.fields.map(({ key, label, emoji }) => (
                    <DescField
                      key={key}
                      emoji={emoji}
                      label={label}
                      value={desc[key as keyof typeof desc]}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
