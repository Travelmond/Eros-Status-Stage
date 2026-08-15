# 05b — src/components/terminal (Painéis avançados — parte B)

> Parte 5b/10. Código-fonte completo dos painéis avançados restantes.

---

### `src/components/terminal/ConfigPanel.jsx`

```jsx
import React, { useState, useMemo } from 'react';
import { getMemoryStats, buildSystemPromptContext, condenseNow, clearMemory } from '../../lib/memoryService';
import AIProviderSection from './AIProviderSection';

function Toggle({ label, description, value, onChange, color = '#00FFF5' }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex-1 min-w-0 pr-2">
        <div className="text-xs font-mono" style={{ color }}>{label}</div>
        {description && <div className="text-xs font-mono mt-0.5" style={{ color: '#ffffff30', fontSize: '9px' }}>{description}</div>}
      </div>
      <button onClick={() => onChange(!value)} className="flex-shrink-0 w-9 h-5 rounded-full transition-all relative"
        style={{ background: value ? `${color}30` : '#ffffff10', border: `1px solid ${value ? color : '#ffffff20'}` }}>
        <div className="absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all"
          style={{ left: value ? '18px' : '2px', background: value ? color : '#ffffff40', boxShadow: value ? `0 0 6px ${color}` : 'none' }} />
      </button>
    </div>
  );
}

function ModeButton({ mode, currentMode, onClick, label, description }) {
  const active = mode === currentMode;
  const color = active ? '#00FFF5' : '#ffffff30';
  return (
    <button onClick={() => onClick(mode)} className="flex-1 rounded p-2 text-left transition-all"
      style={{ border: `1px solid ${active ? '#00FFF5' : '#ffffff15'}`, background: active ? '#00FFF510' : 'transparent' }}>
      <div className="text-xs font-mono font-bold" style={{ color }}>{label}</div>
      <div className="text-xs font-mono mt-0.5" style={{ color: '#ffffff30', fontSize: '9px' }}>{description}</div>
    </button>
  );
}

export default function ConfigPanel({ memory, config, onCondense, onClearMemory, onToggleMode, onToggleDiary, onToggleAuditor, onToggleImgAuditor }) {
  const [showContext, setShowContext] = useState(false);
  const stats = useMemo(() => getMemoryStats(memory), [memory]);
  const contextPreview = useMemo(() => buildSystemPromptContext(memory), [memory]);

  return (
    <div className="mx-3 mb-2 space-y-2">
      <AIProviderSection />
      <div className="rounded overflow-hidden" style={{ border: '1px solid #00FFF520', background: '#0D0D0D' }}>
        <div className="px-3 py-1.5" style={{ background: '#00FFF508', borderBottom: '1px solid #00FFF520' }}>
          <span className="text-xs font-mono font-bold neon-cyan tracking-widest">🧠 MEMORY MODE</span>
        </div>
        <div className="px-3 py-2">
          <div className="flex gap-1.5 mb-2">
            <ModeButton mode="narrative" currentMode={memory?.mode} onClick={onToggleMode} label="📖 NARRATIVE" description="Diary only — immersive, less precise" />
            <ModeButton mode="entities" currentMode={memory?.mode} onClick={onToggleMode} label="🗄️ ENTITIES" description="Facts only — precise, no vibe" />
            <ModeButton mode="hybrid" currentMode={memory?.mode} onClick={onToggleMode} label="⚡ HYBRID" description="Facts + Diary — recommended" />
          </div>
          <div className="text-xs font-mono" style={{ color: '#ffffff40', fontSize: '9px' }}>
            Short-term window: {stats.shortTermCount}/{stats.shortTermLimit} turns · Long-term: {stats.longTermFacts} facts, {stats.longTermDiary} diary entries
          </div>
        </div>
      </div>
      <div className="rounded overflow-hidden" style={{ border: '1px solid #BF5FFF20', background: '#0D0D0D' }}>
        <div className="px-3 py-1.5" style={{ background: '#BF5FFF08', borderBottom: '1px solid #BF5FFF20' }}>
          <span className="text-xs font-mono font-bold neon-purple tracking-widest">⚙️ MEMORY ACTIONS</span>
        </div>
        <div className="px-3 py-2 space-y-1.5">
          <button onClick={onCondense} className="w-full text-xs font-mono px-2 py-1.5 rounded transition-all"
            style={{ border: '1px solid #BF5FFF40', color: '#BF5FFF', background: '#BF5FFF08' }}>⚡ CONDENSE MEMORY NOW</button>
          <div className="text-xs font-mono" style={{ color: '#ffffff30', fontSize: '9px' }}>Forces all short-term turns into long-term storage. Useful before a context reset.</div>
          <button onClick={onClearMemory} className="w-full text-xs font-mono px-2 py-1.5 rounded transition-all"
            style={{ border: '1px solid #FF2D7830', color: '#FF2D7880', background: 'transparent' }}>✗ CLEAR ALL MEMORY</button>
        </div>
      </div>
      <div className="rounded overflow-hidden" style={{ border: '1px solid #FFD70020', background: '#0D0D0D' }}>
        <div className="px-3 py-1.5" style={{ background: '#FFD70008', borderBottom: '1px solid #FFD70020' }}>
          <span className="text-xs font-mono font-bold neon-gold tracking-widest">🔧 SYSTEM TOGGLES</span>
        </div>
        <div className="px-3 py-1">
          <Toggle label="Register Narrative Diary" description="Store chronological summaries in long-term memory" value={memory?.registerDiary !== false} onChange={onToggleDiary} color="#FFD700" />
          <div style={{ borderTop: '1px solid #ffffff08' }}>
            <Toggle label="Consistency Auditor" description="Passive detection of data inconsistencies" value={config?.auditorEnabled !== false} onChange={onToggleAuditor} color="#FF2D78" />
          </div>
          <div style={{ borderTop: '1px solid #ffffff08' }}>
            <Toggle label="IMG Auditor" description="Check image prompts against current state" value={config?.imgAuditorEnabled !== false} onChange={onToggleImgAuditor} color="#00FFF5" />
          </div>
        </div>
      </div>
      <div className="rounded overflow-hidden" style={{ border: '1px solid #39FF1420', background: '#0D0D0D' }}>
        <div className="px-3 py-1.5 flex items-center justify-between cursor-pointer"
          style={{ background: '#39FF1408', borderBottom: showContext ? '1px solid #39FF1420' : 'none' }} onClick={() => setShowContext(!showContext)}>
          <span className="text-xs font-mono font-bold neon-green tracking-widest">📋 SYSTEM PROMPT CONTEXT</span>
          <span className="text-xs font-mono" style={{ color: '#ffffff40' }}>{showContext ? '▲' : '▼'}</span>
        </div>
        {showContext && (
          <div className="px-3 py-2">
            {contextPreview ? (
              <pre className="text-xs font-mono whitespace-pre-wrap break-words" style={{ color: '#39FF14', fontSize: '9px', lineHeight: '1.5', maxHeight: '200px', overflow: 'auto' }}>{contextPreview}</pre>
            ) : (
              <div className="text-xs font-mono text-center py-3" style={{ color: '#ffffff20' }}>No long-term memory yet. Play a few turns to populate.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
```

