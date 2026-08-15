/**
 * Configurações avançadas do usuário para o Eros Status Terminal.
 * Espelhadas no `config_schema` de public/chub_meta.yaml.
 */

/** Preset de personagem/cenário selecionável no painel de configurações. */
export interface CharacterPreset {
  id: string;
  name: string;
  description?: string;
  /** Estado inicial sugerido (parcial) quando o preset é aplicado. */
  initialStatePatch?: Record<string, unknown>;
}

/** Estilo visual das barras de progressão. */
export type BarStyle = 'bar' | 'ascii' | 'emoji';

/** Tema de interface. */
export type ThemeMode = 'dark' | 'cyberpunk' | 'midnight';

export interface ConfigType {
  /** Modelo OpenRouter usado para extração estruturada de status. */
  openRouterModel?: string;

  /**
   * Chave de API do OpenRouter.
   * NUNCA persista este valor em localStorage ou no message/chat state.
   * O Stage recebe a chave apenas via configuração segura do Chub.
   */
  openRouterApiKey?: string;

  /** Presets de personagem/cenário disponíveis. */
  presets?: CharacterPreset[];

  /** Habilita o módulo NTR e seus gatilhos. */
  enableNTR?: boolean;

  /** Habilita o módulo de status sexual detalhado. */
  enableSexModule?: boolean;

  /** Habilita o módulo de reações/emotes. */
  enableReactionModule?: boolean;

  /** Habilita o auditor de consistência passivo. */
  auditorEnabled?: boolean;

  /** Habilita a auditoria de consistência do módulo de imagem. */
  imgAuditorEnabled?: boolean;

  /** Tema de interface. */
  theme?: ThemeMode;

  /** Estilo de renderização das barras de progressão. */
  barStyle?: BarStyle;

  /** Densidade de informação exibida nos painéis. */
  density?: 'compact' | 'comfortable';

  /** Determina se o terminal inicia minimizado. */
  startMinimized?: boolean;
}
