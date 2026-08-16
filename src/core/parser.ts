/**
 * ═══════════════════════════════════════════════════════════════════
 * Eros Status Parser v3.0 — TypeScript
 * Framework-agnostic: zero dependências de React, DOM ou StageBase.
 *
 * Converte saída de texto da IA em um objeto parcial do estado ESS.
 * Baseado fielmente no erosParser.js original, com adaptações para
 * os tipos definidos em T03 (ErosStatusState).
 * ═══════════════════════════════════════════════════════════════════
 */

import type {
  ErosStatusState,
  AuditIssue,
  AuditState,
  CharacterState,
  SystemState,
  UserCharacterState,
  Progressions,
  ClothingSlots,
  BodyState,
  LocationState,
  NPC,
  RelationshipLink,
  SexModule,
  ReactionModule,
  NTRModule,
  UICommands,
  MetaState,
  ImageModule,
  Item,
} from '../types/eros-status';

import {
  DEFAULT_PROGRESSIONS,
  DEFAULT_CLOTHING_SLOTS,
  DEFAULT_BODY,
  DEFAULT_LOCATION,
  DEFAULT_SEX_MODULE,
  DEFAULT_REACTION_MODULE,
  DEFAULT_NTR_MODULE,
  DEFAULT_UI_COMMANDS,
  DEFAULT_META,
  DEFAULT_IMG_MODULE,
  deepClone,
} from './state';

// ---------------------------------------------------------------------------
// Estado mutável interno de parse (inclui campos temporários/normalizados)
// ---------------------------------------------------------------------------

type MutableClothing = {
  upperBody?: string;
  lowerBody?: string;
  underwear?: string;
  accessories?: string;
  condition?: string;
};

type ParsedState = Omit<ErosStatusState, 'clothingSlots' | 'inventory' | 'userCharacter' | 'meta'> & {
  userCharacter: UserCharacterState & { relationships: RelationshipLink[] };
  clothing: MutableClothing;
  clothingSlots: ClothingSlots;
  inventory: { items: (string | Item)[] };
  relationships: RelationshipLink[];
  aiInstructions: string[];
  importantMoments: string[];
  lastRawBlock: string;
  turnCount: number;
  meta: MetaState & { coerced_fields: string[] };
};

function createParsedState(): ParsedState {
  return {
    system: { day: 1, time: '??:??', weather: 'Unknown', location: 'Unknown', sceneType: 'daily_life', ambiance: '' } as SystemState,
    character: {
      name: 'Unknown', role: '', avatarUrl: '', expression: 'neutral', mood: 'Neutral',
      thoughts: '', shamefulThought: '', relationship: '',
    } as CharacterState,
    userCharacter: { name: 'User', relation: '', mood: 'neutral', summary: '', relationships: [] },
    progressions: { ...DEFAULT_PROGRESSIONS },
    clothing: { upperBody: 'Shirt', lowerBody: 'Pants', underwear: 'Underwear', accessories: 'None', condition: 'Worn' },
    clothingSlots: { ...DEFAULT_CLOTHING_SLOTS },
    body: deepClone(DEFAULT_BODY),
    location: deepClone(DEFAULT_LOCATION),
    inventory: { items: [] },
    goals: [],
    npcs: [],
    relationships: [],
    sexModule: deepClone(DEFAULT_SEX_MODULE),
    reactionModule: deepClone(DEFAULT_REACTION_MODULE),
    ntrModule: deepClone(DEFAULT_NTR_MODULE),
    ui_commands: deepClone(DEFAULT_UI_COMMANDS),
    meta: { ...deepClone(DEFAULT_META), coerced_fields: [] },
    img_module: deepClone(DEFAULT_IMG_MODULE),
    audit: { issues: [], ignoredIds: [], correctedIds: [] },
    aiInstructions: [],
    importantMoments: [],
    lastRawBlock: '',
    turnCount: 0,
  };
}

// ---------------------------------------------------------------------------
// API pública
// ---------------------------------------------------------------------------

export function parseErosStatusFromMessage(messageText: string): Partial<ErosStatusState> | null {
  if (!messageText) return null;

  const state = createParsedState();
  let foundAnyData = false;

  const allBrackets = [...messageText.matchAll(/\[([^\]]+)\]/g)];
  for (const m of allBrackets) {
    if (/[\d]%|\p{Emoji}/u.test(m[1])) {
      foundAnyData = true;
      parseCondensedBlock(m[1], state);
    }
  }

  const terminalBlocks = extractAllTerminalBlocks(messageText);
  for (const block of terminalBlocks) {
    foundAnyData = true;
    state.lastRawBlock = block;
    parseTerminalBlock(block, state);
  }

  const jsonBlock = extractJsonBlock(messageText);
  if (jsonBlock) {
    foundAnyData = true;
    parseJsonBlock(jsonBlock, state);
  }

  parseInlineKeyValues(messageText, state);

  const charFormatMatch = messageText.match(/CHAR_FORMAT:\s*(\w+)=/);
  if (charFormatMatch) {
    state.character.name = charFormatMatch[1];
    foundAnyData = true;
  }
  const charNameMatch = messageText.match(/^#([^[\n]+)\[([^\]]+)\]/m);
  if (charNameMatch) {
    state.character.name = charNameMatch[1].trim();
    state.character.role = charNameMatch[2].trim();
    foundAnyData = true;
  }

  const dayHeaderMatch = messageText.match(/Day\s+(\d+)\s*[|│]\s*(\d{1,2}:\d{2})\s*[|│]\s*([^\n|│]+)[|│]\s*📍?\s*([^\n]+)/i);
  if (dayHeaderMatch) {
    state.system.day = parseInt(dayHeaderMatch[1], 10);
    state.system.time = dayHeaderMatch[2];
    const weatherRaw = dayHeaderMatch[3].trim();
    state.system.weather = normalizeWeather(weatherRaw);
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

  return foundAnyData ? toErosStatusState(state) : null;
}

/**
 * Converte um objeto JSON já extraído (ex.: resposta do OpenRouter) em
 * estado ESS diretamente — sem re-serializar para string e re-parsear.
 * Usado pelo painel de extração por IA (AIConfigPanel).
 */
export function parseErosStatusFromJson(
  json: Record<string, unknown> | null | undefined,
): Partial<ErosStatusState> | null {
  if (!json || Object.keys(json).length === 0) return null;
  const state = createParsedState();
  parseJsonBlock(json, state);
  syncClothingSlots(state);
  return toErosStatusState(state);
}

function toErosStatusState(state: ParsedState): Partial<ErosStatusState> {
  // Converte itens string para objetos Item
  const items: Item[] = state.inventory.items.map((it) =>
    typeof it === 'string' ? { name: it } : it,
  );

  // Sincroniza relacionamentos do userCharacter
  const userCharacter: UserCharacterState = {
    ...state.userCharacter,
    relationships: state.userCharacter.relationships.map((r) => ({ ...r })),
  };

  return {
    system: state.system,
    character: state.character,
    userCharacter,
    progressions: state.progressions,
    clothingSlots: state.clothingSlots,
    body: state.body,
    location: state.location,
    inventory: { items },
    goals: state.goals,
    npcs: state.npcs,
    sexModule: state.sexModule,
    reactionModule: state.reactionModule,
    ntrModule: state.ntrModule,
    ui_commands: state.ui_commands,
    meta: state.meta,
    img_module: state.img_module,
    audit: state.audit,
    aiInstructions: state.aiInstructions,
  };
}

// ---------------------------------------------------------------------------
// Helpers exportados
// ---------------------------------------------------------------------------

export function parseCondensedBlock(block: string, state: ParsedState): void {
  const allMatches = [...block.matchAll(/(\p{Emoji})\s*(\d+)%/gu)];
  for (const m of allMatches) {
    const emoji = m[1];
    const val = parseInt(m[2], 10);
    mapEmojiToProgression(emoji, val, state.progressions);
  }

  const locMatch = block.match(/📍([^|\]\u23F0]+?)(?:\s*→\s*([^|\]\u23F0]+?))?(?=\s*[\]\u23F0]|$)/u);
  if (locMatch) {
    state.location.currentRoom = locMatch[1].trim().replace(/^→\s*/, '');
    if (locMatch[2]) state.location.building = locMatch[2].trim();
  }
  const timeMatch = block.match(/[\u23F0\u{1F550}]\s*(\d{1,2}:\d{2})/u);
  if (timeMatch) state.system.time = timeMatch[1];

  state.system.weather = detectWeatherFromText(block) || state.system.weather;
}

