import { NeonProgressBar, type BarStyle } from './NeonProgressBar';
import { resolveRelationshipContext } from '@/lib/relationshipSystem';
import type { ErosStatusState, Progressions } from '@/types/eros-status';

interface ProgressionsPanelProps {
  progressions?: Progressions;
  barStyle?: BarStyle;
  compact?: boolean;
  state?: ErosStatusState;
}

const CORE_STATS = [
  { key: 'affection', label: 'Affection', emoji: '💕', color: 'pink' as const },
  { key: 'obedience', label: 'Obedience', emoji: '🎯', color: 'cyan' as const },
  { key: 'libido', label: 'Libido', emoji: '🔥', color: 'gold' as const },
  { key: 'arousal', label: 'Arousal', emoji: '🍑', color: 'pink' as const },
];

const PERSISTENT_STATS = [
  { key: 'trust', label: 'Trust', emoji: '🌟', color: 'gold' as const },
  { key: 'corruption', label: 'Corruption', emoji: '🖤', color: 'purple' as const },
  { key: 'happiness', label: 'Happiness', emoji: '😊', color: 'green' as const },
  { key: 'embarrassment', label: 'Embarrass.', emoji: '😳', color: 'pink' as const },
  { key: 'fatigue', label: 'Fatigue', emoji: '😴', color: 'purple' as const },
  { key: 'love', label: 'Love', emoji: '❤️', color: 'pink' as const },
  { key: 'jealousy', label: 'Jealousy', emoji: '💚', color: 'green' as const },
];

const DYNAMIC_STATS = [
  { key: 'anxiety', label: 'Anxiety', emoji: '😰', color: 'purple' as const },
  { key: 'fear', label: 'Fear', emoji: '😨', color: 'purple' as const },
  { key: 'anger', label: 'Anger', emoji: '😠', color: 'pink' as const },
  { key: 'nervousness', label: 'Nervousness', emoji: '😬', color: 'gold' as const },
  { key: 'tension', label: 'Tension', emoji: '😤', color: 'gold' as const },
  { key: 'shame', label: 'Shame', emoji: '🙈', color: 'pink' as const },
  { key: 'desire', label: 'Desire', emoji: '💋', color: 'pink' as const },
  { key: 'awe', label: 'Awe', emoji: '🤩', color: 'cyan' as const },
  { key: 'guilt', label: 'Guilt', emoji: '😞', color: 'purple' as const },
  { key: 'excitement', label: 'Excitement', emoji: '⚡', color: 'gold' as const },
  { key: 'sadness', label: 'Sadness', emoji: '😢', color: 'cyan' as const },
  { key: 'submission', label: 'Submission', emoji: '🫡', color: 'purple' as const },
];

export function ProgressionsPanel({ progressions, barStyle = 'bar', compact = false, state }: ProgressionsPanelProps) {
  if (!progressions) return null;
  let hiddenStats = new Set<string>();
  if (state) {
    try {
      const ctx = resolveRelationshipContext(state);
      hiddenStats = ctx.hiddenStats;
    } catch (_) {
      // ignore
    }
  }
  const isVisible = (key: string) => !hiddenStats.has(key);
  const core = CORE_STATS.filter((s) => isVisible(s.key));
  const persistent = PERSISTENT_STATS.filter((s) => isVisible(s.key) && (progressions[s.key as keyof Progressions] ?? 0) > 0);
  const dynamic = DYNAMIC_STATS.filter((s) => isVisible(s.key) && (progressions[s.key as keyof Progressions] ?? 0) > 0);
  const stats = compact ? core : [...core, ...persistent, ...dynamic];

  let contextNote: string | null = null;
  if (state && hiddenStats.size > 0) {
    const ctx = resolveRelationshipContext(state);
    if (ctx.familyTier !== 'none') {
      contextNote = `${ctx.familyConfig.icon} ${ctx.familyConfig.label} — some stats gated`;
    }
  }

  return (
    <div
      className="mx-3 mb-2 p-2 rounded"
      style={{ border: '1px solid var(--terminal-border)', background: 'var(--terminal-card)' }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="text-xs font-mono neon-cyan opacity-60 tracking-widest">PROGRESSIONS</div>
        {contextNote && <div className="text-xs font-mono" style={{ color: 'color-mix(in srgb, var(--neon-pink) 70%, transparent)' }}>{contextNote}</div>}
      </div>
      <div className="space-y-0.5">
        {stats.map(({ key, label, emoji, color }) => (
          <NeonProgressBar
            key={key}
            label={label}
            value={progressions[key as keyof Progressions] ?? 0}
            color={color}
            emoji={emoji}
            style={barStyle}
          />
        ))}
      </div>
    </div>
  );
}
