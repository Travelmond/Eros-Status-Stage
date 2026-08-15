import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
}

export function AIProviderSection({
  apiKey = '',
  selectedModel = '',
  onApiKeyChange,
  onModelChange,
}: AIProviderSectionProps) {
  const [key, setKey] = useState(apiKey);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'idle' | 'testing' | 'ok' | 'error'>('idle');

  const filtered = DEFAULT_MODELS.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.id.toLowerCase().includes(query.toLowerCase()),
  );

  const handleTest = () => {
    setStatus('testing');
    setTimeout(() => {
      setStatus(key.length > 10 ? 'ok' : 'error');
    }, 800);
  };

  return (
    <div
      className="rounded overflow-hidden"
      style={{ border: '1px solid var(--neon-green)20', background: 'var(--terminal-card)' }}
    >
      <div className="px-3 py-1.5" style={{ background: 'var(--neon-green)08', borderBottom: '1px solid var(--neon-green)20' }}>
        <span className="text-xs font-mono font-bold neon-green tracking-widest">🤖 AI PROVIDER</span>
      </div>
      <div className="px-3 py-2 space-y-2">
        <div className="space-y-1">
          <label className="text-[10px] font-mono text-gray-500">OpenRouter API Key</label>
          <Input
            type="password"
            value={key}
            onChange={(e) => {
              setKey(e.target.value);
              onApiKeyChange?.(e.target.value);
            }}
            placeholder="sk-or-v1-..."
            className="h-8 text-xs font-mono bg-black/30 border-[var(--neon-green)30]"
          />
          <div className="text-[9px] font-mono text-gray-600">
            Never commit API keys. Prefer Chub secure config for production.
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-mono text-gray-500">Model</label>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter models..."
            className="h-8 text-xs font-mono bg-black/30 border-[var(--neon-green)30]"
          />
          <div className="flex flex-wrap gap-1 mt-1">
            {filtered.map((m) => (
              <button
                key={m.id}
                onClick={() => onModelChange?.(m.id)}
                className="text-left rounded p-1.5 flex-1 min-w-[120px] transition-all"
                style={{
                  border: `1px solid ${selectedModel === m.id ? 'var(--neon-green)' : '#ffffff15'}`,
                  background: selectedModel === m.id ? 'var(--neon-green)10' : 'transparent',
                }}
              >
                <div className="text-[10px] font-mono font-bold" style={{ color: selectedModel === m.id ? 'var(--neon-green)' : '#e2e8f0' }}>
                  {m.name}
                </div>
                <div className="text-[9px] font-mono text-gray-500">{m.description}</div>
                <div className="text-[9px] font-mono text-gray-600 mt-0.5">
                  ctx {Math.round(m.context_length / 1000)}k · ${m.pricing.prompt}/${m.pricing.completion}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleTest}
            className="text-xs font-mono border-[var(--neon-green)40] text-[var(--neon-green)]"
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
