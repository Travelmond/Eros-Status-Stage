import type { NTRModule } from '@/types/eros-status';

interface NTRPanelProps {
  ntrModule?: NTRModule;
}

export function NTRPanel({ ntrModule }: NTRPanelProps) {
  return (
    <div
      className="mx-3 mb-2 rounded overflow-hidden"
      style={{ border: '1px solid color-mix(in srgb, var(--neon-purple) 40%, transparent)' }}
    >
      <div
        className="px-3 py-1.5"
        style={{ background: 'color-mix(in srgb, var(--neon-purple) 10%, transparent)', borderBottom: '1px solid color-mix(in srgb, var(--neon-purple) 25%, transparent)' }}
      >
        <span className="text-xs font-mono font-bold neon-purple tracking-widest">💔 NTR MODULE</span>
      </div>
      <div className="px-3 py-2 text-xs font-mono" style={{ background: 'var(--terminal-bg)' }}>
        {ntrModule && ntrModule.active ? (
          <div className="space-y-1">
            {ntrModule.ntrCharacter && (
              <div className="flex gap-2">
                <span style={{ color: 'color-mix(in srgb, var(--neon-purple) 80%, transparent)' }}>Character:</span>
                <span className="text-gray-300">{ntrModule.ntrCharacter}</span>
              </div>
            )}
            {ntrModule.ntrPartner && (
              <div className="flex gap-2">
                <span style={{ color: 'color-mix(in srgb, var(--neon-purple) 80%, transparent)' }}>Partner:</span>
                <span className="text-gray-300">{ntrModule.ntrPartner}</span>
              </div>
            )}
            {ntrModule.betrayalStage && (
              <div className="flex gap-2">
                <span style={{ color: 'color-mix(in srgb, var(--neon-purple) 80%, transparent)' }}>Stage:</span>
                <span className="text-gray-300">{ntrModule.betrayalStage}</span>
              </div>
            )}
            {(ntrModule.jealousyLevel || 0) > 0 && (
              <div className="flex gap-2">
                <span style={{ color: 'color-mix(in srgb, var(--neon-purple) 80%, transparent)' }}>Jealousy:</span>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 rounded-full" style={{ background: 'var(--terminal-text-ghost)', width: '80px' }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${ntrModule.jealousyLevel}%`,
                        background: 'var(--neon-purple)',
                        boxShadow: '0 0 4px var(--neon-purple)',
                      }}
                    />
                  </div>
                  <span className="text-gray-500">{ntrModule.jealousyLevel}%</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-700 text-center py-3">
            <div className="text-lg mb-1">💔</div>
            <div>NTR module enabled — waiting for trigger event</div>
          </div>
        )}
      </div>
    </div>
  );
}
