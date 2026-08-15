import { describe, it, expect } from 'vitest';
import { runAudit } from './audit';
import { createInitialState } from './state';

describe('runAudit', () => {
  it('flags location jumps without clear transition', () => {
    const prev = createInitialState({
      location: { currentRoom: 'Bedroom', building: 'Home' },
    });
    const next = createInitialState({
      location: { currentRoom: 'Lake', building: 'Forest' },
    });
    const issues = runAudit(prev, next);
    const locationIssue = issues.find((i) => i.category === 'location');
    expect(locationIssue).toBeDefined();
    expect(locationIssue?.field).toBe('location.currentRoom');
    expect(locationIssue?.severity).toBe('warning');
  });

  it('flags a lost inventory item', () => {
    const prev = createInitialState({
      inventory: { items: [{ name: 'Phone' }, { name: 'Lipstick' }] },
    });
    const next = createInitialState({
      inventory: { items: [{ name: 'Lipstick' }] },
    });
    const issues = runAudit(prev, next);
    const inventoryIssue = issues.find((i) => i.category === 'inventory');
    expect(inventoryIssue).toBeDefined();
    expect(inventoryIssue?.message.toLowerCase()).toContain('phone');
  });

  it('flags narrative contradiction between mood and affection', () => {
    const prev = createInitialState();
    const next = createInitialState({
      character: { mood: 'Angry' },
      progressions: { affection: 80 },
    });
    const issues = runAudit(prev, next);
    const narrativeIssue = issues.find((i) => i.category === 'narrative' && i.field === 'character.mood');
    expect(narrativeIssue).toBeDefined();
    expect(narrativeIssue?.severity).toBe('warning');
  });

  it('returns no issues for a consistent state', () => {
    const prev = createInitialState({
      location: { currentRoom: 'Bedroom' },
      inventory: { items: [{ name: 'Phone' }] },
      character: { mood: 'Happy' },
      progressions: { affection: 60 },
    });
    const next = createInitialState({
      location: { currentRoom: 'Bedroom' },
      inventory: { items: [{ name: 'Phone' }] },
      character: { mood: 'Happy' },
      progressions: { affection: 62 },
    });
    const issues = runAudit(prev, next).filter((i) => !['schema'].includes(i.category));
    expect(issues).toHaveLength(0);
  });
});
