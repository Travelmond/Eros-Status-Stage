import { MiniMapPanel } from './MiniMapPanel';
import type { LocationState, SystemState } from '@/types/eros-status';

interface LocationPanelProps {
  location?: LocationState;
  system?: SystemState;
}

export function LocationPanel({ location, system }: LocationPanelProps) {
  const locationStr = [location?.currentRoom, location?.building].filter(Boolean).join(' → ');

  return (
    <div className="space-y-2 pb-2 animate-fade-in-up">
      <MiniMapPanel location={location} system={system} />
      <div
        className="mx-3 mb-2 p-2 rounded"
        style={{ border: '1px solid var(--terminal-border)', background: 'var(--terminal-card)' }}
      >
        <div className="text-xs font-mono mb-1.5 neon-cyan opacity-60 tracking-widest">LOCATION</div>
        <div className="data-row">
          <span className="data-label">Current:</span>
          <span className="neon-cyan">{locationStr || 'Unknown'}</span>
        </div>
        {location?.description && (
          <div className="text-xs font-mono text-gray-500 italic pl-20 leading-relaxed mt-0.5">
            {location.description}
          </div>
        )}
        {location?.objectsInRoom && location.objectsInRoom.length > 0 && (
          <div className="data-row mt-1">
            <span className="data-label">Objects:</span>
            <span className="text-gray-300">{location.objectsInRoom.join(', ')}</span>
          </div>
        )}
        {location?.visitedRooms && location.visitedRooms.length > 0 && (
          <div className="data-row mt-1">
            <span className="data-label">Visited:</span>
            <span className="text-gray-400">{location.visitedRooms.join(', ')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
