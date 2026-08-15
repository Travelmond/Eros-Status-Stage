# 08 — src/lib (Sistemas: memória, auditor, relacionamentos, posições, utils)

> Parte 8/10. Código-fonte COMPLETO dos sistemas de suporte.

---

### `src/lib/memoryService.js`

```js
/**
 * Memory Service — Eros Status Terminal
 * MEMÓRIA HÍBRIDA: Curto prazo (20 turnos) + Longo prazo (condensado).
 * - shortTermTurns: Array dos últimos 20 turnos (snapshot bruto do estado).
 * - longTermMemory.facts:  JSON estruturado por entidade (NPCs, locais, items).
 * - longTermMemory.diary:  Resumo narrativo cronológico (opcional).
 * Modos: 'narrative' (diário), 'entities' (fatos), 'hybrid' (recomendado).
 * ✅ JavaScript puro — persiste em localStorage.
 */
const STORAGE_KEY = 'eros_memory_store';
const DEFAULT_SHORT_TERM_LIMIT = 20;

export function initMemory(config = {}) {
  return {
    mode: config.mode || 'hybrid',
    shortTermTurns: [],
    longTermMemory: { facts: {}, diary: [] },
    registerDiary: config.registerDiary !== false,
    shortTermLimit: config.shortTermLimit || DEFAULT_SHORT_TERM_LIMIT,
  };
}

export function loadMemory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { const parsed = JSON.parse(raw); return { ...initMemory(), ...parsed }; }
  } catch (e) { console.warn('[memoryService] load failed:', e); }
  return initMemory();
}

export function saveMemory(memory) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(memory)); }
  catch (e) { console.warn('[memoryService] save failed:', e); }
}

export function addTurn(memory, turnId, stateSnapshot) {
  const mem = { ...memory, shortTermTurns: [...memory.shortTermTurns], longTermMemory: { facts: { ...memory.longTermMemory.facts }, diary: [...memory.longTermMemory.diary] } };
  mem.shortTermTurns.push({ turn_id: turnId, state: stateSnapshot, timestamp: Date.now() });
  while (mem.shortTermTurns.length > mem.shortTermLimit) { const oldest = mem.shortTermTurns.shift(); _condenseIntoLongTerm(mem, oldest); }
  saveMemory(mem);
  return mem;
}

function _condenseIntoLongTerm(memory, turn) {
  const s = turn.state;
  if (!s) return;
  const charName = s.character?.name;
  if (charName && charName !== 'Unknown') {
    memory.longTermMemory.facts[charName] = {
      lastKnownLocation: s.location?.currentRoom || '', lastKnownMood: s.character?.mood || '',
      affection: s.progressions?.affection ?? 0, obedience: s.progressions?.obedience ?? 0, corruption: s.progressions?.corruption ?? 0,
      clothing: s.clothingSlots || {}, updatedAt: turn.turn_id,
    };
  }
  for (const npc of (s.npcs || [])) {
    if (!npc.name) continue;
    const key = `npc_${npc.name}`;
    const existing = memory.longTermMemory.facts[key] || {};
    memory.longTermMemory.facts[key] = { ...existing, relation: npc.relation || existing.relation || '', mood: npc.mood || existing.mood || '', updatedAt: turn.turn_id };
  }
  for (const item of (s.inventory?.items || [])) {
    const key = `item_${item.toLowerCase()}`;
    memory.longTermMemory.facts[key] = { owned: true, lastHolder: charName || 'unknown', updatedAt: turn.turn_id };
  }
  if (memory.registerDiary) {
    const day = s.system?.day || '?';
    const time = s.system?.time || '??:??';
    const mood = s.character?.mood || 'unknown';
    const loc = s.location?.currentRoom || 'unknown';
    const aff = s.progressions?.affection ?? 0;
    const summary = `Day ${day} ${time} | ${charName || '?'} @ ${loc} | mood:${mood} aff:${aff}%`;
    memory.longTermMemory.diary.push({ turn_id: turn.turn_id, day, time, summary });
    if (memory.longTermMemory.diary.length > 200) memory.longTermMemory.diary = memory.longTermMemory.diary.slice(-200);
  }
}

export function condenseNow(memory) {
  const mem = { ...memory, shortTermTurns: [...memory.shortTermTurns], longTermMemory: { facts: { ...memory.longTermMemory.facts }, diary: [...memory.longTermMemory.diary] } };
  while (mem.shortTermTurns.length > 0) { const oldest = mem.shortTermTurns.shift(); _condenseIntoLongTerm(mem, oldest); }
  saveMemory(mem);
  return mem;
}

export function clearMemory() { const mem = initMemory(); saveMemory(mem); return mem; }

export function buildSystemPromptContext(memory) {
  if (!memory) return '';
  const lines = [];
  const showDiary = memory.mode === 'narrative' || memory.mode === 'hybrid';
  const showFacts = memory.mode === 'entities' || memory.mode === 'hybrid';
  if (showDiary && memory.longTermMemory.diary.length > 0) {
    lines.push('── NARRATIVE DIARY (long-term memory) ──');
    const recent = memory.longTermMemory.diary.slice(-15);
    for (const entry of recent) lines.push(`[${entry.turn_id}] ${entry.summary}`);
    lines.push('');
  }
  if (showFacts && Object.keys(memory.longTermMemory.facts).length > 0) {
    lines.push('── KNOWN FACTS (entity memory) ──');
    for (const [name, facts] of Object.entries(memory.longTermMemory.facts)) {
      const factStr = Object.entries(facts).filter(([k]) => k !== 'updatedAt').map(([k, v]) => `${k}:${v}`).join(', ');
      lines.push(`${name}: ${factStr}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

