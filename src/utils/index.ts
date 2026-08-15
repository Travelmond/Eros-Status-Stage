/**
 * Utilitarios gerais do Eros Status Terminal.
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge de classes Tailwind + clsx. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Verifica se o ambiente e browser. */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/** Verifica se o Stage esta rodando dentro de um iframe. */
export function isIframe(): boolean {
  return isBrowser() && window.self !== window.top;
}

/** Limita uma string a aproximadamente N tokens (estimativa 4 chars/token). */
export function limitTokens(text: string, maxTokens: number): string {
  if (!text) return '';
  const maxChars = maxTokens * 4;
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars);
}

/** Gera um ID unico simples. */
export function generateId(prefix = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

/** Garante que um valor numerico esteja entre min e max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Delay util para testes/animacoes. */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
