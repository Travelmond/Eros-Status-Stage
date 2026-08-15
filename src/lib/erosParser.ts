/**
 * Re-export do parser real do Eros Status Terminal.
 * O parser framework-agnostic está em `src/core/parser.ts`.
 */

export {
  parseErosStatusFromMessage,
  parseCondensedBlock,
  parseTerminalBlock,
  parseNPCData,
  parseSexModule,
  parseImgModule,
  generateMiniMap,
  getExpressionEmoji,
  getWeatherIcon,
  getClothingEmoji,
  getSexPhaseColor,
  getMenstrualPhaseInfo,
} from '@/core/parser';