### `src/components/terminal/CorrectionAlert.jsx`

```jsx
import React, { useState } from 'react';
import { countPendingIssues } from '../../lib/consistencyAuditor';

function IssueCard({ issue, onCorrect, onIgnore }) {
  const [manualValue, setManualValue] = useState('');
  const [expanded, setExpanded] = useState(false);
  const color = issue.severity === 'critical' ? '#FF2D78' : '#FFD700';
  const typeIcon = { data: '⚠️', narrative: '📖', img: '🖼️' }[issue.type] || '⚠️';
  return (
    <div className="rounded mb-1.5 overflow-hidden" style={{ border: `1px solid ${color}60`, background: '#0D0D0D' }}>
      <div className="px-2 py-1 flex items-center gap-2 cursor-pointer"
        style={{ background: `${color}10`, borderBottom: expanded ? `1px solid ${color}30` : 'none' }} onClick={() => setExpanded(!expanded)}>
        <span className="text-xs">{typeIcon}</span>
        <span className="text-xs font-mono flex-1" style={{ color }}>{issue.description}</span>
        <span className="text-xs font-mono" style={{ color: `${color}80` }}>{expanded ? '▲' : '▼'}</span>
      </div>
      {expanded && (
        <div className="px-2 py-2 space-y-2">
          {issue.originalValue !== undefined && issue.originalValue !== '' && (
            <div className="text-xs font-mono" style={{ color: '#ffffff40' }}>
              <span style={{ color: '#ffffff60' }}>Detected: </span>
              <span className="inconsistency-highlight" style={{ borderBottom: `2px dashed ${color}`, color }}>{String(issue.originalValue).slice(0, 80)}</span>
            </div>
          )}
          {issue.type === 'data' && (
            <div className="space-y-1.5">
              {issue.suggestedValues.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {issue.suggestedValues.map((val, i) => (
                    <button key={i} onClick={() => onCorrect(issue.id, val)} className="text-xs font-mono px-2 py-1 rounded transition-all"
                      style={{ border: `1px solid ${color}40`, color, background: `${color}08` }}>✓ {val}</button>
                  ))}
                </div>
              )}
              <div className="flex gap-1">
                <input type="text" value={manualValue} onChange={e => setManualValue(e.target.value)} placeholder="Manual correction..."
                  className="flex-1 text-xs font-mono px-2 py-1 bg-transparent outline-none" style={{ border: `1px solid ${color}30`, color: '#c0c0c0' }} />
                <button onClick={() => manualValue && onCorrect(issue.id, manualValue)} className="text-xs font-mono px-2 py-1 rounded"
                  style={{ border: `1px solid ${color}`, color, background: `${color}15` }}>APPLY</button>
              </div>
            </div>
          )}
          {issue.type === 'narrative' && (
            <div className="text-xs font-mono" style={{ color: '#ffffff50' }}>Narrative contradictions cannot be auto-corrected. Review the AI's output and decide whether to accept it as a creative choice.</div>
          )}
          {issue.type === 'img' && (
            <div className="flex flex-wrap gap-1">
              {issue.suggestedValues.map((val, i) => (
                <button key={i} onClick={() => onCorrect(issue.id, val)} className="text-xs font-mono px-2 py-1 rounded transition-all"
                  style={{ border: `1px solid ${color}40`, color, background: `${color}08` }}>{val}</button>
              ))}
            </div>
          )}
          <div className="pt-1" style={{ borderTop: `1px solid ${color}15` }}>
            <button onClick={() => onIgnore(issue.id)} className="text-xs font-mono px-2 py-0.5 rounded transition-all"
              style={{ border: '1px solid #ffffff15', color: '#ffffff40', background: 'transparent' }}>✗ Ignore Audit (accept as narrative)</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CorrectionAlert({ issues, onCorrect, onIgnore }) {
  const pending = (issues || []).filter(i => i.status === 'pending');
  if (pending.length === 0) return null;
  const counts = countPendingIssues(issues);
  const hasCritical = pending.some(i => i.severity === 'critical');
  const borderColor = hasCritical ? '#FF2D78' : '#FFD700';
  return (
    <div className="mx-3 mb-2 rounded overflow-hidden fade-in-up" style={{ border: `1px solid ${borderColor}50`, background: '#0A0A0A' }}>
      <div className="px-3 py-1.5 flex items-center justify-between" style={{ background: `${borderColor}10`, borderBottom: `1px solid ${borderColor}30` }}>
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ animation: 'pulse-neon 2s ease-in-out infinite' }}>⚠</span>
          <span className="text-xs font-mono font-bold tracking-widest" style={{ color: borderColor }}>AUDITOR DETECTED {pending.length} ISSUE{pending.length > 1 ? 'S' : ''}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono">
          {counts.data > 0 && <span style={{ color: '#FFD70080' }}>DATA:{counts.data}</span>}
          {counts.narrative > 0 && <span style={{ color: '#BF5FFF80' }}>NARR:{counts.narrative}</span>}
          {counts.img > 0 && <span style={{ color: '#00FFF580' }}>IMG:{counts.img}</span>}
        </div>
      </div>
      <div className="px-2 py-2 max-h-48 overflow-y-auto">
        {pending.map(issue => (<IssueCard key={issue.id} issue={issue} onCorrect={onCorrect} onIgnore={onIgnore} />))}
      </div>
    </div>
  );
}
```

