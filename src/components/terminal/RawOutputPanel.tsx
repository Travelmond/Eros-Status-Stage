import { useState } from 'react';

interface RawOutputPanelProps {
  rawBlock?: string;
  lastMessage?: string;
}

export function RawOutputPanel({ rawBlock, lastMessage }: RawOutputPanelProps) {
  const [showFull, setShowFull] = useState(false);
  const content = rawBlock || lastMessage || '';
  const display = showFull ? content : content.slice(0, 600);

  return (
    <div
      className="mx-3 mb-2 rounded"
      style={{ border: '1px solid var(--terminal-border)', background: 'var(--terminal-card)' }}
    >
      <div className="flex items-center justify-between px-2 pt-2 pb-1">
        <div className="text-xs font-mono neon-cyan opacity-60 tracking-widest">RAW TERMINAL OUTPUT</div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--neon-green)' }} />
          <span className="text-xs font-mono" style={{ color: 'var(--neon-green)80' }}>
            LIVE
          </span>
        </div>
      </div>
      <div
        className="px-2 pb-2 font-mono text-xs overflow-y-auto"
        style={{
          maxHeight: showFull ? '300px' : '140px',
          color: 'var(--neon-cyan)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          lineHeight: '1.5',
          fontSize: '10px',
        }}
      >
        {content ? (
          <>
            {display}
            {content.length > 600 && !showFull && <span className="text-white/40">...</span>}
          </>
        ) : (
          <span className="text-gray-600 italic">
            Waiting for AI output...<span className="cursor-blink">█</span>
          </span>
        )}
      </div>
      {content.length > 600 && (
        <button
          onClick={() => setShowFull((v) => !v)}
          className="w-full py-1 text-xs font-mono transition-all"
          style={{ color: 'var(--neon-cyan)60', borderTop: '1px solid var(--neon-cyan)10' }}
        >
          {showFull ? '▲ COLLAPSE' : '▼ SHOW FULL'}
        </button>
      )}
    </div>
  );
}
