import { getExpressionEmoji } from '@/lib/erosParser';
import type { CharacterState, BodyState } from '@/types/eros-status';

interface EmotionPanelProps {
  character?: CharacterState;
  body?: BodyState;
}

const EXPRESSIONS = [
  { key: 'neutral', emoji: '😐', label: 'Neutral' },
  { key: 'happy', emoji: '😊', label: 'Happy' },
  { key: 'flustered', emoji: '😳', label: 'Flustered' },
  { key: 'aroused', emoji: '😍', label: 'Aroused' },
  { key: 'sad', emoji: '😢', label: 'Sad' },
  { key: 'angry', emoji: '😠', label: 'Angry' },
  { key: 'shy', emoji: '🥺', label: 'Shy' },
  { key: 'loving', emoji: '🥰', label: 'Loving' },
  { key: 'lustful', emoji: '😏', label: 'Lustful' },
  { key: 'scared', emoji: '😨', label: 'Scared' },
];

export function EmotionPanel({ character, body }: EmotionPanelProps) {
  const currentExpr = body?.expression || character?.expression || 'neutral';
  const mood = character?.mood || 'Neutral';
  const avatarUrl = character?.avatarUrl;
  const exprEmoji = getExpressionEmoji(currentExpr, mood);

  return (
    <div
      className="mx-3 mb-2 p-2 rounded"
      style={{ border: '1px solid var(--terminal-border)', background: 'var(--terminal-card)' }}
    >
      <div className="text-xs font-mono mb-1.5 neon-cyan opacity-60 tracking-widest">EMOTION</div>
      <div className="flex gap-2">
        <div
          className="flex-shrink-0 w-16 h-20 rounded flex items-center justify-center relative overflow-hidden"
          style={{ border: '1px solid var(--terminal-border)', background: 'var(--terminal-bg-deep)' }}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="character" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center">
              <div className="text-4xl">{exprEmoji}</div>
              <div className="text-xs mt-1 font-mono" style={{ color: 'color-mix(in srgb, var(--neon-cyan) 80%, transparent)', fontSize: '8px' }}>
                [expression]
              </div>
            </div>
          )}
          <div
            className="absolute bottom-0 left-0 right-0 text-center py-0.5 text-xs font-mono"
            style={{ background: '#00000090', color: 'var(--neon-cyan)', fontSize: '8px' }}
          >
            {mood.toUpperCase()}
          </div>
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-5 gap-0.5">
            {EXPRESSIONS.map((expr) => {
              const isActive =
                currentExpr?.toLowerCase().includes(expr.key) || mood?.toLowerCase().includes(expr.key);
              return (
                <div
                  key={expr.key}
                  title={expr.label}
                  className="w-6 h-6 flex items-center justify-center rounded text-sm cursor-default transition-all"
                  style={{
                    border: isActive ? '1px solid var(--neon-cyan)' : '1px solid color-mix(in srgb, var(--neon-cyan) 15%, transparent)',
                    background: isActive ? 'color-mix(in srgb, var(--neon-cyan) 20%, transparent)' : 'transparent',
                    boxShadow: isActive ? '0 0 6px color-mix(in srgb, var(--neon-cyan) 40%, transparent)' : 'none',
                    fontSize: '14px',
                  }}
                >
                  {expr.emoji}
                </div>
              );
            })}
          </div>
          <div className="mt-1.5 text-xs font-mono text-gray-500">
            <span className="neon-cyan opacity-70">Expression: </span>
            <span className="text-gray-300">{currentExpr}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
