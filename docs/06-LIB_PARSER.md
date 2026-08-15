# 06 — src/lib/erosParser.js (Parser principal)

> Parte 6/10. Código-fonte COMPLETO do parser principal — 1.368 linhas de JavaScript puro, sem dependências.

---

### `src/lib/erosParser.js`

```js
/**
 * ═══════════════════════════════════════════════════════════════════
 * Eros Status Parser v2.1
 * Parses AI chat output for Eros Status System markers
 * Compatible with Chub Venus AI Stage (postMessage / iframe)
 * ═══════════════════════════════════════════════════════════════════
 *
 * ── DEPLOY NO CHUB VENUS AI ─────────────────────────────────────
 * ✅ Este arquivo NÃO precisa de alteração para deploy.
 *    É 100% JavaScript puro — sem dependências de Base44 ou React.
 *
 * ── PERSISTÊNCIA ENTRE TURNOS ───────────────────────────────────
 * O parseErosStatusFromMessage() por si só reseta o estado a cada
 * chamada (parte do DEFAULT_STATE). Para PERSISTIR entre turnos:
 *
 *   import { saveCharacterState, loadCharacterState, deepMerge }
 *     from '../services/characterStateService';
 *
 *   const parsed = parseErosStatusFromMessage(text);
 *   if (parsed) {
 *     const charKey = normalizeCharKey(parsed.character?.name);
 *     const persisted = saveCharacterState(charKey, parsed);
 *     setState(s => deepMerge(s, persisted));
 *   }
 *
 * ── BIBLIOTECAS UTILIZADAS ──────────────────────────────────────
 *   • JavaScript puro (RegExp, Array, Object) — sem npm
 * ═══════════════════════════════════════════════════════════════════
 */

export const DEFAULT_STATE = {
  userCharacter: {
    name: 'User',
    relation: '',
    mood: 'neutral',
    summary: '',
    relationships: [],
  },
  system: {
    day: 1,
    time: '??:??',
    weather: 'Unknown',
    location: 'Unknown',
    sceneType: 'daily_life',
    ambiance: '',
  },
  character: {
    name: 'Unknown',
    role: '',
    avatarUrl: '',
    expression: 'neutral',
    mood: 'Neutral',
  },
  progressions: {
    affection: 30, obedience: 30, libido: 20, arousal: 0,
    trust: 30, corruption: 0, happiness: 50, embarrassment: 0, fatigue: 0, love: 0, jealousy: 0,
    anxiety: 0, fear: 0, anger: 0, nervousness: 0, tension: 0, shame: 0, desire: 0, awe: 0,
    guilt: 0, excitement: 0, sadness: 0, submission: 0, health: 100,
  },
  clothingSlots: { head: 'None', upper: 'None', lower: 'None', underwear: 'None', footwear: 'None', accessories: 'None' },
  clothing: { upperBody: 'Shirt', lowerBody: 'Pants', underwear: 'Underwear', accessories: 'None', condition: 'Worn' },
  body: {
    expression: 'neutral', posture: 'standing', thoughts: '', shamefulThought: '',
    description: { hair: '', eyes: '', face: '', neck: '', chest: '', bust: '', waist: '', hips: '', legs: '', feet: '', tail: '', horns: '', special: '' },
  },
  location: { currentRoom: 'Home', building: 'Unknown', description: '', visitedRooms: [], objectsInRoom: [], miniMapData: null },
  inventory: { items: [] },
  goals: [],
  npcs: [],
  relationships: [],
  sexModule: {
    active: false, phase: 'none', position: '', pace: '', orgasmCount: 0,
    sensory_metrics: { intensity: 0, threshold: 0 },
    marking_history: [],
    senses: { sight: '', sound: '', smell: '', touch: '', taste: '' },
    male: { length: '', girth: '', seminalVolume: '', ejaculationCount: 0 },
    female: { arousalState: '', lubrication: '', vagina: '', cervix: '', uterus: '', ovaries: '', menstrualCycle: { day: 0, phase: '', fertile: false } },
    stimulusDescription: '',
  },
  reactionModule: { active: false, character: '', stimulus: '', reactions: [] },
  ntrModule: { enabled: false, active: false, ntrCharacter: '', ntrPartner: '', jealousyLevel: 0, betrayalStage: '', notes: '' },
  aiInstructions: [],
  importantMoments: [],
  lastRawBlock: '',
  turnCount: 0,
  ui_commands: { suggested_tab: '', notification: { level: '', message: '' }, map_focus: '', map_reveal: [] },
  meta: { turn_id: '', parent_turn_id: '', branch_index: 0, validated: true, coerced_fields: [] },
  img_module: {
    anchors: { char: '', user: '' },
    scene: { positive: '', negative: '', camera_suggestions: [] },
    params: { checkpoint: '', loras: [], sampler: 'DPM++ 2M Karras', steps: 28, cfg: 7.0, clip_skip: 2, hires_fix: { enabled: false, upscale: 2.0, denoising: 0.4 }, aspect_ratio: '2:3', resolution: '832×1216' },
  },
  audit: { issues: [] },
};

export function parseErosStatusFromMessage(messageText) {
  if (!messageText) return null;
  const state = {
    ...DEFAULT_STATE,
    userCharacter: { ...DEFAULT_STATE.userCharacter, relationships: [] },
    system: { ...DEFAULT_STATE.system },
    character: { ...DEFAULT_STATE.character },
    progressions: { ...DEFAULT_STATE.progressions },
    clothingSlots: { ...DEFAULT_STATE.clothingSlots },
    clothing: { ...DEFAULT_STATE.clothing },
    body: { ...DEFAULT_STATE.body, description: { ...DEFAULT_STATE.body.description } },
    location: { ...DEFAULT_STATE.location, visitedRooms: [], objectsInRoom: [] },
    inventory: { items: [] },
    goals: [], npcs: [], relationships: [],
    sexModule: { ...DEFAULT_STATE.sexModule, sensory_metrics: { ...DEFAULT_STATE.sexModule.sensory_metrics }, marking_history: [], senses: { ...DEFAULT_STATE.sexModule.senses }, male: { ...DEFAULT_STATE.sexModule.male }, female: { ...DEFAULT_STATE.sexModule.female, menstrualCycle: { ...DEFAULT_STATE.sexModule.female.menstrualCycle } } },
    reactionModule: { ...DEFAULT_STATE.reactionModule, reactions: [] },
    ntrModule: { ...DEFAULT_STATE.ntrModule },
    ui_commands: { ...DEFAULT_STATE.ui_commands, notification: { ...DEFAULT_STATE.ui_commands.notification }, map_reveal: [] },
    meta: { ...DEFAULT_STATE.meta, coerced_fields: [] },
    img_module: { ...DEFAULT_STATE.img_module, anchors: { ...DEFAULT_STATE.img_module.anchors }, scene: { ...DEFAULT_STATE.img_module.scene, camera_suggestions: [] }, params: { ...DEFAULT_STATE.img_module.params, loras: [], hires_fix: { ...DEFAULT_STATE.img_module.params.hires_fix } } },
    audit: { issues: [] },
    aiInstructions: [], importantMoments: [], lastRawBlock: '', turnCount: 0,
  };
  let foundAnyData = false;

  // 1. Condensed inline bracket stats
  const allBrackets = [...messageText.matchAll(/\[([^\]]+)\]/g)];
  for (const m of allBrackets) {
    if (/[\d]%|\p{Emoji}/u.test(m[1])) { foundAnyData = true; parseCondensedBlock(m[1], state); }
  }

  // 2. ASCII terminal blocks
  const terminalBlocks = extractAllTerminalBlocks(messageText);
  for (const block of terminalBlocks) { foundAnyData = true; state.lastRawBlock = block; parseTerminalBlock(block, state); }

  // 3. JSON status block
  const jsonBlock = extractJsonBlock(messageText);
  if (jsonBlock) { foundAnyData = true; parseJsonBlock(jsonBlock, state); }

  // 4. Inline key:value pairs
  parseInlineKeyValues(messageText, state);

  // 5. Character name
  const charFormatMatch = messageText.match(/CHAR_FORMAT:\s*(\w+)=/);
  if (charFormatMatch) { state.character.name = charFormatMatch[1]; foundAnyData = true; }
  const charNameMatch = messageText.match(/^#([^\[\n]+)\[([^\]]+)\]/m);
  if (charNameMatch) { state.character.name = charNameMatch[1].trim(); state.character.role = charNameMatch[2].trim(); foundAnyData = true; }

  // Day N | HH:MM | weather | location header
  const dayHeaderMatch = messageText.match(/Day\s+(\d+)\s*[|│]\s*(\d{1,2}:\d{2})\s*[|│]\s*([^\n|│]+)[|│]\s*📍?\s*([^\n]+)/i);
  if (dayHeaderMatch) {
    state.system.day = parseInt(dayHeaderMatch[1]);
    state.system.time = dayHeaderMatch[2];
    const weatherRaw = dayHeaderMatch[3].trim();
    if (weatherRaw.includes('☀')) state.system.weather = 'Sunny';
    else if (weatherRaw.includes('🌧')) state.system.weather = 'Rainy';
    else if (weatherRaw.includes('⛈') || weatherRaw.includes('🌩')) state.system.weather = 'Stormy';
    else if (weatherRaw.includes('❄')) state.system.weather = 'Snowy';
    else if (weatherRaw.includes('🌙')) state.system.weather = 'Night';
    else if (weatherRaw.includes('☁') || weatherRaw.includes('🌤')) state.system.weather = 'Cloudy';
    else state.system.weather = weatherRaw.replace(/[^\w\s]/g, '').trim() || state.system.weather;
    const locStr = dayHeaderMatch[4].trim();
    if (locStr) state.location.currentRoom = locStr;
    foundAnyData = true;
  }

  parseNPCData(messageText, state);
  parseGoals(messageText, state);
  parseThoughts(messageText, state);
  parseSexModule(messageText, state);
  parseReactionModule(messageText, state);
  parseNTRModule(messageText, state);
  parseBodyDescription(messageText, state);
  parseRelationshipData(messageText, state);
  parseUserCharacter(messageText, state);
  parseInventorySlots(messageText, state);
  syncClothingSlots(state);
  parseUICommands(messageText, state);
  parseImgModule(messageText, state);
  parseMetaInfo(messageText, state);

  return foundAnyData ? state : null;
}

function parseCondensedBlock(block, state) {
  const allMatches = [...block.matchAll(/(\p{Emoji})\s*(\d+)%/gu)];
  for (const m of allMatches) {
    const emoji = m[1]; const val = parseInt(m[2]);
    if (emoji === '💕' || emoji === '❤️' || emoji === '💖' || emoji === '💝') state.progressions.affection = val;
    else if (emoji === '🎯') state.progressions.obedience = val;
    else if (emoji === '🔥') state.progressions.libido = val;
    else if (emoji === '🍑') state.progressions.arousal = val;
    else if (emoji === '😊') state.progressions.happiness = val;
    else if (emoji === '⭐' || emoji === '🌟') state.progressions.trust = val;
    else if (emoji === '💀' || emoji === '☠️') state.progressions.corruption = val;
    else if (emoji === '😳') state.progressions.embarrassment = val;
    else if (emoji === '😰' || emoji === '😱') state.progressions.anxiety = val;
    else if (emoji === '😨' || emoji === '😱') state.progressions.fear = val;
    else if (emoji === '😠' || emoji === '🤬') state.progressions.anger = val;
    else if (emoji === '😬' || emoji === '😟') state.progressions.nervousness = val;
    else if (emoji === '😤') state.progressions.tension = val;
    else if (emoji === '🙈' || emoji === '😖') state.progressions.shame = val;
    else if (emoji === '💋' || emoji === '🫦') state.progressions.desire = val;
    else if (emoji === '🤩' || emoji === '😲') state.progressions.awe = val;
    else if (emoji === '😞' || emoji === '😔') state.progressions.guilt = val;
    else if (emoji === '⚡' || emoji === '🎉') state.progressions.excitement = val;
    else if (emoji === '😢' || emoji === '😭') state.progressions.sadness = val;
    else if (emoji === '🫡' || emoji === '🙇') state.progressions.submission = val;
    else if (emoji === '💚' || emoji === '🟢') state.progressions.jealousy = val;
    else if (emoji === '💗' || emoji === '🥰') state.progressions.love = val;
  }
  const locMatch = block.match(/📍([^|[\]⏰]+?)(?:\s*→\s*([^|\[\]⏰]+?))?(?=\s*[\]|⏰]|$)/);
  if (locMatch) { state.location.currentRoom = locMatch[1].trim().replace(/^→\s*/, ''); if (locMatch[2]) state.location.building = locMatch[2].trim(); }
  const timeMatch = block.match(/[⏰🕐]\s*(\d{1,2}:\d{2})/);
  if (timeMatch) state.system.time = timeMatch[1];
  if (block.includes('☀️') || block.includes('☀')) state.system.weather = 'Sunny';
  else if (block.includes('🌧️') || block.includes('🌧')) state.system.weather = 'Rainy';
  else if (block.includes('⛈️') || block.includes('🌩️')) state.system.weather = 'Stormy';
  else if (block.includes('❄️')) state.system.weather = 'Snowy';
  else if (block.includes('🌙')) state.system.weather = 'Night';
  else if (block.includes('🌤️') || block.includes('⛅')) state.system.weather = 'Cloudy';
}

function extractAllTerminalBlocks(text) {
  const results = [];
  const re = /╔[═╦]+╗[\s\S]*?╚[═╩]+╝/g;
  let m;
  while ((m = re.exec(text)) !== null) results.push(m[0]);
  if (results.length === 0) { const simple = text.match(/┌[─]+┐[\s\S]*?└[─]+┘/); if (simple) results.push(simple[0]); }
  return results;
}

function parseTerminalBlock(block, state) {
  const headerMatch = block.match(/Day\s*(\d+)[^\d]*(\d{1,2}:\d{2})/i);
  if (headerMatch) { state.system.day = parseInt(headerMatch[1]); state.system.time = headerMatch[2]; }
  const charMatch = block.match(/#([^[\n]+)\[([^\]]+)\]/);
  if (charMatch) { state.character.name = charMatch[1].trim(); state.character.role = charMatch[2].trim(); }
  const moodMatch = block.match(/(?:💬|Mood)[^\n:]*:\s*([^\n║╠╚╔|]+)/i);
  if (moodMatch) state.character.mood = moodMatch[1].trim().replace(/[[\]]/g, '').replace(/[║╠╚╔]/g, '').trim();
  const relMatch = block.match(/(?:🤝|Relationship)[^\n:]*:\s*([^\n║╠╚╔|]+)/i);
  if (relMatch && state.npcs.length === 0) state.character.relationship = relMatch[1].trim();
  const affMatch = block.match(/(?:❤️|💕|Love|Affection|Fav)[^\n:]*:\s*([^\n║╠╚╔|]+)/i);
  if (affMatch) { const numMatch = affMatch[1].match(/(\d+)/); if (numMatch) state.progressions.affection = parseInt(numMatch[1]); else state.character.loveStatus = affMatch[1].trim(); }
  const corrMatch = block.match(/(?:🧠|Corruption)[^\n:]*:\s*([^\n║╠╚╔|]+)/i);
  if (corrMatch) { const n = corrMatch[1].match(/(\d+)/); if (n) state.progressions.corruption = parseInt(n[1]); }
  const healthMatch = block.match(/(?:🩺|Health)[^\n:]*:\s*([^\n║╠╚╔|]+)/i);
  if (healthMatch) { const n = healthMatch[1].match(/(\d+)/); if (n) state.progressions.health = parseInt(n[1]); else state.character.healthStatus = healthMatch[1].trim(); }
  const upperMatch = block.match(/(?:👕|Upper|Wearing)[^\n:]*:\s*([^\n║╠╚╔|]+)/i);
  if (upperMatch) state.clothing.upperBody = upperMatch[1].trim();
  const lowerMatch = block.match(/(?:👖|Lower)[^\n:]*:\s*([^\n║╠╚╔|]+)/i);
  if (lowerMatch) state.clothing.lowerBody = lowerMatch[1].trim();
  const locMatch = block.match(/(?:📍|Location)[^\n:]*:\s*([^\n║╠╚╔|→]+)(?:→\s*([^\n║╠╚╔|]+))?/i);
  if (locMatch) { state.location.currentRoom = locMatch[1].trim(); if (locMatch[2]) state.location.building = locMatch[2].trim(); }
  const timeMatch = block.match(/(?:🕗|⏰|Time)[^\n:]*:\s*([^\n║╠╚╔|]+)/i);
  if (timeMatch) { const t = timeMatch[1].match(/\d{1,2}:\d{2}/); if (t) state.system.time = t[0]; else state.system.timeDesc = timeMatch[1].trim(); }
  const weatherMatch = block.match(/(?:🌤️|Weather)[^\n:]*:\s*([^\n║╠╚╔|]+)/i);
  if (weatherMatch) state.system.weather = weatherMatch[1].trim().replace(/[║╠╚╔]/g, '').trim();
  const ambianceMatch = block.match(/(?:🔊|Ambiance|Ambience)[^\n:]*:\s*([^\n║╠╚╔|]+)/i);
  if (ambianceMatch) state.system.ambiance = ambianceMatch[1].trim();
  const thoughtMatch = block.match(/(?:Surface|Thought|Thinking)[^\n:]*:\s*'([^']+)'/i);
  if (thoughtMatch) state.body.thoughts = thoughtMatch[1];
  const itemsMatch = block.match(/(?:💄|Items?)[^\n:]*:\s*([^\n║╠╚╔|]+)/i);
  if (itemsMatch) { const items = itemsMatch[1].split(',').map(s => s.trim()).filter(Boolean); if (items.length) state.inventory.items = items; }
  parseSexBlockFields(block, state);
  parseNTRBlockFields(block, state);
}

function extractJsonBlock(text) {
  const match = text.match(/```json\s*([\s\S]*?)```/);
  if (!match) return null;
  try { return JSON.parse(match[1]); } catch { return null; }
}

function parseJsonBlock(json, state) {
  if (json.progressions) Object.assign(state.progressions, json.progressions);
  if (json.system) Object.assign(state.system, json.system);
  if (json.location) Object.assign(state.location, json.location);
  if (json.clothing) Object.assign(state.clothing, json.clothing);
  if (json.clothingSlots) Object.assign(state.clothingSlots, json.clothingSlots);
  if (json.body) Object.assign(state.body, json.body);
  if (json.character) Object.assign(state.character, json.character);
  if (json.npcs) state.npcs = json.npcs;
  if (json.inventory?.items) state.inventory.items = json.inventory.items;
  if (json.sexModule) Object.assign(state.sexModule, json.sexModule);
  if (json.ntrModule) Object.assign(state.ntrModule, json.ntrModule);
  if (json.reactionModule) Object.assign(state.reactionModule, json.reactionModule);
  if (json.userCharacter) Object.assign(state.userCharacter, json.userCharacter);
  if (json.ui_commands) {
    if (json.ui_commands.suggested_tab) state.ui_commands.suggested_tab = json.ui_commands.suggested_tab;
    if (json.ui_commands.notification) Object.assign(state.ui_commands.notification, json.ui_commands.notification);
    if (json.ui_commands.map_focus) state.ui_commands.map_focus = json.ui_commands.map_focus;
    if (json.ui_commands.map_reveal) state.ui_commands.map_reveal = json.ui_commands.map_reveal;
  }
  if (json.meta) Object.assign(state.meta, json.meta);
  if (json.img_module) {
    if (json.img_module.anchors) Object.assign(state.img_module.anchors, json.img_module.anchors);
    if (json.img_module.scene) {
      if (json.img_module.scene.positive) state.img_module.scene.positive = json.img_module.scene.positive;
      if (json.img_module.scene.negative) state.img_module.scene.negative = json.img_module.scene.negative;
      if (json.img_module.scene.camera_suggestions) state.img_module.scene.camera_suggestions = json.img_module.scene.camera_suggestions;
    }
    if (json.img_module.params) Object.assign(state.img_module.params, json.img_module.params);
    if (json.img_module.params?.loras) state.img_module.params.loras = json.img_module.params.loras;
  }
}

function parseInlineKeyValues(text, state) {
  const moodMatch = text.match(/(?:[\p{Emoji}]\s+)?Mood[^:]*:\s*([A-Za-z\s,]+?)(?:\n|,\s+\w|$)/iu);
  if (moodMatch) state.character.mood = moodMatch[1].trim();
  const locParts = text.match(/(?:Location|Room)[^:]*:\s*([^→\n]+)(?:→\s*([^\n]+))?/i);
  if (locParts) { state.location.currentRoom = locParts[1].trim(); if (locParts[2]) state.location.building = locParts[2].trim(); }
  const invMatch = text.match(/(?:Items?|Inventory)[^:]*:\s*([^\n║╠╚╔|]+)/i);
  if (invMatch) { const items = invMatch[1].split(',').map(s => s.trim()).filter(Boolean); state.inventory.items = items; }
  const clothingMatch = text.match(/Clothing[^:]*:\s*([^\n]+)/i);
  if (clothingMatch) { const parts = clothingMatch[1].trim().split(',').map(s => s.trim()); state.clothing.upperBody = parts[0] || ''; state.clothing.lowerBody = parts.slice(1).join(', ') || ''; }
  const dayTimeMatch = text.match(/Day\s*(\d+)[^,|]*[,|]\s*(\d{1,2}:\d{2})/i);
  if (dayTimeMatch) { state.system.day = parseInt(dayTimeMatch[1]); state.system.time = dayTimeMatch[2]; }
  const dynamicStats = [
    { key: 'anxiety', patterns: ['Anxiety', 'Anxious'] }, { key: 'fear', patterns: ['Fear', 'Scared'] },
    { key: 'anger', patterns: ['Anger', 'Rage', 'Angry'] }, { key: 'nervousness', patterns: ['Nervousness', 'Nervous', 'Jitters'] },
    { key: 'tension', patterns: ['Tension', 'Tense'] }, { key: 'shame', patterns: ['Shame', 'Ashamed'] },
    { key: 'desire', patterns: ['Desire', 'Longing', 'Want'] }, { key: 'awe', patterns: ['Awe', 'Wonder', 'Amazement'] },
    { key: 'guilt', patterns: ['Guilt', 'Remorse'] }, { key: 'excitement', patterns: ['Excitement', 'Excited', 'Thrill'] },
    { key: 'sadness', patterns: ['Sadness', 'Sorrow', 'Grief'] }, { key: 'submission', patterns: ['Submission', 'Submissive'] },
    { key: 'love', patterns: ['Love', 'Romantic'] }, { key: 'jealousy', patterns: ['Jealousy', 'Envy'] },
  ];
  for (const { key, patterns } of dynamicStats) {
    for (const p of patterns) {
      const m = text.match(new RegExp(p + '[^:\\n]*:\\s*(\\d+)%?', 'i'));
      if (m) { state.progressions[key] = parseInt(m[1]); break; }
    }
  }
}

function parseNPCData(text, state) {
  const npcMatches = [...text.matchAll(/NPCs?:[^\n]*\n((?:[-*•]\s*[^\n]+\n?)+)/gi)];
  for (const match of npcMatches) {
    const npcLines = match[1].split('\n').filter(l => l.trim());
    for (const line of npcLines) {
      const m = line.match(/[-*•]\s*([^([\n]+)(?:\(([^)]+)\))?(?:\[([^\]]+)\])?/);
      if (m) state.npcs.push({ name: m[1].trim(), relation: m[2]?.trim() || '', mood: m[3]?.trim() || 'neutral' });
    }
  }
  const inlineNpc = text.match(/NPCs?[^:]*:\s*([^\n║╠╚╔|]+)/i);
  if (inlineNpc && state.npcs.length === 0) {
    const npcStr = inlineNpc[1];
    if (npcStr.toLowerCase() !== 'none') {
      const entries = npcStr.split(',');
      for (const entry of entries) {
        const m = entry.match(/([^(]+)(?:\(([^)]+)\))?/);
        if (m && m[1].trim()) state.npcs.push({ name: m[1].trim(), relation: m[2]?.trim() || '', mood: 'neutral' });
      }
    }
  }
}

function parseGoals(text, state) {
  const goalsMatch = text.match(/Goals?[^:]*:\s*([^\n║╠╚╔|]+)/i);
  if (goalsMatch) state.goals = goalsMatch[1].split(',').map(s => s.trim()).filter(Boolean);
  const intentMatch = text.match(/Intentions?[^:]*:\s*([^\n║╠╚╔|]+)/i);
  if (intentMatch) { const intents = intentMatch[1].split(',').map(s => s.trim()).filter(Boolean); state.goals = [...new Set([...state.goals, ...intents])]; }
  const aiMatch = text.match(/AI[_\s]?Instructions?[^:]*:\s*([^\n║╠╚╔|]+)/i);
  if (aiMatch) state.aiInstructions = aiMatch[1].split(',').map(s => s.trim()).filter(Boolean);
}

function parseThoughts(text, state) {
  const thoughtMatches = [...text.matchAll(/\*~([^~]+)~\*/g)];
  if (thoughtMatches.length > 0) {
    state.body.thoughts = thoughtMatches[0][1].trim();
    if (thoughtMatches.length > 1) state.body.shamefulThought = thoughtMatches[thoughtMatches.length - 1][1].trim();
  }
  const quotedThought = text.match(/Thoughts?[^:]*:\s*'([^'\n]{3,})'/i);
  if (quotedThought) { state.body.thoughts = quotedThought[1].trim(); return; }
  const unquotedThought = text.match(/Thoughts?[^:]*:\s*(.{3,}?)(?:\n|$)/i);
  if (unquotedThought && !state.body.thoughts) state.body.thoughts = unquotedThought[1].trim().replace(/^['"]|['"]$/g, '');
  const shamefulMatch = text.match(/(?:Shameful|Hidden|Secret)\s*[Tt]hought[^:]*:\s*'([^'\n]+)'/i);
  if (shamefulMatch) state.body.shamefulThought = shamefulMatch[1].trim();
}

function parseSexModule(text, state) {
  const sexBlockMatch = text.match(/(?:🔥|SEX|SEXUAL)[_\s]?(?:STATUS|MODULE|SCENE|PANEL)[^\n]*/i);
  const flirtingMatch = text.match(/(?:FLIRT(?:ING)?|INTIMACY|ROMANCE)[_\s]?(?:STATUS|MODULE|SCENE|PANEL)?[^\n]*/i);
  if (sexBlockMatch) { state.sexModule.active = true; state.sexModule.phase = 'sex'; state.system.sceneType = 'sex'; }
  else if (flirtingMatch && (text.includes('Intimacy Level') || text.includes('intimacy'))) { state.sexModule.active = true; state.sexModule.phase = 'flirting'; state.system.sceneType = 'flirting'; }
  if (text.match(/post[-\s]sex|afterglow|aftermath|finished|spent|cuddling after/i)) { state.sexModule.active = true; state.sexModule.phase = 'post-sex'; }
  parseSexBlockFields(text, state);
}

function parseSexBlockFields(text, state) {
  const kv = (key, t) => { const m = t.match(new RegExp(key + '[^:]*:\\s*([^\\n║╠╚╔|]+)', 'i')); return m ? m[1].trim() : null; };
  const position = kv('(?:Position|Pose|Act)', text);
  if (position) state.sexModule.position = position;
  const pace = kv('(?:Pace|Speed|Rhythm)', text);
  if (pace) state.sexModule.pace = pace;
  const orgMatch = text.match(/[Oo]rgasm[^:]*:?\s*(?:Count|×|x)?\s*(\d+)/);
  if (orgMatch) state.sexModule.orgasmCount = parseInt(orgMatch[1]);
  const sightMatch = text.match(/(?:👁️|Sight|Visuals?)[^:]*:\s*([^\n║╠╚╔|]+)/i); if (sightMatch) state.sexModule.senses.sight = sightMatch[1].trim();
  const soundMatch = text.match(/(?:🔊|Sound|Audio|Moans?)[^:]*:\s*([^\n║╠╚╔|]+)/i); if (soundMatch) state.sexModule.senses.sound = soundMatch[1].trim();
  const smellMatch = text.match(/(?:👃|Smell|Scent|Aroma)[^:]*:\s*([^\n║╠╚╔|]+)/i); if (smellMatch) state.sexModule.senses.smell = smellMatch[1].trim();
  const touchMatch = text.match(/(?:🤚|Touch|Feel|Texture)[^:]*:\s*([^\n║╠╚╔|]+)/i); if (touchMatch) state.sexModule.senses.touch = touchMatch[1].trim();
  const tasteMatch = text.match(/(?:👅|Taste|Flavor)[^:]*:\s*([^\n║╠╚╔|]+)/i); if (tasteMatch) state.sexModule.senses.taste = tasteMatch[1].trim();
  const seminalMatch = text.match(/(?:Seminal|Cum|Semen|Fluid)[^\n:]*(?:Volume|Qty|Amount|Level)?[^:]*:\s*([^\n║╠╚╔|]+)/i); if (seminalMatch) state.sexModule.male.seminalVolume = seminalMatch[1].trim();
  const ejacMatch = text.match(/[Ee]jaculat(?:ion|ed)[^:]*:?\s*(?:Count|×|x)?\s*(\d+)/); if (ejacMatch) state.sexModule.male.ejaculationCount = parseInt(ejacMatch[1]);
  const vaginaMatch = text.match(/(?:Vagina|Pussy|Canal)[^:]*:\s*([^\n║╠╚╔|]+)/i); if (vaginaMatch) state.sexModule.female.vagina = vaginaMatch[1].trim();
  const cervixMatch = text.match(/Cervix[^:]*:\s*([^\n║╠╚╔|]+)/i); if (cervixMatch) state.sexModule.female.cervix = cervixMatch[1].trim();
  const uterusMatch = text.match(/Uterus[^:]*:\s*([^\n║╠╚╔|]+)/i); if (uterusMatch) state.sexModule.female.uterus = uterusMatch[1].trim();
  const ovariesMatch = text.match(/Ovaries?[^:]*:\s*([^\n║╠╚╔|]+)/i); if (ovariesMatch) state.sexModule.female.ovaries = ovariesMatch[1].trim();
  const lubMatch = text.match(/(?:Lubrication|Wetness|Arousal State)[^:]*:\s*([^\n║╠╚╔|]+)/i); if (lubMatch) state.sexModule.female.lubrication = lubMatch[1].trim();
  const cycleMatch = text.match(/(?:Cycle|Period|Menstrual)[^\n:]*(?:Day)?[^:]*:\s*([^\n║╠╚╔|]+)/i);
  if (cycleMatch) {
    const cycleStr = cycleMatch[1].trim();
    const dayN = cycleStr.match(/Day\s*(\d+)/i) || cycleStr.match(/^(\d+)/);
    if (dayN) state.sexModule.female.menstrualCycle.day = parseInt(dayN[1]);
    if (cycleStr.match(/ovulat/i)) { state.sexModule.female.menstrualCycle.phase = 'ovulation'; state.sexModule.female.menstrualCycle.fertile = true; }
    else if (cycleStr.match(/menstruat|period|bleed/i)) state.sexModule.female.menstrualCycle.phase = 'menstruation';
    else if (cycleStr.match(/follicular|post.period/i)) state.sexModule.female.menstrualCycle.phase = 'follicular';
    else if (cycleStr.match(/luteal|pre.period|pms/i)) state.sexModule.female.menstrualCycle.phase = 'luteal';
    if (cycleStr.match(/fertil/i)) state.sexModule.female.menstrualCycle.fertile = true;
  }
  const intimacyMatch = text.match(/(?:💖|Intimacy)[^\n:]*:\s*([^\n║╠╚╔|]+)/i);
  if (intimacyMatch) { state.sexModule.stimulusDescription = intimacyMatch[1].trim(); if (!state.sexModule.active) { state.sexModule.active = true; state.sexModule.phase = 'flirting'; } }
  const intensityMatch = text.match(/(?:Intensity|Sensory[_\s]?Intensity)[^:]*:\s*(\d+)/i);
  if (intensityMatch) state.sexModule.sensory_metrics.intensity = Math.min(100, parseInt(intensityMatch[1]));
  const thresholdMatch = text.match(/(?:Threshold|Psych[_\s]?Threshold|Psychological[_\s]?Threshold)[^:]*:\s*(\d+)/i);
  if (thresholdMatch) state.sexModule.sensory_metrics.threshold = Math.min(100, parseInt(thresholdMatch[1]));
  const ejacLocMatch = text.match(/(?:Ejaculation[_\s]?Location|Cum[_\s]?Location|Internal|External|Marking)[^:]*:\s*([^\n║╠╚╔|]+)/i);
  if (ejacLocMatch) {
    const loc = ejacLocMatch[1].trim();
    state.sexModule.male.ejaculation_location = loc;
    const timeMatch = text.match(/[⏰🕐]\s*(\d{1,2}:\d{2})/);
    const timestamp = timeMatch ? timeMatch[1] : '';
    const existing = state.sexModule.marking_history.find(m => m.location === loc);
    if (existing) existing.count += 1;
    else state.sexModule.marking_history.push({ location: loc, count: 1, timestamp });
  }
}

function parseReactionModule(text, state) {
  const reactionBlockMatch = text.match(/╔[═]+╗[^\n]*\n\s*║[^║]*REACTION[^║]*MODULE[^║]*║[\s\S]*?╚[═]+╝/i);
  if (!reactionBlockMatch) { const inlineHeader = text.match(/🧠\s*REACTION\s*MODULE/i); if (!inlineHeader) return; }
  const block = reactionBlockMatch ? reactionBlockMatch[0] : text;
  state.reactionModule.active = true;
  const charMatch = block.match(/Character[^:]*:\s*([^\n║╠╚╔|]+)/i); if (charMatch) state.reactionModule.character = charMatch[1].trim();
  const stimMatch = block.match(/Stimulus[^:]*:\s*([^\n║╠╚╔|]+)/i); if (stimMatch) state.reactionModule.stimulus = stimMatch[1].trim();
  const reactionLines = [...block.matchAll(/([\p{Emoji}])\s+([\w\s]+?):\s*["""]?([^"""\n║╠╚╔|]+)["""]?/giu)];
  state.reactionModule.reactions = [];
  for (const m of reactionLines) {
    const label = m[2].trim();
    if (['character', 'stimulus', 'reaction module'].some(s => label.toLowerCase().includes(s))) continue;
    state.reactionModule.reactions.push({ emoji: m[1], label, text: m[3].trim().replace(/[""]/g, '') });
  }
}

function parseNTRModule(text, state) {
  const ntrMatch = text.match(/NTR[_\s]?(?:MODULE|STATUS|ACTIVE|PANEL)[^\n]*/i);
  if (ntrMatch) { state.ntrModule.active = true; parseNTRBlockFields(text, state); }
}

function parseNTRBlockFields(text, state) {
  const jealousyMatch = text.match(/(?:Jealousy|NTR)[^\n:]*Level[^:]*:\s*([^\n║╠╚╔|]+)/i);
  if (jealousyMatch) { const n = jealousyMatch[1].match(/(\d+)/); if (n) state.ntrModule.jealousyLevel = parseInt(n[1]); }
  const partnerMatch = text.match(/NTR\s*Partner[^:]*:\s*([^\n║╠╚╔|]+)/i); if (partnerMatch) state.ntrModule.ntrPartner = partnerMatch[1].trim();
  const stageMatch = text.match(/(?:Betrayal|NTR)\s*Stage[^:]*:\s*([^\n║╠╚╔|]+)/i); if (stageMatch) state.ntrModule.betrayalStage = stageMatch[1].trim();
}

function parseUserCharacter(text, state) {
  const blockMatch = text.match(/USER[_\s]CHARACTER[^:]*:\s*([^\n/|]+)(?:[/|]\s*([^\n|]+))?/i);
  if (blockMatch) { state.userCharacter.name = blockMatch[1].trim(); if (blockMatch[2]) state.userCharacter.relation = blockMatch[2].trim(); }
  const userNameMatch = text.match(/\{\{user\}\}\s*[=:]\s*([^\s,\n]+)/i) || text.match(/(?:^|\n)User(?:name)?[^:]*:\s*([^\n,|]+)/im);
  if (userNameMatch) state.userCharacter.name = userNameMatch[1].trim();
  const userRelMatch = text.match(/User\s+[Rr]elat[^:]*:\s*([^\n,|]+)/i) || text.match(/\{\{user\}\}\s+is\s+(?:the\s+)?([^\n,|.]+)/i);
  if (userRelMatch) state.userCharacter.relation = userRelMatch[1].trim();
  if (!state.userCharacter.relation && state.character.relationship) {
    const mirror = { 'wife': 'husband', 'husband': 'wife', 'girlfriend': 'boyfriend', 'boyfriend': 'girlfriend', 'step-sister': 'step-brother', 'step-brother': 'step-sister', 'step-mom': 'step-son', 'step-son': 'step-mom', 'daughter': 'father', 'father': 'daughter', 'mother': 'son', 'son': 'mother' };
    const rel = state.character.relationship?.toLowerCase() || '';
    for (const [k, v] of Object.entries(mirror)) { if (rel.includes(k)) { state.userCharacter.relation = v; break; } }
  }
  if (state.character.name && state.character.name !== 'Unknown') {
    const charRel = state.userCharacter.relation || state.character.relationship || 'partner';
    const existingIdx = state.userCharacter.relationships.findIndex(r => r.target_name?.toLowerCase() === state.character.name?.toLowerCase());
    const charRelObj = { target_name: state.character.name, type: charRel, strength: Math.max(state.progressions?.affection || 70, 50) };
    if (existingIdx >= 0) state.userCharacter.relationships[existingIdx] = charRelObj;
    else state.userCharacter.relationships.push(charRelObj);
  }
  for (const npc of state.npcs) {
    if (!npc.relationships) continue;
    for (const rel of npc.relationships) {
      const targetLower = rel.target_name?.toLowerCase() || '';
      const userNameLower = state.userCharacter.name?.toLowerCase() || 'user';
      if (targetLower === userNameLower || targetLower === 'user' || targetLower === '{{user}}') {
        const reverseTypes = { rival: 'rival', hostile: 'hostile', friendly: 'friendly', romantic: 'admirer', protective: 'protected', submissive: 'dominant' };
        const reverseType = reverseTypes[rel.type] || rel.type;
        const existingIdx = state.userCharacter.relationships.findIndex(r => r.target_name?.toLowerCase() === npc.name?.toLowerCase());
        if (existingIdx < 0) state.userCharacter.relationships.push({ target_name: npc.name, type: reverseType, strength: rel.strength });
      }
    }
  }
}

function parseRelationshipData(text, state) {
  const relMatch = text.match(/(?:Relation(?:ship)?(?:\s+to\s+(?:user|{{user}}|protagonist))?)[^:]*:\s*([^\n║╠╚╔|,]+)/i);
  if (relMatch) { const relStr = relMatch[1].trim(); if (!/^\d+%?$/.test(relStr)) state.character.relationship = relStr; }
  for (const npc of state.npcs) {
    if (!npc.relation) {
      const safeName = npc.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(safeName + '[^\\n]*[Rr]elat[^:]*:\\s*([^\\n║╠╚╔|,]+)', 'i');
      const m = text.match(re);
      if (m) npc.relation = m[1].trim();
    }
  }
}

function parseBodyDescription(text, state) {
  const bodyBlock = text.match(/(?:BODY[_\s]?(?:DESCRIPTION|DESC|PANEL|STATUS)|PHYSICAL[_\s]?(?:DESC|STATUS))[^\n]*\n([\s\S]*?)(?=╚|╔|$)/i);
  const src = bodyBlock ? bodyBlock[1] : text;
  const kv = (key) => { const m = src.match(new RegExp(key + '[^:]*:\\s*([^\\n║╠╚╔|]+)', 'i')); return m ? m[1].trim() : ''; };
  state.body.description.hair = kv('(?:💇|Hair)') || state.body.description.hair;
  state.body.description.eyes = kv('(?:👁️|Eyes?)') || state.body.description.eyes;
  state.body.description.face = kv('(?:Face|Facial)') || state.body.description.face;
  state.body.description.chest = kv('(?:🫁|Chest|Bust|Breasts?)') || state.body.description.chest;
  state.body.description.waist = kv('(?:Waist|Abs|Belly)') || state.body.description.waist;
  state.body.description.hips = kv('(?:Hips?|Thighs?)') || state.body.description.hips;
  state.body.description.legs = kv('(?:Legs?|Hooves?|Paws?)') || state.body.description.legs;
  state.body.description.tail = kv('(?:🐄|Tail)') || state.body.description.tail;
  state.body.description.horns = kv('(?:Horns?|Antlers?)') || state.body.description.horns;
  state.body.description.special = kv('(?:Special|Beast|Monster|Trait)') || state.body.description.special;
}

function parseInventorySlots(text, state) {
  const slots = {
    head: ['(?:👒|🎩|Head)'], upper: ['(?:👕|👚|Upper|Shirt|Top|Wearing)'], lower: ['(?:👖|Lower|Pants|Skirt|Shorts)'],
    underwear: ['(?:🩲|🩱|👙|Underwear|Bra|Panty|Panties|Lingerie)'], footwear: ['(?:👟|👠|👡|👢|🥾|Footwear|Shoes?|Boots?|Sandals?)'], accessories: ['(?:💍|💎|Accessories|Jewelry|Bracelet|Necklace)'],
  };
  for (const [slot, patterns] of Object.entries(slots)) {
    for (const p of patterns) {
      const m = text.match(new RegExp(p + '[^:]*:\\s*([^\\n║╠╚╔|]+)', 'i'));
      if (m) { const val = m[1].trim(); if (val) state.clothingSlots[slot] = val; break; }
    }
  }
}

function parseUICommands(text, state) {
  const cmdBlock = text.match(/(?:UI[_\s]COMMANDS?|INTERFACE[_\s]CONTROL)[^\n]*\n([\s\S]*?)(?=\n\n|\n(?:#|[A-Z]{3,})|$)/i);
  const src = cmdBlock ? cmdBlock[1] : text;
  const tabMatch = src.match(/(?:switch_tab|active_tab|suggested_tab)[^:]*:\s*([^\n,|]+)/i);
  if (tabMatch) state.ui_commands.suggested_tab = tabMatch[1].trim().toLowerCase();
  const notifMatch = src.match(/(?:notification|toast|alert)[^:]*:\s*([^\n|]+)/i);
  if (notifMatch) {
    const nText = notifMatch[1].trim();
    if (/(?:crit|severe|urgent)/i.test(nText)) state.ui_commands.notification = { level: 'critical', message: nText.replace(/^(critical|severe|urgent)[:\s]*/i, '') };
    else if (/(?:warn|caution)/i.test(nText)) state.ui_commands.notification = { level: 'warning', message: nText.replace(/^(warning|caution)[:\s]*/i, '') };
    else state.ui_commands.notification = { level: 'info', message: nText };
  }
  const mapFocusMatch = src.match(/(?:map_focus|focus_map|focus)[^:]*:\s*([^\n,|]+)/i);
  if (mapFocusMatch) state.ui_commands.map_focus = mapFocusMatch[1].trim();
  const mapRevealMatch = src.match(/(?:map_reveal|reveal)[^:]*:\s*([^\n,|]+)/i);
  if (mapRevealMatch) state.ui_commands.map_reveal = mapRevealMatch[1].split(',').map(s => s.trim()).filter(Boolean);
}

function parseImgModule(text, state) {
  const imgBlock = text.match(/(?:IMG[_\s]MODULE|IMAGE[_\s]GEN|PROMPT[_\s]DATA)[^\n]*\n([\s\S]*?)(?=\n\n|(?:╚|$))/i);
  const src = imgBlock ? imgBlock[1] : text;
  const charAnchorMatch = src.match(/(?:char_anchor|char\s+appearance|physique\s+anchor)[^:]*:\s*([^\n]+)/i); if (charAnchorMatch) state.img_module.anchors.char = charAnchorMatch[1].trim();
  const userAnchorMatch = src.match(/(?:user_anchor|user\s+appearance)[^:]*:\s*([^\n]+)/i); if (userAnchorMatch) state.img_module.anchors.user = userAnchorMatch[1].trim();
  const posMatch = src.match(/(?:positive[_\s]prompt|pos\s+prompt)[^:]*:\s*([^\n]+)/i); if (posMatch) state.img_module.scene.positive = posMatch[1].trim();
  const negMatch = src.match(/(?:negative[_\s]prompt|neg\s+prompt)[^:]*:\s*([^\n]+)/i); if (negMatch) state.img_module.scene.negative = negMatch[1].trim();
  const camMatch = src.match(/(?:camera[_\s]suggestions?|shot[_\s]suggestions?)[^:]*:\s*([^\n]+)/i);
  if (camMatch) state.img_module.scene.camera_suggestions = camMatch[1].split(',').map(s => s.trim()).filter(Boolean);
  const ckptMatch = src.match(/(?:checkpoint|model)[^:]*:\s*([^\n,|]+)/i); if (ckptMatch) state.img_module.params.checkpoint = ckptMatch[1].trim();
  const samplerMatch = src.match(/(?:sampler)[^:]*:\s*([^\n,|]+)/i); if (samplerMatch) state.img_module.params.sampler = samplerMatch[1].trim();
  const stepsMatch = src.match(/(?:steps)[^:]*:\s*(\d+)/i); if (stepsMatch) state.img_module.params.steps = parseInt(stepsMatch[1]);
  const cfgMatch = src.match(/(?:cfg[_\s]scale|cfg)[^:]*:\s*([\d.]+)/i); if (cfgMatch) state.img_module.params.cfg = parseFloat(cfgMatch[1]);
  const clipMatch = src.match(/(?:clip[_\s]skip)[^:]*:\s*(\d+)/i); if (clipMatch) state.img_module.params.clip_skip = parseInt(clipMatch[1]);
  const loraMatch = src.match(/(?:loras?|lora[_\s]list)[^:]*:\s*([^\n]+)/i);
  if (loraMatch) {
    const loraParts = loraMatch[1].split(',').map(s => s.trim()).filter(Boolean);
    state.img_module.params.loras = loraParts.map(p => { const [name, weight] = p.split(':'); return { name: name.trim(), weight: parseFloat(weight) || 0.7 }; });
  }
  if (src.match(/hires[_\s]fix[^:]*:\s*(?:on|enabled|true|yes)/i)) state.img_module.params.hires_fix.enabled = true;
  const upscaleMatch = src.match(/(?:upscale|scale)[^:]*:\s*([\d.]+)/i); if (upscaleMatch) state.img_module.params.hires_fix.upscale = parseFloat(upscaleMatch[1]);
  const denoiseMatch = src.match(/(?:denoising?)[^:]*:\s*([\d.]+)/i); if (denoiseMatch) state.img_module.params.hires_fix.denoising = parseFloat(denoiseMatch[1]);
  const arMatch = src.match(/(?:aspect[_\s]ratio|ratio)[^:]*:\s*([^\n,|]+)/i); if (arMatch) state.img_module.params.aspect_ratio = arMatch[1].trim();
  const resMatch = src.match(/(?:resolution|res)[^:]*:\s*([^\n,|]+)/i); if (resMatch) state.img_module.params.resolution = resMatch[1].trim();
}

function parseMetaInfo(text, state) {
  const turnIdMatch = text.match(/(?:turn_id|turn\s+id)[^:]*:\s*([^\n,|]+)/i); if (turnIdMatch) state.meta.turn_id = turnIdMatch[1].trim();
  const parentTurnMatch = text.match(/(?:parent_turn_id|parent\s+turn)[^:]*:\s*([^\n,|]+)/i); if (parentTurnMatch) state.meta.parent_turn_id = parentTurnMatch[1].trim();
  const branchMatch = text.match(/(?:branch_index|branch)[^:]*:\s*(\d+)/i); if (branchMatch) state.meta.branch_index = parseInt(branchMatch[1]);
  if (text.match(/(?:regenerat|re-roll|new\s+response|retry|alternate)/i)) { if (!state.meta.branch_index) state.meta.branch_index = 1; }
}

function syncClothingSlots(state) {
  if (state.clothing.upperBody && state.clothing.upperBody !== 'Shirt') state.clothingSlots.upper = state.clothing.upperBody;
  if (state.clothing.lowerBody && state.clothing.lowerBody !== 'Pants') state.clothingSlots.lower = state.clothing.lowerBody;
  if (state.clothing.underwear && state.clothing.underwear !== 'Underwear') state.clothingSlots.underwear = state.clothing.underwear;
}

export function generateMiniMap(location) {
  const roomGrid = {
    'bedroom': { x: 2, y: 1, label: 'BED' }, 'master bedroom': { x: 2, y: 1, label: 'BED' },
    'kitchen': { x: 0, y: 1, label: 'KIT' }, 'living room': { x: 1, y: 1, label: 'LVN' },
    'bathroom': { x: 2, y: 0, label: 'BTH' }, 'hallway': { x: 1, y: 0, label: 'HAL' },
    'office': { x: 0, y: 0, label: 'OFF' }, 'garden': { x: 1, y: 2, label: 'GRD' },
    'garage': { x: 0, y: 2, label: 'GAR' }, 'barn': { x: 2, y: 2, label: 'BRN' },
    'lake': { x: 0, y: 2, label: 'LKE' }, 'hilltop': { x: 2, y: 0, label: 'HIL' },
    'home': { x: 1, y: 1, label: 'HOM' },
  };
  const current = location.currentRoom?.toLowerCase() || 'home';
  const visited = (location.visitedRooms || []).map(r => r.toLowerCase());
  const grid = Array(3).fill(null).map(() => Array(3).fill(null));
  for (const [room, pos] of Object.entries(roomGrid)) {
    const isVisited = visited.includes(room) || current.includes(room) || room.includes(current);
    const isCurrent = current === room || current.includes(room) || room.includes(current);
    grid[pos.y][pos.x] = { label: pos.label, visited: isVisited, current: isCurrent };
  }
  return grid;
}

export function getExpressionEmoji(expression, mood) {
  const key = (expression || mood || '').toLowerCase();
  const map = {
    neutral: '😐', happy: '😊', flustered: '😳', embarrassed: '😳', aroused: '😍', angry: '😠', sad: '😢', crying: '😭',
    scared: '😨', surprised: '😲', shy: '🥺', loving: '🥰', lustful: '😏', tired: '😴', confused: '😕', disgusted: '😤',
    excited: '🤩', nervous: '😰', proud: '😌', melancholy: '😞', determined: '😤', playful: '😄', seductive: '😘', guilty: '😬',
    cheerful: '😁', devastated: '😩', resigned: '😔', vulnerable: '🥹', hopeful: '🌟', torn: '😣', heartbroken: '💔', jealous: '😒',
    reflective: '🤔', receptive: '🙂', volatile: '🌋', subdued: '😶',
  };
  for (const [k, v] of Object.entries(map)) { if (key.includes(k)) return v; }
  return '😐';
}

export function getWeatherIcon(weather) {
  const w = weather?.toLowerCase() || '';
  if (w.includes('sun') || w.includes('clear') || w.includes('golden')) return '☀️';
  if (w.includes('rain') || w.includes('shower')) return '🌧️';
  if (w.includes('storm') || w.includes('thunder')) return '⛈️';
  if (w.includes('snow') || w.includes('blizzard')) return '❄️';
  if (w.includes('cloud')) return '☁️';
  if (w.includes('wind')) return '💨';
  if (w.includes('night') || w.includes('dark') || w.includes('twilight') || w.includes('dusk') || w.includes('moon')) return '🌙';
  if (w.includes('fog') || w.includes('mist')) return '🌫️';
  if (w.includes('sunset') || w.includes('orange') || w.includes('purple sky')) return '🌅';
  return '🌤️';
}

export function getClothingEmoji(slot, value) {
  const none = !value || value.toLowerCase() === 'none';
  if (slot === 'head') return none ? '🎩' : '👒';
  if (slot === 'upper') {
    if (!none && /shirt|blouse|top|vest/i.test(value)) return '👕';
    if (!none && /dress/i.test(value)) return '👗';
    if (!none && /jacket|coat/i.test(value)) return '🧥';
    if (!none && /swimsuit|bikini/i.test(value)) return '👙';
    return '👚';
  }
  if (slot === 'lower') {
    if (!none && /skirt/i.test(value)) return '👗';
    if (!none && /shorts/i.test(value)) return '🩳';
    return '👖';
  }
  if (slot === 'underwear') { if (!none && /bra/i.test(value)) return '👙'; return '🩲'; }
  if (slot === 'footwear') {
    if (!none && /heel/i.test(value)) return '👠';
    if (!none && /boot/i.test(value)) return '👢';
    if (!none && /sandal|flip/i.test(value)) return '🩴';
    return '👟';
  }
  if (slot === 'accessories') return '💍';
  return '👔';
}

export function getSexPhaseColor(phase) {
  if (phase === 'sex') return '#FF2D78';
  if (phase === 'flirting') return '#BF5FFF';
  if (phase === 'post-sex') return '#FFD700';
  return '#00FFF5';
}

export function getMenstrualPhaseInfo(phase) {
  const phases = {
    menstruation: { label: 'Menstruation', color: '#FF2D78', days: '1-5', fertile: false },
    follicular: { label: 'Follicular', color: '#00FFF5', days: '6-13', fertile: false },
    ovulation: { label: 'Ovulation', color: '#39FF14', days: '14', fertile: true },
    luteal: { label: 'Luteal', color: '#FFD700', days: '15-28', fertile: false },
  };
  return phases[phase] || { label: phase || 'Unknown', color: '#ffffff30', days: '?', fertile: false };
}
```

---

*Próximo: `docs/07-LIB_MIDDLEWARE.md` — `stateMiddleware.js`.*