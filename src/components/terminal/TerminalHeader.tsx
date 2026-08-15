import { useState, useEffect } from 'react';
import { getWeatherIcon } from '@/lib/erosParser';
import type { SystemState, LocationState } from '@/types/eros-status';

interface TerminalHeaderProps {
  system?: SystemState;
  location?: LocationState;
}

export function TerminalHeader({ system, location }: TerminalHeaderProps) {
  const [tick, setTick] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setTick((v) => !v), 500);
    return () => clearInterval(t);
  }, []);

  const weatherIcon = getWeatherIcon(system?.weather);
  const time = system?.time || '??:??';
  const day = system?.day ?? '?';
  const weather = system?.weather || 'Unknown';
  const loc = location?.currentRoom || system?.location || 'Unknown';

  return (
    <div className="px-3 py-2 crt-overlay shrink-0">
      <div className="text-center mb-2">
        <h1 className="text-lg font-bold tracking-widest font-mono hover:animate-glitch">
          <span className="neon-pink">EROS</span>
          <span className="text-white mx-2">STATUS</span>
          <span className="neon-cyan">TERMINAL</span>
        </h1>
        <div
          className="h-px w-full mt-1"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--neon-cyan), var(--neon-pink), transparent)',
          }}
        />
      </div>
      <div
        className="flex items-center justify-center gap-1 text-xs font-mono py-1.5 px-2 rounded"
        style={{ border: '1px solid var(--terminal-border)', background: '#00000060' }}
      >
        <span className="text-white">Day {day}</span>
        <span className="text-gray-600 mx-1">│</span>
        <span className="neon-cyan">{time.replace(':', tick ? ':' : ' ')}</span>
        <span className="text-gray-600 mx-1">│</span>
        <span>{weatherIcon}</span>
        <span className="text-gray-300 ml-1">{weather}</span>
        <span className="text-gray-600 mx-1">│</span>
        <span>📍</span>
        <span className="neon-cyan ml-1">{loc}</span>
      </div>
    </div>
  );
}