### `src/components/terminal/AuditPanel.jsx`

```jsx
import React, { useState } from 'react';
import { countPendingIssues } from '../../lib/consistencyAuditor';

function LogEntry({ entry }) {
  const [expanded, setExpanded] = useState(false);
  const statusColor = entry.status === 'corrected' ? '#39FF14' : entry.status === 'ignored' ? '#ffffff40' : '#FF2D78';
  const statusIcon = entry.status === 'corrected' ? '✓' : entry.status === 'ignored' ? '○' : '⚠';
  return (
    <div className="rounded mb-1 overflow-hidden" style={{ border: `1px solid ${statusColor}20`, background: '#0D0D0D' }}>
      <div className="px-2 py-1 flex items-center gap-2 cursor-pointer text-xs font-mono" onClick={() => setExpanded(!expanded)}>
        <span style={{ color: statusColor }}>{statusIcon}</span>
        <span className="flex-1 truncate" style={{ color: '#ffffff60' }}>{entry.description}</span>
        <span style={{ color: statusColor, fontSize: '9px' }}>{entry.status.toUpperCase()}</span>
        <span style={{ color: '#ffffff20', fontSize: '9px' }}>{expanded ? '▲' : '▼'}</span>
      </div>
      {expanded && (
        <div className="px-2 py-1.5 text-xs font-mono space-y-1" style={{ borderTop: `1px solid ${statusColor}15` }}>
          {entry.originalValue !== undefined && entry.originalValue !== '' && (<div style={{ color: '#ffffff40' }}>Original: {String(entry.originalValue).slice(0, 100)}</div>)}
          {entry.correctedValue && (<div style={{ color: statusColor }}>Corrected to: {entry.correctedValue}</div>)}
          {entry.ignoredReason && (<div style={{ color: '#ffffff30' }}>Ignored: {entry.ignoredReason}</div>)}
          <div style={{ color: '#ffffff20', fontSize: '9px' }}>Type: {entry.type} | Category: {entry.category} | Field: {entry.field}</div>
        </div>
      )}
    </div>
  );
}

export default function AuditPanel({ issues, auditLog, onCorrect, onIgnore, onClearLog }) {
  const [showLog, setShowLog] = useState(true);
  const pending = (issues || []).filter(i => i.status === 'pending');
  const log = auditLog || [];
  const counts = countPendingIssues(issues);
  const stats = { total: log.length + pending.length, corrected: log.filter(e => e.status === 'corrected').length, ignored: log.filter(e => e.status === 'ignored').length, pending: pending.length };
  return (
    <div className="mx-3 mb-2 space-y-2">
      <div className="rounded overflow-hidden" style={{ border: '1px solid #00FFF520', background: '#0D0D0D' }}>
        <div className="px-3 py-1.5" style={{ background: '#00FFF508', borderBottom: '1px solid #00FFF520' }}>
          <span className="text-xs font-mono font-bold neon-cyan tracking-widest">🔍 AUDIT LOG</span>
        </div>
        <div className="px-3 py-2 grid grid-cols-4 gap-2">
          <div className="text-center"><div className="text-lg font-mono" style={{ color: '#FFD700' }}>{stats.pending}</div><div className="text-xs font-mono" style={{ color: '#ffffff30', fontSize: '8px' }}>PENDING</div></div>
          <div className="text-center"><div className="text-lg font-mono" style={{ color: '#39FF14' }}>{stats.corrected}</div><div className="text-xs font-mono" style={{ color: '#ffffff30', fontSize: '8px' }}>CORRECTED</div></div>
          <div className="text-center"><div className="text-lg font-mono" style={{ color: '#ffffff40' }}>{stats.ignored}</div><div className="text-xs font-mono" style={{ color: '#ffffff30', fontSize: '8px' }}>IGNORED</div></div>
          <div className="text-center"><div className="text-lg font-mono" style={{ color: '#00FFF5' }}>{stats.total}</div><div className="text-xs font-mono" style={{ color: '#ffffff30', fontSize: '8px' }}>TOTAL</div></div>
        </div>
      </div>
      {pending.length > 0 && (
        <div className="rounded overflow-hidden" style={{ border: '1px solid #FFD70030', background: '#0D0D0D' }}>
          <div className="px-3 py-1.5" style={{ background: '#FFD70008', borderBottom: '1px solid #FFD70020' }}>
            <span className="text-xs font-mono font-bold" style={{ color: '#FFD700' }}>⚠ ACTIVE ISSUES ({pending.length})</span>
          </div>
          <div className="px-2 py-2 max-h-64 overflow-y-auto">
            {pending.map(issue => (<PendingIssueInline key={issue.id} issue={issue} onCorrect={onCorrect} onIgnore={onIgnore} />))}
          </div>
        </div>
      )}
      <div className="rounded overflow-hidden" style={{ border: '1px solid #00FFF520', background: '#0D0D0D' }}>
        <div className="px-3 py-1.5 flex items-center justify-between cursor-pointer"
          style={{ background: '#00FFF508', borderBottom: showLog ? '1px solid #00FFF520' : 'none' }} onClick={() => setShowLog(!showLog)}>
          <span className="text-xs font-mono font-bold neon-cyan">📋 HISTORY ({log.length})</span>
          <div className="flex items-center gap-2">
            {log.length > 0 && (<button onClick={(e) => { e.stopPropagation(); onClearLog(); }} className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ border: '1px solid #FF2D7830', color: '#FF2D7880', background: 'transparent' }}>CLEAR</button>)}
            <span className="text-xs font-mono" style={{ color: '#ffffff40' }}>{showLog ? '▲' : '▼'}</span>
          </div>
        </div>
        {showLog && (
          <div className="px-2 py-2 max-h-64 overflow-y-auto">
            {log.length === 0 ? (<div className="text-xs font-mono text-center py-4" style={{ color: '#ffffff20' }}>No audit events recorded yet.</div>)
            : ([...log].reverse().map((entry, i) => (<LogEntry key={i} entry={entry} />)))}
          </div>
        )}
      </div>
    </div>
  );
}

function PendingIssueInline({ issue, onCorrect, onIgnore }) {
  const [manualValue, setManualValue] = useState('');
  const color = issue.severity === 'critical' ? '#FF2D78' : '#FFD700';
  const typeIcon = { data: '⚠️', narrative: '📖', img: '🖼️' }[issue.type] || '⚠️';
  return (
    <div className="rounded mb-1.5 overflow-hidden" style={{ border: `1px solid ${color}40`, background: '#0A0A0A' }}>
      <div className="px-2 py-1" style={{ background: `${color}08` }}>
        <div className="flex items-center gap-2"><span className="text-xs">{typeIcon}</span><span className="text-xs font-mono flex-1" style={{ color }}>{issue.description}</span></div>
      </div>
      <div className="px-2 py-1.5 space-y-1.5">
        {issue.type === 'data' && (
          <>
            {issue.suggestedValues.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {issue.suggestedValues.map((val, i) => (<button key={i} onClick={() => onCorrect(issue.id, val)} className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ border: `1px solid ${color}40`, color, background: `${color}08` }}>✓ {val}</button>))}
              </div>
            )}
            <div className="flex gap-1">
              <input type="text" value={manualValue} onChange={e => setManualValue(e.target.value)} placeholder="Manual..." className="flex-1 text-xs font-mono px-1.5 py-0.5 bg-transparent outline-none" style={{ border: `1px solid ${color}30`, color: '#c0c0c0' }} />
              <button onClick={() => manualValue && onCorrect(issue.id, manualValue)} className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ border: `1px solid ${color}`, color, background: `${color}15` }}>OK</button>
            </div>
          </>
        )}
        {issue.type === 'narrative' && (<div className="text-xs font-mono" style={{ color: '#ffffff40' }}>Review the AI output — narrative contradictions require your judgment.</div>)}
        {issue.type === 'img' && issue.suggestedValues.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {issue.suggestedValues.map((val, i) => (<button key={i} onClick={() => onCorrect(issue.id, val)} className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ border: `1px solid ${color}40`, color, background: `${color}08` }}>{val}</button>))}
          </div>
        )}
        <button onClick={() => onIgnore(issue.id)} className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ border: '1px solid #ffffff15', color: '#ffffff40' }}>✗ Ignore</button>
      </div>
    </div>
  );
}
```

