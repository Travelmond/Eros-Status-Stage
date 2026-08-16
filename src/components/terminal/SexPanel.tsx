import { useState } from 'react';
import { getSexPhaseColor, getMenstrualPhaseInfo } from '@/theme/colors';
import { ASCIIPositionViewer } from './ASCIIPositionViewer';
import type { SexModule } from '@/types/eros-status';

interface SexPanelProps {
  sexModule?: SexModule;
}

function Row({ label, value, color = 'var(--neon-pink)' }: { label: string; value: React.ReactNode; color?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 py-0.5 text-xs">
      <span className="flex-shrink-0 font-mono" style={{ color, minWidth: '72px' }}>
        {label}
      </span>
      <span className="font-mono text-gray-300 leading-relaxed">{value}</span>
    </div>
  );
}

function SenseRow({ emoji, label, value }: { emoji: string; label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 py-0.5 text-xs">
      <span className="flex-shrink-0 text-sm">{emoji}</span>
      <span className="flex-shrink-0 font-mono text-gray-600 w-12">{label}</span>
      <span className="font-mono text-gray-300 leading-relaxed">{value}</span>
    </div>
  );
}

function NeonBar({ value = 0, color = 'var(--neon-pink)', label }: { value?: number; color?: string; label: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center gap-2 py-0.5 text-xs">
      <span className="flex-shrink-0 font-mono w-20" style={{ color: `color-mix(in srgb, ${color} 90%, transparent)` }}>
        {label}
      </span>
      <div className="flex-1 rounded-full overflow-hidden" style={{ height: '5px', background: 'var(--terminal-text-subtle)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}, ${color}bb)`,
            boxShadow: `0 0 6px ${color}, 0 0 12px color-mix(in srgb, ${color} 50%, transparent)`,
          }}
        />
      </div>
      <span className="font-mono text-xs w-8 text-right" style={{ color: `color-mix(in srgb, ${color} 80%, transparent)` }}>
        {pct}%
      </span>
    </div>
  );
}

