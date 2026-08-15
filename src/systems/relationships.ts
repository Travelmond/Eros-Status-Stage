/**
 * ═══════════════════════════════════════════════════════════════════
 * Eros Relationship System v3.0
 *
 * Dois eixos independentes:
 *   1. FAMILY TIER   — laco sanguineo/legal (sister, cousin, etc.)
 *   2. AFFECTION TIER — laco emocional/romantico/sexual
 *
 * Adaptado para TypeScript e estado ESS v3.0.
 * ═══════════════════════════════════════════════════════════════════
 */

import type { ErosStatusState, NPC } from '../types/eros-status';

export interface FamilyTierConfig {
  label: string;
  icon: string;
  color: string;
  allowsRomance: boolean;
  allowsErotics: boolean;
  minAffectionForLibido: number;
  minAffectionForArousal: number;
}

export interface AffectionTier {
  id: string;
  label: string;
  threshold: number;
  icon: string;
  color: string;
  requiresLibido?: number;
}

export const FAMILY_TIERS: Record<string, FamilyTierConfig> = {
  none: {
    label: 'No family bond',
    icon: '👤',
    color: '#00FFF5',
    allowsRomance: true,
    allowsErotics: true,
    minAffectionForLibido: 0,
    minAffectionForArousal: 0,
  },
  chosen: {
    label: 'Chosen family / Close friend',
    icon: '🤝',
    color: '#00FFF5',
    allowsRomance: true,
    allowsErotics: true,
    minAffectionForLibido: 30,
    minAffectionForArousal: 40,
  },
  inlaw: {
    label: 'In-law / Step / Adoptive',
    icon: '🔗',
    color: '#FFD700',
    allowsRomance: true,
    allowsErotics: true,
    minAffectionForLibido: 50,
    minAffectionForArousal: 60,
  },
  blood: {
    label: 'Blood family',
    icon: '🩸',
    color: '#FF2D78',
    allowsRomance: false,
    allowsErotics: false,
    minAffectionForLibido: 80,
    minAffectionForArousal: 90,
  },
};

export const AFFECTION_TIERS: AffectionTier[] = [
  { id: 'stranger', label: 'Stranger', threshold: 0, icon: '❓', color: '#ffffff30' },
  { id: 'acquaintance', label: 'Acquaintance', threshold: 15, icon: '🤝', color: '#00FFF580' },
  { id: 'friend', label: 'Friend', threshold: 30, icon: '😊', color: '#00FFF5' },
  { id: 'close_friend', label: 'Close Friend', threshold: 50, icon: '💙', color: '#00FFF5' },
  { id: 'crush', label: 'Crush', threshold: 60, icon: '💗', color: '#FF2D78' },
  { id: 'lover', label: 'Lover', threshold: 70, icon: '💕', color: '#FF2D78' },
  { id: 'sex_friend', label: 'Sex Friend', threshold: 65, icon: '🔥', color: '#FF2D78', requiresLibido: 60 },
  { id: 'partner', label: 'Partner', threshold: 80, icon: '💑', color: '#FF2D78' },
  { id: 'deeply_in_love', label: 'Deeply in Love', threshold: 90, icon: '❤️', color: '#FF2D78' },
  { id: 'spouse', label: 'Spouse', threshold: 85, icon: '💍', color: '#FFD700' },
];

const FAMILY_KEYWORDS: Record<string, string[]> = {
  blood: [
    'sister', 'brother', 'sibling', 'mother', 'father', 'mom', 'dad', 'daughter', 'son',
    'aunt', 'uncle', 'grandmother', 'grandfather', 'grandma', 'grandpa', 'niece', 'nephew', 'cousin',
    'irma', 'irmao', 'mae', 'pai', 'filha', 'filho', 'prima', 'primo',
  ],
  inlaw: [
    'step-sister', 'stepsister', 'step sister', 'step-brother', 'stepbrother', 'step-mother',
    'stepmother', 'step-father', 'stepfather', 'adoptive', 'adopted', 'foster', 'half-sister',
    'half-brother', 'mother-in-law', 'father-in-law', 'sister-in-law', 'brother-in-law',
    'madrasta', 'padrasto', 'adotiva', 'adotivo',
  ],
  chosen: [
    'childhood friend', 'best friend', 'sworn sister', 'sworn brother',
    'amiga de infancia', 'amigo de infancia',
  ],
};

