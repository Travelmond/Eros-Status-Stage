import { useState, useMemo } from 'react';
import { Switch } from '@/components/ui/switch';
import { getMemoryStats, buildSystemPromptContext, type MemoryState } from '@/lib/memoryService';
import { AIProviderSection } from './AIProviderSection';

interface ConfigPanelProps {
  memory?: MemoryState | null;
  config?: {
    auditorEnabled?: boolean;
    imgAuditorEnabled?: boolean;
  };
  onCondense?: () => void;
  onClearMemory?: () => void;
  onToggleMode?: (mode: 'narrative' | 'entities' | 'hybrid') => void;
  onToggleDiary?: (value: boolean) => void;
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
        {description && <div className="text-xs font-mono mt-0.5" style={{ color: '#ffffff30', fontSize: '9px' }}>{description}</div>}
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}

function ModeButton({
  mode,
  currentMode,
  onClick,
  label,
  description,
}: {
  mode: 'narrative' | 'entities' | 'hybrid';
  currentMode?: string;
  onClick: (mode: 'narrative' | 'entities' | 'hybrid') => void;
  label: string;
  description: string;
}) {
  const active = mode === currentMode;
  const color = active ? 'var(--neon-cyan)' : '#ffffff30';
  return (
    <button
      onClick={() => onClick(mode)}
      className="flex-1 rounded p-2 text-left transition-all"
      style={{ border: `1px solid ${active ? 'var(--neon-cyan)' : '#ffffff15'}`, background: active ? 'var(--neon-cyan)10' : 'transparent' }}
    >
      <div className="text-xs font-mono font-bold" style={{ color }}>{label}</div>
      <div className="text-xs font-mono mt-0.5" style={{ color: '#ffffff30', fontSize: '9px' }}>{description}</div>
    </button>
  );
}

export function ConfigPanel({
  memory,
  config,
  onCondense,
  onClearMemory,
  onToggleMode,
  onToggleDiary,
  onToggleAuditor,
  onToggleImgAuditor,
}: ConfigPanelProps) {
  const [showContext, setShowContext] = useState(false);
  const stats = useMemo(() => getMemoryStats(memory || null), [memory]);
  const contextPreview = useMemo(() => buildSystemPromptContext(memory || null), [memory]);

  return (
    <div className="mx-3 mb-2 space-y-2 pb-2 animate-fade-in-up">
      <AIProviderSection />

      <div
        className="rounded overflow-hidden"
        style={{ border: '1px solid var(--terminal-border)', background: 'var(--terminal-card)' }}
      >
        <div className="px-3 py-1.5" style={{ background: 'var(--neon-cyan)08', borderBottom: '1px solid var(--terminal-border)' }}>
          <span className="text-xs font-mono font-bold neon-cyan tracking-widest">🧠 MEMORY MODE</span>
        </div>
        <div className="px-3 py-2">
          <div className="flex gap-1.5 mb-2">
            <ModeButton
              mode="narrative"
              currentMode={memory?.mode}
              onClick={onToggleMode || (() => {})}
              label="📖 NARRATIVE"
              description="Diary only"
            />
            <ModeButton
              mode="entities"
              currentMode={memory?.mode}
              onClick={onToggleMode || (() => {})}
              label="🗄️ ENTITIES"
              description="Facts only"
            />
            <ModeButton
              mode="hybrid"
              currentMode={memory?.mode}
              onClick={onToggleMode || (() => {})}
              label="⚡ HYBRID"
              description="Recommended"
            />
          </div>
          <div className="text-xs font-mono" style={{ color: '#ffffff40', fontSize: '9px' }}>
            Short-term: {stats.shortTermCount}/{stats.shortTermLimit} · Long-term: {stats.longTermFacts} facts, {stats.longTermDiary} diary
          </div>
        </div>
      </div>

      <div
        className="rounded overflow-hidden"
        style={{ border: '1px solid var(--neon-purple)20', background: 'var(--terminal-card)' }}
      >
        <div className="px-3 py-1.5" style={{ background: 'var(--neon-purple)08', borderBottom: '1px solid var(--neon-purple)20' }}>
          <span className="text-xs font-mono font-bold neon-purple tracking-widest">⚙️ MEMORY ACTIONS</span>
        </div>
        <div className="px-3 py-2 space-y-1.5">
          <button
            onClick={() => onCondense?.()}
            className="w-full text-xs font-mono px-2 py-1.5 rounded transition-all"
            style={{ border: '1px solid var(--neon-purple)40', color: 'var(--neon-purple)', background: 'var(--neon-purple)08' }}
          >
            ⚡ CONDENSE MEMORY NOW
          </button>
          <button
            onClick={() => onClearMemory?.()}
            className="w-full text-xs font-mono px-2 py-1.5 rounded transition-all"
            style={{ border: '1px solid var(--neon-pink)30', color: 'var(--neon-pink)80', background: 'transparent' }}
          >
            ✗ CLEAR ALL MEMORY
          </button>
        </div>
      </div>

      <div
        className="rounded overflow-hidden"
        style={{ border: '1px solid var(--neon-gold)20', background: 'var(--terminal-card)' }}
      >
        <div className="px-3 py-1.5" style={{ background: 'var(--neon-gold)08', borderBottom: '1px solid var(--neon-gold)20' }}>
          <span className="text-xs font-mono font-bold neon-gold tracking-widest">🔧 SYSTEM TOGGLES</span>
        </div>
        <div className="px-3 py-1">
          <Toggle
            label="Register Narrative Diary"
            description="Store chronological summaries in long-term memory"
            value={memory?.registerDiary !== false}
            onChange={onToggleDiary || (() => {})}
            color="var(--neon-gold)"
          />
          <div style={{ borderTop: '1px solid #ffffff08' }}>
            <Toggle
              label="Consistency Auditor"
              description="Passive detection of data inconsistencies"
              value={config?.auditorEnabled !== false}
              onChange={onToggleAuditor || (() => {})}
              color="var(--neon-pink)"
            />
          </div>
          <div style={{ borderTop: '1px solid #ffffff08' }}>
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
        style={{ border: '1px solid var(--neon-green)20', background: 'var(--terminal-card)' }}
      >
        <div
          className="px-3 py-1.5 flex items-center justify-between cursor-pointer"
          style={{
            background: 'var(--neon-green)08',
            borderBottom: showContext ? '1px solid var(--neon-green)20' : 'none',
          }}
          onClick={() => setShowContext((v) => !v)}
        >
          <span className="text-xs font-mono font-bold neon-green tracking-widest">📋 SYSTEM PROMPT CONTEXT</span>
          <span className="text-xs font-mono" style={{ color: '#ffffff40' }}>{showContext ? '▲' : '▼'}</span>
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
              <div className="text-xs font-mono text-center py-3" style={{ color: '#ffffff20' }}>
                No long-term memory yet. Play a few turns to populate.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
