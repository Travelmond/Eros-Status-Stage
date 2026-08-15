import { SexPanel } from './SexPanel';
import { ReactionPanel } from './ReactionPanel';
import { NTRPanel } from './NTRPanel';
import type { ErosStatusState } from '@/types/eros-status';

interface ModulesPanelProps {
  state: ErosStatusState;
  ntrEnabled?: boolean;
}

export function ModulesPanel({ state, ntrEnabled }: ModulesPanelProps) {
  const showSex = !!state.sexModule?.active;

  return (
    <div className="space-y-2 pb-2 animate-fade-in-up">
      {showSex ? (
        <SexPanel sexModule={state.sexModule} />
      ) : (
        <EmptyState icon="🔒" title="No active sex/flirt scene detected" subtitle="Panel appears during flirting, sex, or post-sex" />
      )}
      <ReactionPanel reactionModule={state.reactionModule} />
      {ntrEnabled && <NTRPanel ntrModule={state.ntrModule} />}
    </div>
  );
}

function EmptyState({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div
      className="mx-3 mb-2 rounded flex flex-col items-center justify-center py-8 text-gray-700 text-xs font-mono"
      style={{ border: '1px solid var(--terminal-border)', background: 'var(--terminal-bg)' }}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div>{title}</div>
      <div className="text-gray-800 mt-1">{subtitle}</div>
    </div>
  );
}
