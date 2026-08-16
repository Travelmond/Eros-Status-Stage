/**
 * @deprecated Use `@/core/parser` instead. This compatibility re-export will be removed in a future release.
 *
 * Re-export do parser real do Eros Status Terminal.
 * O parser framework-agnostic está em `src/core/parser.ts`.
 */

export {
  parseErosStatusFromMessage,
  parseErosStatusFromJson,
  parseCondensedBlock,
  parseTerminalBlock,
  parseNPCData,
  parseSexModule,
  parseImgModule,
  generateMiniMap,
  getExpressionEmoji,
  getWeatherIcon,
  getClothingEmoji,
} from '@/core/parser';

/**
 * Helpers visuais de cor foram movidos para `@/theme/colors` (F1).
 * @deprecated Importe diretamente de `@/theme/colors`.
 */
export { getSexPhaseColor, getMenstrualPhaseInfo } from '@/theme/colors';


