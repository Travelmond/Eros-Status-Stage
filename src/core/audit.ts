/**
 * ═══════════════════════════════════════════════════════════════════
 * Consistency Auditor — Eros Status Terminal v3.0
 * Auditor PASSIVO. Roda apos o parse e auto-heal do middleware.
 * Detecta inconsistencias nao corrigidas automaticamente.
 * ═══════════════════════════════════════════════════════════════════
 */

import type { ErosStatusState, AuditIssue, AuditSeverity, ClothingSlots } from '../types/eros-status';

export interface AuditOptions {
  imgAuditorEnabled?: boolean;
}

function makeIssue(params: {
  category: AuditIssue['category'];
  field?: string;
  message: string;
  severity: AuditSeverity;
  suggestedValue?: unknown;
}): AuditIssue {
  const id = `${params.category}_${params.field || 'general'}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  return {
    id,
    category: params.category,
    field: params.field,
    message: params.message,
    severity: params.severity,
    suggestedValue: params.suggestedValue,
    ignored: false,
    corrected: false,
  };
}

// ---------------------------------------------------------------------------
// 1. Location consistency
// ---------------------------------------------------------------------------

function checkLocationConsistency(prev: ErosStatusState, next: ErosStatusState): AuditIssue[] {
  const issues: AuditIssue[] = [];
  const prevRoom = prev?.location?.currentRoom?.toLowerCase() || '';
  const nextRoom = next?.location?.currentRoom?.toLowerCase() || '';
  if (!prevRoom || !nextRoom || prevRoom === nextRoom) return issues;

  const proximityMap: Record<string, string[]> = {
    bedroom: ['master bedroom', 'hallway', 'bathroom'],
    'master bedroom': ['bedroom', 'hallway', 'bathroom'],
    kitchen: ['living room', 'hallway', 'garden'],
    'living room': ['kitchen', 'hallway', 'garden'],
    bathroom: ['bedroom', 'hallway', 'master bedroom'],
    hallway: ['bedroom', 'kitchen', 'living room', 'bathroom'],
    office: ['hallway'],
    garden: ['kitchen', 'living room', 'garage'],
  };

  const neighbors = proximityMap[prevRoom] || [];
  const isNearby = neighbors.includes(nextRoom) || nextRoom.includes(prevRoom) || prevRoom.includes(nextRoom);
  if (!isNearby) {
    issues.push(
      makeIssue({
        category: 'location',
        field: 'location.currentRoom',
        message: `Location jumped from "${prev.location.currentRoom}" to "${next.location.currentRoom}" without clear transition.`,
        severity: 'warning',
        suggestedValue: prev.location.currentRoom,
      }),
    );
  }
  return issues;
}

// ---------------------------------------------------------------------------
// 2. Inventory consistency
// ---------------------------------------------------------------------------

function checkInventoryConsistency(prev: ErosStatusState, next: ErosStatusState): AuditIssue[] {
  const issues: AuditIssue[] = [];
  const prevItems = (prev?.inventory?.items || []).map((i) => (typeof i === 'string' ? i : i.name).toLowerCase());
  const nextItems = (next?.inventory?.items || []).map((i) => (typeof i === 'string' ? i : i.name).toLowerCase());
  if (prevItems.length === 0) return issues;

  for (const item of prevItems) {
    if (!nextItems.includes(item)) {
      issues.push(
        makeIssue({
          category: 'inventory',
          field: 'inventory.items',
          message: `Item "${item}" was in inventory last turn but is now gone.`,
          severity: 'warning',
          suggestedValue: item,
        }),
      );
    }
  }
  return issues;
}

// ---------------------------------------------------------------------------
// 3. Clothing consistency
// ---------------------------------------------------------------------------

function checkClothingConsistency(prev: ErosStatusState, next: ErosStatusState): AuditIssue[] {
  const issues: AuditIssue[] = [];
  const prevSlots = prev?.clothingSlots || ({} as ClothingSlots);
  const nextSlots = next?.clothingSlots || ({} as ClothingSlots);
  const slotsToCheck: (keyof ClothingSlots)[] = ['upper', 'lower', 'underwear'];

  for (const slot of slotsToCheck) {
    const prevVal = prevSlots[slot]?.toLowerCase() || '';
    const nextVal = nextSlots[slot]?.toLowerCase() || '';
    if (prevVal && nextVal && prevVal !== 'none' && nextVal !== 'none' && prevVal !== nextVal) {
      issues.push(
        makeIssue({
          category: 'clothing',
          field: `clothingSlots.${slot}`,
          message: `Clothing slot "${slot}" changed from "${prevSlots[slot]}" to "${nextSlots[slot]}" without explicit change scene.`,
          severity: 'warning',
          suggestedValue: prevSlots[slot],
        }),
      );
    }
  }
  return issues;
}

// ---------------------------------------------------------------------------
// 4. Relationship consistency
// ---------------------------------------------------------------------------

function checkRelationshipConsistency(prev: ErosStatusState, next: ErosStatusState): AuditIssue[] {
  const issues: AuditIssue[] = [];
  const prevAff = prev?.progressions?.affection ?? 0;
  const nextAff = next?.progressions?.affection ?? 0;
  const delta = nextAff - prevAff;
  if (Math.abs(delta) >= 30) {
    issues.push(
      makeIssue({
        category: 'relationship',
        field: 'progressions.affection',
        message: `Affection jumped ${delta > 0 ? '+' : ''}${delta}% in one turn (${prevAff}% -> ${nextAff}%). This is unusually large.`,
        severity: delta < 0 ? 'error' : 'warning',
        suggestedValue: Math.round((prevAff + nextAff) / 2),
      }),
    );
  }
  return issues;
}

// ---------------------------------------------------------------------------
// 5. Narrative contradictions
// ---------------------------------------------------------------------------

function checkNarrativeContradictions(_prev: ErosStatusState, next: ErosStatusState): AuditIssue[] {
  const issues: AuditIssue[] = [];
  const mood = (next?.character?.mood || '').toLowerCase();
  const thoughts = (next?.body?.thoughts || '').toLowerCase();
  const affection = next?.progressions?.affection ?? 0;

  if ((mood.includes('angry') || mood.includes('disgust') || mood.includes('hate')) && affection >= 70) {
    issues.push(
      makeIssue({
        category: 'narrative',
        field: 'character.mood',
        message: `Mood is "${next.character.mood}" but affection is high (${affection}%). Possible narrative contradiction.`,
        severity: 'warning',
      }),
    );
  }

  if (thoughts && mood) {
    const negativeWords = ['hate', 'disgust', 'kill', 'despise', 'loathe', 'angry at'];
    const positiveMood = ['happy', 'loving', 'cheerful', 'flustered', 'excited'];
    const hasNegative = negativeWords.some((w) => thoughts.includes(w));
    const hasPositiveMood = positiveMood.some((m) => mood.includes(m));
    if (hasNegative && hasPositiveMood) {
      issues.push(
        makeIssue({
          category: 'narrative',
          field: 'body.thoughts',
          message: `Thoughts contain negative sentiment but mood is "${next.character.mood}". Possible tonal dissonance.`,
          severity: 'warning',
        }),
      );
    }
  }
  return issues;
}

// ---------------------------------------------------------------------------
// 6. IMG consistency
// ---------------------------------------------------------------------------

function checkIMGConsistency(_prev: ErosStatusState, next: ErosStatusState): AuditIssue[] {
  const issues: AuditIssue[] = [];
  const img = next?.img_module;
  if (!img?.scene?.positive) return issues;

  const positive = img.scene.positive.toLowerCase();
  const slots = next.clothingSlots || {};
  const location = (next.location?.currentRoom || '').toLowerCase();

  if (positive.includes('nude') || positive.includes('naked')) {
    const hasClothes = ['upper', 'lower'].some((s) => {
      const val = slots[s as keyof ClothingSlots];
      return val && val.toLowerCase() !== 'none';
    });
    if (hasClothes) {
      issues.push(
        makeIssue({
          category: 'img',
          field: 'img_module.scene.positive',
          message: `Image prompt says "nude/naked" but character is wearing clothes (${slots.upper}, ${slots.lower}).`,
          severity: 'warning',
          suggestedValue: 'keep nude (undress character) | remove nude tag from prompt',
        }),
      );
    }
  }

  const clothingKeywords = ['dress', 'shirt', 'skirt', 'jeans', 'lingerie', 'bikini', 'swimsuit'];
  for (const kw of clothingKeywords) {
    if (positive.includes(kw)) {
      const upperSlot = (slots.upper || '').toLowerCase();
      const lowerSlot = (slots.lower || '').toLowerCase();
      if (!upperSlot.includes(kw) && !lowerSlot.includes(kw) && upperSlot !== 'none' && lowerSlot !== 'none') {
        issues.push(
          makeIssue({
            category: 'img',
            field: 'img_module.scene.positive',
            message: `Image prompt mentions "${kw}" but character's clothing slots show "${slots.upper}" / "${slots.lower}".`,
            severity: 'warning',
            suggestedValue: `use ${slots.upper} | use ${kw} (change character clothing)`,
          }),
        );
        break;
      }
    }
  }

  if (location) {
    const envKeywords: Record<string, string[]> = {
      bedroom: ['bedroom', 'bed'],
      kitchen: ['kitchen'],
      bathroom: ['bathroom', 'shower', 'bath'],
      garden: ['garden', 'outdoor', 'flowers'],
      beach: ['beach', 'ocean', 'sand'],
      forest: ['forest', 'trees'],
    };
    const expectedKws = envKeywords[location] || [];
    if (expectedKws.length > 0) {
      const promptHasLocation = expectedKws.some((kw) => positive.includes(kw));
      if (!promptHasLocation) {
        const otherLocations = Object.entries(envKeywords)
          .filter(([loc]) => loc !== location)
          .map(([, kws]) => kws)
          .flat();
        const mentionedOther = otherLocations.some((kw) => positive.includes(kw));
        if (mentionedOther) {
          issues.push(
            makeIssue({
              category: 'img',
              field: 'img_module.scene.positive',
              message: `Image prompt describes a different location than state (${next.location.currentRoom}).`,
              severity: 'warning',
              suggestedValue: `align to ${next.location.currentRoom} | keep prompt location (character moved)`,
            }),
          );
        }
      }
    }
  }
  return issues;
}

