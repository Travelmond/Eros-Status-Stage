import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AIProviderSection } from './AIProviderSection';
import { callOpenRouter, extractJsonFromResponse } from '@/services/openRouter';
import { parseErosStatusFromJson } from '@/core/parser';
import { toast } from '@/components/ui/use-toast';
import type { ConfigType } from '@/types/config';
import type { ErosStatusState } from '@/types/eros-status';

interface AIConfigPanelProps {
  /**
   * Resultado do processamento:
   * - `Partial<ErosStatusState>` quando a extração por IA teve sucesso;
   * - `string` (texto bruto colado pelo usuário) quando caiu no fallback local.
   */
  onParsed?: (result: Partial<ErosStatusState> | string) => void;
  config?: ConfigType | null;
  onConfigChange?: (patch: Partial<ConfigType>) => void;
}

const EXTRACTION_PROMPT = `You are Eros Status Terminal v3.0 — a structured state extractor.
Read the raw AI roleplay output below and extract all status markers into a single JSON object matching the ESS schema.
Include: system (day, time, weather, location), character (name, role, mood, expression), progressions (affection, obedience, libido, arousal, trust, happiness, embarrassment, love, desire, etc.), clothingSlots, body description, location, inventory items, goals, npcs, sexModule, reactionModule, ntrModule, img_module, ui_commands, meta, audit issues, aiInstructions.
Return ONLY valid JSON. Do not wrap in markdown. If a field is unknown, omit it.`;

export function AIConfigPanel({ onParsed, config, onConfigChange }: AIConfigPanelProps) {
  const [text, setText] = useState('');
  const [raw, setRaw] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fonte de verdade: `config`. Sem estado local duplicado de model/apiKey.
  const apiKey = config?.openRouterApiKey?.trim() || '';
  const model = config?.openRouterModel || 'openai/gpt-4o-mini';

  const handleProcess = async () => {
    if (!text.trim()) {
      toast({ variant: 'destructive', title: 'Empty input', description: 'Paste raw AI output before processing.' });
      return;
    }
    if (!apiKey) {
      toast({ variant: 'destructive', title: 'API key missing', description: 'Enter your OpenRouter API key in the AI Provider section.' });
      return;
    }

    setIsLoading(true);
    toast({ title: 'Processing...', description: 'Calling OpenRouter AI extraction.' });

    try {
      const response = await callOpenRouter({
        apiKey,
        model,
        systemPrompt: EXTRACTION_PROMPT,
        userMessage: text,
      });

      setRaw(response);

      const json = extractJsonFromResponse(response);
      if (!json) {
        toast({ variant: 'destructive', title: 'Extraction failed', description: 'Could not extract valid JSON from AI response. Falling back to local parser.' });
        onParsed?.(text);
        return;
      }

      // Parse apenas uma vez, direto do objeto — sem round-trip stringify/parse.
      const parsedState = parseErosStatusFromJson(json);
      if (!parsedState) {
        toast({ variant: 'destructive', title: 'Parse failed', description: 'AI returned JSON, but no status markers were found.' });
        onParsed?.(text);
        return;
      }

      toast({ title: 'Extraction successful', description: `Parsed ${Object.keys(parsedState).length} status blocks.` });
      onParsed?.(parsedState);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error during AI extraction.';
      toast({ variant: 'destructive', title: 'OpenRouter error', description: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-3 mb-2 space-y-2 pb-2 animate-fade-in-up">
      <AIProviderSection
        config={config}
        onConfigChange={onConfigChange}
      />

      <div
        className="rounded overflow-hidden"
        style={{ border: '1px solid var(--terminal-border)', background: 'var(--terminal-card)' }}
      >
        <div className="px-3 py-1.5" style={{ background: 'color-mix(in srgb, var(--neon-cyan) 8%, transparent)', borderBottom: '1px solid var(--terminal-border)' }}>
          <span className="text-xs font-mono font-bold neon-cyan tracking-widest">🧠 PROCESS AI OUTPUT</span>
        </div>
        <div className="px-3 py-2 space-y-2">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste raw AI output here to extract status markers..."
            className="min-h-[120px] text-xs font-mono bg-[var(--terminal-bg-deep)] border-[var(--terminal-border)]"
          />
          <Button
            onClick={handleProcess}
            disabled={isLoading}
            className="w-full text-xs font-mono bg-[var(--neon-cyan)] text-black hover:bg-[var(--neon-cyan)]/80 disabled:opacity-50"
          >
            {isLoading ? 'PROCESSING...' : 'PROCESS WITH AI'}
          </Button>
        </div>
      </div>

      {raw && (
        <div
          className="rounded overflow-hidden"
          style={{ border: '1px solid color-mix(in srgb, var(--neon-green) 20%, transparent)', background: 'var(--terminal-card)' }}
        >
          <div className="px-3 py-1.5" style={{ background: 'color-mix(in srgb, var(--neon-green) 8%, transparent)', borderBottom: '1px solid color-mix(in srgb, var(--neon-green) 20%, transparent)' }}>
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
