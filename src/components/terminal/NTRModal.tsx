import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface NTRModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

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

export function NTRModal({ onConfirm, onCancel }: NTRModalProps) {
  const [step, setStep] = useState(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: '#000000CC' }}>
      <div
        className="rounded overflow-hidden font-mono text-xs"
        style={{
          width: '320px',
          border: '1px solid var(--neon-pink)60',
          background: 'var(--terminal-card)',
          boxShadow: '0 0 30px var(--neon-pink)20',
        }}
      >
        <div className="px-4 py-2.5" style={{ background: 'var(--neon-pink)15', borderBottom: '1px solid var(--neon-pink)40' }}>
          <div className="text-sm font-bold neon-pink tracking-widest">⚠ NTR MODULE</div>
          <div className="text-gray-500 mt-0.5">Netorare / Cuckold System v1.0</div>
        </div>

        {step === 1 && (
          <div className="p-4">
            <p className="text-gray-400 leading-relaxed mb-3">
              The NTR Module enables{' '}
              <span style={{ color: 'var(--neon-pink)' }}>infidelity, jealousy, and betrayal mechanics</span>{' '}
              in your roleplay.
            </p>
            <div className="mb-3">
              <div className="text-xs mb-1.5" style={{ color: 'var(--neon-green)' }}>✓ PROS</div>
              {PROS.map((p, i) => (
                <div key={i} className="flex gap-2 py-0.5 text-gray-500">
                  <span style={{ color: 'var(--neon-green)80' }}>›</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <div className="text-xs mb-1.5" style={{ color: 'var(--neon-pink)' }}>✗ CONS</div>
              {CONS.map((c, i) => (
                <div key={i} className="flex gap-2 py-0.5 text-gray-500">
                  <span style={{ color: 'var(--neon-pink)80' }}>›</span>
                  <span>{c}</span>
                </div>
              ))}
            </div>
            <div className="text-gray-600 text-xs mb-4 p-2 rounded" style={{ background: 'var(--neon-pink)08', border: '1px solid var(--neon-pink)20' }}>
              This module is <strong style={{ color: 'var(--neon-pink)' }}>irreversible</strong> once activated for this session. Proceed with caution.
            </div>
            <div className="flex gap-2">
              <Button
                onClick={onCancel}
                variant="outline"
                className="flex-1 text-xs font-mono border-[var(--neon-cyan)40] text-[var(--neon-cyan)]"
              >
                CANCEL
              </Button>
              <Button
                onClick={() => setStep(2)}
                className="flex-1 text-xs font-mono bg-[var(--neon-pink)] text-white hover:bg-[var(--neon-pink)]/80"
              >
                PROCEED →
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-4">
            <div className="text-center mb-4">
              <div className="text-2xl mb-2">🔞</div>
              <div className="text-sm font-bold" style={{ color: 'var(--neon-pink)' }}>ARE YOU SURE?</div>
              <div className="text-gray-500 mt-1 leading-relaxed">
                Activating the NTR Module will enable betrayal mechanics, rival tracking, and jealousy events in all future interactions.
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1 text-xs font-mono border-[var(--neon-cyan)40] text-[var(--neon-cyan)]"
              >
                ← GO BACK
              </Button>
              <Button
                onClick={onConfirm}
                className="flex-1 text-xs font-mono font-bold bg-[var(--neon-pink)] text-white hover:bg-[var(--neon-pink)]/80"
              >
                ACTIVATE NTR
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