// ---------------------------------------------------------------------------
// 7. Schema consistency (placeholder ativo para issues nao cobertos)
// ---------------------------------------------------------------------------

function checkSchemaConsistency(_prev: ErosStatusState, next: ErosStatusState): AuditIssue[] {
  const issues: AuditIssue[] = [];
  const coerced = next.meta?.coerced_fields || [];
  if (coerced.length > 0) {
    issues.push(
      makeIssue({
        category: 'schema',
        field: 'meta.coerced_fields',
        message: `Middleware coerced ${coerced.length} field(s): ${coerced.join('; ')}.`,
        severity: 'info',
        suggestedValue: coerced,
      }),
    );
  }
  return issues;
}

// ---------------------------------------------------------------------------
// API publica
// ---------------------------------------------------------------------------

export function runAudit(prevState: ErosStatusState, parsedState: ErosStatusState, options: AuditOptions = {}): AuditIssue[] {
  const { imgAuditorEnabled = true } = options;
  if (!prevState || !parsedState) return [];

  const issues: AuditIssue[] = [];
  issues.push(...checkLocationConsistency(prevState, parsedState));
  issues.push(...checkInventoryConsistency(prevState, parsedState));
  issues.push(...checkClothingConsistency(prevState, parsedState));
  issues.push(...checkRelationshipConsistency(prevState, parsedState));
  issues.push(...checkNarrativeContradictions(prevState, parsedState));
  if (imgAuditorEnabled) issues.push(...checkIMGConsistency(prevState, parsedState));
  issues.push(...checkSchemaConsistency(prevState, parsedState));
  return issues;
}

export function filterPendingIssues(issues: AuditIssue[]): AuditIssue[] {
  return (issues || []).filter((i) => !i.ignored && !i.corrected);
}

export function countPendingIssues(issues: AuditIssue[]): { data: number; narrative: number; img: number; schema: number; total: number } {
  const counts = { data: 0, narrative: 0, img: 0, schema: 0, total: 0 };
  for (const i of issues || []) {
    if (i.ignored || i.corrected) continue;
    counts.total++;
    if (['location', 'inventory', 'clothing', 'relationship'].includes(i.category)) counts.data++;
    if (i.category === 'narrative') counts.narrative++;
    if (i.category === 'img') counts.img++;
    if (i.category === 'schema') counts.schema++;
  }
  return counts;
}
