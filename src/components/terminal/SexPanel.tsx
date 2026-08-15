import { useState } from 'react';
import { getSexPhaseColor, getMenstrualPhaseInfo } from '@/lib/erosParser';
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
      <span className="flex-shrink-0 font-mono w-20" style={{ color: `${color}90` }}>
        {label}
      </span>
      <div className="flex-1 rounded-full overflow-hidden" style={{ height: '5px', background: '#ffffff08' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}, ${color}bb)`,
            boxShadow: `0 0 6px ${color}, 0 0 12px ${color}50`,
          }}
        />
      </div>
      <span className="font-mono text-xs w-8 text-right" style={{ color: `${color}80` }}>
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
      style={{ border: `1px solid ${phaseColor}40` }}
    >
      {sexModule.position && <ASCIIPositionViewer positionName={sexModule.position} phase={phase} />}
      <div
        className="px-3 py-1.5 flex items-center justify-between"
        style={{ background: `${phaseColor}15`, borderBottom: `1px solid ${phaseColor}30` }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold" style={{ color: phaseColor }}>
            {phaseLabels[phase] || '🔥 SEX MODULE'}
          </span>
          {(sexModule.orgasmCount || 0) > 0 && (
            <span
              className="text-xs font-mono px-1.5 rounded"
              style={{ color: 'var(--neon-gold)', background: 'var(--neon-gold)15', border: '1px solid var(--neon-gold)30' }}
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
                  color: tab === t.id ? phaseColor : '#ffffff40',
                  background: tab === t.id ? `${phaseColor}15` : 'transparent',
                  border: `1px solid ${tab === t.id ? phaseColor : '#ffffff10'}`,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-3 py-2" style={{ background: '#0A0A0A' }}>
        {tab === 'overview' && (
          <div className="space-y-0.5">
            {sexModule.pace && <Row label="Pace" value={sexModule.pace} color={phaseColor} />}
            {sexModule.stimulusDescription && (
              <Row label="Intimacy" value={sexModule.stimulusDescription} color={phaseColor} />
            )}
            {(metrics.intensity || 0) > 0 || (metrics.threshold || 0) > 0 ? (
              <div className="mt-1.5 pt-1.5 space-y-1" style={{ borderTop: `1px solid ${phaseColor}20` }}>
                {(metrics.intensity || 0) > 0 && (
                  <NeonBar value={metrics.intensity} color={phaseColor} label="Intensity" />
                )}
                {(metrics.threshold || 0) > 0 && (
                  <NeonBar value={metrics.threshold} color="var(--neon-purple)" label="Threshold" />
                )}
              </div>
            ) : null}
            {hasMale && (
              <div className="mt-1.5 pt-1.5" style={{ borderTop: `1px solid ${phaseColor}20` }}>
                <div className="text-xs font-mono mb-0.5" style={{ color: phaseColor, opacity: 0.6 }}>
                  ♂ MALE
                </div>
                {male.seminalVolume && <Row label="Seminal" value={male.seminalVolume} />}
                {(male.ejaculationCount || 0) > 0 && (
                  <Row label="Ejac" value={`×${male.ejaculationCount}`} />
                )}
                {!!male.ejaculation_location && (
                  <Row label="Location" value={String(male.ejaculation_location)} color="var(--neon-pink)80" />
                )}
              </div>
            )}
          </div>
        )}

        {tab === 'senses' && (
          <div className="space-y-1">
            {(metrics.intensity || 0) > 0 || (metrics.threshold || 0) > 0 ? (
              <div className="space-y-1 mb-2 pb-2" style={{ borderBottom: `1px solid ${phaseColor}20` }}>
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
            {female.arousalState && <Row label="State" value={female.arousalState} color="var(--neon-pink)80" />}
            {female.lubrication && <Row label="Wetness" value={female.lubrication} color="var(--neon-pink)80" />}
            {female.vagina && <Row label="Vagina" value={female.vagina} color="var(--neon-pink)80" />}
            {female.cervix && <Row label="Cervix" value={female.cervix} color="var(--neon-pink)80" />}
            {female.uterus && <Row label="Uterus" value={female.uterus} color="var(--neon-pink)80" />}
            {female.ovaries && <Row label="Ovaries" value={female.ovaries} color="var(--neon-pink)80" />}
            {cycleInfo && (
              <div className="mt-1.5 pt-1.5" style={{ borderTop: '1px solid var(--neon-pink)20' }}>
                <div className="text-xs font-mono mb-1" style={{ color: cycleInfo.color }}>
                  🩸 MENSTRUAL CYCLE
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-mono px-2 py-0.5 rounded"
                    style={{
                      color: cycleInfo.color,
                      background: `${cycleInfo.color}15`,
                      border: `1px solid ${cycleInfo.color}30`,
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
                        background: 'var(--neon-green)15',
                        border: '1px solid var(--neon-green)30',
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
            <div className="text-xs font-mono mb-1.5" style={{ color: 'var(--neon-pink)70' }}>
              💧 MARKING LOG
            </div>
            {(sexModule.marking_history || []).length === 0 ? (
              <div className="text-xs font-mono text-center py-2" style={{ color: '#ffffff20' }}>
                No marking events recorded
              </div>
            ) : (
              <div className="overflow-hidden rounded" style={{ border: '1px solid var(--neon-pink)20' }}>
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr style={{ background: 'var(--neon-pink)10', borderBottom: '1px solid var(--neon-pink)20' }}>
                      <th className="text-left px-2 py-1" style={{ color: 'var(--neon-pink)70' }}>
                        Location
                      </th>
                      <th className="text-center px-2 py-1" style={{ color: 'var(--neon-pink)70' }}>
                        Count
                      </th>
                      <th className="text-right px-2 py-1" style={{ color: 'var(--neon-pink)70' }}>
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
                            borderBottom: i < arr.length - 1 ? '1px solid var(--neon-pink)10' : 'none',
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