function mapEmojiToProgression(emoji: string, val: number, progressions: Progressions): void {
  if (['💕', '❤️', '💖', '💝'].includes(emoji)) progressions.affection = val;
  else if (emoji === '🎯') progressions.obedience = val;
  else if (emoji === '🔥') progressions.libido = val;
  else if (emoji === '🍑') progressions.arousal = val;
  else if (emoji === '😊') progressions.happiness = val;
  else if (['⭐', '🌟'].includes(emoji)) progressions.trust = val;
  else if (['💀', '☠️'].includes(emoji)) progressions.corruption = val;
  else if (emoji === '😳') progressions.embarrassment = val;
  else if (['😰', '😱'].includes(emoji)) progressions.anxiety = val;
  else if (['😨', '😱'].includes(emoji)) progressions.fear = val;
  else if (['😠', '🤬'].includes(emoji)) progressions.anger = val;
  else if (['😬', '😟'].includes(emoji)) progressions.nervousness = val;
  else if (emoji === '😤') progressions.tension = val;
  else if (['🙈', '😖'].includes(emoji)) progressions.shame = val;
  else if (['💋', '🫦'].includes(emoji)) progressions.desire = val;
  else if (['🤩', '😲'].includes(emoji)) progressions.awe = val;
  else if (['😞', '😔'].includes(emoji)) progressions.guilt = val;
  else if (['⚡', '🎉'].includes(emoji)) progressions.excitement = val;
  else if (['😢', '😭'].includes(emoji)) progressions.sadness = val;
  else if (['🫡', '🙇'].includes(emoji)) progressions.submission = val;
  else if (['💚', '🟢'].includes(emoji)) progressions.jealousy = val;
  else if (['💗', '🥰'].includes(emoji)) progressions.love = val;
}

function extractAllTerminalBlocks(text: string): string[] {
  const results: string[] = [];
  const re = /╔[═╦]+╗[\s\S]*?╚[═╩]+╝/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) results.push(m[0]);
  if (results.length === 0) {
    const simple = text.match(/┌[─]+┐[\s\S]*?└[─]+┘/);
    if (simple) results.push(simple[0]);
  }
  return results;
}

export function parseTerminalBlock(block: string, state: ParsedState): void {
  const headerMatch = block.match(/Day\s*(\d+)[^\d]*(\d{1,2}:\d{2})/i);
  if (headerMatch) {
    state.system.day = parseInt(headerMatch[1], 10);
    state.system.time = headerMatch[2];
  }
  const charMatch = block.match(/#([^[\n]+)\[([^\]]+)\]/);
  if (charMatch) {
    state.character.name = charMatch[1].trim();
    state.character.role = charMatch[2].trim();
  }
  const moodMatch = block.match(/(?:💬|Mood)[^\n:]*:\s*([^\n║╠╚╔|]+)/i);
  if (moodMatch) state.character.mood = cleanBlockValue(moodMatch[1]);
  const relMatch = block.match(/(?:🤝|Relationship)[^\n:]*:\s*([^\n║╠╚╔|]+)/i);
  if (relMatch && state.npcs.length === 0) state.character.relationship = relMatch[1].trim();
  const affMatch = block.match(/(?:❤️|💕|Love|Affection|Fav)[^\n:]*:\s*([^\n║╠╚╔|]+)/i);
  if (affMatch) {
    const numMatch = affMatch[1].match(/(\d+)/);
    if (numMatch) state.progressions.affection = parseInt(numMatch[1], 10);
    else (state.character as Record<string, unknown>).loveStatus = affMatch[1].trim();
  }
  const corrMatch = block.match(/(?:🧠|Corruption)[^\n:]*:\s*([^\n║╠╚╔|]+)/i);
  if (corrMatch) {
    const n = corrMatch[1].match(/(\d+)/);
    if (n) state.progressions.corruption = parseInt(n[1], 10);
  }
  const healthMatch = block.match(/(?:🩺|Health)[^\n:]*:\s*([^\n║╠╚╔|]+)/i);
  if (healthMatch) {
    const n = healthMatch[1].match(/(\d+)/);
    if (n) state.progressions.health = parseInt(n[1], 10);
    else (state.character as Record<string, unknown>).healthStatus = healthMatch[1].trim();
  }
  const upperMatch = block.match(/(?:👕|Upper|Wearing)[^\n:]*:\s*([^\n║╠╚╔|]+)/i);
  if (upperMatch) state.clothing.upperBody = upperMatch[1].trim();
  const lowerMatch = block.match(/(?:👖|Lower)[^\n:]*:\s*([^\n║╠╚╔|]+)/i);
  if (lowerMatch) state.clothing.lowerBody = lowerMatch[1].trim();
  const locMatch = block.match(/(?:📍|Location)[^\n:]*:\s*([^\n║╠╚╔|→]+)(?:→\s*([^\n║╠╚╔|]+))?/i);
  if (locMatch) {
    state.location.currentRoom = locMatch[1].trim();
    if (locMatch[2]) state.location.building = locMatch[2].trim();
  }
  const timeMatch = block.match(/(?:🕗|⏰|Time)[^\n:]*:\s*([^\n║╠╚╔|]+)/i);
  if (timeMatch) {
    const t = timeMatch[1].match(/\d{1,2}:\d{2}/);
    if (t) state.system.time = t[0];
    else (state.system as Record<string, unknown>).timeDesc = timeMatch[1].trim();
  }
  const weatherMatch = block.match(/(?:🌤️|Weather)[^\n:]*:\s*([^\n║╠╚╔|]+)/i);
  if (weatherMatch) state.system.weather = cleanBlockValue(weatherMatch[1]);
  const ambianceMatch = block.match(/(?:🔊|Ambiance|Ambience)[^\n:]*:\s*([^\n║╠╚╔|]+)/i);
  if (ambianceMatch) state.system.ambiance = ambianceMatch[1].trim();
  const thoughtMatch = block.match(/(?:Surface|Thought|Thinking)[^\n:]*:\s*'([^']+)'/i);
  if (thoughtMatch) state.body.thoughts = thoughtMatch[1];
  const itemsMatch = block.match(/(?:💄|Items?)[^\n:]*:\s*([^\n║╠╚╔|]+)/i);
  if (itemsMatch) {
    const items = itemsMatch[1].split(',').map((s) => s.trim()).filter(Boolean);
    if (items.length) state.inventory.items = items;
  }
  parseSexBlockFields(block, state);
  parseNTRBlockFields(block, state);
}