export function detectFamilyTier(relationStr?: string): string {
  if (!relationStr) return 'none';
  const lower = relationStr.toLowerCase();
  for (const kw of FAMILY_KEYWORDS.inlaw) if (lower.includes(kw)) return 'inlaw';
  for (const kw of FAMILY_KEYWORDS.blood) if (lower.includes(kw)) return 'blood';
  for (const kw of FAMILY_KEYWORDS.chosen) if (lower.includes(kw)) return 'chosen';
  return 'none';
}

export function detectAffectionTier(affection: number, libido: number): AffectionTier {
  if (libido >= 60 && affection >= 65) {
    const sexFriend = AFFECTION_TIERS.find((t) => t.id === 'sex_friend');
    if (sexFriend) return sexFriend;
  }
  const sorted = AFFECTION_TIERS.filter((t) => t.id !== 'sex_friend').sort((a, b) => b.threshold - a.threshold);
  return sorted.find((t) => affection >= t.threshold) || AFFECTION_TIERS[0];
}

export function detectForbiddenScenario(state: ErosStatusState): boolean {
  const { sexModule, progressions, character } = state;
  if (sexModule?.active) return true;
  if ((progressions?.arousal ?? 0) >= 80) return true;
  const role = (character?.role || '').toLowerCase();
  if (role.includes('forbidden') || role.includes('taboo') || role.includes('incest')) return true;
  return false;
}

export interface ResolvedRelationshipContext {
  primaryRole: string;
  familyTier: string;
  familyConfig: FamilyTierConfig;
  affectionTier: AffectionTier;
  forbiddenScenario: boolean;
  effectiveAllowsRomance: boolean;
  effectiveAllowsErotics: boolean;
  hiddenStats: Set<string>;
  npcRelationships: Array<NPC & { familyTier: string; affTier: AffectionTier }>;
  extraRels: Array<{ name?: string; type?: string; affection?: number; familyTier: string }>;
}

export function resolveRelationshipContext(state: ErosStatusState): ResolvedRelationshipContext {
  const { character, progressions, npcs } = state;
  const primaryRole = character?.role || '';
  const familyTier = detectFamilyTier(primaryRole);
  const familyConfig = FAMILY_TIERS[familyTier] || FAMILY_TIERS.none;
  const affTier = detectAffectionTier(progressions?.affection ?? 30, progressions?.libido ?? 20);
  const forbiddenScenario = detectForbiddenScenario(state);

  const effectiveAllowsRomance = familyConfig.allowsRomance || forbiddenScenario;
  const effectiveAllowsErotics = familyConfig.allowsErotics || forbiddenScenario;

  const hiddenStats = new Set<string>();
  if (!effectiveAllowsRomance) {
    hiddenStats.add('libido');
    hiddenStats.add('desire');
    hiddenStats.add('submission');
  } else {
    const aff = progressions?.affection ?? 0;
    if (aff < familyConfig.minAffectionForLibido) hiddenStats.add('libido');
  }

  if (!effectiveAllowsErotics) {
    hiddenStats.add('arousal');
    hiddenStats.add('corruption');
  } else {
    const aff = progressions?.affection ?? 0;
    if (aff < familyConfig.minAffectionForArousal) hiddenStats.add('arousal');
  }

  const npcRelationships = (npcs || []).map((npc) => ({
    ...npc,
    familyTier: detectFamilyTier(npc.relation),
    affTier: detectAffectionTier((npc.affection as number | undefined) || 30, 20),
  }));

  return {
    primaryRole,
    familyTier,
    familyConfig,
    affectionTier: affTier,
    forbiddenScenario,
    effectiveAllowsRomance,
    effectiveAllowsErotics,
    hiddenStats,
    npcRelationships,
    extraRels: [],
  };
}

export function getFamilyTierBadge(tier: string): FamilyTierConfig {
  return FAMILY_TIERS[tier] || FAMILY_TIERS.none;
}

export function getAffectionTierBadge(tierId: string): AffectionTier {
  return AFFECTION_TIERS.find((t) => t.id === tierId) || AFFECTION_TIERS[0];
}