### `src/components/terminal/RelationshipPanel.jsx`

```jsx
import React, { useState } from 'react';
import { resolveRelationshipContext, FAMILY_TIERS, AFFECTION_TIERS } from '../../lib/relationshipSystem';
import { getExpressionEmoji } from '../../lib/erosParser';

function Badge({ label, color, icon }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-mono px-1.5 py-0.5 rounded"
      style={{ color, background: color + '18', border: `1px solid ${color}40` }}>
      {icon && <span style={{ fontSize: '11px' }}>{icon}</span>}{label}
    </span>
  );
}

function RelRow({ icon, label, value, color = '#00FFF5', valueColor }) {
  return (
    <div className="flex items-start gap-2 py-0.5 text-xs font-mono">
      <span className="flex-shrink-0 w-4 text-center" style={{ fontSize: '12px' }}>{icon}</span>
      <span className="w-24 flex-shrink-0" style={{ color: '#ffffff40' }}>{label}:</span>
      <span style={{ color: valueColor || color }}>{value}</span>
    </div>
  );
}

export default function RelationshipPanel({ state }) {
  const [open, setOpen] = useState(true);
  if (!state) return null;
  const ctx = resolveRelationshipContext(state);
  const { character, npcs, userCharacter } = state;
  const charName = character?.name || '{{char}}';
  const userName = userCharacter?.name || '{{user}}';
  const familyCfg = ctx.familyConfig;
  const affTier = ctx.affectionTier;
  const npcList = ctx.npcRelationships || [];
  return (
    <div className="mx-3 mb-2 rounded overflow-hidden" style={{ border: '1px solid #BF5FFF40' }}>
      <div className="px-3 py-1.5 flex items-center justify-between cursor-pointer"
        style={{ background: '#BF5FFF08', borderBottom: open ? '1px solid #BF5FFF20' : 'none' }} onClick={() => setOpen(o => !o)}>
        <span className="text-xs font-mono font-bold tracking-widest" style={{ color: '#BF5FFF' }}>🤝 RELATIONSHIPS</span>
        <span className="text-xs font-mono" style={{ color: '#BF5FFF40' }}>{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div className="px-3 py-2 space-y-3" style={{ background: '#0A0A0A' }}>
          <div>
            <div className="text-xs font-mono mb-1 tracking-widest" style={{ color: '#BF5FFF70' }}>{charName} → {userName}</div>
            {ctx.primaryRole && (<RelRow icon={familyCfg.icon} label="Bond type" value={ctx.primaryRole} color={familyCfg.color} />)}
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {ctx.familyTier !== 'none' && (<Badge label={familyCfg.label} color={familyCfg.color} icon={familyCfg.icon} />)}
              <Badge label={affTier.label} color={affTier.color} icon={affTier.icon} />
              {ctx.forbiddenScenario && ctx.familyTier === 'blood' && (<Badge label="⚠ Taboo escalation" color="#FF2D78" />)}
            </div>
            {ctx.hiddenStats.size > 0 && !ctx.forbiddenScenario && (
              <div className="mt-1.5 text-xs font-mono px-2 py-1 rounded" style={{ background: '#FF2D7808', border: '1px solid #FF2D7820', color: '#FF2D7880' }}>
                🔒 {[...ctx.hiddenStats].join(', ')} hidden — relationship threshold not reached
              </div>
            )}
            <div className="flex gap-2 mt-1.5 flex-wrap">
              <span className="text-xs font-mono" style={{ color: ctx.effectiveAllowsRomance ? '#39FF14' : '#FF2D7860' }}>{ctx.effectiveAllowsRomance ? '✓' : '✗'} Romance</span>
              <span className="text-xs font-mono" style={{ color: ctx.effectiveAllowsErotics ? '#39FF14' : '#FF2D7860' }}>{ctx.effectiveAllowsErotics ? '✓' : '✗'} Erotics</span>
            </div>
          </div>
          {npcList.length > 0 && (
            <div>
              <div className="text-xs font-mono mb-1 tracking-widest" style={{ color: '#BF5FFF70' }}>NPCs → {charName}</div>
              <div className="space-y-1">
                {npcList.map((npc, i) => {
                  const npcFamilyCfg = FAMILY_TIERS[npc.familyTier];
                  return (
                    <div key={i} className="flex items-center gap-2 text-xs font-mono">
                      <span>{getExpressionEmoji(npc.mood, npc.mood)}</span>
                      <span className="font-bold text-white">{npc.name}</span>
                      {npc.relation && (<Badge label={npc.relation} color={npcFamilyCfg?.color || '#00FFF5'} icon={npcFamilyCfg?.icon} />)}
                      {npc.mood && npc.mood !== 'neutral' && (<span className="text-xs" style={{ color: '#BF5FFF80' }}>{npc.mood}</span>)}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {ctx.extraRels.length > 0 && (
            <div>
              <div className="text-xs font-mono mb-1 tracking-widest" style={{ color: '#BF5FFF70' }}>Other bonds</div>
              {ctx.extraRels.map((rel, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-mono">
                  <span>💫</span><span className="text-white">{rel.name}</span>
                  {rel.type && <Badge label={rel.type} color={FAMILY_TIERS[rel.familyTier]?.color || '#00FFF5'} />}
                  {rel.affection !== undefined && <span className="neon-pink">{rel.affection}%</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

### `src/components/terminal/NotificationToast.jsx`

```jsx
import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext(null);

