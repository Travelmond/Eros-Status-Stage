# 04 — src/components/terminal (Core + painéis base)

> Parte 4/10. Código-fonte completo do componente principal `ErosTerminal.jsx` e dos painéis base.

---

### `src/components/terminal/ErosTerminal.jsx`

> Componente principal. Orquestra parser → middleware → persistência → UI. ❌ **MIGRAÇÃO:** remover rotas React Router; adicionar listener `postMessage` do Chub.

```jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { parseErosStatusFromMessage, DEFAULT_STATE } from '../../lib/erosParser';
import { processIncomingState, validateInitialState } from '../../lib/stateMiddleware';
import { saveCharacterState, loadCharacterState, deepMerge, normalizeCharKey, saveTurnVersion, loadTurnVersion, setCurrentTurnId } from '../../services/characterStateService';
import { useStandaloneToast } from './NotificationToast';
import NotificationToast from './NotificationToast';
import TerminalHeader from './TerminalHeader';
import CharacterPanel from './CharacterPanel';
import TerminalTabs from './TerminalTabs';
import ProgressionsPanel from './ProgressionsPanel';
import DetailsPanel from './DetailsPanel';
import MiniMapPanel from './MiniMapPanel.jsx';
import AvatarPanel from './AvatarPanel';
import NPCPanel from './NPCPanel.jsx';
import GoalsPanel from './GoalsPanel';
import RawOutputPanel from './RawOutputPanel';
import SexPanel from './SexPanel';
import InventoryPanel from './InventoryPanel';
import ReactionPanel from './ReactionPanel';
import BodyDescPanel from './BodyDescPanel';
import BodyDescCharPanel from './BodyDescCharPanel';
import IMGPanel from './IMGPanel';
import NTRModal from './NTRModal';
import RelationshipPanel from './RelationshipPanel';
import AIConfigPanel from './AIConfigPanel.jsx';
import CorrectionAlert from './CorrectionAlert';
import AuditPanel from './AuditPanel';
import ConfigPanel from './ConfigPanel';
import { loadMemory, addTurn as memAddTurn, condenseNow as memCondense, clearMemory as memClear } from '../../lib/memoryService';

const DEMO_MESSAGE = `
Day 5 | 14:32 | ☀️ Sunny | 📍 Bedroom

#Hanako [MILF]

[💕75% 🎯80% 🔥55% 🍑70%] [📍Bedroom → Home] [⏰14:32]