export function SexPanel({ sexModule }: SexPanelProps) {
  const [tab, setTab] = useState('overview');
  if (!sexModule?.active) return null;

  const phase = sexModule.phase || 'sex';
  const phaseColor = getSexPhaseColor(phase);
  const phaseLabels: Record<string, string> = {
    flirting: '💋 FLIRTING',
    sex: '🔥 SEX',
    'post-sex': '✨ POST-SEX',
  };

  const senses = sexModule.senses || {};
  const hasSenses = Object.values(senses).some(Boolean);
  const male = sexModule.male || {};
  const female = sexModule.female || {};
  const hasMale = male.seminalVolume || male.ejaculationCount;
  const hasFemale = Object.entries(female).some(([k, v]) => v && k !== 'menstrualCycle');
  const hasCycle = female.menstrualCycle?.phase;
  const hasMarking = (sexModule.marking_history || []).length > 0;
  const metrics = sexModule.sensory_metrics || {};
  const hasMetrics = (metrics.intensity || 0) > 0 || (metrics.threshold || 0) > 0;

  const tabs = [
    { id: 'overview', label: 'OVR' },
    ...(hasSenses || hasMetrics ? [{ id: 'senses', label: '5♻' }] : []),
    ...(hasFemale || hasCycle ? [{ id: 'anatomy', label: 'ANT' }] : []),
    ...(hasMarking ? [{ id: 'marking', label: 'MRK' }] : []),
  ];

  const cycleInfo = hasCycle ? getMenstrualPhaseInfo(female.menstrualCycle?.phase) : null;

  return (
    <div
      className="mx-3 mb-2 rounded overflow-hidden"
      style={{ border: `1px solid color-mix(in srgb, ${phaseColor} 40%, transparent)` }}
    >
      {sexModule.position && <ASCIIPositionViewer positionName={sexModule.position} phase={phase} />}
      <div
        className="px-3 py-1.5 flex items-center justify-between"
        style={{ background: `color-mix(in srgb, ${phaseColor} 15%, transparent)`, borderBottom: `1px solid color-mix(in srgb, ${phaseColor} 30%, transparent)` }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold" style={{ color: phaseColor }}>
            {phaseLabels[phase] || '🔥 SEX MODULE'}
          </span>
          {(sexModule.orgasmCount || 0) > 0 && (
            <span
              className="text-xs font-mono px-1.5 rounded"
              style={{ color: 'var(--neon-gold)', background: 'color-mix(in srgb, var(--neon-gold) 15%, transparent)', border: '1px solid color-mix(in srgb, var(--neon-gold) 30%, transparent)' }}
            >
              ★×{sexModule.orgasmCount}
            </span>
          )}
        </div>
        {tabs.length > 1 && (
          <div className="flex gap-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="text-xs font-mono px-1.5 py-0.5 rounded transition-all"
                style={{
                  color: tab === t.id ? phaseColor : 'var(--terminal-text-faint)',
                  background: tab === t.id ? `color-mix(in srgb, ${phaseColor} 15%, transparent)` : 'transparent',
                  border: `1px solid ${tab === t.id ? phaseColor : 'var(--terminal-text-ghost)'}`,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-3 py-2" style={{ background: 'var(--terminal-bg)' }}>
        {tab === 'overview' && (
          <div className="space-y-0.5">
            {sexModule.pace && <Row label="Pace" value={sexModule.pace} color={phaseColor} />}
            {sexModule.stimulusDescription && (
              <Row label="Intimacy" value={sexModule.stimulusDescription} color={phaseColor} />
            )}
            {(metrics.intensity || 0) > 0 || (metrics.threshold || 0) > 0 ? (
              <div className="mt-1.5 pt-1.5 space-y-1" style={{ borderTop: `1px solid color-mix(in srgb, ${phaseColor} 20%, transparent)` }}>
                {(metrics.intensity || 0) > 0 && (
                  <NeonBar value={metrics.intensity} color={phaseColor} label="Intensity" />
                )}
                {(metrics.threshold || 0) > 0 && (
                  <NeonBar value={metrics.threshold} color="var(--neon-purple)" label="Threshold" />
                )}
              </div>
            ) : null}
            {hasMale && (
              <div className="mt-1.5 pt-1.5" style={{ borderTop: `1px solid color-mix(in srgb, ${phaseColor} 20%, transparent)` }}>
                <div className="text-xs font-mono mb-0.5" style={{ color: phaseColor, opacity: 0.6 }}>
                  ♂ MALE
                </div>
                {male.seminalVolume && <Row label="Seminal" value={male.seminalVolume} />}
                {(male.ejaculationCount || 0) > 0 && (
                  <Row label="Ejac" value={`×${male.ejaculationCount}`} />
                )}
                {!!male.ejaculation_location && (
                  <Row label="Location" value={String(male.ejaculation_location)} color="color-mix(in srgb, var(--neon-pink) 80%, transparent)" />
                )}
              </div>
            )}
          </div>
        )}

        {tab === 'senses' && (
          <div className="space-y-1">
            {(metrics.intensity || 0) > 0 || (metrics.threshold || 0) > 0 ? (
              <div className="space-y-1 mb-2 pb-2" style={{ borderBottom: `1px solid color-mix(in srgb, ${phaseColor} 20%, transparent)` }}>
                {(metrics.intensity || 0) > 0 && (
                  <NeonBar value={metrics.intensity} color={phaseColor} label="Intensity" />
                )}
                {(metrics.threshold || 0) > 0 && (
                  <NeonBar value={metrics.threshold} color="var(--neon-purple)" label="Threshold" />
                )}
              </div>
            ) : null}
            <SenseRow emoji="👁️" label="Sight" value={senses.sight} />
            <SenseRow emoji="👂" label="Sound" value={senses.sound} />
            <SenseRow emoji="👃" label="Smell" value={senses.smell} />
            <SenseRow emoji="🤚" label="Touch" value={senses.touch} />
            <SenseRow emoji="👅" label="Taste" value={senses.taste} />
            {!hasSenses && !hasMetrics && (
              <div className="text-xs text-gray-700 text-center py-2">No sensory data detected</div>
            )}
          </div>
        )}

        {tab === 'anatomy' && (
          <div className="space-y-0.5">
            <div className="text-xs font-mono mb-1" style={{ color: 'var(--neon-pink)', opacity: 0.6 }}>
              ♀ FEMALE ANATOMY
            </div>
            {female.arousalState && <Row label="State" value={female.arousalState} color="color-mix(in srgb, var(--neon-pink) 80%, transparent)" />}
            {female.lubrication && <Row label="Wetness" value={female.lubrication} color="color-mix(in srgb, var(--neon-pink) 80%, transparent)" />}
            {female.vagina && <Row label="Vagina" value={female.vagina} color="color-mix(in srgb, var(--neon-pink) 80%, transparent)" />}
            {female.cervix && <Row label="Cervix" value={female.cervix} color="color-mix(in srgb, var(--neon-pink) 80%, transparent)" />}
            {female.uterus && <Row label="Uterus" value={female.uterus} color="color-mix(in srgb, var(--neon-pink) 80%, transparent)" />}
            {female.ovaries && <Row label="Ovaries" value={female.ovaries} color="color-mix(in srgb, var(--neon-pink) 80%, transparent)" />}
            {cycleInfo && (
              <div className="mt-1.5 pt-1.5" style={{ borderTop: '1px solid color-mix(in srgb, var(--neon-pink) 20%, transparent)' }}>
                <div className="text-xs font-mono mb-1" style={{ color: cycleInfo.color }}>
                  🩸 MENSTRUAL CYCLE
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-mono px-2 py-0.5 rounded"
                    style={{
                      color: cycleInfo.color,
                      background: `color-mix(in srgb, ${cycleInfo.color} 15%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${cycleInfo.color} 30%, transparent)`,
                    }}
                  >
                    {cycleInfo.label}
                  </span>
                  {(female.menstrualCycle?.day || 0) > 0 && (
                    <span className="text-xs font-mono text-gray-500">
                      Day {female.menstrualCycle?.day}
                    </span>
                  )}
                  {female.menstrualCycle?.fertile && (
                    <span
                      className="text-xs font-mono px-1.5 py-0.5 rounded"
                      style={{
                        color: 'var(--neon-green)',
                        background: 'color-mix(in srgb, var(--neon-green) 15%, transparent)',
                        border: '1px solid color-mix(in srgb, var(--neon-green) 30%, transparent)',
                      }}
                    >
                      ♻ FERTILE
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-600 mt-1">Days: {cycleInfo.days}</div>
              </div>
            )}
            {!hasFemale && !hasCycle && (
              <div className="text-xs text-gray-700 text-center py-2">No anatomy data detected</div>
            )}
          </div>
        )}

        {tab === 'marking' && (
          <div>
            <div className="text-xs font-mono mb-1.5" style={{ color: 'color-mix(in srgb, var(--neon-pink) 70%, transparent)' }}>
              💧 MARKING LOG
            </div>
            {(sexModule.marking_history || []).length === 0 ? (
              <div className="text-xs font-mono text-center py-2" style={{ color: 'var(--terminal-text-faint)' }}>
                No marking events recorded
              </div>
            ) : (
              <div className="overflow-hidden rounded" style={{ border: '1px solid color-mix(in srgb, var(--neon-pink) 20%, transparent)' }}>
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr style={{ background: 'color-mix(in srgb, var(--neon-pink) 10%, transparent)', borderBottom: '1px solid color-mix(in srgb, var(--neon-pink) 20%, transparent)' }}>
                      <th className="text-left px-2 py-1" style={{ color: 'color-mix(in srgb, var(--neon-pink) 70%, transparent)' }}>
                        Location
                      </th>
                      <th className="text-center px-2 py-1" style={{ color: 'color-mix(in srgb, var(--neon-pink) 70%, transparent)' }}>
                        Count
                      </th>
                      <th className="text-right px-2 py-1" style={{ color: 'color-mix(in srgb, var(--neon-pink) 70%, transparent)' }}>
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(sexModule.marking_history || []).map((m: unknown, i: number, arr: unknown[]) => {
                      const entry = m as { location?: string; count?: number; timestamp?: string };
                      return (
                        <tr
                          key={i}
                          style={{
                            borderBottom: i < arr.length - 1 ? '1px solid color-mix(in srgb, var(--neon-pink) 10%, transparent)' : 'none',
                          }}
                        >
                          <td className="px-2 py-1 text-gray-300">{entry.location || '--'}</td>
                          <td className="px-2 py-1 text-center" style={{ color: 'var(--neon-pink)' }}>
                            ×{entry.count || 1}
                          </td>
                          <td className="px-2 py-1 text-right text-gray-600">
                            {entry.timestamp || '--:--'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
