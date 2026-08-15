/**
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
