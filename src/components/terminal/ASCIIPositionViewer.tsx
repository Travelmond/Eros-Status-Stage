import { findPosition } from '@/lib/sexPositionsLibrary';
import { getSexPhaseColor } from '@/theme/colors';

interface ASCIIPositionViewerProps {
  positionName?: string;
  phase?: string;
}

export function ASCIIPositionViewer({ positionName, phase }: ASCIIPositionViewerProps) {
  const data = findPosition(positionName);
  const phaseColor = getSexPhaseColor(phase || 'sex');
  if (!positionName) return null;

  return (
    <div
      className="mx-0 mb-0 rounded overflow-hidden"
      style={{ border: `1px solid color-mix(in srgb, ${phaseColor} 30%, transparent)`, background: '#060606' }}
    >
      <div
        className="px-3 py-1.5 flex items-center justify-between"
        style={{ background: `color-mix(in srgb, ${phaseColor} 10%, transparent)`, borderBottom: `1px solid color-mix(in srgb, ${phaseColor} 20%, transparent)` }}
      >
        <div className="flex items-center gap-2">
          <span className="text-base">{data?.emoji || '🔥'}</span>
          <span className="text-xs font-mono font-bold tracking-widest" style={{ color: phaseColor }}>
            {data?.label || positionName.toUpperCase()}
          </span>
          {data?.category && (
            <span
              className="text-xs font-mono px-1.5 py-0.5 rounded"
              style={{
                color: `color-mix(in srgb, ${phaseColor} 90%, transparent)`,
                background: `color-mix(in srgb, ${phaseColor} 10%, transparent)`,
                border: `1px solid color-mix(in srgb, ${phaseColor} 20%, transparent)`,
                fontSize: '9px',
              }}
            >
              {data.category}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 px-3 py-2">
        <div
          className="flex-shrink-0 rounded px-2 py-1.5 overflow-hidden"
          style={{
            background: 'var(--terminal-bg)',
            border: `1px solid color-mix(in srgb, ${phaseColor} 20%, transparent)`,
            minWidth: '72px',
            maxWidth: '90px',
          }}
        >
          {data ? (
            <pre
              className="font-mono text-center leading-snug select-none"
              style={{
                color: phaseColor,
                fontSize: '10px',
                whiteSpace: 'pre',
                overflow: 'hidden',
                textShadow: `0 0 6px color-mix(in srgb, ${phaseColor} 60%, transparent)`,
              }}
            >
              {data.ascii.join('\n')}
            </pre>
          ) : (
            <pre
              className="font-mono text-center"
              style={{ color: `color-mix(in srgb, ${phaseColor} 40%, transparent)`, fontSize: '10px' }}
            >{`  /\\ \n (  )\n  \\/ `}</pre>
          )}
        </div>
        <div className="flex-1 min-w-0">
          {data?.description ? (
            <p className="text-xs font-mono leading-relaxed" style={{ color: '#ffffff50' }}>
              {data.description}
            </p>
          ) : (
            <p className="text-xs font-mono" style={{ color: 'var(--terminal-text-muted)' }}>
              Position not in library — rendering name only.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
