import { useState, useCallback } from 'react';
import ErosTerminal from '@/components/terminal/ErosTerminal';
import { createInitialState } from '@/core/state';
import { parseErosStatusFromMessage } from '@/core/parser';
import { processIncomingState } from '@/core/middleware';
import { condenseChatMemory } from '@/systems/memory';
import { setPreference, getPreference } from '@/services/characterState';
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

/**
 * Chave de persistência (localStorage) para as preferências de UI do TestRunner.
 * A API key é intencionalmente excluída do armazenamento (regra de segurança).
 */
const CONFIG_PREF_KEY = 'ui_config';

/**
 * Chave dedicada (localStorage) para a API key do OpenRouter quando o usuário
 * opta explicitamente por "lembrar chave nesta máquina" (rememberApiKey=true).
 * Nunca é gravada junto às preferências normais — apenas aqui, sob opt-in.
 */
const REMEMBERED_KEY_STORAGE = 'eros_remembered_openrouter_key';

/**
 * Remove campos sensíveis antes de persistir a config.
 * `openRouterApiKey` NUNCA é gravada em localStorage — permanece apenas em memória.
 */
function sanitizeConfigForStorage(config: ConfigType): Partial<ConfigType> {
  const { openRouterApiKey: _omit, ...rest } = config;
  return rest;
}

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
  const [chatState, setChatState] = useState<ErosChatState>({
    schema_version: '3.0.0',
    visitedRooms: ['Home', 'Bedroom'],
    revealedRooms: ['Home', 'Bedroom', 'Kitchen'],
  });
  const [config, setConfig] = useState<ConfigType>(() => {
    const cfg: ConfigType = {
      ...DEMO_CONFIG,
      ...getPreference<Partial<ConfigType>>(CONFIG_PREF_KEY, {}),
    };
    if (cfg.rememberApiKey) {
      try {
        cfg.openRouterApiKey = localStorage.getItem(REMEMBERED_KEY_STORAGE) || '';
      } catch {
        /* ignore — localStorage pode falhar em iframe sandbox/private mode */
      }
    }
    return cfg;
  });
  const [log, setLog] = useState<string[]>([]);

  const handleConfigChange = useCallback((patch: Partial<ConfigType>) => {
    setConfig((prev) => {
      const next = { ...prev, ...patch };
      setPreference(CONFIG_PREF_KEY, sanitizeConfigForStorage(next));
      try {
        if (next.rememberApiKey && next.openRouterApiKey) {
          localStorage.setItem(REMEMBERED_KEY_STORAGE, next.openRouterApiKey);
        } else if (next.rememberApiKey === false) {
          localStorage.removeItem(REMEMBERED_KEY_STORAGE);
        }
      } catch {
        /* ignore — localStorage pode falhar em iframe sandbox/private mode */
      }
      return next;
    });
  }, []);

  const handleCondenseMemory = useCallback(() => {
    setChatState((prev) => condenseChatMemory(prev));
  }, []);

  const handleClearMemory = useCallback(() => {
    setChatState((prev) => ({
      ...prev,
      longTermMemory: { facts: [], narrativeSummary: '', lastCondensedTurn: undefined },
      turnHistory: [],
    }));
  }, []);

  const handleCorrectAudit = useCallback((issueId: string, value: unknown) => {
    setState((prev) => {
      const currentAudit = prev.audit ?? { issues: [], correctedIds: [], ignoredIds: [] };
      const correctedIds = currentAudit.correctedIds ?? [];
      const ignoredIds = currentAudit.ignoredIds ?? [];
      return {
        ...prev,
        audit: {
          ...currentAudit,
          issues: currentAudit.issues.map((issue) =>
            issue.id === issueId ? { ...issue, corrected: true, ignored: false } : issue,
          ),
          correctedIds: correctedIds.includes(issueId) ? correctedIds : [...correctedIds, issueId],
          ignoredIds: ignoredIds.filter((id) => id !== issueId),
        },
      };
    });
    setLog((prev) => [...prev, `[AUDIT] ${issueId} → ${String(value)}`]);
  }, []);

  const handleIgnoreAudit = useCallback((issueId: string) => {
    setState((prev) => {
      const currentAudit = prev.audit ?? { issues: [], correctedIds: [], ignoredIds: [] };
      const correctedIds = currentAudit.correctedIds ?? [];
      const ignoredIds = currentAudit.ignoredIds ?? [];
      return {
        ...prev,
        audit: {
          ...currentAudit,
          issues: currentAudit.issues.map((issue) =>
            issue.id === issueId ? { ...issue, ignored: true, corrected: false } : issue,
          ),
          ignoredIds: ignoredIds.includes(issueId) ? ignoredIds : [...ignoredIds, issueId],
          correctedIds: correctedIds.filter((id) => id !== issueId),
        },
      };
    });
    setLog((prev) => [...prev, `[AUDIT IGNORE] ${issueId}`]);
  }, []);

  const applyParsedState = useCallback((parsed: Partial<ErosStatusState>) => {
    const result = processIncomingState(state, parsed, {
      ntrEnabled: config.enableNTR ?? false,
      auditorEnabled: config.auditorEnabled ?? true,
      imgAuditorEnabled: config.imgAuditorEnabled ?? true,
      config,
      currentTurnId: `t${Date.now()}`,
      parentTurnId: state.meta?.turn_id || '',
      previousChatState: chatState,
    });

    setState(result.messageState);
    setChatState(result.chatState);
  }, [state, chatState, config]);

  const handleParse = useCallback((text: string) => {
    setLog((prev) => [...prev, `> ${text.slice(0, 80)}${text.length > 80 ? '…' : ''}`]);
    const parsed = parseErosStatusFromMessage(text);
    if (!parsed) return;
    applyParsedState(parsed);
  }, [applyParsedState]);

  const handleApplyState = useCallback((parsed: Partial<ErosStatusState>) => {
    setLog((prev) => [...prev, `[AI EXTRACT] applied ${Object.keys(parsed).length} blocks`]);
    applyParsedState(parsed);
  }, [applyParsedState]);

  return (
    <div className="h-screen w-screen bg-[var(--terminal-bg)] flex overflow-hidden text-xs font-mono">
      <Toaster />

      {/* Simulated chat sidebar */}
      <div className="hidden md:flex w-[360px] flex-col border-r border-[var(--terminal-border)] bg-[var(--terminal-panel)]">
        <div className="p-3 border-b border-[var(--terminal-border)] neon-cyan tracking-widest">SIMULATED CHUB CHAT</div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="p-2 rounded bg-[var(--terminal-card)] border border-[var(--terminal-border)]" style={{ color: 'var(--terminal-text-muted)' }}>
            <span className="neon-pink font-bold">Hanako:</span> Day 5 already? Time flies when you're around...
          </div>
          <div className="p-2 rounded bg-[var(--terminal-card)] border border-[var(--terminal-border)]" style={{ color: 'var(--terminal-text-muted)' }}>
            <span className="neon-cyan font-bold">User:</span> You seem flustered.
          </div>
          {log.map((entry, i) => (
            <div key={i} className="p-2 rounded bg-[var(--terminal-card)] border border-[color-mix(in_srgb,var(--neon-green)_20%,transparent)]" style={{ color: 'var(--terminal-text-faint)' }}>
              <span className="text-[var(--neon-green)] font-bold">PARSE:</span> {entry}
            </div>
          ))}
        </div>
        <div className="p-2 border-t border-[var(--terminal-border)] text-[10px]" style={{ color: 'var(--terminal-text-faint)' }}>
          Chat simulation — terminal receives postMessage from here.
        </div>
      </div>

      {/* Terminal stage */}
      <div className="flex-1 min-w-[320px] h-full">
        <ErosTerminal
          state={state}
          chatState={chatState}
          config={config}
          onParse={handleParse}
          onApplyState={handleApplyState}
          onConfigChange={handleConfigChange}
          onCorrectAudit={handleCorrectAudit}
          onIgnoreAudit={handleIgnoreAudit}
          onCondenseMemory={handleCondenseMemory}
          onClearMemory={handleClearMemory}
        />
      </div>

      {/* Demo scenario controls */}
      <div className="hidden lg:flex w-[220px] flex-col border-l border-[var(--terminal-border)] bg-[var(--terminal-panel)] p-3 gap-2">
        <div className="neon-gold tracking-widest mb-1">DEMO SCENES</div>
        <Button
          size="sm"
          variant="outline"
          className="text-xs font-mono border-[color-mix(in_srgb,var(--neon-cyan)_40%,transparent)] text-[var(--neon-cyan)]"
          onClick={() => setState(buildDemoState('default'))}
        >
          Default / Daily
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-xs font-mono border-[color-mix(in_srgb,var(--neon-pink)_40%,transparent)] text-[var(--neon-pink)]"
          onClick={() => setState(buildDemoState('sex'))}
        >
          Sex Module
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-xs font-mono border-[color-mix(in_srgb,var(--neon-purple)_40%,transparent)] text-[var(--neon-purple)]"
          onClick={() => setState(buildDemoState('reaction'))}
        >
          Reaction Module
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-xs font-mono border-[color-mix(in_srgb,var(--neon-purple)_40%,transparent)] text-[var(--neon-purple)]"
          onClick={() => setState(buildDemoState('ntr'))}
        >
          NTR Module
        </Button>
        <div className="mt-auto text-[9px]" style={{ color: 'var(--terminal-text-faint)' }}>
          Eros Status Terminal v3.0 — Stage TestRunner
        </div>
      </div>
    </div>
  );
}