function cleanBlockValue(value: string): string {
  return value.trim().replace(/[[\]]/g, '').replace(/[║╠╚╔]/g, '').trim();
}

function extractJsonBlock(text: string): Record<string, unknown> | null {
  const match = text.match(/```json\s*([\s\S]*?)```/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function parseJsonBlock(json: Record<string, unknown>, state: ParsedState): void {
  if (json.progressions) Object.assign(state.progressions, json.progressions as Progressions);
  if (json.system) Object.assign(state.system, json.system as SystemState);
  if (json.location) Object.assign(state.location, json.location as LocationState);
  if (json.clothing) Object.assign(state.clothing, json.clothing as MutableClothing);
  if (json.clothingSlots) Object.assign(state.clothingSlots, json.clothingSlots as ClothingSlots);
  if (json.body) Object.assign(state.body, json.body as BodyState);
  if (json.character) Object.assign(state.character, json.character as CharacterState);
  if (json.npcs) state.npcs = (json.npcs as NPC[]).map((n) => ({ ...n }));
  if ((json.inventory as { items?: unknown[] } | undefined)?.items) {
    state.inventory.items = (json.inventory as { items: unknown[] }).items.map((it) =>
      typeof it === 'string' ? { name: it } : (it as Item),
    );
  }
  if (json.sexModule) Object.assign(state.sexModule, json.sexModule as SexModule);
  if (json.ntrModule) Object.assign(state.ntrModule, json.ntrModule as NTRModule);
  if (json.reactionModule) Object.assign(state.reactionModule, json.reactionModule as ReactionModule);
  if (json.userCharacter) Object.assign(state.userCharacter, json.userCharacter as UserCharacterState);
  if (json.ui_commands) {
    const uic = json.ui_commands as UICommands;
    if (uic.suggested_tab) state.ui_commands.suggested_tab = uic.suggested_tab;
    if (uic.notification) Object.assign(state.ui_commands.notification ?? {}, uic.notification);
    if (uic.map_focus) state.ui_commands.map_focus = uic.map_focus;
    if (uic.map_reveal) state.ui_commands.map_reveal = uic.map_reveal;
  }
  if (json.meta) Object.assign(state.meta, json.meta as MetaState);
  if (json.img_module) {
    const img = json.img_module as ImageModule;
    if (img.anchors) Object.assign(state.img_module.anchors ?? {}, img.anchors);
    if (img.scene) Object.assign(state.img_module.scene ?? {}, img.scene);
    if (img.params) Object.assign(state.img_module.params ?? {}, img.params);
  }
  if (Array.isArray(json.goals)) {
    state.goals = json.goals.filter((g): g is string => typeof g === 'string');
  }
  if (Array.isArray(json.aiInstructions)) {
    state.aiInstructions = json.aiInstructions.filter((a): a is string => typeof a === 'string');
  }
  if (json.audit && typeof json.audit === 'object') {
    const audit = json.audit as Partial<AuditState>;
    if (Array.isArray(audit.issues)) {
      state.audit.issues = audit.issues.map((i) => ({ ...(i as AuditIssue) }));
    }
    if (Array.isArray(audit.ignoredIds)) state.audit.ignoredIds = [...audit.ignoredIds];
    if (Array.isArray(audit.correctedIds)) state.audit.correctedIds = [...audit.correctedIds];
  }
}

function parseInlineKeyValues(text: string, state: ParsedState): void {
  const moodMatch = text.match(/(?:[\p{Emoji}]\s+)?Mood[^:]*:\s*([A-Za-z\s,]+?)(?:\n|,\s+\w|$)/iu);
  if (moodMatch) state.character.mood = moodMatch[1].trim();

  const locParts = text.match(/(?:Location|Room)[^:]*:\s*([^→\n]+)(?:→\s*([^\n]+))?/i);
  if (locParts) {
    state.location.currentRoom = locParts[1].trim();
    if (locParts[2]) state.location.building = locParts[2].trim();
  }

  const invMatch = text.match(/(?:Items?|Inventory)[^:]*:\s*([^\n║╠╚╔|]+)/i);
  if (invMatch) {
    const items = invMatch[1].split(',').map((s) => s.trim()).filter(Boolean);
    state.inventory.items = items;
  }

  const clothingMatch = text.match(/Clothing[^:]*:\s*([^\n]+)/i);
  if (clothingMatch) {
    const parts = clothingMatch[1].trim().split(',').map((s) => s.trim());
    state.clothing.upperBody = parts[0] || '';
    state.clothing.lowerBody = parts.slice(1).join(', ') || '';
  }

  const dayTimeMatch = text.match(/Day\s*(\d+)[^,|]*[,|]\s*(\d{1,2}:\d{2})/i);
  if (dayTimeMatch) {
    state.system.day = parseInt(dayTimeMatch[1], 10);
    state.system.time = dayTimeMatch[2];
  }

  const dynamicStats: { key: keyof Progressions; patterns: string[] }[] = [
    { key: 'anxiety', patterns: ['Anxiety', 'Anxious'] },
    { key: 'fear', patterns: ['Fear', 'Scared'] },
    { key: 'anger', patterns: ['Anger', 'Rage', 'Angry'] },
    { key: 'nervousness', patterns: ['Nervousness', 'Nervous', 'Jitters'] },
    { key: 'tension', patterns: ['Tension', 'Tense'] },
    { key: 'shame', patterns: ['Shame', 'Ashamed'] },
    { key: 'desire', patterns: ['Desire', 'Longing', 'Want'] },
    { key: 'awe', patterns: ['Awe', 'Wonder', 'Amazement'] },
    { key: 'guilt', patterns: ['Guilt', 'Remorse'] },
    { key: 'excitement', patterns: ['Excitement', 'Excited', 'Thrill'] },
    { key: 'sadness', patterns: ['Sadness', 'Sorrow', 'Grief'] },
    { key: 'submission', patterns: ['Submission', 'Submissive'] },
    { key: 'love', patterns: ['Love', 'Romantic'] },
    { key: 'jealousy', patterns: ['Jealousy', 'Envy'] },
  ];

  for (const { key, patterns } of dynamicStats) {
    for (const p of patterns) {
      const m = text.match(new RegExp(p + '[^:\n]*:\\s*(\\d+)%?', 'i'));
      if (m) {
        state.progressions[key] = parseInt(m[1], 10);
        break;
      }
    }
  }
}

export function parseNPCData(text: string, state: ParsedState): void {
  const npcMatches = [...text.matchAll(/NPCs?:[^\n]*\n((?:[-*•]\s*[^\n]+\n?)+)/gi)];
  for (const match of npcMatches) {
    const npcLines = match[1].split('\n').filter((l) => l.trim());
    for (const line of npcLines) {
      const m = line.match(/[-*•]\s*([^([\n]+)(?:\(([^)]+)\))?(?:\[([^\]]+)\])?/);
      if (m) {
        state.npcs.push({ name: m[1].trim(), relation: m[2]?.trim() || '', mood: m[3]?.trim() || 'neutral' });
      }
    }
  }
  const inlineNpc = text.match(/NPCs?[^:]*:\s*([^\n║╠╚╔|]+)/i);
  if (inlineNpc && state.npcs.length === 0) {
    const npcStr = inlineNpc[1];
    if (npcStr.toLowerCase() !== 'none') {
      const entries = npcStr.split(',');
      for (const entry of entries) {
        const m = entry.match(/([^(]+)(?:\(([^)]+)\))?/);
        if (m && m[1].trim()) {
          state.npcs.push({ name: m[1].trim(), relation: m[2]?.trim() || '', mood: 'neutral' });
        }
      }
    }
  }
}

function parseGoals(text: string, state: ParsedState): void {
  const goalsMatch = text.match(/Goals?[^:]*:\s*([^\n║╠╚╔|]+)/i);
  if (goalsMatch) state.goals = goalsMatch[1].split(',').map((s) => s.trim()).filter(Boolean);
  const intentMatch = text.match(/Intentions?[^:]*:\s*([^\n║╠╚╔|]+)/i);
  if (intentMatch) {
    const intents = intentMatch[1].split(',').map((s) => s.trim()).filter(Boolean);
    state.goals = [...new Set([...state.goals, ...intents])];
  }
  const aiMatch = text.match(/AI[_\s]?Instructions?[^:]*:\s*([^\n║╠╚╔|]+)/i);
  if (aiMatch) state.aiInstructions = aiMatch[1].split(',').map((s) => s.trim()).filter(Boolean);
}

function parseThoughts(text: string, state: ParsedState): void {
  const thoughtMatches = [...text.matchAll(/\*~([^~]+)~/g)];
  if (thoughtMatches.length > 0) {
    state.body.thoughts = thoughtMatches[0][1].trim();
    if (thoughtMatches.length > 1) state.body.shamefulThought = thoughtMatches[thoughtMatches.length - 1][1].trim();
  }
  const quotedThought = text.match(/Thoughts?[^:]*:\s*'([^'\n]{3,})'/i);
  if (quotedThought) {
    state.body.thoughts = quotedThought[1].trim();
    return;
  }
  const unquotedThought = text.match(/Thoughts?[^:]*:\s*(.{3,}?)(?:\n|$)/i);
  if (unquotedThought && !state.body.thoughts) {
    state.body.thoughts = unquotedThought[1].trim().replace(/^['"]|['"]$/g, '');
  }
  const shamefulMatch = text.match(/(?:Shameful|Hidden|Secret)\s*[Tt]hought[^:]*:\s*'([^'\n]+)'/i);
  if (shamefulMatch) state.body.shamefulThought = shamefulMatch[1].trim();
}

export function parseSexModule(text: string, state: ParsedState): void {
  const sexBlockMatch = text.match(/(?:🔥|SEX|SEXUAL)[_\s]?(?:STATUS|MODULE|SCENE|PANEL)[^\n]*/i);
  const flirtingMatch = text.match(/(?:FLIRT(?:ING)?|INTIMACY|ROMANCE)[_\s]?(?:STATUS|MODULE|SCENE|PANEL)?[^\n]*/i);
  if (sexBlockMatch) {
    state.sexModule.active = true;
    state.sexModule.phase = 'sex';
    state.system.sceneType = 'sex';
  } else if (flirtingMatch && (text.includes('Intimacy Level') || text.includes('intimacy'))) {
    state.sexModule.active = true;
    state.sexModule.phase = 'flirting';
    state.system.sceneType = 'flirting';
  }
  if (text.match(/post[-\s]sex|afterglow|aftermath|finished|spent|cuddling after/i)) {
    state.sexModule.active = true;
    state.sexModule.phase = 'post-sex';
  }
  parseSexBlockFields(text, state);
}

function parseSexBlockFields(text: string, state: ParsedState): void {
  const kv = (key: string) => {
    const m = text.match(new RegExp(key + '[^:]*:\\s*([^\\n║╠╚╔|]+)', 'i'));
    return m ? m[1].trim() : null;
  };

  const position = kv('(?:Position|Pose|Act)');
  if (position) state.sexModule.position = position;
  const pace = kv('(?:Pace|Speed|Rhythm)');
  if (pace) state.sexModule.pace = pace;
  const orgMatch = text.match(/[Oo]rgasm[^:]*:?\s*(?:Count|×|x)?\s*(\d+)/);
  if (orgMatch) state.sexModule.orgasmCount = parseInt(orgMatch[1], 10);

  const senses: { key: keyof NonNullable<SexModule['senses']>; patterns: string[] }[] = [
    { key: 'sight', patterns: ['(?:👁️|Sight|Visuals?)'] },
    { key: 'sound', patterns: ['(?:🔊|Sound|Audio|Moans?)'] },
    { key: 'smell', patterns: ['(?:👃|Smell|Scent|Aroma)'] },
    { key: 'touch', patterns: ['(?:🤚|Touch|Feel|Texture)'] },
    { key: 'taste', patterns: ['(?:👅|Taste|Flavor)'] },
  ];
  for (const { key, patterns } of senses) {
    const val = kv(patterns[0]);
    if (val) {
      state.sexModule.senses = state.sexModule.senses ?? {};
      (state.sexModule.senses as Record<string, string>)[key] = val;
    }
  }

  const seminalMatch = text.match(/(?:Seminal|Cum|Semen|Fluid)[^\n:]*(?:Volume|Qty|Amount|Level)?[^:]*:\s*([^\n║╠╚╔|]+)/i);
  if (seminalMatch) {
    state.sexModule.male = state.sexModule.male ?? {};
    state.sexModule.male.seminalVolume = seminalMatch[1].trim();
  }
  const ejacMatch = text.match(/[Ee]jaculat(?:ion|ed)[^:]*:?\s*(?:Count|×|x)?\s*(\d+)/);
  if (ejacMatch) {
    state.sexModule.male = state.sexModule.male ?? {};
    state.sexModule.male.ejaculationCount = parseInt(ejacMatch[1], 10);
  }
  const vaginaMatch = text.match(/(?:Vagina|Pussy|Canal)[^:]*:\s*([^\n║╠╚╔|]+)/i);
  if (vaginaMatch) {
    state.sexModule.female = state.sexModule.female ?? {};
    state.sexModule.female.vagina = vaginaMatch[1].trim();
  }
  const cervixMatch = text.match(/Cervix[^:]*:\s*([^\n║╠╚╔|]+)/i);
  if (cervixMatch) {
    state.sexModule.female = state.sexModule.female ?? {};
    state.sexModule.female.cervix = cervixMatch[1].trim();
  }
  const uterusMatch = text.match(/Uterus[^:]*:\s*([^\n║╠╚╔|]+)/i);
  if (uterusMatch) {
    state.sexModule.female = state.sexModule.female ?? {};
    state.sexModule.female.uterus = uterusMatch[1].trim();
  }
  const ovariesMatch = text.match(/Ovaries?[^:]*:\s*([^\n║╠╚╔|]+)/i);
  if (ovariesMatch) {
    state.sexModule.female = state.sexModule.female ?? {};
    state.sexModule.female.ovaries = ovariesMatch[1].trim();
  }
  const lubMatch = text.match(/(?:Lubrication|Wetness|Arousal State)[^:]*:\s*([^\n║╠╚╔|]+)/i);
  if (lubMatch) {
    state.sexModule.female = state.sexModule.female ?? {};
    state.sexModule.female.lubrication = lubMatch[1].trim();
  }
  const cycleMatch = text.match(/(?:Cycle|Period|Menstrual)[^\n:]*(?:Day)?[^:]*:\s*([^\n║╠╚╔|]+)/i);
  if (cycleMatch) {
    state.sexModule.female = state.sexModule.female ?? {};
    const cycleStr = cycleMatch[1].trim();
    const dayN = cycleStr.match(/Day\s*(\d+)/i) || cycleStr.match(/^(\d+)/);
    state.sexModule.female.menstrualCycle = state.sexModule.female.menstrualCycle ?? { day: 1, phase: 'follicular', fertile: false };
    if (dayN) state.sexModule.female.menstrualCycle.day = parseInt(dayN[1], 10);
    if (cycleStr.match(/ovulat/i)) {
      state.sexModule.female.menstrualCycle.phase = 'ovulation';
      state.sexModule.female.menstrualCycle.fertile = true;
    } else if (cycleStr.match(/menstruat|period|bleed/i)) {
      state.sexModule.female.menstrualCycle.phase = 'menstruation';
    } else if (cycleStr.match(/follicular|post.period/i)) {
      state.sexModule.female.menstrualCycle.phase = 'follicular';
    } else if (cycleStr.match(/luteal|pre.period|pms/i)) {
      state.sexModule.female.menstrualCycle.phase = 'luteal';
    }
    if (cycleStr.match(/fertil/i)) state.sexModule.female.menstrualCycle.fertile = true;
  }
  const intimacyMatch = text.match(/(?:💖|Intimacy)[^\n:]*:\s*([^\n║╠╚╔|]+)/i);
  if (intimacyMatch) {
    state.sexModule.stimulusDescription = intimacyMatch[1].trim();
    if (!state.sexModule.active) {
      state.sexModule.active = true;
      state.sexModule.phase = 'flirting';
    }
  }
  const intensityMatch = text.match(/(?:Intensity|Sensory[_\s]?Intensity)[^:]*:\s*(\d+)/i);
  if (intensityMatch) {
    state.sexModule.sensory_metrics = state.sexModule.sensory_metrics ?? {};
    state.sexModule.sensory_metrics.intensity = Math.min(100, parseInt(intensityMatch[1], 10));
  }
  const thresholdMatch = text.match(/(?:Threshold|Psych[_\s]?Threshold|Psychological[_\s]?Threshold)[^:]*:\s*(\d+)/i);
  if (thresholdMatch) {
    state.sexModule.sensory_metrics = state.sexModule.sensory_metrics ?? {};
    state.sexModule.sensory_metrics.threshold = Math.min(100, parseInt(thresholdMatch[1], 10));
  }
  const ejacLocMatch = text.match(/(?:Ejaculation[_\s]?Location|Cum[_\s]?Location|Internal|External|Marking)[^:]*:\s*([^\n║╠╚╔|]+)/i);
  if (ejacLocMatch) {
    const loc = ejacLocMatch[1].trim();
    state.sexModule.male = state.sexModule.male ?? {};
    (state.sexModule.male as Record<string, unknown>).ejaculation_location = loc;
    const timeMatch = text.match(/[\u23F0\u{1F550}]\s*(\d{1,2}:\d{2})/u);
    const timestamp = timeMatch ? timeMatch[1] : '';
    state.sexModule.marking_history = state.sexModule.marking_history ?? [];
    const existing = state.sexModule.marking_history.find(
      (m: unknown) => (m as { location?: string }).location === loc,
    );
    if (existing) {
      (existing as { count: number }).count += 1;
    } else {
      state.sexModule.marking_history.push({ location: loc, count: 1, timestamp });
    }
  }
}

function parseReactionModule(text: string, state: ParsedState): void {
  const reactionBlockMatch = text.match(/╔[═]+╗[^\n]*\n\s*║[^║]*REACTION[^║]*MODULE[^║]*║[\s\S]*?╚[═]+╝/i);
  if (!reactionBlockMatch) {
    const inlineHeader = text.match(/🧠\s*REACTION\s*MODULE/i);
    if (!inlineHeader) return;
  }
  const block = reactionBlockMatch ? reactionBlockMatch[0] : text;
  state.reactionModule.active = true;
  const charMatch = block.match(/Character[^:]*:\s*([^\n║╠╚╔|]+)/i);
  if (charMatch) state.reactionModule.character = charMatch[1].trim();
  const stimMatch = block.match(/Stimulus[^:]*:\s*([^\n║╠╚╔|]+)/i);
  if (stimMatch) state.reactionModule.stimulus = stimMatch[1].trim();
  const reactionLines = [...block.matchAll(/([\p{Emoji}])\s+([\w\s]+?):\s*["""]?([^"""\n║╠╚╔|]+)["""]?/giu)];
  state.reactionModule.reactions = [];
  for (const m of reactionLines) {
    const label = m[2].trim();
    if (['character', 'stimulus', 'reaction module'].some((s) => label.toLowerCase().includes(s))) continue;
    state.reactionModule.reactions.push({ emoji: m[1], label, text: m[3].trim().replace(/[""]/g, '') });
  }
}

function parseNTRModule(text: string, state: ParsedState): void {
  const ntrMatch = text.match(/NTR[_\s]?(?:MODULE|STATUS|ACTIVE|PANEL)[^\n]*/i);
  if (ntrMatch) {
    state.ntrModule.active = true;
    parseNTRBlockFields(text, state);
  }
}

function parseNTRBlockFields(text: string, state: ParsedState): void {
  const jealousyMatch = text.match(/(?:Jealousy|NTR)[^\n:]*Level[^:]*:\s*([^\n║╠╚╔|]+)/i);
  if (jealousyMatch) {
    const n = jealousyMatch[1].match(/(\d+)/);
    if (n) state.ntrModule.jealousyLevel = parseInt(n[1], 10);
  }
  const partnerMatch = text.match(/NTR\s*Partner[^:]*:\s*([^\n║╠╚╔|]+)/i);
  if (partnerMatch) state.ntrModule.ntrPartner = partnerMatch[1].trim();
  const stageMatch = text.match(/(?:Betrayal|NTR)\s*Stage[^:]*:\s*([^\n║╠╚╔|]+)/i);
  if (stageMatch) state.ntrModule.betrayalStage = stageMatch[1].trim();
}

function parseUserCharacter(text: string, state: ParsedState): void {
  const blockMatch = text.match(/USER[_\s]CHARACTER[^:]*:\s*([^\n/|]+)(?:[/|]\s*([^\n|]+))?/i);
  if (blockMatch) {
    state.userCharacter.name = blockMatch[1].trim();
    if (blockMatch[2]) state.userCharacter.relation = blockMatch[2].trim();
  }
  const userNameMatch = text.match(/\{\{user\}\}\s*[=:]\s*([^\s,\n]+)/i) || text.match(/(?:^|\n)User(?:name)?[^:]*:\s*([^\n,|]+)/im);
  if (userNameMatch) state.userCharacter.name = userNameMatch[1].trim();
  const userRelMatch = text.match(/User\s+[Rr]elat[^:]*:\s*([^\n,|]+)/i) || text.match(/\{\{user\}\}\s+is\s+(?:the\s+)?([^\n,|.]+)/i);
  if (userRelMatch) state.userCharacter.relation = userRelMatch[1].trim();

  if (!state.userCharacter.relation && state.character.relationship) {
    const mirror: Record<string, string> = {
      wife: 'husband', husband: 'wife', girlfriend: 'boyfriend', boyfriend: 'girlfriend',
      'step-sister': 'step-brother', 'step-brother': 'step-sister', 'step-mom': 'step-son',
      'step-son': 'step-mom', daughter: 'father', father: 'daughter', mother: 'son', son: 'mother',
    };
    const rel = state.character.relationship.toLowerCase();
    for (const [k, v] of Object.entries(mirror)) {
      if (rel.includes(k)) {
        state.userCharacter.relation = v;
        break;
      }
    }
  }

  if (state.character.name && state.character.name !== 'Unknown') {
    const charRel = state.userCharacter.relation || state.character.relationship || 'partner';
    const existingIdx = state.userCharacter.relationships.findIndex(
      (r) => (r.targetName || '').toLowerCase() === (state.character.name || '').toLowerCase(),
    );
    const charRelObj: RelationshipLink = {
      targetName: state.character.name,
      type: charRel,
      affection: Math.max(state.progressions.affection ?? 70, 50),
    };
    if (existingIdx >= 0) state.userCharacter.relationships[existingIdx] = charRelObj;
    else state.userCharacter.relationships.push(charRelObj);
  }

  for (const npc of state.npcs) {
    if (!npc.relationships) continue;
    for (const rel of npc.relationships) {
      const targetLower = (rel.targetName || '').toLowerCase();
      const userNameLower = state.userCharacter.name?.toLowerCase() || 'user';
      if (targetLower === userNameLower || targetLower === 'user' || targetLower === '{{user}}') {
        const reverseTypes: Record<string, string> = {
          rival: 'rival', hostile: 'hostile', friendly: 'friendly', romantic: 'admirer', protective: 'protected', submissive: 'dominant',
        };
        const reverseType = reverseTypes[(rel.type || '') as string] || rel.type;
        const existingIdx = state.userCharacter.relationships.findIndex(
          (r) => (r.targetName || '').toLowerCase() === npc.name.toLowerCase(),
        );
        if (existingIdx < 0) {
          state.userCharacter.relationships.push({ targetName: npc.name, type: reverseType, affection: rel.affection });
        }
      }
    }
  }
}

function parseRelationshipData(text: string, state: ParsedState): void {
  const relMatch = text.match(/(?:Relation(?:ship)?(?:\s+to\s+(?:user|\{\{user\}\}|protagonist))?)[^:]*:\s*([^\n║╠╚╔|,]+)/i);
  if (relMatch) {
    const relStr = relMatch[1].trim();
    if (!/^\d+%?$/.test(relStr)) state.character.relationship = relStr;
  }
  for (const npc of state.npcs) {
    if (!npc.relation) {
      const safeName = npc.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(safeName + '[^\n]*[Rr]elat[^:]*:\\s*([^\\n║╠╚╔|,]+)', 'i');
      const m = text.match(re);
      if (m) npc.relation = m[1].trim();
    }
  }
}

function parseBodyDescription(text: string, state: ParsedState): void {
  const bodyBlock = text.match(/(?:BODY[_\s]?(?:DESCRIPTION|DESC|PANEL|STATUS)|PHYSICAL[_\s]?(?:DESC|STATUS))[^\n]*\n([\s\S]*?)(?=╚|╔|$)/i);
  const src = bodyBlock ? bodyBlock[1] : text;
  const kv = (key: string) => {
    const m = src.match(new RegExp(key + '[^:]*:\\s*([^\\n║╠╚╔|]+)', 'i'));
    return m ? m[1].trim() : '';
  };
  state.body.description = state.body.description ?? {};
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

function parseInventorySlots(text: string, state: ParsedState): void {
  const slots: Record<keyof ClothingSlots, string[]> = {
    head: ['(?:👒|🎩|Head)'],
    upper: ['(?:👕|👚|Upper|Shirt|Top|Wearing)'],
    lower: ['(?:👖|Lower|Pants|Skirt|Shorts)'],
    underwear: ['(?:🩲|🩱|👙|Underwear|Bra|Panty|Panties|Lingerie)'],
    footwear: ['(?:👟|👠|👡|👢|🥾|Footwear|Shoes?|Boots?|Sandals?)'],
    accessories: ['(?:💍|💎|Accessories|Jewelry|Bracelet|Necklace)'],
  };
  for (const [slot, patterns] of Object.entries(slots)) {
    for (const p of patterns) {
      const m = text.match(new RegExp(p + '[^:]*:\\s*([^\\n║╠╚╔|]+)', 'i'));
      if (m) {
        const val = m[1].trim();
        if (val) state.clothingSlots[slot as keyof ClothingSlots] = val;
        break;
      }
    }
  }
}

function parseUICommands(text: string, state: ParsedState): void {
  const cmdBlock = text.match(/(?:UI[_\s]COMMANDS?|INTERFACE[_\s]CONTROL)[^\n]*\n([\s\S]*?)(?=\n\n|\n(?:#|[A-Z]{3,})|$)/i);
  const src = cmdBlock ? cmdBlock[1] : text;
  const tabMatch = src.match(/(?:switch_tab|active_tab|suggested_tab)[^:]*:\s*([^\n,|]+)/i);
  if (tabMatch) state.ui_commands.suggested_tab = tabMatch[1].trim().toLowerCase();
  const notifMatch = src.match(/(?:notification|toast|alert)[^:]*:\s*([^\n|]+)/i);
  if (notifMatch) {
    const nText = notifMatch[1].trim();
    if (/(?:crit|severe|urgent)/i.test(nText)) {
      state.ui_commands.notification = { level: 'error', message: nText.replace(/^(critical|severe|urgent)[:\s]*/i, '') };
    } else if (/(?:warn|caution)/i.test(nText)) {
      state.ui_commands.notification = { level: 'warn', message: nText.replace(/^(warning|caution)[:\s]*/i, '') };
    } else {
      state.ui_commands.notification = { level: 'info', message: nText };
    }
  }
  const mapFocusMatch = src.match(/(?:map_focus|focus_map|focus)[^:]*:\s*([^\n,|]+)/i);
  if (mapFocusMatch) state.ui_commands.map_focus = mapFocusMatch[1].trim();
  const mapRevealMatch = src.match(/(?:map_reveal|reveal)[^:]*:\s*([^\n,|]+)/i);
  if (mapRevealMatch) state.ui_commands.map_reveal = mapRevealMatch[1].split(',').map((s) => s.trim()).filter(Boolean);
}

export function parseImgModule(text: string, state: ParsedState): void {
  const imgBlock = text.match(/(?:IMG[_\s]MODULE|IMAGE[_\s]GEN|PROMPT[_\s]DATA)[^\n]*\n([\s\S]*?)(?=\n\n|(?:╚|$))/i);
  const src = imgBlock ? imgBlock[1] : text;
  const charAnchorMatch = src.match(/(?:char_anchor|char\s+appearance|physique\s+anchor)[^:]*:\s*([^\n]+)/i);
  if (charAnchorMatch) state.img_module.anchors = { ...state.img_module.anchors, char: charAnchorMatch[1].trim() };
  const userAnchorMatch = src.match(/(?:user_anchor|user\s+appearance)[^:]*:\s*([^\n]+)/i);
  if (userAnchorMatch) state.img_module.anchors = { ...state.img_module.anchors, user: userAnchorMatch[1].trim() };
  const posMatch = src.match(/(?:positive[_\s]prompt|pos\s+prompt)[^:]*:\s*([^\n]+)/i);
  if (posMatch) state.img_module.scene = { ...state.img_module.scene, positive: posMatch[1].trim() };
  const negMatch = src.match(/(?:negative[_\s]prompt|neg\s+prompt)[^:]*:\s*([^\n]+)/i);
  if (negMatch) state.img_module.scene = { ...state.img_module.scene, negative: negMatch[1].trim() };
  const camMatch = src.match(/(?:camera[_\s]suggestions?|shot[_\s]suggestions?)[^:]*:\s*([^\n]+)/i);
  if (camMatch) {
    state.img_module.scene = {
      ...state.img_module.scene,
      camera_suggestions: camMatch[1].split(',').map((s) => s.trim()).filter(Boolean),
    };
  }
  const ckptMatch = src.match(/(?:checkpoint|model)[^:]*:\s*([^\n,|]+)/i);
  if (ckptMatch) state.img_module.params = { ...state.img_module.params, checkpoint: ckptMatch[1].trim() };
  const samplerMatch = src.match(/(?:sampler)[^:]*:\s*([^\n,|]+)/i);
  if (samplerMatch) state.img_module.params = { ...state.img_module.params, sampler: samplerMatch[1].trim() };
  const stepsMatch = src.match(/(?:steps)[^:]*:\s*(\d+)/i);
  if (stepsMatch) state.img_module.params = { ...state.img_module.params, steps: parseInt(stepsMatch[1], 10) };
  const cfgMatch = src.match(/(?:cfg[_\s]scale|cfg)[^:]*:\s*([\d.]+)/i);
  if (cfgMatch) state.img_module.params = { ...state.img_module.params, cfg: parseFloat(cfgMatch[1]) };
  const clipMatch = src.match(/(?:clip[_\s]skip)[^:]*:\s*(\d+)/i);
  if (clipMatch) state.img_module.params = { ...state.img_module.params, clip_skip: parseInt(clipMatch[1], 10) };
  const loraMatch = src.match(/(?:loras?|lora[_\s]list)[^:]*:\s*([^\n]+)/i);
  if (loraMatch) {
    const loraParts = loraMatch[1].split(',').map((s) => s.trim()).filter(Boolean);
    state.img_module.params = {
      ...state.img_module.params,
      loras: loraParts.map((p) => {
        const [name, weight] = p.split(':');
        return `${name.trim()}:${parseFloat(weight) || 0.7}`;
      }),
    };
  }
  if (src.match(/hires[_\s]fix[^:]*:\s*(?:on|enabled|true|yes)/i)) {
    state.img_module.params = {
      ...state.img_module.params,
      hires_fix: { ...(state.img_module.params?.hires_fix ?? {}), enabled: true },
    };
  }
  const upscaleMatch = src.match(/(?:upscale|scale)[^:]*:\s*([\d.]+)/i);
  if (upscaleMatch) {
    state.img_module.params = {
      ...state.img_module.params,
      hires_fix: { ...(state.img_module.params?.hires_fix ?? {}), upscale: parseFloat(upscaleMatch[1]) },
    };
  }
  const denoiseMatch = src.match(/(?:denoising?)[^:]*:\s*([\d.]+)/i);
  if (denoiseMatch) {
    state.img_module.params = {
      ...state.img_module.params,
      hires_fix: { ...(state.img_module.params?.hires_fix ?? {}), denoise: parseFloat(denoiseMatch[1]) },
    };
  }
  const arMatch = src.match(/(?:aspect[_\s]ratio|ratio)[^:]*:\s*([^\n,|]+)/i);
  if (arMatch) state.img_module.params = { ...state.img_module.params, aspect_ratio: arMatch[1].trim() };
  const resMatch = src.match(/(?:resolution|res)[^:]*:\s*([^\n,|]+)/i);
  if (resMatch) state.img_module.params = { ...state.img_module.params, resolution: resMatch[1].trim() };
}

function parseMetaInfo(text: string, state: ParsedState): void {
  const turnIdMatch = text.match(/(?:turn_id|turn\s+id)[^:]*:\s*([^\n,|]+)/i);
  if (turnIdMatch) state.meta.turn_id = turnIdMatch[1].trim();
  const parentTurnMatch = text.match(/(?:parent_turn_id|parent\s+turn)[^:]*:\s*([^\n,|]+)/i);
  if (parentTurnMatch) state.meta.parent_turn_id = parentTurnMatch[1].trim();
  const branchMatch = text.match(/(?:branch_index|branch)[^:]*:\s*(\d+)/i);
  if (branchMatch) state.meta.branch_index = parseInt(branchMatch[1], 10);
  if (text.match(/(?:regenerat|re-roll|new\s+response|retry|alternate)/i)) {
    if (!state.meta.branch_index) state.meta.branch_index = 1;
  }
}

function syncClothingSlots(state: ParsedState): void {
  if (state.clothing.upperBody && state.clothing.upperBody !== 'Shirt') state.clothingSlots.upper = state.clothing.upperBody;
  if (state.clothing.lowerBody && state.clothing.lowerBody !== 'Pants') state.clothingSlots.lower = state.clothing.lowerBody;
  if (state.clothing.underwear && state.clothing.underwear !== 'Underwear') state.clothingSlots.underwear = state.clothing.underwear;
}

// ---------------------------------------------------------------------------
// Helpers visuais/exportados
// ---------------------------------------------------------------------------

export function generateMiniMap(location: LocationState): unknown[] {
  const roomGrid: Record<string, { x: number; y: number; label: string }> = {
    bedroom: { x: 2, y: 1, label: 'BED' },
    'master bedroom': { x: 2, y: 1, label: 'BED' },
    kitchen: { x: 0, y: 1, label: 'KIT' },
    'living room': { x: 1, y: 1, label: 'LVN' },
    bathroom: { x: 2, y: 0, label: 'BTH' },
    hallway: { x: 1, y: 0, label: 'HAL' },
    office: { x: 0, y: 0, label: 'OFF' },
    garden: { x: 1, y: 2, label: 'GRD' },
    garage: { x: 0, y: 2, label: 'GAR' },
    barn: { x: 2, y: 2, label: 'BRN' },
    lake: { x: 0, y: 2, label: 'LKE' },
    hilltop: { x: 2, y: 0, label: 'HIL' },
    home: { x: 1, y: 1, label: 'HOM' },
  };
  const current = location.currentRoom?.toLowerCase() || 'home';
  const visited = (location.visitedRooms || []).map((r) => r.toLowerCase());
  const grid: Array<Array<{ label: string; visited: boolean; current: boolean } | null>> = Array(3)
    .fill(null)
    .map(() => Array(3).fill(null));
  for (const [room, pos] of Object.entries(roomGrid)) {
    const isVisited = visited.includes(room) || current.includes(room) || room.includes(current);
    const isCurrent = current === room || current.includes(room) || room.includes(current);
    grid[pos.y][pos.x] = { label: pos.label, visited: isVisited, current: isCurrent };
  }
  return grid;
}

export function getExpressionEmoji(expression?: string, mood?: string): string {
  const key = (expression || mood || '').toLowerCase();
  const map: Record<string, string> = {
    neutral: '😐', happy: '😊', flustered: '😳', embarrassed: '😳', aroused: '😍', angry: '😠', sad: '😢',
    crying: '😭', scared: '😨', surprised: '😲', shy: '🥺', loving: '🥰', lustful: '😏', tired: '😴',
    confused: '😕', disgusted: '😤', excited: '🤩', nervous: '😰', proud: '😌', melancholy: '😞',
    determined: '😤', playful: '😄', seductive: '😘', guilty: '😬', cheerful: '😁', devastated: '😩',
    resigned: '😔', vulnerable: '🥹', hopeful: '🌟', torn: '😣', heartbroken: '💔', jealous: '😒',
    reflective: '🤔', receptive: '🙂', volatile: '🌋', subdued: '😶',
  };
  for (const [k, v] of Object.entries(map)) {
    if (key.includes(k)) return v;
  }
  return '😐';
}

export function getWeatherIcon(weather?: string): string {
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

export function getClothingEmoji(slot: keyof ClothingSlots, value?: string): string {
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
  if (slot === 'underwear') {
    if (!none && /bra/i.test(value)) return '👙';
    return '🩲';
  }
  if (slot === 'footwear') {
    if (!none && /heel/i.test(value)) return '👠';
    if (!none && /boot/i.test(value)) return '👢';
    if (!none && /sandal|flip/i.test(value)) return '🩴';
    return '👟';
  }
  if (slot === 'accessories') return '💍';
  return '👔';
}

function normalizeWeather(raw: string): string {
  if (raw.includes('☀')) return 'Sunny';
  if (raw.includes('🌧')) return 'Rainy';
  if (raw.includes('⛈') || raw.includes('🌩')) return 'Stormy';
  if (raw.includes('❄')) return 'Snowy';
  if (raw.includes('🌙')) return 'Night';
  if (raw.includes('☁') || raw.includes('🌤')) return 'Cloudy';
  return raw.replace(/[^\w\s]/g, '').trim() || 'Unknown';
}

function detectWeatherFromText(text: string): string | null {
  if (text.includes('☀️') || text.includes('☀')) return 'Sunny';
  if (text.includes('🌧️') || text.includes('🌧')) return 'Rainy';
  if (text.includes('⛈️') || text.includes('🌩️')) return 'Stormy';
  if (text.includes('❄️')) return 'Snowy';
  if (text.includes('🌙')) return 'Night';
  if (text.includes('🌤️') || text.includes('⛅')) return 'Cloudy';
  return null;
}
