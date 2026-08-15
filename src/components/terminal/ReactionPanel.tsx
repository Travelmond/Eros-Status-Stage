import type { ReactionModule } from '@/types/eros-status';

interface ReactionPanelProps {
  reactionModule?: ReactionModule;
}

export function ReactionPanel({ reactionModule }: ReactionPanelProps) {
  if (!reactionModule?.active || !reactionModule.reactions?.length) return null;

  return (
    <div
      className="mx-3 mb-2 rounded overflow-hidden"
      style={{ border: '1px solid var(--neon-purple)40' }}
    >
      <div
        className="px-3 py-1.5"
        style={{ background: 'var(--neon-purple)10', borderBottom: '1px solid var(--neon-purple)25' }}
      >
        <span className="text-xs font-mono font-bold neon-purple tracking-widest">🧠 REACTION MODULE</span>
      </div>
      {(reactionModule.character || reactionModule.stimulus) && (
        <div
          className="px-3 py-1.5 text-xs font-mono"
          style={{ borderBottom: '1px solid var(--neon-purple)15', background: 'var(--terminal-card)' }}
        >
          {reactionModule.character && (
            <div className="flex gap-2">
              <span style={{ color: 'var(--neon-purple)80' }}>Character:</span>
              <span className="text-gray-300">{reactionModule.character}</span>
            </div>
          )}
          {reactionModule.stimulus && (
            <div className="flex gap-2 mt-0.5">
              <span style={{ color: 'var(--neon-purple)80' }}>Stimulus:</span>
              <span className="text-gray-400 leading-relaxed">{reactionModule.stimulus}</span>
            </div>
          )}
        </div>
      )}
      <div className="px-3 py-1.5" style={{ background: '#0A0A0A' }}>
        {reactionModule.reactions.map((r, i) => (
          <div
            key={i}
            className="flex items-start gap-2 py-0.5 text-xs font-mono border-b"
            style={{ borderColor: 'var(--neon-purple)08' }}
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