export function getMemoryStats(memory) {
  return {
    shortTermCount: memory?.shortTermTurns?.length || 0,
    shortTermLimit: memory?.shortTermLimit || DEFAULT_SHORT_TERM_LIMIT,
    longTermFacts: Object.keys(memory?.longTermMemory?.facts || {}).length,
    longTermDiary: memory?.longTermMemory?.diary?.length || 0,
    mode: memory?.mode || 'hybrid',
  };
}
```

### `src/lib/consistencyAuditor.js`

```js
/**
 * Consistency Auditor — Eros Status Terminal
 * Auditor PASSIVO. Roda APÓS o parse + auto-heal do middleware.
 * Detecta inconsistências que NÃO puderam ser corrigidas automaticamente.
 * Tipos: 'data' (loc/inv/clothing/rel), 'narrative' (mood vs thoughts), 'img' (prompt vs state).
 * ✅ JavaScript puro — sem dependências.
 */
function makeIssue({ type, category, field, description, originalValue, suggestedValues = [], severity = 'warning', autoFixable = false }) {
  return { id: `${category}_${field}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, type, category, field, description, originalValue, suggestedValues, severity, autoFixable, status: 'pending', createdAt: Date.now() };
}

function checkLocationConsistency(prev, next) {
  const issues = [];
  const prevRoom = prev?.location?.currentRoom?.toLowerCase() || '';
  const nextRoom = next?.location?.currentRoom?.toLowerCase() || '';
  if (!prevRoom || !nextRoom || prevRoom === nextRoom) return issues;
  const proximityMap = {
    'bedroom': ['master bedroom', 'hallway', 'bathroom'], 'master bedroom': ['bedroom', 'hallway', 'bathroom'],
    'kitchen': ['living room', 'hallway', 'garden'], 'living room': ['kitchen', 'hallway', 'garden'],
    'bathroom': ['bedroom', 'hallway', 'master bedroom'], 'hallway': ['bedroom', 'kitchen', 'living room', 'bathroom'],
    'office': ['hallway'], 'garden': ['kitchen', 'living room', 'garage'],
  };
  const neighbors = proximityMap[prevRoom] || [];
  const isNearby = neighbors.includes(nextRoom) || nextRoom.includes(prevRoom) || prevRoom.includes(nextRoom);
  if (!isNearby) {
    issues.push(makeIssue({ type: 'data', category: 'location_jump', field: 'location.currentRoom', description: `Location jumped from "${prev.location.currentRoom}" to "${next.location.currentRoom}" without clear transition.`, originalValue: next.location.currentRoom, suggestedValues: [prev.location.currentRoom, next.location.currentRoom], severity: 'warning' }));
  }
  return issues;
}

function checkInventoryConsistency(prev, next) {
  const issues = [];
  const prevItems = (prev?.inventory?.items || []).map(i => i.toLowerCase());
  const nextItems = (next?.inventory?.items || []).map(i => i.toLowerCase());
  if (prevItems.length === 0) return issues;
  for (const item of prevItems) {
    if (!nextItems.includes(item)) {
      issues.push(makeIssue({ type: 'data', category: 'inventory_contradiction', field: `inventory.items`, description: `Item "${item}" was in inventory last turn but is now gone.`, originalValue: item, suggestedValues: [item, 'removed'], severity: 'warning' }));
    }
  }
  return issues;
}

function checkClothingConsistency(prev, next) {
  const issues = [];
  const prevSlots = prev?.clothingSlots || {};
  const nextSlots = next?.clothingSlots || {};
  const slotsToCheck = ['upper', 'lower', 'underwear'];
  for (const slot of slotsToCheck) {
    const prevVal = prevSlots[slot]?.toLowerCase() || '';
    const nextVal = nextSlots[slot]?.toLowerCase() || '';
    if (prevVal && nextVal && prevVal !== 'none' && nextVal !== 'none' && prevVal !== nextVal) {
      issues.push(makeIssue({ type: 'data', category: 'clothing_mismatch', field: `clothingSlots.${slot}`, description: `Clothing slot "${slot}" changed from "${prevSlots[slot]}" to "${nextSlots[slot]}" without explicit change scene.`, originalValue: nextSlots[slot], suggestedValues: [prevSlots[slot], nextSlots[slot]], severity: 'warning' }));
    }
  }
  return issues;
}

function checkRelationshipConsistency(prev, next) {
  const issues = [];
  const prevAff = prev?.progressions?.affection ?? 0;
  const nextAff = next?.progressions?.affection ?? 0;
  const delta = Math.abs(nextAff - prevAff);
  if (delta >= 30) {
    issues.push(makeIssue({ type: 'data', category: 'relationship_shift', field: 'progressions.affection', description: `Affection jumped ${nextAff > prevAff ? '+' : ''}${nextAff - prevAff}% in one turn (${prevAff}% → ${nextAff}%). This is unusually large.`, originalValue: nextAff, suggestedValues: [String(prevAff), String(nextAff), String(Math.round((prevAff + nextAff) / 2))], severity: nextAff > prevAff ? 'warning' : 'critical' }));
  }
  return issues;
}

function checkNarrativeContradictions(prev, next) {
  const issues = [];
  const mood = (next?.character?.mood || '').toLowerCase();
  const thoughts = (next?.body?.thoughts || '').toLowerCase();
  const affection = next?.progressions?.affection ?? 0;
  if ((mood.includes('angry') || mood.includes('disgust') || mood.includes('hate')) && affection >= 70) {
    issues.push(makeIssue({ type: 'narrative', category: 'narrative_contradiction', field: 'character.mood', description: `Mood is "${next.character.mood}" but affection is high (${affection}%). Possible narrative contradiction.`, originalValue: next.character.mood, suggestedValues: [], severity: 'warning' }));
  }
  if (thoughts && mood) {
    const negativeWords = ['hate', 'disgust', 'kill', 'despise', 'loathe', 'angry at'];
    const positiveMood = ['happy', 'loving', 'cheerful', 'flustered', 'excited'];
    const hasNegative = negativeWords.some(w => thoughts.includes(w));
    const hasPositiveMood = positiveMood.some(m => mood.includes(m));
    if (hasNegative && hasPositiveMood) {
      issues.push(makeIssue({ type: 'narrative', category: 'narrative_contradiction', field: 'body.thoughts', description: `Thoughts contain negative sentiment but mood is "${next.character.mood}". Possible tonal dissonance.`, originalValue: next.body.thoughts, suggestedValues: [], severity: 'warning' }));
    }
  }
  return issues;
}

function checkIMGConsistency(prev, next) {
  const issues = [];
  const img = next?.img_module;
  if (!img?.scene?.positive) return issues;
  const positive = img.scene.positive.toLowerCase();
  const slots = next.clothingSlots || {};
  const location = (next.location?.currentRoom || '').toLowerCase();
  if (positive.includes('nude') || positive.includes('naked')) {
    const hasClothes = ['upper', 'lower'].some(s => slots[s] && slots[s].toLowerCase() !== 'none');
    if (hasClothes) {
      issues.push(makeIssue({ type: 'img', category: 'img_clothing_mismatch', field: 'img_module.scene.positive', description: `Image prompt says "nude/naked" but character is wearing clothes (${slots.upper}, ${slots.lower}).`, originalValue: 'nude', suggestedValues: ['keep nude (undress character)', 'remove nude tag from prompt'], severity: 'warning' }));
    }
  }
  const clothingKeywords = ['dress', 'shirt', 'skirt', 'jeans', 'lingerie', 'bikini', 'swimsuit'];
  for (const kw of clothingKeywords) {
    if (positive.includes(kw)) {
      const upperSlot = (slots.upper || '').toLowerCase();
      const lowerSlot = (slots.lower || '').toLowerCase();
      if (!upperSlot.includes(kw) && !lowerSlot.includes(kw) && upperSlot !== 'none' && lowerSlot !== 'none') {
        issues.push(makeIssue({ type: 'img', category: 'img_clothing_mismatch', field: 'img_module.scene.positive', description: `Image prompt mentions "${kw}" but character's clothing slots show "${slots.upper}" / "${slots.lower}".`, originalValue: kw, suggestedValues: [`use ${slots.upper}`, `use ${kw} (change character clothing)`], severity: 'warning' }));
        break;
      }
    }
  }
  if (location) {
    const envKeywords = { 'bedroom': ['bedroom', 'bed'], 'kitchen': ['kitchen'], 'bathroom': ['bathroom', 'shower', 'bath'], 'garden': ['garden', 'outdoor', 'flowers'], 'beach': ['beach', 'ocean', 'sand'], 'forest': ['forest', 'trees'] };
    const expectedKws = envKeywords[location] || [];
    if (expectedKws.length > 0) {
      const promptHasLocation = expectedKws.some(kw => positive.includes(kw));
      if (!promptHasLocation) {
        const otherLocations = Object.entries(envKeywords).filter(([loc]) => loc !== location).map(([, kws]) => kws).flat();
        const mentionedOther = otherLocations.some(kw => positive.includes(kw));
        if (mentionedOther) {
          issues.push(makeIssue({ type: 'img', category: 'img_location_mismatch', field: 'img_module.scene.positive', description: `Image prompt describes a different location than state (${next.location.currentRoom}).`, originalValue: positive.slice(0, 60), suggestedValues: [`align to ${next.location.currentRoom}`, 'keep prompt location (character moved)'], severity: 'warning' }));
        }
      }
    }
  }
  return issues;
}

