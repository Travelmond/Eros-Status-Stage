import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AIProviderSection } from './AIProviderSection';

interface AIConfigPanelProps {
  onParsed?: (text: string) => void;
}

export function AIConfigPanel({ onParsed }: AIConfigPanelProps) {
  const [text, setText] = useState('');
  const [model, setModel] = useState('openai/gpt-4o-mini');
  const [apiKey, setApiKey] = useState('');
  const [raw, setRaw] = useState('');

  const handleProcess = () => {
    // Stub: apenas repassa o texto bruto para o callback de parse.
    // A extração via OpenRouter será implementada no contrato T02.
    setRaw(`// Stub response\n${text.slice(0, 400)}...`);
    onParsed?.(text);
  };

  return (
    <div className="mx-3 mb-2 space-y-2 pb-2 animate-fade-in-up">
      <AIProviderSection apiKey={apiKey} selectedModel={model} onApiKeyChange={setApiKey} onModelChange={setModel} />

      <div
        className="rounded overflow-hidden"
        style={{ border: '1px solid var(--terminal-border)', background: 'var(--terminal-card)' }}
      >
        <div className="px-3 py-1.5" style={{ background: 'var(--neon-cyan)08', borderBottom: '1px solid var(--terminal-border)' }}>
          <span className="text-xs font-mono font-bold neon-cyan tracking-widest">🧠 PROCESS AI OUTPUT</span>
        </div>
        <div className="px-3 py-2 space-y-2">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste raw AI output here to extract status markers..."
            className="min-h-[120px] text-xs font-mono bg-black/30 border-[var(--terminal-border)]"
          />
          <Button
            onClick={handleProcess}
            className="w-full text-xs font-mono bg-[var(--neon-cyan)] text-black hover:bg-[var(--neon-cyan)]/80"
          >
            PROCESS WITH AI
          </Button>
        </div>
      </div>

      {raw && (
        <div
          className="rounded overflow-hidden"
          style={{ border: '1px solid var(--neon-green)20', background: 'var(--terminal-card)' }}
        >
          <div className="px-3 py-1.5" style={{ background: 'var(--neon-green)08', borderBottom: '1px solid var(--neon-green)20' }}>
            <span className="text-xs font-mono font-bold neon-green tracking-widest">📄 RAW RESPONSE</span>
          </div>
          <pre
            className="px-3 py-2 text-xs font-mono whitespace-pre-wrap break-words"
            style={{ color: 'var(--neon-green)', fontSize: '10px', maxHeight: '160px', overflow: 'auto' }}
          >
            {raw}
          </pre>
        </div>
      )}
    </div>
  );
}