😊 Mood: Flustered
Thoughts: 'He's looking at me again...'
Clothing: Light orange shirt, tight jeans
Location: Master Bedroom → Home
Inventory: Phone, Lipstick
Goals: Prepare dinner, resist flirting
NPCs: Kenji (neighbor, suspicious)
USER_CHARACTER: Fabiano / husband
`;

function NTRStatusPanel({ ntrModule, character }) {
  return (
    <div className="mx-3 mb-2 rounded overflow-hidden" style={{ border: '1px solid #BF5FFF40' }}>
      <div className="px-3 py-1.5" style={{ background: '#BF5FFF10', borderBottom: '1px solid #BF5FFF25' }}>
        <span className="text-xs font-mono font-bold neon-purple tracking-widest">💔 NTR MODULE</span>
      </div>
      <div className="px-3 py-2 text-xs font-mono" style={{ background: '#0A0A0A' }}>
        {ntrModule && ntrModule.active ? (
          <div className="space-y-1">
            {ntrModule.ntrCharacter && (<div className="flex gap-2"><span style={{ color: '#BF5FFF80' }}>Character:</span><span className="text-gray-300">{ntrModule.ntrCharacter}</span></div>)}
            {ntrModule.ntrPartner && (<div className="flex gap-2"><span style={{ color: '#BF5FFF80' }}>Partner:</span><span className="text-gray-300">{ntrModule.ntrPartner}</span></div>)}
            {ntrModule.betrayalStage && (<div className="flex gap-2"><span style={{ color: '#BF5FFF80' }}>Stage:</span><span className="text-gray-300">{ntrModule.betrayalStage}</span></div>)}
            {ntrModule.jealousyLevel > 0 && (
              <div className="flex gap-2">
                <span style={{ color: '#BF5FFF80' }}>Jealousy:</span>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 rounded-full" style={{ background: '#ffffff10', width: '80px' }}>
                    <div className="h-full rounded-full" style={{ width: `${ntrModule.jealousyLevel}%`, background: '#BF5FFF', boxShadow: '0 0 4px #BF5FFF' }} />
                  </div>
                  <span className="text-gray-500">{ntrModule.jealousyLevel}%</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-700 text-center py-3"><div className="text-lg mb-1">💔</div><div>NTR module enabled — waiting for trigger event</div></div>
        )}
      </div>
    </div>
  );
}

export default function ErosTerminal({ barStyle = 'bar', initialText }) {
  const [state, setState] = useState(DEFAULT_STATE);
  const [activeTab, setActiveTab] = useState('status');
  const [inputText, setInputText] = useState('');
  const [lastRaw, setLastRaw] = useState('');
  const [turnCount, setTurnCount] = useState(0);
  const [ntrEnabled, setNtrEnabled] = useState(false);
  const [showNTRModal, setShowNTRModal] = useState(false);
  const [progressionChanges, setProgressionChanges] = useState([]);
  const [branchInfo, setBranchInfo] = useState({ turnId: '', parentTurnId: '', branchIndex: 0 });
  const [memory, setMemory] = useState(null);
  const [config, setConfig] = useState({ auditorEnabled: true, imgAuditorEnabled: true });
  const [auditIssues, setAuditIssues] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const prevStateRef = useRef(null);
  const { toasts, addToast, removeToast } = useStandaloneToast();

  useEffect(() => {
    setMemory(loadMemory());
    const seed = initialText || DEMO_MESSAGE;
    const parsed = parseErosStatusFromMessage(seed);
    if (parsed) {
      const { state: validated } = validateInitialState(parsed);
      const charKey = normalizeCharKey(validated.character?.name || 'character');
      const persisted = saveCharacterState(charKey, validated);
      const initialTurnId = `t1`;
      setCurrentTurnId(charKey, initialTurnId);
      saveTurnVersion(charKey, initialTurnId, '', persisted);
      setState(persisted);
      prevStateRef.current = persisted;
      setLastRaw(seed.trim());
      setTurnCount(1);
      setBranchInfo({ turnId: initialTurnId, parentTurnId: '', branchIndex: 0 });
    }
  }, [initialText]);

  const handleParse = useCallback((text, isRegeneration = false) => {
    if (!text.trim()) return;
    const prevState = prevStateRef.current || state;
    const parsed = parseErosStatusFromMessage(text);
    if (!parsed) return;
    if (ntrEnabled) parsed.ntrModule.enabled = true;
    const result = processIncomingState(prevState, parsed, { ntrEnabled, auditorEnabled: config.auditorEnabled, imgAuditorEnabled: config.imgAuditorEnabled });
    const charKey = normalizeCharKey(parsed.character?.name || prevState.character?.name || 'character');
    const newTurnNumber = prevState._turnCount ? prevState._turnCount + 1 : turnCount + 1;
    const branchIdx = isRegeneration ? (branchInfo.branchIndex + 1) : 0;
    const turnId = `t${newTurnNumber}_v${branchIdx}`;
    const parentTurnId = isRegeneration ? branchInfo.parentTurnId : (branchInfo.turnId || `t${newTurnNumber - 1}_v0`);
    const toSave = { ...result.state, _turnCount: newTurnNumber };
    saveTurnVersion(charKey, turnId, parentTurnId, toSave);
    const persisted = saveCharacterState(charKey, result.state);
    setCurrentTurnId(charKey, turnId);
    setState(prev => { const merged = deepMerge(prev, { ...result.state, turnCount: newTurnNumber }); prevStateRef.current = merged; return merged; });
    setTurnCount(newTurnNumber);
    setBranchInfo({ turnId, parentTurnId, branchIndex: branchIdx });
    if (result.tabSwitch && result.tabSwitch !== activeTab) setActiveTab(result.tabSwitch);
    for (const notif of result.notifications) { addToast({ level: notif.level || 'info', message: notif.message, duration: notif.level === 'critical' ? 5000 : 3500 }); }
    setProgressionChanges(result.progressionChanges || []);
    setAuditIssues(result.auditIssues || []);
    if (memory) { const updatedMem = memAddTurn(memory, turnId, toSave); setMemory(updatedMem); }
    if (result.invalidations.length > 0) console.warn('[ErosTerminal] State coerced:', result.invalidations);
    if (result.rejectedCommands.length > 0) console.warn('[ErosTerminal] UI commands rejected:', result.rejectedCommands);
    setLastRaw(text);
  }, [state, activeTab, ntrEnabled, turnCount, branchInfo, addToast, config.auditorEnabled, config.imgAuditorEnabled, memory]);

  const handleRegenerate = useCallback((text) => { handleParse(text, true); }, [handleParse]);

  const handleCorrectAudit = useCallback((issueId, newValue) => {
    const issue = auditIssues.find(i => i.id === issueId);
    if (!issue) return;
    setState(prev => {
      const newState = { ...prev };
      const path = issue.field.split('.');
      let target = newState;
      for (let i = 0; i < path.length - 1; i++) target = target[path[i]];
      target[path[path.length - 1]] = newValue;
      prevStateRef.current = newState;
      return newState;
    });
    setAuditLog(log => [...log, { ...issue, status: 'corrected', correctedValue: newValue }]);
    setAuditIssues(issues => issues.filter(i => i.id !== issueId));
  }, [auditIssues]);

  const handleIgnoreAudit = useCallback((issueId) => {
    const issue = auditIssues.find(i => i.id === issueId);
    if (!issue) return;
    setAuditLog(log => [...log, { ...issue, status: 'ignored', ignoredReason: 'User accepted as narrative' }]);
    setAuditIssues(issues => issues.filter(i => i.id !== issueId));
  }, [auditIssues]);

  const handleClearLog = useCallback(() => { setAuditLog([]); }, []);
  const handleCondense = useCallback(() => { if (!memory) return; const updated = memCondense(memory); setMemory(updated); addToast({ level: 'info', message: '🧠 Memory condensed to long-term', duration: 3000 }); }, [memory, addToast]);
  const handleClearMemory = useCallback(() => { const cleared = memClear(); setMemory(cleared); addToast({ level: 'warning', message: '🧠 All memory cleared', duration: 3000 }); }, [addToast]);
  const handleToggleMode = useCallback((mode) => { setMemory(mem => mem ? { ...mem, mode } : mem); }, []);
  const handleToggleDiary = useCallback((value) => { setMemory(mem => mem ? { ...mem, registerDiary: value } : mem); }, []);
  const handleToggleAuditor = useCallback((value) => { setConfig(c => ({ ...c, auditorEnabled: value })); }, []);
  const handleToggleImgAuditor = useCallback((value) => { setConfig(c => ({ ...c, imgAuditorEnabled: value })); }, []);

  useEffect(() => {
    if (progressionChanges.length > 0) {
      const timer = setTimeout(() => setProgressionChanges([]), 1500);
      return () => clearTimeout(timer);
    }
  }, [progressionChanges]);

  const handleSubmit = (e) => { e.preventDefault(); handleParse(inputText); setInputText(''); };
  const handleNTRToggle = () => { if (!ntrEnabled) setShowNTRModal(true); else setNtrEnabled(false); };
  const handleNTRConfirm = () => { setNtrEnabled(true); setShowNTRModal(false); };

  const showSex = !!(state.sexModule && state.sexModule.active);
  const showReaction = !!(state.reactionModule && state.reactionModule.active && state.reactionModule.reactions?.length);
  const showNTR = ntrEnabled;

  return (
    <div className="flex flex-col h-full font-mono overflow-hidden crt-overlay relative" style={{ background: '#0A0A0A', color: '#e2e8f0' }}>
      {showNTRModal && <NTRModal onConfirm={handleNTRConfirm} onCancel={() => setShowNTRModal(false)} />}
      <NotificationToast toasts={toasts} onRemove={removeToast} />
      <TerminalHeader system={state.system} location={state.location} />
      <CharacterPanel character={state.character} body={state.body} />
      <TerminalTabs activeTab={activeTab} onTabChange={setActiveTab} showSex={showSex} showReaction={showReaction} showNTR={showNTR} />
      <CorrectionAlert issues={auditIssues} onCorrect={handleCorrectAudit} onIgnore={handleIgnoreAudit} />
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'status' && (<div className="pb-2 fade-in-up"><ProgressionsPanel progressions={state.progressions} barStyle={barStyle} state={state} /><RelationshipPanel state={state} /><ReactionPanel reactionModule={state.reactionModule} /><DetailsPanel body={state.body} clothing={state.clothing} location={state.location} inventory={null} goals={state.goals} npcs={state.npcs} /><GoalsPanel goals={state.goals} aiInstructions={state.aiInstructions} /></div>)}
        {activeTab === 'inventory' && (<div className="pb-2 fade-in-up"><InventoryPanel clothingSlots={state.clothingSlots} inventory={state.inventory} character={state.character} /><BodyDescPanel body={state.body} character={state.character} /></div>)}
        {activeTab === 'character' && (<div className="pb-2 fade-in-up"><AvatarPanel character={state.character} body={state.body} expressionPose={state.expressionPose} /><BodyDescCharPanel body={state.body} character={state.character} /><ProgressionsPanel progressions={state.progressions} barStyle={barStyle} compact={false} state={state} /></div>)}
        {activeTab === 'location' && (<div className="pb-2 fade-in-up"><MiniMapPanel location={state.location} system={state.system} /><DetailsPanel body={null} clothing={null} location={state.location} inventory={state.inventory} goals={null} npcs={null} /></div>)}
        {activeTab === 'npcs' && (<div className="pb-2 fade-in-up"><RelationshipPanel state={state} /><NPCPanel npcs={state.npcs} relationships={state.relationships} state={state} /><GoalsPanel goals={state.goals} aiInstructions={state.aiInstructions} /></div>)}
        {activeTab === 'sex' && (<div className="pb-2 fade-in-up">{showSex ? <SexPanel sexModule={state.sexModule} /> : <div className="flex flex-col items-center justify-center h-32 text-gray-700 text-xs font-mono"><div className="text-2xl mb-2">🔒</div><div>No active sex/flirt scene detected</div><div className="text-gray-800 mt-1">Panel appears during flirting, sex, or post-sex</div></div>}</div>)}
        {activeTab === 'reaction' && (<div className="pb-2 fade-in-up">{showReaction ? <ReactionPanel reactionModule={state.reactionModule} /> : <div className="flex flex-col items-center justify-center h-32 text-gray-700 text-xs font-mono"><div className="text-2xl mb-2">🧠</div><div>No reaction module data detected</div><div className="text-gray-800 mt-1">Tab appears when AI outputs a REACTION MODULE block</div></div>}</div>)}
        {activeTab === 'img' && (<div className="pb-2 fade-in-up"><IMGPanel state={state} imgAuditIssues={auditIssues} /></div>)}
        {activeTab === 'ntr' && ntrEnabled && (<div className="pb-2 fade-in-up"><NTRStatusPanel ntrModule={state.ntrModule} character={state.character} /></div>)}
        {activeTab === 'raw' && (<div className="pb-2 fade-in-up"><RawOutputPanel rawBlock={lastRaw} /></div>)}
        {activeTab === 'aiconfig' && (<div className="pb-2 fade-in-up"><AIConfigPanel onParsed={(text) => handleParse(text)} /></div>)}
        {activeTab === 'audit' && (<div className="pb-2 fade-in-up"><AuditPanel issues={auditIssues} auditLog={auditLog} onCorrect={handleCorrectAudit} onIgnore={handleIgnoreAudit} onClearLog={handleClearLog} /></div>)}
        {activeTab === 'config' && (<div className="pb-2 fade-in-up"><ConfigPanel memory={memory} config={config} onCondense={handleCondense} onClearMemory={handleClearMemory} onToggleMode={handleToggleMode} onToggleDiary={handleToggleDiary} onToggleAuditor={handleToggleAuditor} onToggleImgAuditor={handleToggleImgAuditor} /></div>)}
      </div>
      <form onSubmit={handleSubmit} className="px-3 pb-3 pt-2 flex-shrink-0">
        <div className="flex items-center gap-1 rounded px-2 py-1.5" style={{ border: '1px solid #00FFF530', background: '#050505' }}>
          <span className="text-xs neon-cyan flex-shrink-0">▸</span>
          <input type="text" value={inputText} onChange={e => setInputText(e.target.value)} placeholder="Paste AI output to parse..." className="flex-1 bg-transparent text-xs font-mono outline-none text-gray-300 placeholder-gray-700" />
          <button type="submit" className="text-xs px-2 py-0.5 rounded font-mono transition-all flex-shrink-0" style={{ border: '1px solid #00FFF540', color: '#00FFF5', background: '#00FFF510' }}>PARSE</button>
        </div>
        <div className="flex items-center justify-between mt-1 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono" style={{ color: '#ffffff20' }}>T#{turnCount}</span>
            {branchInfo.branchIndex > 0 && (<span className="text-xs font-mono px-1 rounded" style={{ color: '#FFD700', background: '#FFD70010', border: '1px solid #FFD70030', fontSize: '9px' }}>v{branchInfo.branchIndex}</span>)}
            {state.meta?.coerced_fields?.length > 0 && (<span className="text-xs font-mono" style={{ color: '#FF2D7860', fontSize: '9px' }} title={state.meta.coerced_fields.join(', ')}>⚠{state.meta.coerced_fields.length}</span>)}
            {auditIssues.filter(i => i.status === 'pending').length > 0 && (<button onClick={() => setActiveTab('audit')} className="text-xs font-mono px-1 rounded cursor-pointer" style={{ color: '#FFD700', background: '#FFD70010', border: '1px solid #FFD70030', fontSize: '9px' }} title="Open AUDIT tab">🔍{auditIssues.filter(i => i.status === 'pending').length}</button>)}
            <span className="text-xs font-mono" style={{ color: '#ffffff20' }}>• ESS v3.0</span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleNTRToggle} className="text-xs font-mono px-1.5 py-0.5 rounded transition-all" style={{ border: `1px solid ${ntrEnabled ? '#BF5FFF' : '#ffffff15'}`, color: ntrEnabled ? '#BF5FFF' : '#ffffff30', background: ntrEnabled ? '#BF5FFF15' : 'transparent' }} title="Toggle NTR Module">NTR</button>
            <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full" style={{ background: '#39FF14', boxShadow: '0 0 4px #39FF14' }} /><span className="text-xs font-mono" style={{ color: '#ffffff30' }}>LIVE</span></div>
          </div>
        </div>
      </form>
    </div>
  );
}
```

