import { describe, it, expect } from 'vitest';
import { parseErosStatusFromMessage } from './parser';

describe('parseErosStatusFromMessage', () => {
  it('returns null for empty text', () => {
    expect(parseErosStatusFromMessage('')).toBeNull();
    expect(parseErosStatusFromMessage('   ')).toBeNull();
  });

  it('parses a JSON block', () => {
    const text = '```json\n{"system": {"day": 3, "time": "14:20"}, "character": {"name": "Hanako"}, "progressions": {"affection": 80}}\n```';
    const result = parseErosStatusFromMessage(text);
    expect(result).not.toBeNull();
    expect(result?.system?.day).toBe(3);
    expect(result?.system?.time).toBe('14:20');
    expect(result?.character?.name).toBe('Hanako');
    expect(result?.progressions?.affection).toBe(80);
  });

  it('parses emoji percentages into progressions', () => {
    const text = '[💕 75%] [🔥 60%] [😳 40%]';
    const result = parseErosStatusFromMessage(text);
    expect(result).not.toBeNull();
    expect(result?.progressions?.affection).toBe(75);
    expect(result?.progressions?.libido).toBe(60);
    expect(result?.progressions?.embarrassment).toBe(40);
  });

  it('detects sex module markers', () => {
    const text = '[💕 50%]\n[SEX_MODULE]\nPosition: missionary\nPace: passionate\nIntensity: 78';
    const result = parseErosStatusFromMessage(text);
    expect(result).not.toBeNull();
    expect(result?.sexModule?.active).toBe(true);
    expect(result?.sexModule?.phase).toBe('sex');
    expect(result?.sexModule?.position).toBe('missionary');
    expect(result?.sexModule?.pace).toBe('passionate');
    expect(result?.sexModule?.sensory_metrics?.intensity).toBe(78);
  });

  it('returns null for plain text without ESS markers', () => {
    const text = 'The sun sets over the quiet neighborhood. She smiles softly.';
    const result = parseErosStatusFromMessage(text);
    expect(result).toBeNull();
  });

  it('extracts aiInstructions when present', () => {
    const text = '[💕 50%] AI Instructions: focus on dialogue, keep it flirty';
    const result = parseErosStatusFromMessage(text);
    expect(result).not.toBeNull();
    expect(result?.aiInstructions).toEqual(['focus on dialogue', 'keep it flirty']);
  });
});