export function runAudit(prevState, parsedState, options = {}) {
  const { imgAuditorEnabled = true } = options;
  if (!prevState || !parsedState) return [];
  const issues = [];
  issues.push(...checkLocationConsistency(prevState, parsedState));
  issues.push(...checkInventoryConsistency(prevState, parsedState));
  issues.push(...checkClothingConsistency(prevState, parsedState));
  issues.push(...checkRelationshipConsistency(prevState, parsedState));
  issues.push(...checkNarrativeContradictions(prevState, parsedState));
  if (imgAuditorEnabled) issues.push(...checkIMGConsistency(prevState, parsedState));
  return issues;
}

export function filterIssuesByType(issues, type) {
  return (issues || []).filter(i => i.type === type && i.status === 'pending');
}

export function countPendingIssues(issues) {
  const counts = { data: 0, narrative: 0, img: 0, total: 0 };
  for (const i of (issues || [])) { if (i.status === 'pending') { counts[i.type] = (counts[i.type] || 0) + 1; counts.total++; } }
  return counts;
}
```

### `src/lib/relationshipSystem.js`

```js
/**
 * Eros Relationship System — Based on Eros Status System 3.0 Lorebook rules.
 * Relationships have two independent axes:
 *   1. FAMILY TIER   — blood/legal bond (sister, cousin, etc.)
 *   2. AFFECTION TIER — emotional/romantic/sexual bond (stranger → lover → spouse)
 */