export function useToast() { return useContext(ToastContext); }

let toastIdCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback(({ level = 'info', message, duration = 3500 }) => {
    const id = ++toastIdCounter;
    setToasts(prev => { const next = [...prev, { id, level, message, duration }]; return next.length > 3 ? next.slice(-3) : next; });
    return id;
  }, []);
  const removeToast = useCallback((id) => { setToasts(prev => prev.filter(t => t.id !== id)); }, []);
  const clearToasts = useCallback(() => { setToasts([]); }, []);
  return (
    <ToastContext.Provider value={{ addToast, removeToast, clearToasts }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

const LEVEL_STYLES = {
  info:     { bg: '#0A0A0A', border: '#00FFF540', text: '#00FFF5', icon: 'ℹ️', glow: '#00FFF5' },
  warning:  { bg: '#0A0A0A', border: '#FFD70040', text: '#FFD700', icon: '⚠️', glow: '#FFD700' },
  critical: { bg: '#0A0A0A', border: '#FF2D7840', text: '#FF2D78', icon: '💔', glow: '#FF2D78' },
};

function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-16 left-0 right-0 z-50 flex flex-col items-center gap-1.5 pointer-events-none px-4" style={{ maxWidth: '320px', margin: '0 auto' }}>
      <AnimatePresence>
        {toasts.map(toast => (<ToastItem key={toast.id} toast={toast} onRemove={onRemove} />))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onRemove }) {
  const style = LEVEL_STYLES[toast.level] || LEVEL_STYLES.info;
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), toast.duration);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);
  return (
    <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="pointer-events-auto w-full rounded px-3 py-2 text-xs font-mono flex items-start gap-2 cursor-pointer"
      style={{ background: style.bg, border: `1px solid ${style.border}`, color: style.text, boxShadow: `0 0 8px ${style.glow}20` }}
      onClick={() => onRemove(toast.id)}>
      <span className="flex-shrink-0 text-sm">{style.icon}</span>
      <span className="leading-relaxed">{toast.message}</span>
    </motion.div>
  );
}

export function useStandaloneToast() {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback(({ level = 'info', message, duration = 3500 }) => {
    const id = Date.now() + Math.random();
    setToasts(prev => { const next = [...prev, { id, level, message, duration }]; return next.length > 3 ? next.slice(-3) : next; });
    setTimeout(() => { setToasts(prev => prev.filter(t => t.id !== id)); }, duration);
    return id;
  }, []);
  const removeToast = useCallback((id) => { setToasts(prev => prev.filter(t => t.id !== id)); }, []);
  return { toasts, addToast, removeToast };
}

export default function NotificationToast({ toasts, onRemove }) {
  if (!toasts?.length) return null;
  return <ToastContainer toasts={toasts} onRemove={onRemove} />;
}
```

### `src/components/terminal/NTRModal.jsx`

```jsx
import React, { useState } from 'react';

const PROS = [
  'Adds dramatic tension and complex emotions to the story',
  'Characters develop through jealousy, betrayal, and recovery arcs',
  'Unlocks unique NTR-specific status panels and mechanics',
  'Enables rival NPC jealousy tracking and relationship triangles',
];
const CONS = [
  'Content may be emotionally intense or disturbing',
  'Relationship statuses will reflect NTR events permanently',
  'Some users find this content uncomfortable or distressing',
  'Cannot be undone mid-session without resetting module state',
];

