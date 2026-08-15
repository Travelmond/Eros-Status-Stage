import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { callOpenRouter, callOpenRouterSimple, testOpenRouterConnection, OpenRouterError, DEFAULT_TIMEOUT_MS } from './openRouter';

describe('callOpenRouter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('throws when apiKey is empty', async () => {
    await expect(callOpenRouter({ apiKey: '', model: 'openai/gpt-4o-mini', userMessage: 'hi' })).rejects.toThrow(
      'Chave API e obrigatoria.',
    );
  });

  it('throws when model is empty', async () => {
    await expect(callOpenRouter({ apiKey: 'sk-test', model: '', userMessage: 'hi' })).rejects.toThrow(
      'Modelo e obrigatorio.',
    );
  });

  it('throws when userMessage is empty', async () => {
    await expect(callOpenRouter({ apiKey: 'sk-test', model: 'openai/gpt-4o-mini', userMessage: '   ' })).rejects.toThrow(
      'Mensagem do usuario esta vazia.',
    );
  });

  it('returns content from a successful response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Hello from OpenRouter' } }],
      }),
    });

    const result = await callOpenRouter({
      apiKey: 'sk-test',
      model: 'openai/gpt-4o-mini',
      userMessage: 'hello',
    });

    expect(result).toBe('Hello from OpenRouter');
    expect(global.fetch).toHaveBeenCalledOnce();
    const requestInit = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1] as RequestInit;
    expect(requestInit.signal).toBeInstanceOf(AbortSignal);
  });

  it('throws OpenRouterError on HTTP error', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 402,
      json: async () => ({ error: { message: 'Insufficient credits' } }),
    });

    await expect(
      callOpenRouter({ apiKey: 'sk-test', model: 'openai/gpt-4o-mini', userMessage: 'hello' }),
    ).rejects.toThrow('Insufficient credits');
  });

  it('throws OpenRouterError on timeout', async () => {
    global.fetch = vi.fn().mockImplementation(
      (_input: RequestInfo | URL, init?: RequestInit) =>
        new Promise((_resolve, reject) => {
          const signal = init?.signal;
          const onAbort = () => reject(new DOMException('The operation was aborted.', 'AbortError'));
          if (signal) {
            signal.addEventListener('abort', onAbort);
          }
        }),
    );

    const promise = callOpenRouter({ apiKey: 'sk-test', model: 'openai/gpt-4o-mini', userMessage: 'hello' });
    vi.advanceTimersByTime(DEFAULT_TIMEOUT_MS + 100);

    await expect(promise).rejects.toBeInstanceOf(OpenRouterError);
    await expect(promise).rejects.toThrow(/timeout/i);
  });

  it('simple wrapper passes arguments correctly', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'OK' } }],
      }),
    });

    const result = await callOpenRouterSimple('sk-test', 'openai/gpt-4o-mini', 'system prompt', 'user text');
    expect(result).toBe('OK');
  });

  it('testOpenRouterConnection returns ok on success', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'OK' } }],
      }),
    });

    const result = await testOpenRouterConnection('sk-test', 'openai/gpt-4o-mini');
    expect(result.ok).toBe(true);
  });

  it('testOpenRouterConnection returns failure on error', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network failure'));

    const result = await testOpenRouterConnection('sk-test', 'openai/gpt-4o-mini');
    expect(result.ok).toBe(false);
    expect(result.message).toContain('Network failure');
  });
});
