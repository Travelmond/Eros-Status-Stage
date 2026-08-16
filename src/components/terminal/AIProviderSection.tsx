import { useState, useCallback, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  testOpenRouterConnection,
  fetchOpenRouterModels,
  AVAILABLE_MODELS,
} from '@/services/openRouter';
import type { OpenRouterModelInfo } from '@/services/openRouter';
import type { ConfigType } from '@/types/config';

// Fallback offline: converte AVAILABLE_MODELS (id/label/tier) para o shape
// consumido pela UI (OpenRouterModelInfo). Fallback nao tem context/pricing.
const FALLBACK_MODELS: OpenRouterModelInfo[] = AVAILABLE_MODELS.map((m) => ({
  id: m.id,
  name: m.label,
}));

/** `128000` -> `128k`; `1000000` -> `1000k`. Retorna null se invalido. */
function formatContextLength(n?: number): string | null {
  if (typeof n !== 'number' || !Number.isFinite(n) || n <= 0) return null;
  return n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`;
}

/** Converte preco por token em preco por milhao (numerico). */
function toPerMillion(v?: string | number): number | null {
  if (v == null) return null;
  const num = typeof v === 'string' ? Number(v) : v;
  if (!Number.isFinite(num)) return null;
  return num * 1_000_000;
}

/** `0.00000015` -> `$0.15/M`; `0.0000006` -> `$0.60/M`. */
function formatPrice(v?: string | number): string | null {
  const perM = toPerMillion(v);
  if (perM == null) return null;
  const decimals = perM < 0.01 ? 4 : 2;
  return `$${perM.toFixed(decimals)}/M`;
}

/** Linha de metadados: `ctx 128k · $0.15/M in · $0.60/M out`. */
function ModelMeta({ model }: { model: OpenRouterModelInfo }) {
  const parts: string[] = [];
  const ctx = formatContextLength(model.context_length);
  if (ctx) parts.push(`ctx ${ctx}`);
  const inPrice = formatPrice(model.pricing?.prompt);
  const outPrice = formatPrice(model.pricing?.completion);
  if (inPrice || outPrice) parts.push(`${inPrice ?? '—'} in · ${outPrice ?? '—'} out`);
  if (parts.length === 0) return null;
  return (
    <div className="text-[9px] font-mono mt-0.5" style={{ color: 'var(--terminal-text-faint)' }}>
      {parts.join(' · ')}
    </div>
  );
}

interface AIProviderSectionProps {
  config?: ConfigType | null;
  onConfigChange?: (patch: Partial<ConfigType>) => void;
}

export function AIProviderSection({ config, onConfigChange }: AIProviderSectionProps) {
  // Fonte de verdade: `config.openRouterModel` (derivado, sem estado duplicado).
  // `key` e apenas input transitorio, propagado imediatamente para `onConfigChange`.
  const [key, setKey] = useState(config?.openRouterApiKey || '');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'idle' | 'testing' | 'ok' | 'error'>('idle');
  const [showKey, setShowKey] = useState(false);

  // Lista dinamica de modelos (OpenRouter) com fallback offline.
  const [models, setModels] = useState<OpenRouterModelInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const selectedModel = config?.openRouterModel || '';
  const rememberApiKey = config?.rememberApiKey === true;

  // Validacao de formato: nao-bloqueante, apenas aviso visual.
  const trimmedKey = key.trim();
  const keyInvalid = trimmedKey !== '' && !trimmedKey.startsWith('sk-or-');

  useEffect(() => {
    const nextKey = config?.openRouterApiKey || '';
    setKey((prev) => (nextKey !== prev ? nextKey : prev));
  }, [config?.openRouterApiKey]);

  useEffect(() => {
    let cancelled = false;
    async function loadModels() {
      try {
        const list = await fetchOpenRouterModels();
        if (cancelled) return;
        setModels(list.length > 0 ? list : FALLBACK_MODELS);
        setLoadError(null);
      } catch (err) {
        if (cancelled) return;
        setLoadError(err instanceof Error ? err.message : 'Failed to load models');
        setModels(FALLBACK_MODELS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadModels();
    return () => {
      cancelled = true;
    };
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!normalizedQuery) return models;
    return models.filter(
      (m) =>
        m.name.toLowerCase().includes(normalizedQuery) ||
        m.id.toLowerCase().includes(normalizedQuery),
    );
  }, [models, normalizedQuery]);

  const showCustomOption = normalizedQuery !== '' && filtered.length === 0;

  const handleApiKeyInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKey(value);
    onConfigChange?.({ openRouterApiKey: value });
  }, [onConfigChange]);

  const handleModelSelect = useCallback((modelId: string) => {
    onConfigChange?.({ openRouterModel: modelId });
  }, [onConfigChange]);

  const handleRememberChange = useCallback((value: boolean) => {
    onConfigChange?.({ rememberApiKey: value });
  }, [onConfigChange]);

  const handleTest = useCallback(async () => {
    setStatus('testing');
    const model = selectedModel || models[0]?.id || FALLBACK_MODELS[0]?.id || '';
    const result = await testOpenRouterConnection(key, model);
    setStatus(result.ok ? 'ok' : 'error');
  }, [key, selectedModel, models]);

  return (
    <div
      className="rounded overflow-hidden"
      style={{ border: '1px solid color-mix(in srgb, var(--neon-green) 20%, transparent)', background: 'var(--terminal-card)' }}
    >
      <div className="px-3 py-1.5" style={{ background: 'color-mix(in srgb, var(--neon-green) 8%, transparent)', borderBottom: '1px solid color-mix(in srgb, var(--neon-green) 20%, transparent)' }}>
        <span className="text-xs font-mono font-bold neon-green tracking-widest">🤖 AI PROVIDER</span>
      </div>
      <div className="px-3 py-2 space-y-2">
        <div className="space-y-1">
          <label htmlFor="or-api-key" className="text-[10px] font-mono" style={{ color: 'var(--terminal-text-muted)' }}>OpenRouter API Key</label>
          <div className="relative">
            <Input
              id="or-api-key"
              type={showKey ? 'text' : 'password'}
              value={key}
              onChange={handleApiKeyInputChange}
              placeholder="sk-or-v1-..."
              autoComplete="off"
              className="h-8 text-xs font-mono bg-[var(--terminal-bg-deep)] border-[color-mix(in_srgb,_var(--neon-green)_30%,_transparent)] pr-8"
            />
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              aria-label={showKey ? 'Ocultar chave' : 'Mostrar chave'}
              aria-pressed={showKey}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 inline-flex items-center justify-center rounded transition-colors"
              style={{ color: 'var(--terminal-text-muted)' }}
            >
              {showKey ? '🙈' : '👁️'}
            </button>
          </div>
          {keyInvalid && (
            <div className="text-[9px] font-mono" style={{ color: 'var(--neon-pink)' }} role="alert">
              Chave inválida — deve começar com 'sk-or-'
            </div>
          )}
          <div className="text-[9px] font-mono" style={{ color: 'var(--terminal-text-faint)' }}>
            Never commit API keys. Prefer Chub secure config for production.
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Switch
              id="or-remember-key"
              checked={rememberApiKey}
              onCheckedChange={handleRememberChange}
            />
            <label htmlFor="or-remember-key" className="text-[10px] font-mono cursor-pointer" style={{ color: 'var(--terminal-text-secondary)' }}>
              Lembrar chave nesta máquina
            </label>
          </div>
          {rememberApiKey && (
            <div className="text-[9px] font-mono" style={{ color: 'var(--neon-pink)' }} role="note">
              ⚠️ armazena em localStorage deste navegador
            </div>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="or-model-search" className="text-[10px] font-mono" style={{ color: 'var(--terminal-text-muted)' }}>Model</label>
          <Input
            id="or-model-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search models or type a custom model ID..."
            aria-label="Search OpenRouter models"
            className="h-8 text-xs font-mono bg-[var(--terminal-bg-deep)] border-[color-mix(in_srgb,_var(--neon-green)_30%,_transparent)]"
          />

          {loadError && (
            <div className="text-[9px] font-mono" style={{ color: 'var(--neon-pink)' }} role="alert">
              Couldn&apos;t fetch models ({loadError}). Showing offline fallback.
            </div>
          )}

          {loading ? (
            <div className="py-2 text-[10px] font-mono" style={{ color: 'var(--terminal-text-muted)' }} role="status" aria-live="polite">
              Loading models...
            </div>
          ) : (
            <div className="flex flex-wrap gap-1 mt-1">
              {filtered.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleModelSelect(m.id)}
                  aria-pressed={selectedModel === m.id}
                  className="text-left rounded p-1.5 flex-1 min-w-[120px] transition-all"
                  style={{
                    border: `1px solid ${selectedModel === m.id ? 'var(--neon-green)' : 'var(--terminal-text-ghost)'}`,
                    background: selectedModel === m.id ? 'color-mix(in srgb, var(--neon-green) 10%, transparent)' : 'transparent',
                  }}
                >
                  <div className="text-[10px] font-mono font-bold" style={{ color: selectedModel === m.id ? 'var(--neon-green)' : 'var(--terminal-text-secondary)' }}>
                    {m.name}
                  </div>
                  {m.description && (
                    <div className="text-[9px] font-mono" style={{ color: 'var(--terminal-text-muted)' }}>{m.description}</div>
                  )}
                  <ModelMeta model={m} />
                </button>
              ))}

              {showCustomOption && (
                <button
                  type="button"
                  onClick={() => handleModelSelect(query.trim())}
                  aria-pressed={selectedModel === query.trim()}
                  className="text-left rounded p-1.5 flex-1 min-w-[120px] transition-all"
                  style={{
                    border: `1px solid ${selectedModel === query.trim() ? 'var(--neon-pink)' : 'var(--terminal-text-ghost)'}`,
                    background: selectedModel === query.trim() ? 'color-mix(in srgb, var(--neon-pink) 10%, transparent)' : 'transparent',
                  }}
                >
                  <div className="text-[10px] font-mono font-bold" style={{ color: 'var(--neon-pink)' }}>
                    Use custom model: {query.trim()}
                  </div>
                  <div className="text-[9px] font-mono" style={{ color: 'var(--terminal-text-muted)' }}>
                    Set this exact ID as the model (new/alias not listed yet).
                  </div>
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2" aria-live="polite" aria-atomic="true">
          <Button
            size="sm"
            variant="outline"
            onClick={handleTest}
            className="text-xs font-mono border-[color-mix(in_srgb,_var(--neon-green)_40%,_transparent)] text-[var(--neon-green)]"
            aria-busy={status === 'testing'}
          >
            {status === 'testing' ? 'Testing...' : 'Test Connection'}
          </Button>
          {status === 'ok' && <Badge className="bg-[var(--neon-green)] text-black text-[10px]">OK</Badge>}
          {status === 'error' && <Badge className="bg-[var(--neon-pink)] text-white text-[10px]">Failed</Badge>}
        </div>
      </div>
    </div>
  );
}
