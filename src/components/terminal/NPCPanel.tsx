import { getExpressionEmoji } from '@/lib/erosParser';
import type { NPC } from '@/types/eros-status';

interface NPCPanelProps {
  npcs?: NPC[];
}

export function NPCPanel({ npcs }: NPCPanelProps) {
  if (!npcs || npcs.length === 0) {
    return (
      <div
        className="mx-3 mb-2 rounded p-3 text-center"
        style={{ border: '1px solid color-mix(in srgb, var(--neon-purple) 20%, transparent)', background: 'var(--terminal-bg)' }}
      >
        <div className="text-xs font-mono text-gray-700">
          <div className="text-lg mb-1">👥</div>
          No NPCs detected.
          <br />
          <span className="text-gray-800">The AI must include an NPCS block.</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="mx-3 mb-2 rounded overflow-hidden"
      style={{ border: '1px solid color-mix(in srgb, var(--neon-purple) 40%, transparent)' }}
    >
      <div
        className="px-3 py-1.5"
        style={{ background: 'color-mix(in srgb, var(--neon-purple) 8%, transparent)', borderBottom: '1px solid color-mix(in srgb, var(--neon-purple) 20%, transparent)' }}
      >
        <span className="text-xs font-mono font-bold neon-purple tracking-widest">👥 NPC ROSTER</span>
      </div>
      <div className="px-3 py-2 space-y-2" style={{ background: 'var(--terminal-bg)' }}>
        {npcs.map((npc, i) => (
          <div
            key={i}
            className="flex items-start gap-2 p-1.5 rounded"
            style={{ border: '1px solid #ffffff08' }}
          >
            <span className="text-lg">{getExpressionEmoji(npc.mood, npc.mood)}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-white">{npc.name}</span>
                {npc.relation && (
                  <span
                    className="text-[9px] px-1 rounded"
                    style={{ color: 'var(--neon-cyan)', border: '1px solid color-mix(in srgb, var(--neon-cyan) 30%, transparent)' }}
                  >
                    {npc.relation}
                  </span>
                )}
                {npc.importance && (
                  <span
                    className="text-[9px] px-1 rounded"
                    style={{
                      color:
                        npc.importance === 'high'
                          ? 'var(--neon-pink)'
                          : npc.importance === 'medium'
                          ? 'var(--neon-gold)'
                          : 'var(--neon-green)',
                    }}
                  >
                    {npc.importance}
                  </span>
                )}
              </div>
              {npc.mood && npc.mood !== 'neutral' && (
                <div className="text-[10px] font-mono text-gray-500 mt-0.5">mood: {npc.mood}</div>
              )}
              {npc.summary && (
                <div className="text-[10px] font-mono text-gray-600 leading-relaxed mt-0.5">{npc.summary}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
