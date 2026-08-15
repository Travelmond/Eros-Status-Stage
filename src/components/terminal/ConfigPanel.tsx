import { useState, useMemo } from 'react';
import { Switch } from '@/components/ui/switch';
import { buildMemoryContext, getMemoryStats } from '@/systems/memory';
import { AIProviderSection } from './AIProviderSection';
import type { ConfigType } from '@/types/config';
import type { ErosChatState } from '@/types/eros-status';

interface ConfigPanelProps {
  chatState?: ErosChatState | null;
  config?: ConfigType | null;
  onCondense?: () => void;
  onClearMemory?: () => void;
  onToggleAuditor?: (value: boolean) => void;
  onToggleImgAuditor?: (value: boolean) => void;
}

function Toggle({
  label,
  description,
  value,
  onChange,
  color = 'var(--neon-cyan)',
}: {
  label: string;
  description?: string;
  value: boolean;
  onChange: (v: boolean) => void;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex-1 min-w-0 pr-2">
        <div className="text-xs font-mono" style={{ color }}>{label}</div>
        {description && <div className="text-xs font-mono mt-0.5" style={{ color: 'var(--terminal-text-muted)', fontSize: '9px' }}>{description}</div>}
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}

export function ConfigPanel({
  chatState,
  config,
  onCondense,
  onClearMemory,
  onToggleAuditor,
  onToggleImgAuditor,
  onConfigChange,
}: ConfigPanelProps & { onConfigChange?: (patch: Partial<ConfigType>) => void }) {
  const [showContext, setShowContext] = useState(false);
  const stats = useMemo(() => getMemoryStats(chatState || undefined), [chatState]);
  const contextPreview = useMemo(() => buildMemoryContext(chatState?.longTermMemory ?? null), [chatState]);

  return (
    <div className="mx-3 mb-2 space-y-2 pb-2 animate-fade-in-up">
      <AIProviderSection
        config={config}
        onConfigChange={onConfigChange}
      />

      <div
        className="rounded overflow-hidden"
        style={{ border: '1px solid var(--terminal-border)', background: 'var(--terminal-card)' }}
      >
        <div className="px-3 py-1.5" style={{ background: 'color-mix(in srgb, var(--neon-cyan) 8%, transparent)', borderBottom: '1px solid var(--terminal-border)' }}>
          <span className="text-xs font-mono font-bold neon-cyan tracking-widest">🧠 MEMORY STATUS</span>
        </div>
        <div className="px-3 py-2">
          <div className="text-xs font-mono" style={{ color: 'var(--terminal-text-hint)', fontSize: '9px' }}>
            Short-term turns: {stats.turnCount} · Long-term facts: {stats.factsCount} · Narrative: {stats.narrativeLength} chars
          </div>
        </div>
      </div>

      <div
        className="rounded overflow-hidden"
        style={{ border: '1px solid color-mix(in srgb, var(--neon-purple) 20%, transparent)', background: 'var(--terminal-card)' }}
      >
        <div className="px-3 py-1.5" style={{ background: 'color-mix(in srgb, var(--neon-purple) 8%, transparent)', borderBottom: '1px solid color-mix(in srgb, var(--neon-purple) 20%, transparent)' }}>
          <span className="text-xs font-mono font-bold neon-purple tracking-widest">⚙️ MEMORY ACTIONS</span>
        </div>
        <div className="px-3 py-2 space-y-1.5">
          <button
            onClick={() => onCondense?.()}
            className="w-full text-xs font-mono px-2 py-1.5 rounded transition-all"
            style={{ border: '1px solid color-mix(in srgb, var(--neon-purple) 40%, transparent)', color: 'var(--neon-purple)', background: 'color-mix(in srgb, var(--neon-purple) 8%, transparent)' }}
          >
            ⚡ CONDENSE MEMORY NOW
          </button>
          <button
            onClick={() => onClearMemory?.()}
            className="w-full text-xs font-mono px-2 py-1.5 rounded transition-all"
            style={{ border: '1px solid color-mix(in srgb, var(--neon-pink) 30%, transparent)', color: 'color-mix(in srgb, var(--neon-pink) 80%, transparent)', background: 'transparent' }}
          >
            ✗ CLEAR ALL MEMORY
          </button>
        </div>
      </div>

      <div
        className="rounded overflow-hidden"
        style={{ border: '1px solid color-mix(in srgb, var(--neon-gold) 20%, transparent)', background: 'var(--terminal-card)' }}
      >
        <div className="px-3 py-1.5" style={{ background: 'color-mix(in srgb, var(--neon-gold) 8%, transparent)', borderBottom: '1px solid color-mix(in srgb, var(--neon-gold) 20%, transparent)' }}>
          <span className="text-xs font-mono font-bold neon-gold tracking-widest">🔧 SYSTEM TOGGLES</span>
        </div>
        <div className="px-3 py-1">
          <Toggle
            label="Consistency Auditor"
            description="Passive detection of data inconsistencies"
            value={config?.auditorEnabled !== false}
            onChange={onToggleAuditor || (() => {})}
            color="var(--neon-pink)"
          />
          <div style={{ borderTop: '1px solid var(--terminal-text-subtle)' }}>
            <Toggle
              label="IMG Auditor"
              description="Check image prompts against current state"
              value={config?.imgAuditorEnabled !== false}
              onChange={onToggleImgAuditor || (() => {})}
              color="var(--neon-cyan)"
            />
          </div>
        </div>
      </div>

      <div
        className="rounded overflow-hidden"
        style={{ border: '1px solid color-mix(in srgb, var(--neon-green) 20%, transparent)', background: 'var(--terminal-card)' }}
      >
        <div
          className="px-3 py-1.5 flex items-center justify-between cursor-pointer"
          style={{
            background: 'color-mix(in srgb, var(--neon-green) 8%, transparent)',
            borderBottom: showContext ? '1px solid color-mix(in srgb, var(--neon-green) 20%, transparent)' : 'none',
          }}
          onClick={() => setShowContext((v) => !v)}
        >
          <span className="text-xs font-mono font-bold neon-green tracking-widest">📋 SYSTEM PROMPT CONTEXT</span>
          <span className="text-xs font-mono" style={{ color: 'var(--terminal-text-hint)' }}>{showContext ? '▲' : '▼'}</span>
        </div>
        {showContext && (
          <div className="px-3 py-2">
            {contextPreview ? (
              <pre
                className="text-xs font-mono whitespace-pre-wrap break-words"
                style={{ color: 'var(--neon-green)', fontSize: '9px', lineHeight: '1.5', maxHeight: '200px', overflow: 'auto' }}
              >
                {contextPreview}
              </pre>
            ) : (
              <div className="text-xs font-mono text-center py-3" style={{ color: 'var(--terminal-text-faint)' }}>
                No long-term memory yet. Play a few turns to populate.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
