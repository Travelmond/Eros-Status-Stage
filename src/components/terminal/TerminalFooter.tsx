import { cn } from '@/utils/cn';
import type { MetaState } from '@/types/eros-status';
import type { AuditIssue } from '@/types/eros-status';

interface TerminalFooterProps {
  turnCount?: number;
  branchIndex?: number;
  meta?: MetaState;
  auditIssues?: AuditIssue[];
  version?: string;
  ntrEnabled?: boolean;
  onToggleNTR?: () => void;
  onOpenAudit?: () => void;
  className?: string;
}

export function TerminalFooter({
  turnCount = 0,
  branchIndex = 0,
  meta,
  auditIssues = [],
  version = 'ESS v3.0',
  ntrEnabled = false,
  onToggleNTR,
  onOpenAudit,
  className,
}: TerminalFooterProps) {
  const pending = auditIssues.filter((i) => !i.corrected && !i.ignored).length;
  const coercedCount = meta?.coerced_fields?.length || 0;

  return (
    <div
      className={cn(
        'px-3 pb-3 pt-2 flex-shrink-0 flex items-center justify-between text-xs font-mono',
        className,
      )}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-white/20">T#{turnCount}</span>
        {branchIndex > 0 && (
          <span
            className="px-1 rounded text-[9px]"
            style={{
              color: 'var(--neon-gold)',
              background: 'var(--neon-gold)10',
              border: '1px solid var(--neon-gold)30',
            }}
          >
            v{branchIndex}
          </span>
        )}
        {coercedCount > 0 && (
          <span
            className="text-[9px]"
            style={{ color: 'var(--neon-pink)60' }}
            title={meta?.coerced_fields?.join(', ')}
          >
            ⚠{coercedCount}
          </span>
        )}
        {pending > 0 && (
          <button
            onClick={onOpenAudit}
            className="text-[9px] px-1 rounded cursor-pointer"
            style={{
              color: 'var(--neon-gold)',
              background: 'var(--neon-gold)10',
              border: '1px solid var(--neon-gold)30',
            }}
            title="Open AUDIT tab"
          >
            🔍{pending}
          </button>
        )}
        <span className="text-white/20">• {version}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleNTR}
          className="text-xs font-mono px-1.5 py-0.5 rounded transition-all"
          style={{
            border: `1px solid ${ntrEnabled ? 'var(--neon-purple)' : '#ffffff15'}`,
            color: ntrEnabled ? 'var(--neon-purple)' : '#ffffff30',
            background: ntrEnabled ? 'var(--neon-purple)15' : 'transparent',
          }}
          title="Toggle NTR Module"
        >
          NTR
        </button>
        <div className="flex items-center gap-1">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: 'var(--neon-green)', boxShadow: '0 0 4px var(--neon-green)' }}
          />
          <span className="text-white/30">LIVE</span>
        </div>
      </div>
    </div>
  );
}
