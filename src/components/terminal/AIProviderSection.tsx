import { useState, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { testOpenRouterConnection } from '@/services/openRouter';
import type { ConfigType } from '@/types/config';

interface ModelInfo {
  id: string;
  name: string;
  context_length: number;
  pricing: { prompt: number; completion: number };
  description?: string;
}

const DEFAULT_MODELS: ModelInfo[] = [
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    context_length: 128000,
    pricing: { prompt: 0.15, completion: 0.6 },
    description: 'Fast and cheap for structured extraction.',
  },
  {
    id: 'anthropic/claude-3.5-haiku',
    name: 'Claude 3.5 Haiku',
    context_length: 200000,
    pricing: { prompt: 0.8, completion: 4 },
    description: 'Great instruction following.',
  },
  {
    id: 'google/gemini-flash-1.5',
    name: 'Gemini Flash 1.5',
    context_length: 1000000,
    pricing: { prompt: 0.075, completion: 0.3 },
    description: 'Huge context window, low price.',
  },
];

interface AIProviderSectionProps {
  apiKey?: string;
  selectedModel?: string;
  onApiKeyChange?: (key: string) => void;
  onModelChange?: (model: string) => void;
  config?: ConfigType | null;
  onConfigChange?: (patch: Partial<ConfigType>) => void;
}

export function AIProviderSection({
  apiKey: propApiKey = '',
  selectedModel: propSelectedModel = '',
  onApiKeyChange,
  onModelChange,
  config,
  onConfigChange,
}: AIProviderSectionProps) {
  const [key, setKey] = useState(propApiKey || config?.openRouterApiKey || '');
  const [selectedModel, setSelectedModel] = useState(propSelectedModel || config?.openRouterModel || '');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'idle' | 'testing' | 'ok' | 'error'>('idle');

  useEffect(() => {
    const nextKey = propApiKey || config?.openRouterApiKey || '';
    const nextModel = propSelectedModel || config?.openRouterModel || '';
    setKey((prev) => (nextKey !== prev ? nextKey : prev));
    setSelectedModel((prev) => (nextModel !== prev ? nextModel : prev));
  }, [propApiKey, propSelectedModel, config?.openRouterApiKey, config?.openRouterModel]);

  const filtered = DEFAULT_MODELS.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.id.toLowerCase().includes(query.toLowerCase()),
  );

  const handleApiKeyInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKey(value);
    onApiKeyChange?.(value);
    onConfigChange?.({ openRouterApiKey: value });
  }, [onApiKeyChange, onConfigChange]);

  const handleModelSelect = useCallback((model: string) => {
    setSelectedModel(model);
    onModelChange?.(model);
    onConfigChange?.({ openRouterModel: model });
  }, [onModelChange, onConfigChange]);

  const handleTest = useCallback(async () => {
    setStatus('testing');
    const model = selectedModel || DEFAULT_MODELS[0]?.id || '';
    const result = await testOpenRouterConnection(key, model);
    setStatus(result.ok ? 'ok' : 'error');
  }, [key, selectedModel]);

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
          <label className="text-[10px] font-mono" style={{ color: 'var(--terminal-text-muted)' }}>OpenRouter API Key</label>
          <Input
            type="password"
            value={key}
            onChange={handleApiKeyInputChange}
            placeholder="sk-or-v1-..."
            className="h-8 text-xs font-mono bg-[var(--terminal-bg-deep)] border-[color-mix(in_srgb,_var(--neon-green)_30%,_transparent)]"
          />
          <div className="text-[9px] font-mono" style={{ color: 'var(--terminal-text-faint)' }}>
            Never commit API keys. Prefer Chub secure config for production.
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-mono" style={{ color: 'var(--terminal-text-muted)' }}>Model</label>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter models..."
            className="h-8 text-xs font-mono bg-[var(--terminal-bg-deep)] border-[color-mix(in_srgb,_var(--neon-green)_30%,_transparent)]"
          />
          <div className="flex flex-wrap gap-1 mt-1">
            {filtered.map((m) => (
              <button
                key={m.id}
                onClick={() => handleModelSelect(m.id)}
                className="text-left rounded p-1.5 flex-1 min-w-[120px] transition-all"
                style={{
                  border: `1px solid ${selectedModel === m.id ? 'var(--neon-green)' : 'var(--terminal-text-ghost)'}`,
                  background: selectedModel === m.id ? 'color-mix(in srgb, var(--neon-green) 10%, transparent)' : 'transparent',
                }}
              >
                <div className="text-[10px] font-mono font-bold" style={{ color: selectedModel === m.id ? 'var(--neon-green)' : 'var(--terminal-text-secondary)' }}>
                  {m.name}
                </div>
                <div className="text-[9px] font-mono" style={{ color: 'var(--terminal-text-muted)' }}>{m.description}</div>
                <div className="text-[9px] font-mono mt-0.5" style={{ color: 'var(--terminal-text-faint)' }}>
                  ctx {Math.round(m.context_length / 1000)}k · ${m.pricing.prompt}/${m.pricing.completion}
                </div>
              </button>
            ))}
          </div>
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
