# 09 — src/services (OpenRouter + CharacterState)

> Parte 9/10. Código-fonte COMPLETO dos serviços.

---

### `src/services/openRouterService.js`

```js
/**
 * OpenRouter Service — Eros Status Terminal
 * Serviço dedicado para comunicação com a API do OpenRouter.
 * 100% compatível com Chub Venus AI Stage — não usa dependências do Base44.
 * Usa apenas `fetch` nativo do navegador.
 */
export const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';
export const DEFAULT_TEMPERATURE = 0.25;
export const DEFAULT_MAX_TOKENS = 3000;

export const AVAILABLE_MODELS = [
  { id: 'openai/gpt-4o-mini',                   label: 'GPT-4o Mini (rápido, barato)',         tier: 'economy' },
  { id: 'openai/gpt-4o',                         label: 'GPT-4o (melhor qualidade)',             tier: 'premium' },
  { id: 'anthropic/claude-3-haiku',              label: 'Claude 3 Haiku (equilibrado)',          tier: 'mid' },
  { id: 'anthropic/claude-3.5-sonnet',           label: 'Claude 3.5 Sonnet (premium)',           tier: 'premium' },
  { id: 'meta-llama/llama-3.1-70b-instruct',    label: 'LLaMA 3.1 70B (open-source)',           tier: 'mid' },
  { id: 'mistralai/mixtral-8x7b-instruct',       label: 'Mixtral 8x7B (veloz)',                  tier: 'economy' },
  { id: 'google/gemini-flash-1.5',              label: 'Gemini Flash 1.5 (multimodal)',          tier: 'mid' },
  { id: 'nousresearch/hermes-3-llama-3.1-70b',  label: 'Hermes 3 70B (roleplay)',               tier: 'mid' },
];

export class OpenRouterError extends Error {
  constructor(message, status, raw) {
    super(message);
    this.name = 'OpenRouterError';
    this.status = status;
    this.raw = raw;
  }
}

export async function callOpenRouter({
  apiKey, model, systemPrompt, userMessage,
  temperature = DEFAULT_TEMPERATURE,
  maxTokens = DEFAULT_MAX_TOKENS,
  appTitle = 'Eros Status Stage',
}) {
  if (!apiKey) throw new OpenRouterError('Chave API é obrigatória.', 401, null);
  if (!model)  throw new OpenRouterError('Modelo é obrigatório.', 400, null);
  if (!userMessage?.trim()) throw new OpenRouterError('Mensagem do usuário está vazia.', 400, null);

  const response = await fetch(OPENROUTER_BASE_URL, {
    method: 'POST',
    headers: {
      'Authorization':  `Bearer ${apiKey}`,
      'Content-Type':   'application/json',
      'HTTP-Referer':   typeof window !== 'undefined' ? window.location.origin : 'https://chub.ai',
      'X-Title':        appTitle,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt || '' },
        { role: 'user',   content: userMessage },
      ],
      temperature,
      max_tokens: maxTokens,
    }),
  });

  const raw = await response.json().catch(() => ({}));
  if (!response.ok) {
    const msg = raw?.error?.message || `HTTP ${response.status}`;
    throw new OpenRouterError(msg, response.status, raw);
  }
  const content = raw?.choices?.[0]?.message?.content;
  if (!content) throw new OpenRouterError('Resposta vazia da API.', 200, raw);
  return content;
}

export function extractJsonFromResponse(rawResponse) {
  if (!rawResponse) return null;
  const fenced = rawResponse.match(/```json\s*([\s\S]*?)```/);
  if (fenced) { try { return JSON.parse(fenced[1]); } catch { /* continua */ } }
  const plain = rawResponse.match(/(\{[\s\S]+\})/);
  if (plain) { try { return JSON.parse(plain[1]); } catch { /* continua */ } }
  return null;
}

export async function testOpenRouterConnection(apiKey, model) {
  try {
    const reply = await callOpenRouter({
      apiKey, model,
      systemPrompt: 'You are a connection test. Reply with exactly "OK".',
      userMessage: 'Test.',
      temperature: 0, maxTokens: 10,
    });
    return { ok: true, message: `✓ Conectado — ${model.split('/').pop()} — "${reply.trim().slice(0, 30)}"` };
  } catch (err) {
    return { ok: false, message: `✗ ${err.message}` };
  }
}
```

### `src/services/characterStateService.js`