### `src/components/terminal/TerminalHeader.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { getWeatherIcon } from '../../lib/erosParser';

export default function TerminalHeader({ system, location }) {
  const [tick, setTick] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setTick(v => !v), 500);
    return () => clearInterval(t);
  }, []);

  const weatherIcon = getWeatherIcon(system?.weather || '');
  const time = system?.time || '??:??';
  const day = system?.day || '?';
  const weather = system?.weather || 'Unknown';
  const loc = location?.currentRoom || system?.location || 'Unknown';

  return (
    <div className="px-3 py-2 crt-overlay">
      <div className="text-center mb-2">
        <h1 className="text-lg font-bold tracking-widest font-mono glitch">
          <span className="neon-pink">EROS</span>
          <span className="text-white mx-2">STATUS</span>
          <span className="neon-cyan">TERMINAL</span>
        </h1>
        <div className="h-px w-full mt-1" style={{ background: 'linear-gradient(90deg, transparent, #00FFF540, #FF2D7840, transparent)' }} />
      </div>
      <div className="flex items-center justify-center gap-1 text-xs font-mono py-1.5 px-2 rounded"
        style={{ border: '1px solid #00FFF530', background: '#00000060' }}>
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
```

### `src/components/terminal/CharacterPanel.jsx`

```jsx
import React from 'react';
import { getExpressionEmoji } from '../../lib/erosParser';

const MATRIX_CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function MatrixBackground() {
  const chars = Array.from({ length: 60 }, (_, i) =>
    MATRIX_CHARS[Math.floor((i * 7 + 13) % MATRIX_CHARS.length)]
  );
  return (
    <div className="absolute inset-0 overflow-hidden text-xs font-mono opacity-20 leading-4 tracking-widest" style={{ color: '#00FFF5', wordBreak: 'break-all', pointerEvents: 'none' }}>
      {chars.join('')}
    </div>
  );
}

export default function CharacterPanel({ character, body }) {
  const name = character?.name || 'Unknown';
  const role = character?.role || '';
  const expression = body?.expression || character?.expression || 'neutral';
  const mood = character?.mood || 'Neutral';
  const expressionEmoji = getExpressionEmoji(mood, expression);
  const avatarUrl = character?.avatarUrl;

  return (
    <div className="mx-3 mb-2 rounded relative overflow-hidden" style={{ border: '1px solid #00FFF530', background: '#0D0D0D', minHeight: '56px' }}>
      <MatrixBackground />
      <div className="relative z-10 flex items-center gap-3 p-2">
        <div className="w-12 h-12 rounded flex items-center justify-center flex-shrink-0 text-2xl"
          style={{ border: '1px solid #00FFF540', background: '#00000080' }}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover rounded" />
          ) : (
            <span>{expressionEmoji}</span>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm neon-cyan tracking-wide">{name}</span>
            {role && (
              <span className="text-xs px-1.5 py-0.5 rounded font-mono"
                style={{ border: '1px solid #FF2D7840', color: '#FF2D78', background: '#FF2D7810' }}>
                {role}
              </span>
            )}
          </div>
          <div className="text-xs mt-0.5 text-gray-400">
            <span className="neon-cyan opacity-70">MOOD: </span>
            <span className="text-white">{mood}</span>
            <span className="ml-2 text-xs">{expressionEmoji}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### `src/components/terminal/TerminalTabs.jsx`

```jsx
import React from 'react';

const ALL_TABS = [
  { id: 'status',    label: 'STATUS', icon: '📊', color: '#00FFF5' },
  { id: 'inventory', label: 'INV',    icon: '🎒', color: '#00FFF5' },
  { id: 'character', label: 'CHAR',   icon: '🧍', color: '#00FFF5' },
  { id: 'location',  label: 'MAP',    icon: '🗺️', color: '#00FFF5' },
  { id: 'npcs',      label: 'NPCs',   icon: '👥', color: '#00FFF5' },
  { id: 'sex',       label: 'SEX',    icon: '🔥', color: '#FF2D78' },
  { id: 'reaction',  label: 'REACT',  icon: '🧠', color: '#BF5FFF', conditional: 'reaction' },
  { id: 'ntr',       label: 'NTR',    icon: '💔', color: '#BF5FFF' },
  { id: 'img',       label: 'IMG',    icon: '🖼️', color: '#FFD700' },
  { id: 'raw',       label: 'RAW',    icon: '📄', color: '#00FFF5' },
  { id: 'audit',     label: 'AUDIT',  icon: '🔍', color: '#FF2D78' },
  { id: 'config',    label: 'CONFIG', icon: '⚙️', color: '#BF5FFF' },
  { id: 'aiconfig',  label: 'AI',     icon: '🤖', color: '#39FF14' },
];

export default function TerminalTabs({ activeTab, onTabChange, showSex = false, showReaction = false, showNTR = false }) {
  const tabs = ALL_TABS.filter(t => {
    if (t.conditional === 'reaction') return showReaction;
    return true;
  });

  return (
    <div className="flex flex-wrap items-center flex-shrink-0"
      style={{ borderBottom: '1px solid #00FFF520', background: '#0A0A0A' }}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        const color = tab.color || '#00FFF5';
        return (
          <button key={tab.id} onClick={() => onTabChange(tab.id)} title={tab.label}
            className="flex flex-col items-center justify-center px-2 py-1.5 flex-shrink-0 transition-all border-b-2"
            style={{
              borderBottomColor: isActive ? color : 'transparent',
              background: isActive ? `${color}10` : 'transparent',
              color: isActive ? color : '#ffffff30',
              textShadow: isActive ? `0 0 8px ${color}` : 'none',
              minWidth: '36px', gap: '2px',
            }}>
            <span style={{ fontSize: '14px', lineHeight: 1 }}>{tab.icon}</span>
            <span style={{ fontSize: '8px', fontFamily: 'monospace', letterSpacing: '0.05em', lineHeight: 1 }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
```

### `src/components/terminal/ProgressionsPanel.jsx`

```jsx
import React from 'react';
import NeonProgressBar from './NeonProgressBar';
import { resolveRelationshipContext } from '../../lib/relationshipSystem';

const CORE_STATS = [
  { key: 'affection', label: 'Affection', emoji: '💕', color: 'pink' },
  { key: 'obedience', label: 'Obedience', emoji: '🎯', color: 'cyan' },
  { key: 'libido',    label: 'Libido',    emoji: '🔥', color: 'gold' },
  { key: 'arousal',   label: 'Arousal',   emoji: '🍑', color: 'pink' },
];
const PERSISTENT_STATS = [
  { key: 'trust',         label: 'Trust',       emoji: '🌟', color: 'gold' },
  { key: 'corruption',    label: 'Corruption',  emoji: '🖤', color: 'purple' },
  { key: 'happiness',     label: 'Happiness',   emoji: '😊', color: 'green' },
  { key: 'embarrassment', label: 'Embarrass.',  emoji: '😳', color: 'pink' },
  { key: 'fatigue',       label: 'Fatigue',     emoji: '😴', color: 'purple' },
  { key: 'love',          label: 'Love',        emoji: '❤️', color: 'pink' },
  { key: 'jealousy',      label: 'Jealousy',    emoji: '💚', color: 'green' },
];
const DYNAMIC_STATS = [
  { key: 'anxiety',     label: 'Anxiety',     emoji: '😰', color: 'purple' },
  { key: 'fear',        label: 'Fear',        emoji: '😨', color: 'purple' },
  { key: 'anger',       label: 'Anger',       emoji: '😠', color: 'pink' },
  { key: 'nervousness', label: 'Nervousness', emoji: '😬', color: 'gold' },
  { key: 'tension',     label: 'Tension',     emoji: '😤', color: 'gold' },
  { key: 'shame',       label: 'Shame',       emoji: '🙈', color: 'pink' },
  { key: 'desire',      label: 'Desire',      emoji: '💋', color: 'pink' },
  { key: 'awe',         label: 'Awe',         emoji: '🤩', color: 'cyan' },
  { key: 'guilt',       label: 'Guilt',       emoji: '😞', color: 'purple' },
  { key: 'excitement',  label: 'Excitement',  emoji: '⚡', color: 'gold' },
  { key: 'sadness',     label: 'Sadness',     emoji: '😢', color: 'cyan' },
  { key: 'submission',  label: 'Submission',  emoji: '🫡', color: 'purple' },
];

export default function ProgressionsPanel({ progressions, barStyle = 'bar', compact = false, state }) {
  if (!progressions) return null;
  let hiddenStats = new Set();
  if (state) {
    try {
      const ctx = resolveRelationshipContext(state);
      hiddenStats = ctx.hiddenStats;
    } catch (_) { }
  }
  const isVisible = (key) => !hiddenStats.has(key);
  const core = CORE_STATS.filter(s => isVisible(s.key));
  const persistent = PERSISTENT_STATS.filter(s => isVisible(s.key) && (progressions[s.key] ?? 0) > 0);
  const dynamic = DYNAMIC_STATS.filter(s => isVisible(s.key) && (progressions[s.key] ?? 0) > 0);
  const stats = compact ? core : [...core, ...persistent, ...dynamic];
  let contextNote = null;
  if (state && hiddenStats.size > 0) {
    const ctx = resolveRelationshipContext(state);
    if (ctx.familyTier !== 'none') {
      contextNote = `${ctx.familyConfig.icon} ${ctx.familyConfig.label} — some stats gated`;
    }
  }
  return (
    <div className="mx-3 mb-2 p-2 rounded" style={{ border: '1px solid #00FFF530', background: '#0D0D0D' }}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="text-xs font-mono neon-cyan opacity-60 tracking-widest">PROGRESSIONS</div>
        {contextNote && <div className="text-xs font-mono" style={{ color: '#FF2D7870' }}>{contextNote}</div>}
      </div>
      <div className="space-y-0.5">
        {stats.map(({ key, label, emoji, color }) => (
          <NeonProgressBar key={key} label={label} value={progressions[key] ?? 0} color={color} emoji={emoji} style={barStyle} />
        ))}
      </div>
    </div>
  );
}
```

### `src/components/terminal/DetailsPanel.jsx`

```jsx
import React from 'react';

function DetailRow({ label, value, valueColor = '#e2e8f0' }) {
  if (!value) return null;
  return (
    <div className="flex gap-1 text-xs font-mono leading-relaxed">
      <span className="neon-cyan flex-shrink-0 w-20">{label}</span>
      <span style={{ color: valueColor }}>{value}</span>
    </div>
  );
}

export default function DetailsPanel({ body, clothing, location, inventory, goals, npcs }) {
  const thoughts = body?.thoughts;
  const shameful = body?.shamefulThought;
  const posture = body?.posture;
  const clothingDesc = [clothing?.upperBody, clothing?.lowerBody !== clothing?.upperBody ? clothing?.lowerBody : null].filter(Boolean).join(', ');
  const locationStr = location?.currentRoom ? [location.currentRoom, location.building].filter(Boolean).join(' → ') : null;
  const inventoryStr = inventory?.items?.length ? inventory.items.slice(0, 6).join(', ') : null;
  const goalsStr = goals?.length ? goals.slice(0, 3).join(', ') : null;
  const npcsStr = npcs?.length ? npcs.slice(0, 3).map(n => n.name + (n.relation ? ` (${n.relation})` : '')).join(', ') : null;

  return (
    <div className="mx-3 mb-2 p-2 rounded" style={{ border: '1px solid #00FFF530', background: '#0D0D0D' }}>
      <div className="space-y-0.5">
        {thoughts && (<div className="text-xs font-mono leading-relaxed mb-1"><span className="neon-cyan">Thoughts: </span><span className="text-gray-300 italic">'{thoughts}'</span></div>)}
        {shameful && (<div className="text-xs font-mono leading-relaxed mb-1"><span style={{ color: '#FF2D78' }}>Secret: </span><span className="text-gray-400 italic">'{shameful}'</span></div>)}
        <DetailRow label="Clothing:" value={clothingDesc} valueColor="#d1d5db" />
        {clothing?.underwear && clothing.underwear !== 'None' && (<DetailRow label="Underwear:" value={clothing.underwear} valueColor="#d1d5db" />)}
        <DetailRow label="Location:" value={locationStr} valueColor="#00FFF5" />
        {location?.description && (<div className="text-xs font-mono text-gray-500 italic pl-20 leading-relaxed">{location.description}</div>)}
        {posture && <DetailRow label="Posture:" value={posture} valueColor="#d1d5db" />}
        {inventoryStr && (<><div className="h-px my-1" style={{ background: '#00FFF510' }} /><DetailRow label="Inventory:" value={inventoryStr} valueColor="#d1d5db" /></>)}
        {goalsStr && <DetailRow label="Goals:" value={goalsStr} valueColor="#FFD700" />}
        {npcsStr && <DetailRow label="NPCs:" value={npcsStr} valueColor="#BF5FFF" />}
      </div>
    </div>
  );
}
```

### `src/components/terminal/GoalsPanel.jsx`

```jsx
import React from 'react';

export default function GoalsPanel({ goals, aiInstructions }) {
  const allGoals = goals || [];
  const instructions = aiInstructions || [];
  if (allGoals.length === 0 && instructions.length === 0) return null;
  return (
    <div className="mx-3 mb-2 p-2 rounded" style={{ border: '1px solid #00FFF530', background: '#0D0D0D' }}>
      <div className="text-xs font-mono mb-1.5 neon-cyan opacity-60 tracking-widest">GOALS & INTENTIONS</div>
      <div className="space-y-1">
        {allGoals.map((goal, i) => (
          <div key={i} className="flex items-start gap-1.5 text-xs font-mono">
            <span style={{ color: '#FFD700' }}>▸</span>
            <span className="text-gray-300">{goal}</span>
          </div>
        ))}
        {instructions.map((inst, i) => (
          <div key={`inst-${i}`} className="flex items-start gap-1.5 text-xs font-mono">
            <span style={{ color: '#BF5FFF' }}>◈</span>
            <span className="text-gray-400 italic">{typeof inst === 'string' ? inst : inst.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### `src/components/terminal/RawOutputPanel.jsx`

```jsx
import React, { useState } from 'react';

export default function RawOutputPanel({ rawBlock, lastMessage }) {
  const [showFull, setShowFull] = useState(false);
  const content = rawBlock || lastMessage || '';
  const display = showFull ? content : content.slice(0, 600);
  return (
    <div className="mx-3 mb-2 rounded" style={{ border: '1px solid #00FFF530', background: '#0D0D0D' }}>
      <div className="flex items-center justify-between px-2 pt-2 pb-1">
        <div className="text-xs font-mono neon-cyan opacity-60 tracking-widest">RAW TERMINAL OUTPUT</div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#39FF14' }} />
          <span className="text-xs font-mono" style={{ color: '#39FF1480' }}>LIVE</span>
        </div>
      </div>
      <div className="px-2 pb-2 font-mono text-xs overflow-y-auto"
        style={{ maxHeight: showFull ? '300px' : '140px', color: '#00FFF5', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: '1.5', fontSize: '10px' }}>
        {content ? (<>{display}{content.length > 600 && !showFull && <span style={{ color: '#ffffff40' }}>...</span>}</>) : (<span className="text-gray-600 italic">Waiting for AI output...<span className="cursor-blink">█</span></span>)}
      </div>
      {content.length > 600 && (
        <button onClick={() => setShowFull(v => !v)} className="w-full py-1 text-xs font-mono transition-all"
          style={{ color: '#00FFF560', borderTop: '1px solid #00FFF510' }}>
          {showFull ? '▲ COLLAPSE' : '▼ SHOW FULL'}
        </button>
      )}
    </div>
  );
}
```

### `src/components/terminal/NeonProgressBar.jsx`

```jsx
import React from 'react';

const colorMap = {
  cyan: { fill: 'progress-fill-cyan', text: '#00FFF5', track: '#00FFF515' },
  pink: { fill: 'progress-fill-pink', text: '#FF2D78', track: '#FF2D7815' },
  green: { fill: 'progress-fill-green', text: '#39FF14', track: '#39FF1415' },
  gold: { fill: 'progress-fill-gold', text: '#FFD700', track: '#FFD70015' },
  purple: { fill: 'progress-fill-purple', text: '#BF5FFF', track: '#BF5FFF15' },
};

export default function NeonProgressBar({ label, value, max = 100, color = 'cyan', emoji, style = 'bar' }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const colors = colorMap[color] || colorMap.cyan;

  if (style === 'ascii') {
    const totalChars = 20;
    const filled = Math.round((pct / 100) * totalChars);
    const empty = totalChars - filled;
    const bar = '[' + '='.repeat(filled) + '-'.repeat(empty) + ']';
    return (
      <div className="flex items-center gap-2 font-mono text-xs py-0.5">
        {emoji && <span className="text-sm w-5">{emoji}</span>}
        <span className="w-24 text-xs" style={{ color: colors.text }}>{label}</span>
        <span className="w-10 text-right font-bold" style={{ color: colors.text }}>{Math.round(pct)}%</span>
        <span className="text-xs" style={{ color: colors.text, textShadow: `0 0 6px ${colors.text}` }}>{bar}</span>
      </div>
    );
  }

  if (style === 'emoji') {
    const filled = Math.round((pct / 100) * 10);
    return (
      <div className="flex items-center gap-2 font-mono text-xs py-0.5">
        {emoji && <span className="text-sm w-5">{emoji}</span>}
        <span className="w-24 text-xs" style={{ color: colors.text }}>{label}</span>
        <span className="w-10 text-right font-bold" style={{ color: colors.text }}>{Math.round(pct)}%</span>
        <span className="text-xs tracking-widest">{'♥'.repeat(filled)}<span style={{ color: '#333' }}>{'♥'.repeat(10 - filled)}</span></span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 font-mono text-xs py-0.5">
      {emoji && <span className="text-sm w-5 flex-shrink-0">{emoji}</span>}
      <span className="w-24 flex-shrink-0 text-xs" style={{ color: colors.text }}>{label}</span>
      <span className="w-8 text-right font-bold flex-shrink-0 text-xs" style={{ color: colors.text }}>{Math.round(pct)}%</span>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: colors.track }}>
        <div className={`h-full rounded-full transition-all duration-700 ease-out ${colors.fill}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
```

### `src/components/terminal/AvatarPanel.jsx`

```jsx
import React from 'react';
import { getExpressionEmoji } from '../../lib/erosParser';

const EXPRESSIONS = [
  { key: 'neutral', emoji: '😐', label: 'Neutral' },
  { key: 'happy', emoji: '😊', label: 'Happy' },
  { key: 'flustered', emoji: '😳', label: 'Flustered' },
  { key: 'aroused', emoji: '😍', label: 'Aroused' },
  { key: 'sad', emoji: '😢', label: 'Sad' },
  { key: 'angry', emoji: '😠', label: 'Angry' },
  { key: 'shy', emoji: '🥺', label: 'Shy' },
  { key: 'loving', emoji: '🥰', label: 'Loving' },
  { key: 'lustful', emoji: '😏', label: 'Lustful' },
  { key: 'scared', emoji: '😨', label: 'Scared' },
];

export default function AvatarPanel({ character, body, expressionPose }) {
  const currentExpr = body?.expression || character?.expression || 'neutral';
  const mood = character?.mood || 'Neutral';
  const avatarUrl = character?.avatarUrl;
  const poseDesc = expressionPose?.poseDescription || body?.posture || 'standing';
  const aiTags = expressionPose?.tags || [];
  const exprEmoji = getExpressionEmoji(currentExpr, mood);

  return (
    <div className="mx-3 mb-2 p-2 rounded" style={{ border: '1px solid #00FFF530', background: '#0D0D0D' }}>
      <div className="text-xs font-mono mb-1.5 neon-cyan opacity-60 tracking-widest">AVATAR</div>
      <div className="flex gap-2">
        <div className="flex-shrink-0 w-16 h-20 rounded flex items-center justify-center relative overflow-hidden"
          style={{ border: '1px solid #00FFF540', background: '#050505' }}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="character" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center">
              <div className="text-4xl">{exprEmoji}</div>
              <div className="text-xs mt-1 font-mono" style={{ color: '#00FFF580', fontSize: '8px' }}>[expression]</div>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 text-center py-0.5 text-xs font-mono"
            style={{ background: '#00000090', color: '#00FFF5', fontSize: '8px' }}>{mood.toUpperCase()}</div>
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-5 gap-0.5">
            {EXPRESSIONS.map(expr => {
              const isActive = currentExpr?.toLowerCase().includes(expr.key) || mood?.toLowerCase().includes(expr.key);
              return (
                <div key={expr.key} title={expr.label}
                  className="w-6 h-6 flex items-center justify-center rounded text-sm cursor-default transition-all"
                  style={{ border: isActive ? '1px solid #00FFF5' : '1px solid #00FFF515', background: isActive ? '#00FFF520' : 'transparent', boxShadow: isActive ? '0 0 6px #00FFF540' : 'none', fontSize: '14px' }}>
                  {expr.emoji}
                </div>
              );
            })}
          </div>
          <div className="mt-1.5 text-xs font-mono text-gray-500">
            <span className="neon-cyan opacity-70">Pose: </span><span className="text-gray-300">{poseDesc}</span>
          </div>
          {aiTags.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-0.5">
              {aiTags.slice(0, 4).map((tag, i) => (
                <span key={i} className="text-xs px-1 py-0.5 rounded font-mono"
                  style={{ background: '#00FFF510', color: '#00FFF580', border: '1px solid #00FFF520', fontSize: '9px' }}>{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

### `src/components/terminal/MiniMapPanel.jsx`

> Mini-mapa 3×3 dinâmico com registry de salas. ~328 linhas. Código completo preservado no repositório (`src/components/terminal/MiniMapPanel.jsx`). Renderiza: header com building + período do dia, grid 3×3 (current/visited/known/unknown), label de localização atual, objetos na sala (colapsável), legenda com contadores. Usa `ROOM_REGISTRY` (40+ salas mapeadas), `getTimePeriod`, `buildGrid`, `MapCell`.

### `src/components/terminal/NPCPanel.jsx`

> Web of Relations SVG + lista accordion. ~371 linhas. Código completo preservado no repositório (`src/components/terminal/NPCPanel.jsx`). Renderiza: `WebOfRelations` (SVG com nós CHAR/USER/NPCs orbitando, edges coloridos por tipo de relação, legenda), `CharacterCard` (accordion com summary + bonds), tabs Web/List. Inclui {{user}} como nó participante.

---

*Próximo: `docs/05-TERMINAL_PANELS.md` — painéis avançados (Sex, IMG, AIConfig, Audit, etc.).*