export const FAMILY_TIERS = {
  none: { label: 'No family bond', icon: '👤', color: '#00FFF5', allowsRomance: true, allowsErotics: true, minAffectionForLibido: 0, minAffectionForArousal: 0 },
  chosen: { label: 'Chosen family / Close friend', icon: '🤝', color: '#00FFF5', allowsRomance: true, allowsErotics: true, minAffectionForLibido: 30, minAffectionForArousal: 40 },
  inlaw: { label: 'In-law / Step / Adoptive', icon: '🔗', color: '#FFD700', allowsRomance: true, allowsErotics: true, minAffectionForLibido: 50, minAffectionForArousal: 60 },
  blood: { label: 'Blood family', icon: '🩸', color: '#FF2D78', allowsRomance: false, allowsErotics: false, minAffectionForLibido: 80, minAffectionForArousal: 90 },
};

export const AFFECTION_TIERS = [
  { id: 'stranger',       label: 'Stranger',       threshold: 0,   icon: '❓', color: '#ffffff30' },
  { id: 'acquaintance',   label: 'Acquaintance',   threshold: 15,  icon: '🤝', color: '#00FFF580' },
  { id: 'friend',         label: 'Friend',         threshold: 30,  icon: '😊', color: '#00FFF5' },
  { id: 'close_friend',   label: 'Close Friend',   threshold: 50,  icon: '💙', color: '#00FFF5' },
  { id: 'crush',          label: 'Crush',          threshold: 60,  icon: '💗', color: '#FF2D78' },
  { id: 'lover',          label: 'Lover',          threshold: 70,  icon: '💕', color: '#FF2D78' },
  { id: 'sex_friend',     label: 'Sex Friend',     threshold: 65,  icon: '🔥', color: '#FF2D78', requiresLibido: 60 },
  { id: 'partner',        label: 'Partner',        threshold: 80,  icon: '💑', color: '#FF2D78' },
  { id: 'deeply_in_love', label: 'Deeply in Love', threshold: 90,  icon: '❤️', color: '#FF2D78' },
  { id: 'spouse',         label: 'Spouse',         threshold: 85,  icon: '💍', color: '#FFD700' },
];

