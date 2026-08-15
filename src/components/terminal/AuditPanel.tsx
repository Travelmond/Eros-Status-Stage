import { useState } from 'react';
import { Input } from '@/components/ui/input';
import type { AuditIssue } from '@/types/eros-status';


interface AuditPanelProps {
  issues?: AuditIssue[];
  auditLog?: AuditIssue[];
  onCorrect?: (issueId: string, newValue: unknown) => void;
  onIgnore?: (issueId: string) => void;
  onClearLog?: () => void;
}

function LogEntry({ entry }: { entry: AuditIssue }) {
  const [expanded, setExpanded] = useState(false);
  const statusColor = entry.corrected ? 'var(--neon-green)' : entry.ignored ? '#ffffff40' : 'var(--neon-pink)';
  const statusIcon = entry.corrected ? '✓' : entry.ignored ? '○' : '⚠';
  const statusLabel = entry.corrected ? 'CORRECTED' : entry.ignored ? 'IGNORED' : 'PENDING';

  return (
    <div
      className="rounded mb-1 overflow-hidden"
      style={{ border: `1px solid ${statusColor}20`, background: 'var(--terminal-card)' }}
    >
      <div
        className="px-2 py-1 flex items-center gap-2 cursor-pointer text-xs font-mono"
        onClick={() => setExpanded((v) => !v)}
      >
        <span style={{ color: statusColor }}>{statusIcon}</span>
        <span className="flex-1 truncate" style={{ color: '#ffffff60' }}>{entry.message}</span>
        <span style={{ color: statusColor, fontSize: '9px' }}>{statusLabel}</span>
        <span style={{ color: '#ffffff20', fontSize: '9px' }}>{expanded ? '▲' : '▼'}</span>
      </div>
      {expanded && (
        <div className="px-2 py-1.5 text-xs font-mono space-y-1" style={{ borderTop: `1px solid ${statusColor}15` }}>
          {entry.suggestedValue !== undefined && (
            <div style={{ color: '#ffffff40' }}>Suggested: {String(entry.suggestedValue).slice(0, 100)}</div>
          )}
          <div style={{ color: '#ffffff20', fontSize: '9px' }}>Type: {entry.category} | Severity: {entry.severity}</div>
        </div>
      )}
    </div>
  );
}

function PendingIssueInline({
  issue,
  onCorrect,
  onIgnore,
}: {
  issue: AuditIssue;
  onCorrect?: (issueId: string, newValue: unknown) => void;
  onIgnore?: (issueId: string) => void;
}) {
  const [manualValue, setManualValue] = useState('');
  const color = issue.severity === 'error' ? 'var(--neon-pink)' : 'var(--neon-gold)';

  return (
    <div
      className="rounded mb-1.5 overflow-hidden"
      style={{ border: `1px solid ${color}40`, background: '#0A0A0A' }}
    >
      <div className="px-2 py-1" style={{ background: `${color}08` }}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono flex-1" style={{ color }}>{issue.message}</span>
        </div>
      </div>
      <div className="px-2 py-1.5 space-y-1.5">
        {issue.category !== 'narrative' && (
          <div className="flex gap-1">
            <Input
              value={manualValue}
              onChange={(e) => setManualValue(e.target.value)}
              placeholder="Manual..."
              className="flex-1 text-xs font-mono h-7 bg-black/30 border-[var(--terminal-border)]"
            />
            <button
              onClick={() => manualValue && onCorrect?.(issue.id, manualValue)}
              className="text-xs font-mono px-1.5 py-0.5 rounded"
              style={{ border: `1px solid ${color}`, color, background: `${color}15` }}
            >
              OK
            </button>
          </div>
        )}
        {issue.category === 'narrative' && (
          <div className="text-xs font-mono" style={{ color: '#ffffff40' }}>
            Review the AI output — narrative contradictions require your judgment.
          </div>
        )}
        <button
          onClick={() => onIgnore?.(issue.id)}
          className="text-xs font-mono px-1.5 py-0.5 rounded"
          style={{ border: '1px solid #ffffff15', color: '#ffffff40' }}
        >
          ✗ Ignore
        </button>
      </div>
    </div>
  );
}

