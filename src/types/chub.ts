/**
 * Tipagens de integração com a Stage API do Chub Venus AI.
 *
 * Re-exportamos os tipos oficiais de @chub-ai/stages-ts para garantir
 * compatibilidade total com a assinatura genérica de StageBase.
 */

import type { ReactElement } from 'react';
import type {
  Character,
  InitialData,
  LoadResponse,
  Message,
  StageResponse,
  User,
} from '@chub-ai/stages-ts';
import type { ErosInitState, ErosChatState, ErosStatusState } from './eros-status';
import type { ConfigType as ErosConfigType } from './config';

export type { Character, InitialData, LoadResponse, Message, StageResponse, User };

/** Estado gerado uma única vez por chat (seed/mundo inicial). */
export type InitStateType = ErosInitState;

/** Estado global do chat, persistente entre branches (fog-of-war / mapa). */
export type ChatStateType = ErosChatState;

/** Estado por mensagem — corpo vivo do ESS. */
export type MessageStateType = ErosStatusState;

/** Configurações avançadas do usuário. */
export type ConfigType = ErosConfigType;

/** Assinatura mínima de um renderizador Stage (para referência em testes). */
export type StageRenderer = () => ReactElement | null;
