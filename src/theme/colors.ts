/**
 * ═══════════════════════════════════════════════════════════════════
 * Eros Status Terminal — Tema central de cores (F1)
 *
 * Fonte única de verdade para as cores de UI. Os valores referenciam
 * os design tokens `--neon-*` / `--terminal-*` definidos em
 * `src/index.css`. Nenhum componente deve hardcodar cores hex: importe
 * os tokens daqui ou use as variáveis CSS diretamente.
 *
 * Este módulo é a casa dos helpers visuais de cor que antes viviam no
 * parser (`getSexPhaseColor`, `getMenstrualPhaseInfo`), mantendo o
 * `src/core/parser.ts` 100% framework-agnostic.
 * ═══════════════════════════════════════════════════════════════════
 */

/** Tokens neon oficiais (espelham `--neon-*` de `src/index.css`). */
export const NEON = {
  cyan: 'var(--neon-cyan)',
  cyanSoft: 'var(--neon-cyan-soft)',
  pink: 'var(--neon-pink)',
  pinkSoft: 'var(--neon-pink-soft)',
  green: 'var(--neon-green)',
  greenSoft: 'var(--neon-green-soft)',
  purple: 'var(--neon-purple)',
  purpleSoft: 'var(--neon-purple-soft)',
  gold: 'var(--neon-gold)',
  goldSoft: 'var(--neon-gold-soft)',
} as const;

/** Cor neutra de fallback para fases/ciclos desconhecidos. */
export const NEUTRAL_FALLBACK = 'var(--terminal-text-faint)';

/**
 * Cor de destaque associada a cada fase do módulo sexual.
 * @deprecated preferido em favor do uso dos tokens diretamente.
 */
export function getSexPhaseColor(phase?: string): string {
  switch (phase) {
    case 'sex':
      return NEON.pink;
    case 'flirting':
      return NEON.purple;
    case 'post-sex':
      return NEON.gold;
    default:
      return NEON.cyan;
  }
}

export interface MenstrualPhaseInfo {
  label: string;
  color: string;
  days: string;
  fertile: boolean;
}

/** Informações visuais (rótulo + cor) de cada fase do ciclo menstrual. */
export function getMenstrualPhaseInfo(phase?: string): MenstrualPhaseInfo {
  const phases: Record<string, MenstrualPhaseInfo> = {
    menstruation: { label: 'Menstruation', color: NEON.pink, days: '1-5', fertile: false },
    follicular: { label: 'Follicular', color: NEON.cyan, days: '6-13', fertile: false },
    ovulation: { label: 'Ovulation', color: NEON.green, days: '14', fertile: true },
    luteal: { label: 'Luteal', color: NEON.gold, days: '15-28', fertile: false },
  };
  return phases[phase || ''] || { label: phase || 'Unknown', color: NEUTRAL_FALLBACK, days: '?', fertile: false };
}
