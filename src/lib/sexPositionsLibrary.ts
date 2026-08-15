/**
 * @deprecated Use `@/systems/sexPositions` instead. This compatibility re-export will be removed in a future release.
 *
 * Re-export da biblioteca de posições sexuais real.
 * O banco de posições ASCII está em `src/systems/sexPositions.ts`.
 */

export {
  POSITIONS_LIB,
  POSITION_CATEGORIES,
  POSITIONS_LIST,
  findPosition,
  getPositionsByCategory,
} from '@/systems/sexPositions';

export type { SexPosition } from '@/systems/sexPositions';
