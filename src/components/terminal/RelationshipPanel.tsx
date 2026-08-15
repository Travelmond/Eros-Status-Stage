import { useState } from 'react';
import { resolveRelationshipContext, FAMILY_TIERS } from '@/lib/relationshipSystem';
import { getExpressionEmoji } from '@/lib/erosParser';
import type { ErosStatusState } from '@/types/eros-status';

interface RelationshipPanelProps {
  state?: ErosStatusState;
}

function Badge({ label, color, icon }: { label: string; color: string; icon?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-mono px-1.5 py-0.5 rounded"
      style={{ color, background: `${color}18`, border: `1px solid ${color}40` }}
    >
      {icon && <span style={{ fontSize: '11px' }}>{icon}</span>}
      {label}
    </span>
  );
}

function RelRow({
  icon,
  label,
  value,
  color = '#00FFF5',
  valueColor,
}: {
  icon: string;
  label: string;
  value: React.ReactNode;
  color?: string;
  valueColor?: string;
}) {
  return (
    <div className="flex items-start gap-2 py-0.5 text-xs font-mono">
      <span className="flex-shrink-0 w-4 text-center" style={{ fontSize: '12px' }}>
        {icon}
      </span>
      <span className="w-24 flex-shrink-0" style={{ color: '#ffffff40' }}>
        {label}:
      </span>
      <span style={{ color: valueColor || color }}>{value}</span>
    </div>
  );
}

export function RelationshipPanel({ state }: RelationshipPanelProps) {
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
    <div
      className="mx-3 mb-2 rounded overflow-hidden"
      style={{ border: '1px solid var(--neon-purple)40' }}
    >
      <div
        className="px-3 py-1.5 flex items-center justify-between cursor-pointer"
        style={{
          background: 'var(--neon-purple)08',
          borderBottom: open ? '1px solid var(--neon-purple)20' : 'none',
        }}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-xs font-mono font-bold tracking-widest" style={{ color: 'var(--neon-purple)' }}>
          🤝 RELATIONSHIPS
        </span>
        <span className="text-xs font-mono" style={{ color: 'var(--neon-purple)40' }}>
          {open ? '▲' : '▼'}
        </span>
      </div>
      {open && (
        <div className="px-3 py-2 space-y-3" style={{ background: '#0A0A0A' }}>
          <div>
            <div
              className="text-xs font-mono mb-1 tracking-widest"
              style={{ color: 'var(--neon-purple)70' }}
            >
              {charName} → {userName}
            </div>
            {ctx.primaryRole && (
              <RelRow icon={familyCfg.icon} label="Bond type" value={ctx.primaryRole} color={familyCfg.color} />
            )}
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {ctx.familyTier !== 'none' && (
                <Badge label={familyCfg.label} color={familyCfg.color} icon={familyCfg.icon} />
              )}
              <Badge label={affTier.label} color={affTier.color} icon={affTier.icon} />
              {ctx.forbiddenScenario && ctx.familyTier === 'blood' && (
                <Badge label="⚠ Taboo escalation" color="#FF2D78" />
              )}
            </div>
            {ctx.hiddenStats.size > 0 && !ctx.forbiddenScenario && (
              <div
                className="mt-1.5 text-xs font-mono px-2 py-1 rounded"
                style={{
                  background: 'var(--neon-pink)08',
                  border: '1px solid var(--neon-pink)20',
                  color: 'var(--neon-pink)80',
                }}
              >
                🔒 {[...ctx.hiddenStats].join(', ')} hidden — relationship threshold not reached
              </div>
            )}
            <div className="flex gap-2 mt-1.5 flex-wrap">
              <span
                className="text-xs font-mono"
                style={{ color: ctx.effectiveAllowsRomance ? 'var(--neon-green)' : 'var(--neon-pink)60' }}
              >
                {ctx.effectiveAllowsRomance ? '✓' : '✗'} Romance
              </span>
              <span
                className="text-xs font-mono"
                style={{ color: ctx.effectiveAllowsErotics ? 'var(--neon-green)' : 'var(--neon-pink)60' }}
              >
                {ctx.effectiveAllowsErotics ? '✓' : '✗'} Erotics
              </span>
            </div>
          </div>

          {npcList.length > 0 && (
            <div>
              <div
                className="text-xs font-mono mb-1 tracking-widest"
                style={{ color: 'var(--neon-purple)70' }}
              >
                NPCs → {charName}
              </div>
              <div className="space-y-1">
                {npcs?.map((npc, i) => {
                  const npcFamilyCfg = FAMILY_TIERS[npc.relation || 'none'] || FAMILY_TIERS.none;
                  return (
                    <div key={i} className="flex items-center gap-2 text-xs font-mono">
                      <span>{getExpressionEmoji(npc.mood, npc.mood)}</span>
                      <span className="font-bold text-white">{npc.name}</span>
                      {npc.relation && (
                        <Badge
                          label={npc.relation}
                          color={npcFamilyCfg?.color || '#00FFF5'}
                          icon={npcFamilyCfg?.icon}
                        />
                      )}
                      {npc.mood && npc.mood !== 'neutral' && (
                        <span className="text-xs" style={{ color: 'var(--neon-purple)80' }}>
                          {npc.mood}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {ctx.extraRels.length > 0 && (
            <div>
              <div
                className="text-xs font-mono mb-1 tracking-widest"
                style={{ color: 'var(--neon-purple)70' }}
              >
                Other bonds
              </div>
              {ctx.extraRels.map((rel, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-mono">
                  <span>💫</span>
                  <span className="text-white">{rel.name}</span>
                  {rel.type && <Badge label={rel.type} color={FAMILY_TIERS[rel.familyTier || 'none']?.color || '#00FFF5'} />}
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
