import type { ReactionModule } from '@/types/eros-status';

interface ReactionPanelProps {
  reactionModule?: ReactionModule;
}

export function ReactionPanel({ reactionModule }: ReactionPanelProps) {
  if (!reactionModule?.active || !reactionModule.reactions?.length) return null;

  return (
    <div
      className="mx-3 mb-2 rounded overflow-hidden"
      style={{ border: '1px solid color-mix(in srgb, var(--neon-purple) 40%, transparent)' }}
    >
      <div
        className="px-3 py-1.5"
        style={{ background: 'color-mix(in srgb, var(--neon-purple) 10%, transparent)', borderBottom: '1px solid color-mix(in srgb, var(--neon-purple) 25%, transparent)' }}
      >
        <span className="text-xs font-mono font-bold neon-purple tracking-widest">🧠 REACTION MODULE</span>
      </div>
      {(reactionModule.character || reactionModule.stimulus) && (
        <div
          className="px-3 py-1.5 text-xs font-mono"
          style={{ borderBottom: '1px solid color-mix(in srgb, var(--neon-purple) 15%, transparent)', background: 'var(--terminal-card)' }}
        >
          {reactionModule.character && (
            <div className="flex gap-2">
              <span style={{ color: 'color-mix(in srgb, var(--neon-purple) 80%, transparent)' }}>Character:</span>
              <span className="text-gray-300">{reactionModule.character}</span>
            </div>
          )}
          {reactionModule.stimulus && (
            <div className="flex gap-2 mt-0.5">
              <span style={{ color: 'color-mix(in srgb, var(--neon-purple) 80%, transparent)' }}>Stimulus:</span>
              <span className="text-gray-400 leading-relaxed">{reactionModule.stimulus}</span>
            </div>
          )}
        </div>
      )}
      <div className="px-3 py-1.5" style={{ background: 'var(--terminal-bg)' }}>
        {reactionModule.reactions.map((r, i) => (
          <div
            key={i}
            className="flex items-start gap-2 py-0.5 text-xs font-mono border-b"
            style={{ borderColor: 'color-mix(in srgb, var(--neon-purple) 8%, transparent)' }}
          >
            <span className="flex-shrink-0 text-sm w-5">{r.emoji}</span>
            <span className="w-16 flex-shrink-0 font-bold" style={{ color: 'var(--neon-purple)' }}>
              {r.label}:
            </span>
            <span className="text-gray-300 leading-relaxed italic">"{r.text}"</span>
          </div>
        ))}
      </div>
    </div>
  );
}