```js
/**
 * Character State Service — Eros Status Terminal
 * Gerencia a PERSISTÊNCIA do estado do personagem entre turnos.
 * Problema resolvido: O Chub Venus AI regenera o prompt a cada turno,
 * o que fazia os valores do terminal resetarem. Este serviço mantém
 * o estado acumulado e aplica atualizações incrementais (deepMerge).
 * ✅ Usa apenas localStorage — sem dependências externas.
 */
const STORAGE_PREFIX   = 'eros_char_state_v1_';
const STORAGE_META      = 'eros_char_meta_v1';
const STORAGE_TURNS     = 'eros_char_turns_v1_';
const STORAGE_TURN_META = 'eros_char_turn_meta_v1_';

export function deepMerge(target, source) {
  if (!source || typeof source !== 'object') return target;
  if (!target || typeof target !== 'object') return source;
  const result = { ...target };
  for (const key of Object.keys(source)) {
    const sv = source[key];
    const tv = target[key];
    if (sv === null || sv === undefined) continue;
    if (Array.isArray(sv)) { result[key] = sv.length > 0 ? sv : (tv || []); }
    else if (typeof sv === 'object' && !Array.isArray(sv)) { result[key] = deepMerge(tv || {}, sv); }
    else { result[key] = sv; }
  }
  return result;
}

function saveToStorage(key, data) { try { localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data)); } catch (e) { console.warn('[CharacterState] Save failed:', e.message); } }
function loadFromStorage(key) { try { const raw = localStorage.getItem(STORAGE_PREFIX + key); return raw ? JSON.parse(raw) : null; } catch { return null; } }
function deleteFromStorage(key) { try { localStorage.removeItem(STORAGE_PREFIX + key); } catch { /* ignore */ } }
function loadMeta() { try { return JSON.parse(localStorage.getItem(STORAGE_META) || '{}'); } catch { return {}; } }
function saveMeta(meta) { try { localStorage.setItem(STORAGE_META, JSON.stringify(meta)); } catch { /* ignore */ } }

export function saveCharacterState(charKey, newState) {
  const existing = loadFromStorage(charKey) || {};
  const merged = deepMerge(existing, newState);
  merged._savedAt = new Date().toISOString();
  merged._turnCount = (merged._turnCount || 0) + 1;
  saveToStorage(charKey, merged);
  const meta = loadMeta();
  meta[charKey] = { name: newState?.character?.name || charKey, savedAt: merged._savedAt, turnCount: merged._turnCount };
  saveMeta(meta);
  return merged;
}

export function loadCharacterState(charKey) { return loadFromStorage(charKey); }

export function deleteCharacterState(charKey) {
  deleteFromStorage(charKey);
  const meta = loadMeta();
  delete meta[charKey];
  saveMeta(meta);
}

export function listSavedCharacters() {
  const meta = loadMeta();
  return Object.entries(meta).map(([key, info]) => ({ key, ...info }));
}

export function getContextForPrompt(state) {
  if (!state) return '';
  const p = state.progressions || {};
  const c = state.character || {};
  const loc = state.location || {};
  const uc = state.userCharacter || {};
  const stats = Object.entries(p).filter(([, v]) => v > 0).map(([k, v]) => `${k}:${v}`).join(', ');
  const npcSummary = (state.npcs || []).map(n => `${n.name}(${n.relation || 'npc'})`).join(', ');
  const clothingStr = [state.clothingSlots?.upper, state.clothingSlots?.lower].filter(v => v && v !== 'None').join(', ');
  const lines = [
    `[PERSISTENT STATE — Turn ${state._turnCount || 1}]`,
    `Character: ${c.name || '?'} | Role: ${c.role || '?'} | Mood: ${c.mood || '?'}`,
    `User: ${uc.name || 'User'} | Relation: ${uc.relation || '?'}`,
    `Location: ${loc.currentRoom || '?'} → ${loc.building || '?'}`,
    stats ? `Stats: ${stats}` : '',
    clothingStr ? `Wearing: ${clothingStr}` : '',
    npcSummary ? `NPCs: ${npcSummary}` : '',
    `Day: ${state.system?.day || 1} | Time: ${state.system?.time || '??:??'} | Weather: ${state.system?.weather || '?'}`,
    `[MAINTAIN all unlisted values from this context unless narrative explicitly changes them]`,
  ].filter(Boolean);
  return lines.join('\n');
}

export function normalizeCharKey(name) {
  return (name || 'unknown').toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 32);
}

// ── BRANCHING / TURN VERSIONING ──
export function saveTurnVersion(charKey, turnId, parentTurnId, state) {
  const turnData = { turnId, parentTurnId, savedAt: new Date().toISOString(), state: { ...state, _turnId: turnId, _parentTurnId: parentTurnId } };
  try { localStorage.setItem(STORAGE_TURNS + charKey + '_' + turnId, JSON.stringify(turnData)); } catch (e) { console.warn('[CharacterState] Turn save failed:', e.message); }
  const turnMeta = loadTurnMeta(charKey);
  turnMeta[turnId] = { parentTurnId, savedAt: turnData.savedAt, branchIndex: parseInt(turnId.split('_v')[1]) || 0 };
  saveTurnMeta(charKey, turnMeta);
}

export function loadTurnVersion(charKey, turnId) {
  try { const raw = localStorage.getItem(STORAGE_TURNS + charKey + '_' + turnId); return raw ? JSON.parse(raw) : null; } catch { return null; }
}

export function listTurnVersions(charKey) {
  const turnMeta = loadTurnMeta(charKey);
  return Object.entries(turnMeta).map(([turnId, info]) => ({ turnId, ...info })).sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
}

export function getBranchTree(charKey) {
  const versions = listTurnVersions(charKey);
  const tree = {};
  for (const v of versions) { tree[v.turnId] = { parentTurnId: v.parentTurnId, branchIndex: v.branchIndex, savedAt: v.savedAt, branches: [] }; }
  for (const v of versions) { if (v.parentTurnId && tree[v.parentTurnId]) tree[v.parentTurnId].branches.push(v.turnId); }
  return tree;
}

export function getCurrentTurnId(charKey) {
  const meta = loadMeta();
  return meta[charKey]?.currentTurnId || null;
}

export function setCurrentTurnId(charKey, turnId) {
  const meta = loadMeta();
  if (!meta[charKey]) meta[charKey] = {};
  meta[charKey].currentTurnId = turnId;
  saveMeta(meta);
}

export function deleteTurnVersion(charKey, turnId) {
  try { localStorage.removeItem(STORAGE_TURNS + charKey + '_' + turnId); } catch { /* ignore */ }
  const turnMeta = loadTurnMeta(charKey);
  delete turnMeta[turnId];
  saveTurnMeta(charKey, turnMeta);
}

function loadTurnMeta(charKey) { try { const key = STORAGE_TURN_META + charKey; return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; } }
function saveTurnMeta(charKey, meta) { try { localStorage.setItem(STORAGE_TURN_META + charKey, JSON.stringify(meta)); } catch { /* ignore */ } }
```

---

*Próximo: `docs/10-MISC.md` — api, hooks, utils, components root, main, App, ui + deploy.*