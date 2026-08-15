/**
 * ErosTerminal — Painel visual raiz do Eros Status Terminal v3.0.
 *
 * Orquestra os componentes de UI, tabs, notificações e correções de auditoria.
 * A lógica de parse/middleware/auditoria é aplicada pelo Stage.tsx; este
 * componente apenas renderiza o estado recebido via props.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TerminalHeader } from './TerminalHeader';
import { TerminalFooter } from './TerminalFooter';
import { CharacterPanel } from './CharacterPanel';
import { StatusPanel } from './StatusPanel';
import { InventoryPanel } from './InventoryPanel';
import { LocationPanel } from './LocationPanel';
import { NPCPanel } from './NPCPanel';
import { GoalsPanel } from './GoalsPanel';
import { ModulesPanel } from './ModulesPanel';
import { BodyDescPanel } from './BodyDescPanel';
import { BodyDescCharPanel } from './BodyDescCharPanel';
import { ImagePromptPanel } from './ImagePromptPanel';
import { RawOutputPanel } from './RawOutputPanel';
import { ConfigPanel } from './ConfigPanel';
import { AIConfigPanel } from './AIConfigPanel';
import { AuditPanel } from './AuditPanel';
import { CorrectionAlert } from './CorrectionAlert';
import { NTRModal } from './NTRModal';
import { NotificationToast, type Toast, type ToastLevel } from './NotificationToast';
import { ProgressionsPanel } from './ProgressionsPanel';
import { RelationshipPanel } from './RelationshipPanel';
import { EmotionPanel } from './EmotionPanel';
import type { ErosStatusState, ErosChatState, AuditIssue } from '@/types/eros-status';
import type { ConfigType, BarStyle } from '@/types/config';

export interface ErosTerminalProps {
  state?: ErosStatusState;
  chatState?: ErosChatState;
  config?: ConfigType | null;
  barStyle?: BarStyle;
  onParse?: (text: string) => void;
  onConfigChange?: (patch: Partial<ConfigType>) => void;
  onIgnoreAudit?: (issueId: string) => void;
  onCorrectAudit?: (issueId: string, value: unknown) => void;
  onCondenseMemory?: () => void;
  onClearMemory?: () => void;
}

const ALL_TABS = [
  { id: 'status', label: 'STATUS', icon: '📊', color: 'var(--neon-cyan)' },
  { id: 'inventory', label: 'INV', icon: '🎒', color: 'var(--neon-cyan)' },
  { id: 'character', label: 'CHAR', icon: '🧍', color: 'var(--neon-cyan)' },
  { id: 'location', label: 'MAP', icon: '🗺️', color: 'var(--neon-cyan)' },
  { id: 'npcs', label: 'NPCs', icon: '👥', color: 'var(--neon-cyan)' },
  { id: 'sex', label: 'SEX', icon: '🔥', color: 'var(--neon-pink)', conditional: 'sex' },
  { id: 'reaction', label: 'REACT', icon: '🧠', color: 'var(--neon-purple)', conditional: 'reaction' },
  { id: 'ntr', label: 'NTR', icon: '💔', color: 'var(--neon-purple)', conditional: 'ntr' },
  { id: 'img', label: 'IMG', icon: '🖼️', color: 'var(--neon-gold)' },
  { id: 'raw', label: 'RAW', icon: '📄', color: 'var(--neon-cyan)' },
  { id: 'audit', label: 'AUDIT', icon: '🔍', color: 'var(--neon-pink)' },
  { id: 'config', label: 'CONFIG', icon: '⚙️', color: 'var(--neon-purple)' },
  { id: 'aiconfig', label: 'AI', icon: '🤖', color: 'var(--neon-green)' },
];

export default function ErosTerminal({
  state,
  chatState,
  config,
  barStyle = 'bar',
  onParse,
  onIgnoreAudit,
  onCorrectAudit,
  onConfigChange,
  onCondenseMemory,
  onClearMemory,
}: ErosTerminalProps) {
  const [activeTab, setActiveTab] = useState('status');
  const [inputText, setInputText] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showNTRModal, setShowNTRModal] = useState(false);
  const [auditLog, setAuditLog] = useState<AuditIssue[]>([]);
  const [lastRaw, setLastRaw] = useState('');
  const prevStateRef = useRef<ErosStatusState | null>(null);

  const ntrEnabled = config?.enableNTR ?? false;
  const currentState = state ?? ({} as ErosStatusState);
  const auditIssues = currentState.audit?.issues || [];
  const turnCount = chatState?.globalMeta?.totalTurns || 0;
  const branchIndex = currentState.meta?.branch_index || 0;

  const addToast = useCallback((level: ToastLevel, message: string, duration = 3500) => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, level, message, duration }]);
  }, []);

  useEffect(() => {
    if (!state) return;

    // Notificação via ui_commands
    const notif = state.ui_commands?.notification;
    if (notif?.message) {
      const level = (notif.level === 'warn' ? 'warning' : notif.level === 'error' ? 'critical' : 'info') as ToastLevel;
      addToast(level, notif.message, level === 'critical' ? 5000 : 3500);
    }

    // Auto-switch de aba sugerido pela IA
    const suggested = state.ui_commands?.suggested_tab;
    if (suggested && ALL_TABS.some((t) => t.id === suggested)) {
      setActiveTab(suggested);
    }

    prevStateRef.current = state;
  }, [state, addToast]);

  const removeToast = useCallback((id: string | number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setLastRaw(inputText);
    onParse?.(inputText);
    setInputText('');
  };

  const handleCorrectAudit = (issueId: string, newValue: unknown) => {
    const issue = auditIssues.find((i) => i.id === issueId);
    if (issue) {
      setAuditLog((prev) => [...prev, { ...issue, corrected: true, ignored: false }]);
    }
    onCorrectAudit?.(issueId, newValue);
  };

  const handleIgnoreAudit = (issueId: string) => {
    const issue = auditIssues.find((i) => i.id === issueId);
    if (issue) {
      setAuditLog((prev) => [...prev, { ...issue, corrected: false, ignored: true }]);
    }
    onIgnoreAudit?.(issueId);
  };

  const handleNTRToggle = () => {
    if (!ntrEnabled) setShowNTRModal(true);
    else onConfigChange?.({ enableNTR: false });
  };

  const handleNTRConfirm = () => {
    setShowNTRModal(false);
    onConfigChange?.({ enableNTR: true });
    addToast('critical', '💔 NTR module enabled', 5000);
  };

  const showSex = !!currentState.sexModule?.active;
  const showReaction = !!currentState.reactionModule?.active && (currentState.reactionModule.reactions?.length || 0) > 0;

  const visibleTabs = ALL_TABS.filter((t) => {
    if (t.conditional === 'sex') return showSex;
    if (t.conditional === 'reaction') return showReaction;
    if (t.conditional === 'ntr') return ntrEnabled;
    return true;
  });

  return (
    <div
      className="flex flex-col h-full font-mono overflow-hidden crt-overlay relative"
      style={{ background: 'var(--terminal-bg)', color: 'var(--terminal-text-secondary)' }}
    >
      {showNTRModal && <NTRModal onConfirm={handleNTRConfirm} onCancel={() => setShowNTRModal(false)} />}
      <NotificationToast toasts={toasts} onRemove={removeToast} />

      <TerminalHeader system={currentState.system} location={currentState.location} />
      <CharacterPanel character={currentState.character} body={currentState.body} />

      {/* Tabs */}
      <div
        className="flex flex-wrap items-center flex-shrink-0"
        style={{ borderBottom: '1px solid color-mix(in srgb, var(--neon-cyan) 20%, transparent)', background: 'var(--terminal-bg)' }}
      >
        {visibleTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
              className="flex flex-col items-center justify-center px-2 py-1.5 flex-shrink-0 transition-all border-b-2"
              style={{
                borderBottomColor: isActive ? tab.color : 'transparent',
                background: isActive ? `color-mix(in srgb, ${tab.color} 10%, transparent)` : 'transparent',
                color: isActive ? tab.color : 'var(--terminal-text-muted)',
                textShadow: isActive ? `0 0 8px ${tab.color}` : 'none',
                minWidth: '36px',
                gap: '2px',
              }}
            >
              <span style={{ fontSize: '14px', lineHeight: 1 }}>{tab.icon}</span>
              <span style={{ fontSize: '8px', letterSpacing: '0.05em', lineHeight: 1 }}>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <CorrectionAlert issues={auditIssues} onCorrect={handleCorrectAudit} onIgnore={handleIgnoreAudit} />

      {/* Conteúdo das abas */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'status' && (
              <div className="pb-2 animate-fade-in-up">
                <StatusPanel state={currentState} barStyle={barStyle} />
                <EmotionPanel character={currentState.character} body={currentState.body} />
                <GoalsPanel goals={currentState.goals} aiInstructions={currentState.aiInstructions} />
              </div>
            )}
            {activeTab === 'inventory' && (
              <div className="pb-2 animate-fade-in-up">
                <InventoryPanel
                  clothingSlots={currentState.clothingSlots}
                  inventory={currentState.inventory}
                  characterName={currentState.character?.name}
                />
                <BodyDescPanel body={currentState.body} character={currentState.character} />
              </div>
            )}
            {activeTab === 'character' && (
              <div className="pb-2 animate-fade-in-up">
                <EmotionPanel character={currentState.character} body={currentState.body} />
                <BodyDescCharPanel body={currentState.body} character={currentState.character} />
                <ProgressionsPanel progressions={currentState.progressions} barStyle={barStyle} state={currentState} />
              </div>
            )}
            {activeTab === 'location' && (
              <div className="pb-2 animate-fade-in-up">
                <LocationPanel location={currentState.location} system={currentState.system} />
              </div>
            )}
            {activeTab === 'npcs' && (
              <div className="pb-2 animate-fade-in-up">
                <RelationshipPanel state={currentState} />
                <NPCPanel npcs={currentState.npcs} />
                <GoalsPanel goals={currentState.goals} />
              </div>
            )}
            {activeTab === 'sex' && (
              <div className="pb-2 animate-fade-in-up">
                <ModulesPanel state={currentState} ntrEnabled={ntrEnabled} />
              </div>
            )}
            {activeTab === 'reaction' && (
              <div className="pb-2 animate-fade-in-up">
                <ModulesPanel state={currentState} ntrEnabled={ntrEnabled} />
              </div>
            )}
            {activeTab === 'ntr' && ntrEnabled && (
              <div className="pb-2 animate-fade-in-up">
                <ModulesPanel state={currentState} ntrEnabled={ntrEnabled} />
              </div>
            )}
            {activeTab === 'img' && (
              <div className="pb-2 animate-fade-in-up">
                <ImagePromptPanel state={currentState} imgAuditIssues={auditIssues} />
              </div>
            )}
            {activeTab === 'raw' && (
              <div className="pb-2 animate-fade-in-up">
                <RawOutputPanel rawBlock={lastRaw} />
              </div>
            )}
            {activeTab === 'aiconfig' && (
              <div className="pb-2 animate-fade-in-up">
                <AIConfigPanel
                  onParsed={(text) => onParse?.(text)}
                  config={config}
                  onConfigChange={onConfigChange}
                />
              </div>
            )}
            {activeTab === 'audit' && (
              <div className="pb-2 animate-fade-in-up">
                <AuditPanel
                  issues={auditIssues}
                  auditLog={auditLog}
                  onCorrect={handleCorrectAudit}
                  onIgnore={handleIgnoreAudit}
                  onClearLog={() => setAuditLog([])}
                />
              </div>
            )}
            {activeTab === 'config' && (
              <div className="pb-2 animate-fade-in-up">
                <ConfigPanel
                  chatState={chatState}
                  config={config}
                  onConfigChange={onConfigChange}
                  onCondense={onCondenseMemory}
                  onClearMemory={onClearMemory}
                  onToggleAuditor={(value) => onConfigChange?.({ auditorEnabled: value })}
                  onToggleImgAuditor={(value) => onConfigChange?.({ imgAuditorEnabled: value })}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer / input */}
      <form onSubmit={handleSubmit} className="px-3 pb-3 pt-2 flex-shrink-0">
        <div
          className="flex items-center gap-1 rounded px-2 py-1.5"
          style={{ border: '1px solid color-mix(in srgb, var(--neon-cyan) 30%, transparent)', background: 'var(--terminal-bg-deep)' }}
        >
          <span className="text-xs neon-cyan flex-shrink-0">▸</span>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste AI output to parse..."
            className="flex-1 bg-transparent text-xs font-mono outline-none text-[var(--terminal-text-primary)] placeholder:text-[var(--terminal-text-ghost)]"
          />
          <button
            type="submit"
            className="text-xs px-2 py-0.5 rounded font-mono transition-all flex-shrink-0"
            style={{ border: '1px solid color-mix(in srgb, var(--neon-cyan) 40%, transparent)', color: 'var(--neon-cyan)', background: 'color-mix(in srgb, var(--neon-cyan) 10%, transparent)' }}
          >
            PARSE
          </button>
        </div>
        <TerminalFooter
          turnCount={turnCount}
          branchIndex={branchIndex}
          meta={currentState.meta}
          auditIssues={auditIssues}
          ntrEnabled={ntrEnabled}
          onToggleNTR={handleNTRToggle}
          onOpenAudit={() => setActiveTab('audit')}
        />
      </form>
    </div>
  );
}