export function AuditPanel({ issues = [], auditLog = [], onCorrect, onIgnore, onClearLog }: AuditPanelProps) {
  const [showLog, setShowLog] = useState(true);
  const pending = issues.filter((i) => !i.corrected && !i.ignored);
  const stats = {
    total: auditLog.length + pending.length,
    corrected: auditLog.filter((e) => e.corrected).length,
    ignored: auditLog.filter((e) => e.ignored).length,
    pending: pending.length,
  };

  return (
    <div className="mx-3 mb-2 space-y-2 pb-2 animate-fade-in-up">
      <div
        className="rounded overflow-hidden"
        style={{ border: '1px solid var(--terminal-border)', background: 'var(--terminal-card)' }}
      >
        <div className="px-3 py-1.5" style={{ background: 'var(--neon-cyan)08', borderBottom: '1px solid var(--terminal-border)' }}>
          <span className="text-xs font-mono font-bold neon-cyan tracking-widest">🔍 AUDIT LOG</span>
        </div>
        <div className="px-3 py-2 grid grid-cols-4 gap-2">
          <StatBox value={stats.pending} label="PENDING" color="var(--neon-gold)" />
          <StatBox value={stats.corrected} label="CORRECTED" color="var(--neon-green)" />
          <StatBox value={stats.ignored} label="IGNORED" color="#ffffff40" />
          <StatBox value={stats.total} label="TOTAL" color="var(--neon-cyan)" />
        </div>
      </div>

      {pending.length > 0 && (
        <div
          className="rounded overflow-hidden"
          style={{ border: '1px solid var(--neon-gold)30', background: 'var(--terminal-card)' }}
        >
          <div className="px-3 py-1.5" style={{ background: 'var(--neon-gold)08', borderBottom: '1px solid var(--neon-gold)20' }}>
            <span className="text-xs font-mono font-bold" style={{ color: 'var(--neon-gold)' }}>
              ⚠ ACTIVE ISSUES ({pending.length})
            </span>
          </div>
          <div className="px-2 py-2 max-h-64 overflow-y-auto">
            {pending.map((issue) => (
              <PendingIssueInline key={issue.id} issue={issue} onCorrect={onCorrect} onIgnore={onIgnore} />
            ))}
          </div>
        </div>
      )}

      <div
        className="rounded overflow-hidden"
        style={{ border: '1px solid var(--terminal-border)', background: 'var(--terminal-card)' }}
      >
        <div
          className="px-3 py-1.5 flex items-center justify-between cursor-pointer"
          style={{ background: 'var(--neon-cyan)08', borderBottom: showLog ? '1px solid var(--terminal-border)' : 'none' }}
          onClick={() => setShowLog((v) => !v)}
        >
          <span className="text-xs font-mono font-bold neon-cyan">📋 HISTORY ({auditLog.length})</span>
          <div className="flex items-center gap-2">
            {auditLog.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClearLog?.();
                }}
                className="text-xs font-mono px-1.5 py-0.5 rounded"
                style={{ border: '1px solid var(--neon-pink)30', color: 'var(--neon-pink)80', background: 'transparent' }}
              >
                CLEAR
              </button>
            )}
            <span className="text-xs font-mono" style={{ color: '#ffffff40' }}>{showLog ? '▲' : '▼'}</span>
          </div>
        </div>
        {showLog && (
          <div className="px-2 py-2 max-h-64 overflow-y-auto">
            {auditLog.length === 0 ? (
              <div className="text-xs font-mono text-center py-4" style={{ color: '#ffffff20' }}>
                No audit events recorded yet.
              </div>
            ) : (
              [...auditLog].reverse().map((entry, i) => <LogEntry key={i} entry={entry} />)
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="text-center">
      <div className="text-lg font-mono" style={{ color }}>{value}</div>
      <div className="text-xs font-mono" style={{ color: '#ffffff30', fontSize: '8px' }}>{label}</div>
    </div>
  );
}
