/**
 * Teste de integração do ciclo de vida do Stage.
 *
 * Prova que as funções reais (load, beforePrompt, afterResponse, setState e
 * render) funcionam sem o ambiente do Chub — instanciando `Stage` diretamente
 * com um `InitialData` mock, no ambiente de desenvolvimento (`environment:
 * 'development'`, que usa MockGenerator/MockMessenger e não toca em window).
 */

import { describe, it, expect } from 'vitest';
import React from 'react';
import Stage from './Stage';
import { createInitialState, createDefaultInitState, createDefaultChatState } from './core/state';
import type {
  InitialData,
  Message,
  InitStateType,
  ChatStateType,
  MessageStateType,
  ConfigType,
} from './types/chub';

function buildMockData(): InitialData<InitStateType, ChatStateType, MessageStateType, ConfigType> {
  const initState = createDefaultInitState();
  const chatState = createDefaultChatState();
  const messageState = createInitialState({
    character: { name: 'Hanako', role: '[MILF]', mood: 'Flustered', expression: 'flustered' },
    system: { day: 5, time: '14:32', weather: 'Sunny', location: 'Home', sceneType: 'daily_life' },
  });

  return {
    characters: {},
    users: {},
    config: {
      auditorEnabled: true,
      imgAuditorEnabled: true,
      enableNTR: false,
      enableSexModule: true,
      enableReactionModule: true,
    },
    environment: 'development',
    initState,
    chatState,
    messageState,
  };
}

function makeMessage(content: string, overrides: Partial<Message> = {}): Message {
  return {
    content,
    anonymizedId: '0',
    isBot: false,
    promptForId: '1',
    identity: 'msg-1',
    isMain: true,
    ...overrides,
  };
}

describe('Stage lifecycle (without Chub)', () => {
  it('load() returns success and the three state slices', async () => {
    const stage = new Stage(buildMockData());
    const res = await stage.load();

    expect(res.success).toBe(true);
    expect(res.initState).toBeDefined();
    expect(res.chatState).toBeDefined();
    expect(res.messageState).toBeDefined();
    expect(res.messageState?.character?.name).toBe('Hanako');
  });

  it('beforePrompt() returns a non-empty stageDirections', async () => {
    const stage = new Stage(buildMockData());
    await stage.load();

    const res = await stage.beforePrompt(makeMessage('Hello there'));

    const directions = res.stageDirections ?? '';
    expect(directions.length).toBeGreaterThan(0);
    expect(directions).toContain('EROS STATUS TERMINAL');
  });

  it('afterResponse() updates messageState from ESS markers', async () => {
    const stage = new Stage(buildMockData());
    await stage.load();

    const res = await stage.afterResponse(makeMessage('She blushes. [💕90% 🔥60%]', { isBot: true }));

    expect(res.messageState).toBeDefined();
    expect(res.messageState?.progressions?.affection).toBe(90);
    expect(res.messageState?.progressions?.libido).toBe(60);
    expect(res.chatState).toBeDefined();
  });

  it('setState() replaces internal state (verified via subsequent afterResponse)', async () => {
    const stage = new Stage(buildMockData());
    await stage.load();

    const novo = createInitialState({
      character: { name: 'Sakura' },
      progressions: { affection: 42 },
    });
    await stage.setState(novo);

    // Mensagem sem marcadores ESS -> parser retorna null e o estado interno
    // (substituído por setState) é devolvido intacto.
    const res = await stage.afterResponse(makeMessage('No markers here', { isBot: true }));

    expect(res.messageState?.character?.name).toBe('Sakura');
    expect(res.messageState?.progressions?.affection).toBe(42);
  });

  it('render() returns a valid React element without throwing', () => {
    const stage = new Stage(buildMockData());

    expect(() => stage.render()).not.toThrow();
    const element = stage.render();
    expect(React.isValidElement(element)).toBe(true);
  });
});
