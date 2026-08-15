import { getExpressionEmoji } from '@/lib/erosParser';
import type { CharacterState, BodyState } from '@/types/eros-status';

interface CharacterPanelProps {
  character?: CharacterState;
  body?: BodyState;
}

const MATRIX_CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function MatrixBackground() {
  const chars = Array.from({ length: 60 }, (_, i) => MATRIX_CHARS[(i * 7 + 13) % MATRIX_CHARS.length]);
  return (
    <div
      className="absolute inset-0 overflow-hidden text-xs font-mono opacity-20 leading-4 tracking-widest pointer-events-none"
      style={{ color: 'var(--neon-cyan)', wordBreak: 'break-all' }}
    >
      {chars.join('')}
    </div>
  );
}

export function CharacterPanel({ character, body }: CharacterPanelProps) {
  const name = character?.name || 'Unknown';
  const role = character?.role || '';
  const expression = body?.expression || character?.expression || 'neutral';
  const mood = character?.mood || 'Neutral';
  const expressionEmoji = getExpressionEmoji(mood, expression);
  const avatarUrl = character?.avatarUrl;

  return (
    <div
      className="mx-3 mb-2 rounded relative overflow-hidden shrink-0"
      style={{ border: '1px solid var(--terminal-border)', background: 'var(--terminal-card)', minHeight: '56px' }}
    >
      <MatrixBackground />
      <div className="relative z-10 flex items-center gap-3 p-2">
        <div
          className="w-12 h-12 rounded flex items-center justify-center flex-shrink-0 text-2xl"
          style={{ border: '1px solid var(--terminal-border)', background: '#00000080' }}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover rounded" />
          ) : (
            <span>{expressionEmoji}</span>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm neon-cyan tracking-wide">{name}</span>
            {role && (
              <span
                className="text-xs px-1.5 py-0.5 rounded font-mono"
                style={{
                  border: '1px solid color-mix(in srgb, var(--neon-pink) 40%, transparent)',
                  color: 'var(--neon-pink)',
                  background: 'color-mix(in srgb, var(--neon-pink) 10%, transparent)',
                }}
              >
                {role}
              </span>
            )}
          </div>
          <div className="text-xs mt-0.5 text-gray-400">
            <span className="neon-cyan opacity-70">MOOD: </span>
            <span className="text-white">{mood}</span>
            <span className="ml-2 text-xs">{expressionEmoji}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
