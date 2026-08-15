import { useState, useMemo } from 'react';
import type { LocationState, SystemState } from '@/types/eros-status';

interface MiniMapPanelProps {
  location?: LocationState;
  system?: SystemState;
}

const ROOM_REGISTRY: Record<string, { x: number; y: number; label: string }> = {
  home: { x: 1, y: 1, label: 'Home' },
  bedroom: { x: 0, y: 0, label: 'Bedroom' },
  kitchen: { x: 2, y: 0, label: 'Kitchen' },
  livingroom: { x: 1, y: 0, label: 'Living' },
  bathroom: { x: 0, y: 1, label: 'Bath' },
  office: { x: 2, y: 1, label: 'Office' },
  garden: { x: 0, y: 2, label: 'Garden' },
  garage: { x: 2, y: 2, label: 'Garage' },
  hallway: { x: 1, y: 2, label: 'Hall' },
};

function normalizeRoom(name?: string): string {
  return (name || '').toLowerCase().replace(/[^a-z]/g, '');
}

function getTimePeriod(time?: string): string {
  const hour = parseInt((time || '12:00').split(':')[0], 10);
  if (hour < 6) return 'NIGHT';
  if (hour < 12) return 'MORNING';
  if (hour < 18) return 'AFTERNOON';
  return 'EVENING';
}

export function MiniMapPanel({ location, system }: MiniMapPanelProps) {
  const [showLegend, setShowLegend] = useState(false);
  const current = normalizeRoom(location?.currentRoom);
  const visited = new Set((location?.visitedRooms || []).map(normalizeRoom));
  const known = new Set((location?.knownRooms || []).map(normalizeRoom));

  const grid = useMemo(() => {
    const cells: Array<{ key: string; x: number; y: number; state: 'current' | 'visited' | 'known' | 'unknown' }> = [];
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        const room = Object.values(ROOM_REGISTRY).find((r) => r.x === x && r.y === y);
        const key = room?.label || `cell-${x}-${y}`;
        let state: 'current' | 'visited' | 'known' | 'unknown' = 'unknown';
        if (room) {
          const norm = normalizeRoom(room.label);
          if (norm === current) state = 'current';
          else if (visited.has(norm)) state = 'visited';
          else if (known.has(norm)) state = 'known';
        }
        cells.push({ key, x, y, state });
      }
    }
    return cells;
  }, [current, visited, known]);

  const counts = useMemo(() => {
    return {
      visited: grid.filter((c) => c.state === 'visited' || c.state === 'current').length,
      known: grid.filter((c) => c.state === 'known').length,
      unknown: grid.filter((c) => c.state === 'unknown').length,
    };
  }, [grid]);

  return (
    <div
      className="mx-3 mb-2 rounded overflow-hidden"
      style={{ border: '1px solid var(--terminal-border)' }}
    >
      <div
        className="px-3 py-1.5 flex items-center justify-between"
        style={{ background: 'color-mix(in srgb, var(--neon-cyan) 8%, transparent)', borderBottom: '1px solid var(--terminal-border)' }}
      >
        <span className="text-xs font-mono font-bold neon-cyan tracking-widest">🗺️ MINI MAP</span>
        <span className="text-xs font-mono text-gray-600">
          {location?.building || system?.location || 'Unknown'} • {getTimePeriod(system?.time)}
        </span>
      </div>

      <div className="p-3" style={{ background: 'var(--terminal-bg)' }}>
        <div className="grid grid-cols-3 gap-1 max-w-[160px] mx-auto">
          {grid.map((cell) => {
            const isCurrent = cell.state === 'current';
            const isVisited = cell.state === 'visited';
            const isKnown = cell.state === 'known';
            return (
              <div
                key={`${cell.x}-${cell.y}`}
                className="aspect-square rounded flex items-center justify-center text-[9px] font-mono text-center leading-tight"
                style={{
                  background: isCurrent
                    ? 'color-mix(in srgb, var(--neon-cyan) 20%, transparent)'
                    : isVisited
                    ? 'color-mix(in srgb, var(--neon-green) 10%, transparent)'
                    : isKnown
                    ? 'color-mix(in srgb, var(--neon-gold) 8%, transparent)'
                    : 'var(--terminal-bg-deep)',
                  border: isCurrent
                    ? '1px solid var(--neon-cyan)'
                    : isVisited
                    ? '1px solid color-mix(in srgb, var(--neon-green) 30%, transparent)'
                    : isKnown
                    ? '1px solid color-mix(in srgb, var(--neon-gold) 20%, transparent)'
                    : '1px solid #ffffff08',
                  color: isCurrent ? 'var(--neon-cyan)' : isVisited ? 'var(--neon-green)' : isKnown ? 'var(--neon-gold)' : 'var(--terminal-text-ghost)',
                  boxShadow: isCurrent ? '0 0 8px color-mix(in srgb, var(--neon-cyan) 40%, transparent)' : 'none',
                }}
              >
                {cell.key.startsWith('cell') ? '·' : cell.key}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-3 mt-2 text-[9px] font-mono text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm" style={{ background: 'color-mix(in srgb, var(--neon-cyan) 20%, transparent)', border: '1px solid var(--neon-cyan)' }} />
            You
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm" style={{ background: 'color-mix(in srgb, var(--neon-green) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--neon-green) 30%, transparent)' }} />
            Visited
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm" style={{ background: 'color-mix(in srgb, var(--neon-gold) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--neon-gold) 20%, transparent)' }} />
            Known
          </span>
        </div>

        <button
          onClick={() => setShowLegend((v) => !v)}
          className="w-full mt-2 text-[9px] font-mono text-center"
          style={{ color: 'color-mix(in srgb, var(--neon-cyan) 60%, transparent)' }}
        >
          {showLegend ? '▲ Hide legend' : '▼ Show legend'} — {counts.visited} visited / {counts.known} known / {counts.unknown} unknown
        </button>

        {showLegend && (
          <div className="mt-2 text-[9px] font-mono text-gray-600 text-center">
            Mini-map is rebuilt from location.currentRoom, visitedRooms and knownRooms.
          </div>
        )}
      </div>
    </div>
  );
}