export default function NTRModal({ onConfirm, onCancel }) {
  const [step, setStep] = useState(1);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: '#000000CC' }}>
      <div className="rounded overflow-hidden font-mono text-xs" style={{ width: '320px', border: '1px solid #FF2D7860', background: '#0D0D0D', boxShadow: '0 0 30px #FF2D7820' }}>
        <div className="px-4 py-2.5" style={{ background: '#FF2D7815', borderBottom: '1px solid #FF2D7840' }}>
          <div className="text-sm font-bold neon-pink tracking-widest">⚠ NTR MODULE</div>
          <div className="text-gray-500 mt-0.5">Netorare / Cuckold System v1.0</div>
        </div>
        {step === 1 && (
          <div className="p-4">
            <p className="text-gray-400 leading-relaxed mb-3">The NTR Module enables <span style={{ color: '#FF2D78' }}>infidelity, jealousy, and betrayal mechanics</span> in your roleplay. This adds complex emotional dynamics and rival tracking.</p>
            <div className="mb-3">
              <div className="text-xs mb-1.5" style={{ color: '#39FF14' }}>✓ PROS</div>
              {PROS.map((p, i) => (<div key={i} className="flex gap-2 py-0.5 text-gray-500"><span style={{ color: '#39FF1480' }}>›</span><span>{p}</span></div>))}
            </div>
            <div className="mb-4">
              <div className="text-xs mb-1.5" style={{ color: '#FF2D78' }}>✗ CONS</div>
              {CONS.map((c, i) => (<div key={i} className="flex gap-2 py-0.5 text-gray-500"><span style={{ color: '#FF2D7880' }}>›</span><span>{c}</span></div>))}
            </div>
            <div className="text-gray-600 text-xs mb-4 p-2 rounded" style={{ background: '#FF2D7808', border: '1px solid #FF2D7820' }}>This module is <strong style={{ color: '#FF2D78' }}>irreversible</strong> once activated for this session. Proceed with caution.</div>
            <div className="flex gap-2">
              <button onClick={onCancel} className="flex-1 py-1.5 rounded text-xs font-mono transition-all" style={{ border: '1px solid #00FFF540', color: '#00FFF5', background: '#00FFF508' }}>CANCEL</button>
              <button onClick={() => setStep(2)} className="flex-1 py-1.5 rounded text-xs font-mono transition-all" style={{ border: '1px solid #FF2D7860', color: '#FF2D78', background: '#FF2D7815' }}>PROCEED →</button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="p-4">
            <div className="text-center mb-4">
              <div className="text-2xl mb-2">🔞</div>
              <div className="text-sm font-bold" style={{ color: '#FF2D78' }}>ARE YOU SURE?</div>
              <div className="text-gray-500 mt-1 leading-relaxed">Activating the NTR Module will enable betrayal mechanics, rival tracking, and jealousy events in all future interactions.</div>
            </div>
            <div className="flex gap-2">
              <button onClick={onCancel} className="flex-1 py-1.5 rounded text-xs font-mono transition-all" style={{ border: '1px solid #00FFF540', color: '#00FFF5', background: '#00FFF508' }}>← GO BACK</button>
              <button onClick={onConfirm} className="flex-1 py-1.5 rounded text-xs font-mono font-bold transition-all" style={{ border: '1px solid #FF2D78', color: '#fff', background: '#FF2D78' }}>ACTIVATE NTR</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

### `src/components/terminal/ASCIIPositionViewer.jsx`

```jsx
import React from 'react';
import { findPosition } from '../../lib/sexPositionsLibrary';
import { getSexPhaseColor } from '../../lib/erosParser';

export default function ASCIIPositionViewer({ positionName, phase }) {
  const data = findPosition(positionName);
  const phaseColor = getSexPhaseColor(phase || 'sex');
  if (!positionName) return null;
  return (
    <div className="mx-0 mb-0 rounded overflow-hidden" style={{ border: `1px solid ${phaseColor}30`, background: '#060606' }}>
      <div className="px-3 py-1.5 flex items-center justify-between" style={{ background: `${phaseColor}10`, borderBottom: `1px solid ${phaseColor}20` }}>
        <div className="flex items-center gap-2">
          <span className="text-base">{data?.emoji || '🔥'}</span>
          <span className="text-xs font-mono font-bold tracking-widest" style={{ color: phaseColor }}>{data?.label || positionName.toUpperCase()}</span>
          {data?.category && (<span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ color: `${phaseColor}90`, background: `${phaseColor}10`, border: `1px solid ${phaseColor}20`, fontSize: '9px' }}>{data.category}</span>)}
        </div>
      </div>
      <div className="flex items-center gap-3 px-3 py-2">
        <div className="flex-shrink-0 rounded px-2 py-1.5 overflow-hidden" style={{ background: '#0A0A0A', border: `1px solid ${phaseColor}20`, minWidth: '72px', maxWidth: '90px' }}>
          {data ? (
            <pre className="font-mono text-center leading-snug select-none" style={{ color: phaseColor, fontSize: '10px', whiteSpace: 'pre', overflow: 'hidden', textShadow: `0 0 6px ${phaseColor}60`, letterSpacing: '0px' }}>{data.ascii.join('\n')}</pre>
          ) : (
            <pre className="font-mono text-center" style={{ color: `${phaseColor}40`, fontSize: '10px' }}>{`  /\\ \n (  )\n  \\/ `}</pre>
          )}
        </div>
        <div className="flex-1 min-w-0">
          {data?.description ? (<p className="text-xs font-mono leading-relaxed" style={{ color: '#ffffff50' }}>{data.description}</p>)
          : (<p className="text-xs font-mono" style={{ color: '#ffffff30' }}>Position not in library — rendering name only.</p>)}
        </div>
      </div>
    </div>
  );
}
```

### `src/components/terminal/BodyDescCharPanel.jsx`

```jsx
import React, { useState } from 'react';

const BODY_SECTIONS = [
  { key: 'face_section', label: 'Face', emoji: '😊', fields: [{ key: 'eyes', label: 'Eyes', emoji: '👁️' }, { key: 'mouth', label: 'Mouth', emoji: '💋' }, { key: 'face', label: 'Face', emoji: '😊' }, { key: 'hair', label: 'Hair', emoji: '💇' }] },
  { key: 'shoulders_arms', label: 'Shoulders & Arms', emoji: '💪', fields: [{ key: 'shoulders', label: 'Shoulders', emoji: '🤲' }, { key: 'arms', label: 'Arms', emoji: '💪' }, { key: 'hands', label: 'Hands', emoji: '🤚' }, { key: 'neck', label: 'Neck', emoji: '🫀' }] },
  { key: 'chest_section', label: 'Chest', emoji: '👙', fields: [{ key: 'chest', label: 'Chest/Bust', emoji: '👙' }, { key: 'bust', label: 'Bust Size', emoji: '📐' }] },
  { key: 'abdomen_section', label: 'Abdomen', emoji: '🫁', fields: [{ key: 'waist', label: 'Waist/Abs', emoji: '📏' }, { key: 'belly', label: 'Belly', emoji: '🫁' }] },
  { key: 'hips_section', label: 'Hips', emoji: '🍑', fields: [{ key: 'hips', label: 'Hips', emoji: '🍑' }, { key: 'buttocks', label: 'Buttocks', emoji: '🫶' }] },
  { key: 'intimate_section', label: 'Intimate', emoji: '🔒', sensitive: true, fields: [{ key: 'intimate', label: 'Intimate', emoji: '🔒' }, { key: 'pubic', label: 'Pubic Area', emoji: '🌿' }] },
  { key: 'legs_feet', label: 'Legs & Feet', emoji: '🦵', fields: [{ key: 'legs', label: 'Legs', emoji: '🦵' }, { key: 'thighs', label: 'Thighs', emoji: '🦿' }, { key: 'feet', label: 'Feet', emoji: '🦶' }] },
  { key: 'special_section', label: 'Special Traits', emoji: '✨', fields: [{ key: 'tail', label: 'Tail', emoji: '🐄' }, { key: 'horns', label: 'Horns', emoji: '🐮' }, { key: 'special', label: 'Special', emoji: '✨' }] },
];

function DescField({ emoji, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 py-0.5 text-xs font-mono border-b" style={{ borderColor: '#FFD70008' }}>
      <span className="flex-shrink-0 text-sm w-5 text-center">{emoji}</span>
      <span className="w-20 flex-shrink-0" style={{ color: '#FFD70070' }}>{label}:</span>
      <span className="text-gray-300 leading-relaxed">{value}</span>
    </div>
  );
}

export default function BodyDescCharPanel({ body, character }) {
  const [openSections, setOpenSections] = useState({ face_section: true });
  const desc = body?.description || {};
  const allDesc = { ...desc };
  const toggleSection = (key) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  const visibleSections = BODY_SECTIONS.filter(section => section.fields.some(f => allDesc[f.key]));
  if (visibleSections.length === 0) return (
    <div className="mx-3 mb-2 rounded p-3 text-center" style={{ border: '1px solid #FFD70020', background: '#0A0A0A' }}>
      <div className="text-xs font-mono text-gray-700"><div className="text-lg mb-1">🧬</div>No physical description data detected.<br /><span className="text-gray-800">AI must include body description fields.</span></div>
    </div>
  );
  return (
    <div className="mx-3 mb-2 rounded overflow-hidden" style={{ border: '1px solid #FFD70030' }}>
      <div className="px-3 py-1.5" style={{ background: '#FFD70008', borderBottom: '1px solid #FFD70020' }}>
        <span className="text-xs font-mono font-bold neon-gold tracking-widest">🧬 PHYSICAL DESCRIPTION</span>
        {character?.name && (<span className="text-xs text-gray-600 ml-2 font-mono">— {character.name}</span>)}
      </div>
      <div style={{ background: '#0A0A0A' }}>
        {visibleSections.map(section => {
          const isOpen = openSections[section.key];
          const hasFields = section.fields.some(f => allDesc[f.key]);
          if (!hasFields) return null;
          return (
            <div key={section.key} style={{ borderBottom: '1px solid #FFD70010' }}>
              <div className="flex items-center justify-between px-3 py-1.5 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => toggleSection(section.key)} style={{ background: isOpen ? '#FFD70008' : 'transparent' }}>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{section.emoji}</span>
                  <span className="text-xs font-mono font-bold" style={{ color: '#FFD700AA' }}>{section.label}{section.sensitive && <span className="ml-1 text-xs" style={{ color: '#FF2D7880' }}>⚠</span>}</span>
                </div>
                <span className="text-xs font-mono" style={{ color: '#FFD70040' }}>{isOpen ? '▲' : '▼'}</span>
              </div>
              {isOpen && (<div className="px-3 pb-1">{section.fields.map(({ key, label, emoji }) => (<DescField key={key} emoji={emoji} label={label} value={allDesc[key]} />))}</div>)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

### `src/components/terminal/BodyDescPanel.jsx`

```jsx
import React, { useState } from 'react';

const BODY_PARTS = [
  { key: 'hair', label: 'Hair', emoji: '💇' }, { key: 'eyes', label: 'Eyes', emoji: '👁️' }, { key: 'face', label: 'Face', emoji: '😊' },
  { key: 'neck', label: 'Neck', emoji: '🫀' }, { key: 'chest', label: 'Chest', emoji: '🫁' }, { key: 'bust', label: 'Bust', emoji: '👙' },
  { key: 'waist', label: 'Waist', emoji: '📏' }, { key: 'hips', label: 'Hips', emoji: '🍑' }, { key: 'legs', label: 'Legs', emoji: '🦵' },
  { key: 'feet', label: 'Feet', emoji: '🦶' }, { key: 'tail', label: 'Tail', emoji: '🐄' }, { key: 'horns', label: 'Horns', emoji: '🐮' }, { key: 'special', label: 'Special', emoji: '✨' },
];

export default function BodyDescPanel({ body, character }) {
  const [expanded, setExpanded] = useState(false);
  const desc = body?.description || {};
  const parts = BODY_PARTS.filter(p => desc[p.key]);
  if (parts.length === 0) return null;
  return (
    <div className="mx-3 mb-2 rounded overflow-hidden" style={{ border: '1px solid #FFD70030' }}>
      <div className="px-3 py-1.5 flex items-center justify-between cursor-pointer"
        style={{ background: '#FFD70008', borderBottom: expanded ? '1px solid #FFD70020' : 'none' }} onClick={() => setExpanded(e => !e)}>
        <span className="text-xs font-mono font-bold neon-gold tracking-widest">🧬 BODY DESCRIPTION</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">{character?.name || ''}</span>
          <span className="text-xs font-mono" style={{ color: '#FFD70060' }}>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>
      {expanded && (
        <div className="px-3 py-1.5" style={{ background: '#0A0A0A' }}>
          {parts.map(({ key, label, emoji }) => (
            <div key={key} className="flex items-start gap-2 py-0.5 text-xs font-mono border-b" style={{ borderColor: '#FFD70008' }}>
              <span className="flex-shrink-0 text-sm w-5 text-center">{emoji}</span>
              <span className="w-16 flex-shrink-0" style={{ color: '#FFD70070' }}>{label}:</span>
              <span className="text-gray-300 leading-relaxed">{desc[key]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### `src/components/terminal/InventoryPanel.jsx`

```jsx
import React from 'react';
import { getClothingEmoji } from '../../lib/erosParser';

const SLOTS = [
  { key: 'head', label: 'Head' }, { key: 'upper', label: 'Upper' }, { key: 'lower', label: 'Lower' },
  { key: 'underwear', label: 'Underwear' }, { key: 'footwear', label: 'Footwear' }, { key: 'accessories', label: 'Extras' },
];

export default function InventoryPanel({ clothingSlots, inventory, character }) {
  const name = character?.name || '?';
  return (
    <div className="mx-3 mb-2 rounded overflow-hidden" style={{ border: '1px solid #00FFF530' }}>
      <div className="px-3 py-1.5" style={{ background: '#00FFF510', borderBottom: '1px solid #00FFF520' }}>
        <div className="flex items-center gap-2">
          <span className="text-xs">🎒</span>
          <span className="text-xs font-mono font-bold neon-cyan tracking-widest">INVENTORY</span>
          <span className="text-xs font-mono text-gray-600">—</span>
          <span className="text-xs font-mono" style={{ color: '#00FFF5AA' }}>{name}</span>
        </div>
      </div>
      <div className="px-3 py-1.5" style={{ background: '#0A0A0A' }}>
        {SLOTS.map(({ key, label }) => {
          const value = clothingSlots?.[key] || 'None';
          const emoji = getClothingEmoji(key, value);
          const isEmpty = !value || value.toLowerCase() === 'none';
          return (
            <div key={key} className="flex items-start gap-2 py-0.5 text-xs font-mono border-b" style={{ borderColor: '#00FFF508' }}>
              <span className="flex-shrink-0 text-sm w-5 text-center">{emoji}</span>
              <span className="w-20 flex-shrink-0" style={{ color: '#00FFF570' }}>{label}:</span>
              <span style={{ color: isEmpty ? '#ffffff20' : '#e2e8f0' }}>{value}</span>
            </div>
          );
        })}
        {inventory?.items && inventory.items.length > 0 && (
          <div className="flex items-start gap-2 py-0.5 text-xs font-mono mt-0.5">
            <span className="flex-shrink-0 text-sm w-5 text-center">🎒</span>
            <span className="w-20 flex-shrink-0" style={{ color: '#00FFF570' }}>Items:</span>
            <span className="text-gray-300">{inventory.items.join(', ')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
```

### `src/components/terminal/ReactionPanel.jsx`

```jsx
import React from 'react';

export default function ReactionPanel({ reactionModule }) {
  if (!reactionModule?.active || !reactionModule.reactions?.length) return null;
  return (
    <div className="mx-3 mb-2 rounded overflow-hidden" style={{ border: '1px solid #BF5FFF40' }}>
      <div className="px-3 py-1.5" style={{ background: '#BF5FFF10', borderBottom: '1px solid #BF5FFF25' }}>
        <span className="text-xs font-mono font-bold neon-purple tracking-widest">🧠 REACTION MODULE</span>
      </div>
      {(reactionModule.character || reactionModule.stimulus) && (
        <div className="px-3 py-1.5 text-xs font-mono" style={{ borderBottom: '1px solid #BF5FFF15', background: '#0D0D0D' }}>
          {reactionModule.character && (<div className="flex gap-2"><span style={{ color: '#BF5FFF80' }}>Character:</span><span className="text-gray-300">{reactionModule.character}</span></div>)}
          {reactionModule.stimulus && (<div className="flex gap-2 mt-0.5"><span style={{ color: '#BF5FFF80' }}>Stimulus:</span><span className="text-gray-400 leading-relaxed">{reactionModule.stimulus}</span></div>)}
        </div>
      )}
      <div className="px-3 py-1.5" style={{ background: '#0A0A0A' }}>
        {reactionModule.reactions.map((r, i) => (
          <div key={i} className="flex items-start gap-2 py-0.5 text-xs font-mono border-b" style={{ borderColor: '#BF5FFF08' }}>
            <span className="flex-shrink-0 text-sm w-5">{r.emoji}</span>
            <span className="w-16 flex-shrink-0 font-bold" style={{ color: '#BF5FFF' }}>{r.label}:</span>
            <span className="text-gray-300 leading-relaxed italic">"{r.text}"</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

*Próximo: `docs/06-LIB_PARSERS.md` — `erosParser.js` + `stateMiddleware.js`.*