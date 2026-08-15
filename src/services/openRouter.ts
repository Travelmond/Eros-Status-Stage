/**
 * ═══════════════════════════════════════════════════════════════════
 * OpenRouter Service — Eros Status Terminal v3.0
 *
 * Servico dedicado para comunicacao com a API do OpenRouter.
 * 100% client-side, usa fetch nativo.
 * Nunca persista a API key em localStorage.
 * ═══════════════════════════════════════════════════════════════════
 */

export const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';
export const DEFAULT_TEMPERATURE = 0.25;
export const DEFAULT_MAX_TOKENS = 3000;
export const DEFAULT_TIMEOUT_MS = 30000;

export interface OpenRouterModel {
  id: string;
  label: string;
  tier: 'economy' | 'mid' | 'premium';
}

export const AVAILABLE_MODELS: OpenRouterModel[] = [
  { id: 'openai/gpt-4o-mini', label: 'GPT-4o Mini (rapido, barato)', tier: 'economy' },
  { id: 'openai/gpt-4o', label: 'GPT-4o (melhor qualidade)', tier: 'premium' },
  { id: 'anthropic/claude-3-haiku', label: 'Claude 3 Haiku (equilibrado)', tier: 'mid' },
  { id: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet (premium)', tier: 'premium' },
  { id: 'meta-llama/llama-3.1-70b-instruct', label: 'LLaMA 3.1 70B (open-source)', tier: 'mid' },
  { id: 'mistralai/mixtral-8x7b-instruct', label: 'Mixtral 8x7B (veloz)', tier: 'economy' },
  { id: 'google/gemini-flash-1.5', label: 'Gemini Flash 1.5 (multimodal)', tier: 'mid' },
  { id: 'nousresearch/hermes-3-llama-3.1-70b', label: 'Hermes 3 70B (roleplay)', tier: 'mid' },
];

export class OpenRouterError extends Error {
  status: number;
  raw: unknown;
  constructor(message: string, status: number, raw: unknown) {
    super(message);
    this.name = 'OpenRouterError';
    this.status = status;
    this.raw = raw;
  }
}

export interface CallOpenRouterOptions {
  apiKey: string;
  model: string;
  systemPrompt?: string;
  userMessage: string;
  temperature?: number;
  maxTokens?: number;
  appTitle?: string;
}

export async function callOpenRouter({
  apiKey,
  model,
  systemPrompt,
  userMessage,
  temperature = DEFAULT_TEMPERATURE,
  maxTokens = DEFAULT_MAX_TOKENS,
  appTitle = 'Eros Status Terminal',
}: CallOpenRouterOptions): Promise<string> {
  if (!apiKey) throw new OpenRouterError('Chave API e obrigatoria.', 401, null);
  if (!model) throw new OpenRouterError('Modelo e obrigatorio.', 400, null);
  if (!userMessage?.trim()) throw new OpenRouterError('Mensagem do usuario esta vazia.', 400, null);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(OPENROUTER_BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://chub.ai',
        'X-Title': appTitle,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt || '' },
          { role: 'user', content: userMessage },
        ],
        temperature,
        max_tokens: maxTokens,
      }),
      signal: controller.signal,
    });

    const raw = await response.json().catch(() => ({}));
    clearTimeout(timeoutId);
    if (!response.ok) {
      const msg = (raw as { error?: { message?: string } })?.error?.message || `HTTP ${response.status}`;
      throw new OpenRouterError(msg, response.status, raw);
    }
    const content = (raw as { choices?: Array<{ message?: { content?: string } }> })?.choices?.[0]?.message?.content;
    if (!content) throw new OpenRouterError('Resposta vazia da API.', 200, raw);
    return content;
  } catch (err) {
    clearTimeout(timeoutId);
    if ((err instanceof Error || (err && typeof err === 'object' && 'name' in err)) && (err as { name?: string }).name === 'AbortError') {
      throw new OpenRouterError('Request timeout: OpenRouter did not respond within 30s.', 408, err);
    }
    throw err;
  }
}

/**
 * Wrapper compativel com a assinatura de alto nivel do contrato T02:
 * callOpenRouter(apiKey, model, jailbreak?, text)
 */
export async function callOpenRouterSimple(
  apiKey: string,
  model: string,
  jailbreak: string | undefined,
  text: string,
): Promise<string> {
  return callOpenRouter({
    apiKey,
    model,
    systemPrompt: jailbreak,
    userMessage: text,
  });
}

export function extractJsonFromResponse(rawResponse?: string | null): Record<string, unknown> | null {
  if (!rawResponse) return null;
  const fenced = rawResponse.match(/```json\s*([\s\S]*?)```/);
  if (fenced) {
    try {
      return JSON.parse(fenced[1]) as Record<string, unknown>;
    } catch {
      /* continua */
    }
  }
  const plain = rawResponse.match(/(\{[\s\S]+\})/);
  if (plain) {
    try {
      return JSON.parse(plain[1]) as Record<string, unknown>;
    } catch {
      /* continua */
    }
  }
  return null;
}

export async function testOpenRouterConnection(apiKey: string, model: string): Promise<{ ok: boolean; message: string }> {
  try {
    const reply = await callOpenRouter({
      apiKey,
      model,
      systemPrompt: 'You are a connection test. Reply with exactly "OK".',
      userMessage: 'Test.',
      temperature: 0,
      maxTokens: 10,
    });
    return { ok: true, message: `✓ Conectado — ${model.split('/').pop()} — "${reply.trim().slice(0, 30)}"` };
  } catch (err) {
    return { ok: false, message: `✗ ${(err as Error).message}` };
  }
}