const FAMILY_KEYWORDS = {
  blood: ['sister', 'brother', 'sibling', 'mother', 'father', 'mom', 'dad', 'daughter', 'son', 'aunt', 'uncle', 'grandmother', 'grandfather', 'grandma', 'grandpa', 'niece', 'nephew', 'cousin', 'irmã', 'irmão', 'mãe', 'pai', 'filha', 'filho', 'prima', 'primo'],
  inlaw: ['step-sister', 'stepsister', 'step sister', 'step-brother', 'stepbrother', 'step-mother', 'stepmother', 'step-father', 'stepfather', 'adoptive', 'adopted', 'foster', 'half-sister', 'half-brother', 'mother-in-law', 'father-in-law', 'sister-in-law', 'brother-in-law', 'madrasta', 'padrasto', 'adotiva', 'adotivo'],
  chosen: ['childhood friend', 'best friend', 'sworn sister', 'sworn brother', 'amiga de infância', 'amigo de infância'],
};

export function detectFamilyTier(relationStr) {
  if (!relationStr) return 'none';
  const lower = relationStr.toLowerCase();
  for (const kw of FAMILY_KEYWORDS.inlaw) if (lower.includes(kw)) return 'inlaw';
  for (const kw of FAMILY_KEYWORDS.blood) if (lower.includes(kw)) return 'blood';
  for (const kw of FAMILY_KEYWORDS.chosen) if (lower.includes(kw)) return 'chosen';
  return 'none';
}

export function detectAffectionTier(affection, libido) {
  if (libido >= 60 && affection >= 65) return AFFECTION_TIERS.find(t => t.id === 'sex_friend');
  const sorted = [...AFFECTION_TIERS].filter(t => t.id !== 'sex_friend').sort((a, b) => b.threshold - a.threshold);
  return sorted.find(t => affection >= t.threshold) || AFFECTION_TIERS[0];
}

export function detectForbiddenScenario(state) {
  const { sexModule, progressions, character } = state;
  if (sexModule?.active) return true;
  if ((progressions?.arousal ?? 0) >= 80) return true;
  const role = (character?.role || '').toLowerCase();
  if (role.includes('forbidden') || role.includes('taboo') || role.includes('incest')) return true;
  return false;
}

export function resolveRelationshipContext(state) {
  const { character, progressions, npcs, relationships } = state;
  const primaryRole = character?.role || '';
  const familyTier = detectFamilyTier(primaryRole);
  const familyConfig = FAMILY_TIERS[familyTier];
  const affTier = detectAffectionTier(progressions?.affection ?? 30, progressions?.libido ?? 20);
  const forbiddenScenario = detectForbiddenScenario(state);
  const effectiveAllowsRomance = familyConfig.allowsRomance || forbiddenScenario;
  const effectiveAllowsErotics = familyConfig.allowsErotics || forbiddenScenario;
  const hiddenStats = new Set();
  if (!effectiveAllowsRomance) { hiddenStats.add('libido'); hiddenStats.add('desire'); hiddenStats.add('submission'); }
  else { const aff = progressions?.affection ?? 0; if (aff < familyConfig.minAffectionForLibido) hiddenStats.add('libido'); }
  if (!effectiveAllowsErotics) { hiddenStats.add('arousal'); hiddenStats.add('corruption'); }
  else { const aff = progressions?.affection ?? 0; if (aff < familyConfig.minAffectionForArousal) hiddenStats.add('arousal'); }
  const npcRelationships = (npcs || []).map(npc => ({ ...npc, familyTier: detectFamilyTier(npc.relation), affTier: detectAffectionTier(npc.affection || 30, 20) }));
  const extraRels = (relationships || []).map(rel => ({ ...rel, familyTier: detectFamilyTier(rel.type || rel.relation || '') }));
  return { primaryRole, familyTier, familyConfig, affectionTier: affTier, forbiddenScenario, effectiveAllowsRomance, effectiveAllowsErotics, hiddenStats, npcRelationships, extraRels };
}

