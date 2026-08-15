import { ProgressionsPanel } from './ProgressionsPanel';
import { RelationshipPanel } from './RelationshipPanel';
import type { ErosStatusState } from '@/types/eros-status';
import type { BarStyle } from './NeonProgressBar';

interface StatusPanelProps {
  state: ErosStatusState;
  barStyle?: BarStyle;
}

export function StatusPanel({ state, barStyle = 'bar' }: StatusPanelProps) {
  return (
    <div className="space-y-2 pb-2 animate-fade-in-up">
      <ProgressionsPanel progressions={state.progressions} barStyle={barStyle} state={state} />
      <RelationshipPanel state={state} />
    </div>
  );
}
