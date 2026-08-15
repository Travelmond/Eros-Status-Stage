import { useState } from 'react';
import { Input } from '@/components/ui/input';
import type { AuditIssue } from '@/types/eros-status';
import { countPendingIssues } from '@/lib/consistencyAuditor';

interface CorrectionAlertProps {
  issues?: AuditIssue[];
  onCorrect?: (issueId: string, newValue: unknown) => void;
  onIgnore?: (issueId: string) => void;
}

function IssueCard({
  issue,
  onCorrect,
  onIgnore,
}: {
  issue: AuditIssue;
  onCorrect?: (issueId: string, newValue: unknown) => void;
  onIgnore?: (issueId: string) => void;
}) {
  const [manualValue, setManualValue] = useState('');
  const [expanded, setExpanded] = useState(false);
  const color = issue.severity === 'error' ? 'var(--neon-pink)' : 'var(--neon-gold)';
  const typeIcon = { schema: '⚠️', narrative: '📖', img: '🖼️', relationship: '💕', location: '📍', inventory: '🎒', clothing: '👕' }[issue.category] || '⚠️';

  return (
    <div
      className="rounded mb-1.5 overflow-hidden"
      style={{ border: `1px solid ${color}60`, background: 'var(--terminal-card)' }}
    >
      <div
        className="px-2 py-1 flex items-center gap-2 cursor-pointer"
        style={{ background: `${color}10`, borderBottom: expanded ? `1px solid ${color}30` : 'none' }}
        onClick={() => setExpanded((v) => !v)}
      >
        <span className="text-xs">{typeIcon}</span>
        <span className="text-xs font-mono flex-1" style={{ color }}>{issue.message}</span>
        <span className="text-xs font-mono" style={{ color: `${color}80` }}>{expanded ? '▲' : '▼'}</span>
      </div>
      {expanded && (
        <div className="px-2 py-2 space-y-2">
          {issue.suggestedValue !== undefined && (
            <div className="text-xs font-mono" style={{ color: '#ffffff40' }}>
              <span style={{ color: '#ffffff60' }}>Suggested: </span>
              <span style={{ borderBottom: `2px dashed ${color}`, color }}>{String(issue.suggestedValue).slice(0, 80)}</span>
            </div>
          )}
          {issue.category !== 'narrative' && (
            <div className="space-y-1.5">
              <div className="flex gap-1">
                <Input
                  value={manualValue}
                  onChange={(e) => setManualValue(e.target.value)}
                  placeholder="Manual correction..."
                  className="flex-1 text-xs font-mono h-7 bg-black/30 border-[var(--terminal-border)]"
                />
                <button
                  onClick={() => manualValue && onCorrect?.(issue.id, manualValue)}
                  className="text-xs font-mono px-2 py-1 rounded"
                  style={{ border: `1px solid ${color}`, color, background: `${color}15` }}
                >
                  APPLY
                </button>
              </div>
            </div>
          )}
          {issue.category === 'narrative' && (
            <div className="text-xs font-mono" style={{ color: '#ffffff50' }}>
              Narrative contradictions cannot be auto-corrected. Review the AI's output and decide whether to accept it as a creative choice.
            </div>
          )}
          <div className="pt-1" style={{ borderTop: `1px solid ${color}15` }}>
            <button
              onClick={() => onIgnore?.(issue.id)}
              className="text-xs font-mono px-2 py-0.5 rounded transition-all"
              style={{ border: '1px solid #ffffff15', color: '#ffffff40', background: 'transparent' }}
            >
              ✗ Ignore Audit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function CorrectionAlert({ issues = [], onCorrect, onIgnore }: CorrectionAlertProps) {
  const pending = issues.filter((i) => !i.corrected && !i.ignored);
  if (pending.length === 0) return null;

  const counts = countPendingIssues(issues);
  const hasCritical = pending.some((i) => i.severity === 'error');
  const borderColor = hasCritical ? 'var(--neon-pink)' : 'var(--neon-gold)';

  return (
    <div
      className="mx-3 mb-2 rounded overflow-hidden animate-fade-in-up"
      style={{ border: `1px solid ${borderColor}50`, background: '#0A0A0A' }}
    >
      <div
        className="px-3 py-1.5 flex items-center justify-between"
        style={{ background: `${borderColor}10`, borderBottom: `1px solid ${borderColor}30` }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm animate-pulse-neon">⚠</span>
          <span className="text-xs font-mono font-bold tracking-widest" style={{ color: borderColor }}>
            AUDITOR DETECTED {pending.length} ISSUE{pending.length > 1 ? 'S' : ''}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono">
          {counts.data > 0 && <span style={{ color: 'var(--neon-gold)80' }}>DATA:{counts.data}</span>}
          {counts.narrative > 0 && <span style={{ color: 'var(--neon-purple)80' }}>NARR:{counts.narrative}</span>}
          {counts.img > 0 && <span style={{ color: 'var(--neon-cyan)80' }}>IMG:{counts.img}</span>}
        </div>
      </div>
      <div className="px-2 py-2 max-h-48 overflow-y-auto">
        {pending.map((issue) => (
          <IssueCard key={issue.id} issue={issue} onCorrect={onCorrect} onIgnore={onIgnore} />
        ))}
      </div>
    </div>
  );
}
