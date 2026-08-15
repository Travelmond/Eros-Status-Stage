/**
 * @deprecated Use `@/systems/relationships` instead. This compatibility re-export will be removed in a future release.
 *
 * Re-export do sistema de relacionamentos real.
 * A lógica de family/affection tiers está em `src/systems/relationships.ts`.
 */

export {
  FAMILY_TIERS,
  AFFECTION_TIERS,
  detectFamilyTier,
  detectAffectionTier,
  detectForbiddenScenario,
  resolveRelationshipContext,
  getFamilyTierBadge,
  getAffectionTierBadge,
} from '@/systems/relationships';

export type {
  FamilyTierConfig,
  AffectionTier,
  ResolvedRelationshipContext,
} from '@/systems/relationships';