export function getFamilyTierBadge(tier) { return FAMILY_TIERS[tier] || FAMILY_TIERS.none; }
export function getAffectionTierBadge(tierId) { return AFFECTION_TIERS.find(t => t.id === tierId) || AFFECTION_TIERS[0]; }
```

### `src/lib/sexPositionsLibrary.js`

```js
/**
 * Sex Positions Library — ASCII Art Database (Eros Status Terminal v3.0)
 * Banco de dados pré-definido de posições sexuais com arte ASCII.
 * A IA só precisa retornar o nome (key) no campo sexModule.position.
 */
export const POSITIONS_LIB = {
  "missionary": { emoji: "🛏️", category: "Classic", label: "Missionary", description: "Face-to-face, partner on top.", ascii: ["   \\o/  ", "   /|\\  ", "  _/|\\_  ", " (_____)  "] },
  "cowgirl": { emoji: "🤠", category: "Classic", label: "Cowgirl", description: "Partner on top, facing forward.", ascii: ["  \\o/   ", "   |    ", "  /|\\   ", " _/ \\_  "] },
  "reverse cowgirl": { emoji: "🔄", category: "Classic", label: "Reverse Cowgirl", description: "Partner on top, facing away.", ascii: ["  _o_   ", "   |\\   ", "  /|    ", " _/ \\_ "] },
  "doggystyle": { emoji: "🐕", category: "Classic", label: "Doggystyle", description: "Rear entry, both on knees.", ascii: [" \\o  o/ ", "  |  |  ", "  |--|  ", " /    \\ "] },
  "spooning": { emoji: "🥄", category: "Classic", label: "Spooning", description: "Side by side, rear entry.", ascii: [" (o)(o) ", "  )--<  ", " (    ) ", "  ----  "] },
  "69": { emoji: "🔁", category: "Oral", label: "69", description: "Mutual oral stimulation.", ascii: ["  \\o/   ", "   |    ", "  /|    ", " o/|    ", "  |\\   ", "  |/   "] },
  "standing": { emoji: "🧍", category: "Standing", label: "Standing", description: "Both standing, face-to-face.", ascii: ["  o o   ", " /|X|\\  ", "  | |   ", " / \\ /\\ "] },
  "standing doggy": { emoji: "🧱", category: "Standing", label: "Standing Doggy", description: "Rear entry, both standing.", ascii: [" o   o  ", " |\\  |  ", " | \\ |  ", "/   \\|  "] },
  "wall pin": { emoji: "🧱", category: "Standing", label: "Wall Pin", description: "Partner pressed against wall.", ascii: [" |o  o  ", " ||  |  ", " ||--|  ", " |/ \\   "] },
  "lifted": { emoji: "🏋️", category: "Standing", label: "Lifted", description: "Partner carried, legs wrapped.", ascii: ["  o\\o   ", "  |/|   ", " /X/    ", "/   \\   "] },
  "lap dance": { emoji: "💺", category: "Seated", label: "Lap Dance", description: "Partner seated, other on lap.", ascii: ["  \\o/   ", "   |    ", " __U__  ", "(_____)  "] },
  "seated facing": { emoji: "🪑", category: "Seated", label: "Seated Facing", description: "Face-to-face, seated position.", ascii: ["  o o   ", " (X X)  ", "  | |   ", " _| |_  "] },
  "chair": { emoji: "🪑", category: "Seated", label: "Chair", description: "One seated on chair, other on lap.", ascii: ["  \\o/   ", "   |    ", " |_|_|  ", " |   |  "] },
  "side by side": { emoji: "↔️", category: "Lying", label: "Side by Side", description: "Both lying sideways, face-to-face.", ascii: [" o---o  ", " |   |  ", " |---|  ", "       "] },
  "lotus": { emoji: "🪷", category: "Lying", label: "Lotus", description: "Partner in lap, face-to-face seated.", ascii: ["  \\o/   ", "   X    ", " (___) ", "        "] },
  "prone bone": { emoji: "⬇️", category: "Lying", label: "Prone Bone", description: "Partner lying flat, rear entry.", ascii: [" o----o ", " |    | ", " ------  ", "        "] },
  "pile driver": { emoji: "⬇️", category: "Lying", label: "Pile Driver", description: "Legs raised vertically, deep penetration.", ascii: ["  |||   ", "  |||   ", " (   )  ", "  ---   "] },
  "blowjob": { emoji: "💋", category: "Oral", label: "Blowjob", description: "Oral stimulation, kneeling.", ascii: ["   o    ", "   |    ", " o-|    ", " |      "] },
  "cunnilingus": { emoji: "👅", category: "Oral", label: "Cunnilingus", description: "Oral stimulation, lying.", ascii: [" o----  ", "  \\  |  ", "   \\ |  ", "    \\|  "] },
  "doggy deep": { emoji: "🔥", category: "Advanced", label: "Deep Doggy", description: "Rear entry, hips held, deep thrust.", ascii: [" \\o  o/ ", "  |  |  ", "  |==|  ", " /    \\ "] },
  "amazon": { emoji: "⚡", category: "Advanced", label: "Amazon", description: "Partner dominant, legs folded back.", ascii: ["  \\o/   ", "   |    ", " __U__  ", "  |||   "] },
  "suspended": { emoji: "🌀", category: "Advanced", label: "Suspended", description: "Partner held in air, full penetration.", ascii: ["  o\\    ", "  |/o   ", " /|/    ", "/       "] },
  "butterfly": { emoji: "🦋", category: "Advanced", label: "Butterfly", description: "Partner at edge of surface, legs raised.", ascii: ["  o  o  ", "  |--|  ", " /|  |\\ ", "/  --  \\"] },
  "pretzel": { emoji: "🥨", category: "Advanced", label: "Pretzel", description: "Side position, one leg raised.", ascii: [" o--o   ", " |  |\\  ", " |  | \\ ", "        "] },
};

