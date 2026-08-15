import { useState, useCallback } from 'react';
import ErosTerminal from '@/components/terminal/ErosTerminal';
import { createInitialState } from '@/core/state';
import type { ErosStatusState, ErosChatState } from '@/types/eros-status';
import type { ConfigType } from '@/types/config';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';

/**
 * TestRunner standalone para desenvolvimento local.
 * Simula um chat lateral + terminal, com botões de cenários demo.
 */

const DEMO_CONFIG: ConfigType = {
  openRouterModel: 'openai/gpt-4o-mini',
  auditorEnabled: true,
  imgAuditorEnabled: true,
  enableNTR: false,
  enableSexModule: true,
  enableReactionModule: true,
  theme: 'cyberpunk',
  barStyle: 'bar',
  density: 'comfortable',
};

function buildDemoState(variant: 'default' | 'sex' | 'reaction' | 'ntr' = 'default'): ErosStatusState {
  const base = createInitialState({
    character: {
      name: 'Hanako',
      role: '[MILF]',
      mood: 'Flustered',
      expression: 'flustered',
    },
    system: {
      day: 5,
      time: '14:32',
      weather: 'Sunny',
      location: 'Home',
      sceneType: variant === 'sex' ? 'sex' : variant === 'reaction' ? 'flirting' : 'daily_life',
    },
    progressions: {
      affection: 75,
      obedience: 80,
      libido: 55,
      arousal: variant === 'sex' ? 92 : 70,
      trust: 60,
      happiness: 65,
      embarrassment: 45,
      love: 50,
      desire: 40,
    },
    clothingSlots: {
      head: 'Glasses',
      upper: 'Light orange shirt',
      lower: 'Tight jeans',
      underwear: 'Lace',
      footwear: 'Sandals',
      accessories: 'Wedding ring',
    },
    body: {
      expression: 'flustered',
      posture: 'leaning',
      thoughts: "He's looking at me again...",
      description: {
        hair: 'long black',
        eyes: 'amber',
        face: 'mature beauty, light makeup',
        chest: 'large breasts',
        waist: 'slim',
        hips: 'wide',
        legs: 'long',
      },
    },
    location: {
      currentRoom: 'Bedroom',
      building: 'Home',
      description: 'Soft afternoon light through lace curtains. King bed unmade.',
      visitedRooms: ['Kitchen', 'Living Room', 'Bedroom'],
      knownRooms: ['Bathroom', 'Garden', 'Garage'],
      objectsInRoom: ['bed', 'mirror', 'phone'],
    },
    inventory: {
      items: [
        { name: 'Phone', emoji: '📱' },
        { name: 'Lipstick', emoji: '💄' },
      ],
    },
    goals: ['Prepare dinner', 'Resist flirting'],
    npcs: [
      { name: 'Kenji', relation: 'neighbor', mood: 'suspicious', importance: 'medium' },
    ],
  });

  if (variant === 'sex') {
    return {
      ...base,
      sexModule: {
        active: true,
        phase: 'sex',
        position: 'missionary',
        pace: 'passionate',
        orgasmCount: 1,
        sensory_metrics: { intensity: 78, threshold: 65 },
        senses: {
          sight: 'sweat glistening on skin',
          sound: 'soft moans and bed creaks',
          smell: 'perfume and arousal',
          touch: 'warm skin, tight embrace',
          taste: 'lipstick and salt',
        },
      },
    };
  }

  if (variant === 'reaction') {
    return {
      ...base,
      reactionModule: {
        active: true,
        character: 'Hanako',
        stimulus: 'User brushes her hand',
        reactions: [
          { emoji: '😳', label: 'Blush', text: 'My cheeks burn...' },
          { emoji: '💓', label: 'Heart', text: 'Heartbeat quickens.' },
        ],
      },
    };
  }

  if (variant === 'ntr') {
    return {
      ...base,
      ntrModule: {
        enabled: true,
        active: true,
        ntrCharacter: 'Hanako',
        ntrPartner: 'Rival',
        jealousyLevel: 35,
        betrayalStage: 'temptation',
      },
    };
  }

  return base;
}

export default function App() {
  const [state, setState] = useState<ErosStatusState>(buildDemoState('default'));
  const [chatState] = useState<ErosChatState>({
    schema_version: '3.0.0',
    visitedRooms: ['Home', 'Bedroom'],
    revealedRooms: ['Home', 'Bedroom', 'Kitchen'],
  });
  const [log, setLog] = useState<string[]>([]);

  const handleParse = useCallback((text: string) => {
    setLog((prev) => [...prev, `> ${text.slice(0, 80)}${text.length > 80 ? '…' : ''}`]);
  }, []);

  return (
    <div className="h-screen w-screen bg-[#050505] flex overflow-hidden text-xs font-mono">
      <Toaster />

      {/* Simulated chat sidebar */}
      <div className="hidden md:flex w-[360px] flex-col border-r border-[var(--terminal-border)] bg-[#080808]">
        <div className="p-3 border-b border-[var(--terminal-border)] neon-cyan tracking-widest">SIMULATED CHUB CHAT</div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="p-2 rounded bg-[#0D0D0D] border border-[var(--terminal-border)] text-gray-400">
            <span className="neon-pink font-bold">Hanako:</span> Day 5 already? Time flies when you're around...
          </div>
          <div className="p-2 rounded bg-[#0D0D0D] border border-[var(--terminal-border)] text-gray-400">
            <span className="text-cyan-400 font-bold">User:</span> You seem flustered.
          </div>
          {log.map((entry, i) => (
            <div key={i} className="p-2 rounded bg-[#0D0D0D] border border-[var(--neon-green)20] text-gray-500">
              <span className="text-[var(--neon-green)] font-bold">PARSE:</span> {entry}
            </div>
          ))}
        </div>
        <div className="p-2 border-t border-[var(--terminal-border)] text-[10px] text-gray-600">
          Chat simulation — terminal receives postMessage from here.
        </div>
      </div>

      {/* Terminal stage */}
      <div className="flex-1 min-w-[320px] h-full">
        <ErosTerminal
          state={state}
          chatState={chatState}
          config={DEMO_CONFIG}
          onParse={handleParse}
          onCorrectAudit={(id, val) => setLog((prev) => [...prev, `[AUDIT] ${id} → ${String(val)}`])}
          onIgnoreAudit={(id) => setLog((prev) => [...prev, `[AUDIT IGNORE] ${id}`])}
        />
      </div>

      {/* Demo scenario controls */}
      <div className="hidden lg:flex w-[220px] flex-col border-l border-[var(--terminal-border)] bg-[#080808] p-3 gap-2">
        <div className="neon-gold tracking-widest mb-1">DEMO SCENES</div>
        <Button
          size="sm"
          variant="outline"
          className="text-xs font-mono border-[var(--neon-cyan)40] text-[var(--neon-cyan)]"
          onClick={() => setState(buildDemoState('default'))}
        >
          Default / Daily
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-xs font-mono border-[var(--neon-pink)40] text-[var(--neon-pink)]"
          onClick={() => setState(buildDemoState('sex'))}
        >
          Sex Module
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-xs font-mono border-[var(--neon-purple)40] text-[var(--neon-purple)]"
          onClick={() => setState(buildDemoState('reaction'))}
        >
          Reaction Module
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-xs font-mono border-[var(--neon-purple)40] text-[var(--neon-purple)]"
          onClick={() => setState(buildDemoState('ntr'))}
        >
          NTR Module
        </Button>
        <div className="mt-auto text-[9px] text-gray-600">
          Eros Status Terminal v3.0 — Stage TestRunner
        </div>
      </div>
    </div>
  );
}
