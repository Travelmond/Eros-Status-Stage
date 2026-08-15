/**
 * Barrel exports dos tipagens do Eros Status Terminal.
 *
 * Nota: `ConfigType` é definido em `./config` e re-aliases em `./chub`;
 * por isso o barrel exporta explicitamente de `./chub` apenas os tipos
 * que não colidem com `./config`.
 */

export * from './config';
export * from './eros-status';
export type {
  Character,
  InitialData,
  LoadResponse,
  Message,
  StageRenderer,
  StageResponse,
  User,
} from './chub';
export type {
  ChatStateType,
  InitStateType,
  MessageStateType,
} from './chub';