export function findPosition(name) {
  if (!name) return null;
  const lower = name.toLowerCase().trim();
  if (POSITIONS_LIB[lower]) return POSITIONS_LIB[lower];
  for (const [key, data] of Object.entries(POSITIONS_LIB)) { if (lower.includes(key) || key.includes(lower)) return data; }
  return null;
}

export function getPositionsByCategory(category) {
  return Object.entries(POSITIONS_LIB).filter(([, v]) => v.category === category).map(([k, v]) => ({ key: k, ...v }));
}

export const POSITION_CATEGORIES = ['Classic', 'Standing', 'Seated', 'Lying', 'Oral', 'Advanced'];
export const POSITIONS_LIST = Object.keys(POSITIONS_LIB);
```

### `src/lib/utils.js`

```js
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const isIframe = window.self !== window.top;
```

### `src/lib/app-params.js`

```js
// Standalone stub — no Base44 params needed
export const appParams = {};
```

### `src/lib/query-client.js`

```js
import { QueryClient } from '@tanstack/react-query';

export const queryClientInstance = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});
```

### `src/lib/AuthContext.jsx`

> ❌ **MIGRAÇÃO (deploy Chub):** Remover — auth é gerenciado pelo Chub Venus AI. ~161 linhas (`AuthProvider` + `useAuth` + `checkAppState` + `checkUserAuth` + `logout` + `navigateToLogin`). Código completo preservado no repositório (`src/lib/AuthContext.jsx`). Usa `@base44/sdk` (`createAxiosClient`, `base44.auth`), `appParams`, `UserNotRegisteredError`.

### `src/lib/PageNotFound.jsx`

> Página 404 do Base44. ❌ **MIGRAÇÃO:** Remover no deploy standalone. ~75 linhas. Código completo preservado no repositório (`src/lib/PageNotFound.jsx`). Usa `react-router-dom` (`useLocation`), `@base44/sdk` (`base44.auth.me`), `@tanstack/react-query`.

---

*Próximo: `docs/09-SERVICES.md` — `openRouterService.js` + `characterStateService.js`.*