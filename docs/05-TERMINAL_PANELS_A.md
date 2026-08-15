# 05a — src/components/terminal (Painéis avançados — parte A)

> Parte 5/10. Código-fonte completo dos painéis avançados maiores. A parte B está em `docs/05-TERMINAL_PANELS_B.md`.

---

### `src/components/terminal/IMGPanel.jsx`

> Geração de prompts Stable Diffusion: 6 sub-tabs (positive/negative/camera/physique/model/comfy) + builders + auditor IMG. ~584 linhas.

```jsx
import React, { useState, useCallback } from 'react';

function copyToClipboard(text) {
  navigator.clipboard?.writeText(text).catch(() => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  });
}

function CopyBlock({ label, content, color = '#00FFF5', hint }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    copyToClipboard(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  if (!content) return null;
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-mono font-bold tracking-widest" style={{ color }}>{label}</span>
        <button onClick={handleCopy} className="text-xs font-mono px-2 py-0.5 rounded transition-all"
          style={{ border: `1px solid ${copied ? '#39FF14' : color + '40'}`, color: copied ? '#39FF14' : color + '99', background: copied ? '#39FF1410' : 'transparent' }}>
          {copied ? '✓ COPIED' : 'COPY'}
        </button>
      </div>
      {hint && <div className="text-xs font-mono mb-1" style={{ color: '#ffffff30' }}>{hint}</div>}
      <div className="text-xs font-mono leading-relaxed p-2 rounded select-all cursor-text"
        style={{ background: '#0A0A0A', border: `1px solid ${color}20`, color: '#c0c0c0', whiteSpace: 'pre-wrap', lineHeight: '1.7', fontSize: '10px' }}
        onClick={handleCopy}>{content}</div>
    </div>
  );
}

function buildPositivePrompt(state) {
  const { character, body, clothingSlots, clothing, location, sexModule, progressions } = state;
  const tags = [];
  tags.push('masterpiece, best quality, highly detailed, ultra-sharp, 8k uhd');
  const role = character?.role?.toLowerCase().replace(/[\[\]]/g, '').trim();
  if (role) tags.push(role);
  if (character?.name) tags.push(`1girl, solo`);
  const desc = body?.description || {};
  if (desc.hair) tags.push(desc.hair + ' hair');
  if (desc.eyes) tags.push(desc.eyes + ' eyes');
  if (desc.face) tags.push(desc.face);
  if (desc.chest || desc.bust) tags.push(desc.chest || desc.bust);
  if (desc.waist) tags.push(desc.waist);
  if (desc.hips) tags.push(desc.hips);
  if (desc.legs) tags.push(desc.legs);
  if (desc.tail) tags.push(desc.tail + ', kemonomimi');
  if (desc.horns) tags.push(desc.horns + ', fantasy');
  if (desc.special) tags.push(desc.special);
  const slots = clothingSlots || {};
  const clothingParts = [slots.upper, slots.lower, slots.underwear, slots.footwear, slots.accessories].filter(Boolean).filter(v => v !== 'None');
  if (clothingParts.length > 0) { tags.push(...clothingParts.map(c => c.toLowerCase())); }
  else if (clothing?.upperBody && clothing.upperBody !== 'Shirt') { tags.push(clothing.upperBody.toLowerCase()); }
  if (slots.upper === 'None' && slots.lower === 'None') tags.push('nude, naked');
  else if (slots.underwear === 'None' && clothingParts.length < 2) tags.push('no underwear');
  const mood = (character?.mood || '').toLowerCase();
  const arousal = progressions?.arousal ?? 0;
  const affection = progressions?.affection ?? 0;
  const exprMap = [
    { match: 'flustered',  tag: 'flushed cheeks, embarrassed expression, blushing' },
    { match: 'aroused',    tag: 'seductive expression, half-lidded eyes, ahegao' },
    { match: 'happy',      tag: 'smiling, cheerful expression, open mouth smile' },
    { match: 'sad',        tag: 'teary eyes, sad expression, downcast eyes' },
    { match: 'nervous',    tag: 'nervous expression, biting lip, fidgeting' },
    { match: 'loving',     tag: 'gentle smile, loving gaze, heart in eyes' },
    { match: 'lustful',    tag: 'sultry expression, seductive, bedroom eyes' },
    { match: 'angry',      tag: 'angry expression, furrowed brows, frown' },
    { match: 'scared',     tag: 'scared expression, wide eyes, trembling' },
    { match: 'shy',        tag: 'shy expression, looking away, covering face' },
    { match: 'cheerful',   tag: 'beaming smile, energetic pose' },
    { match: 'passionate', tag: 'passionate expression, intense gaze, desire' },
    { match: 'seductive',  tag: 'seductive pose, alluring expression, smirk' },
  ];
  for (const { match, tag } of exprMap) { if (mood.includes(match)) { tags.push(tag); break; } }
  if (arousal >= 80 && !mood.includes('aroused')) tags.push('aroused, heavy breathing');
  const posture = body?.posture || 'standing';
  const postureMap = {
    'lying down': 'lying on bed, supine', 'sitting': 'sitting, seated', 'kneeling': 'kneeling, on knees',
    'leaning': 'leaning forward, bent over', 'standing': 'standing, upright', 'crouching': 'crouching, low stance', 'lying': 'lying down, horizontal',
  };
  for (const [k, v] of Object.entries(postureMap)) { if (posture.toLowerCase().includes(k)) { tags.push(v); break; } }
  if (arousal >= 70 || (sexModule?.active)) { tags.push('full body, dynamic angle'); }
  else if (affection >= 70) { tags.push('cowboy shot, looking at viewer, soft focus background'); }
  else { tags.push('upper body, portrait, looking at viewer'); }
  tags.push('depth of field, bokeh');
  if (sexModule?.active) {
    if (sexModule.position) tags.push(sexModule.position.toLowerCase());
    if (sexModule.phase === 'sex') { tags.push('explicit, nsfw, nude, sex, intercourse'); if (sexModule.senses?.sight) tags.push(sexModule.senses.sight.toLowerCase()); }
    else if (sexModule.phase === 'flirting') { tags.push('suggestive, seductive pose, revealing clothing'); }
    else if (sexModule.phase === 'post-sex') { tags.push('lying down, afterglow, satisfied expression, messy hair, sweat'); }
  }
  const room = (location?.currentRoom || '').toLowerCase();
  const building = (location?.building || '').toLowerCase();
  const envMap = {
    'bedroom': 'bedroom, king bed, soft ambient lighting, intimate setting, curtains',
    'kitchen': 'kitchen, modern kitchen, warm overhead lighting, countertop',
    'living room': 'living room, sofa, warm interior, evening light',
    'bathroom': 'bathroom, tiles, mirror, steam, shower',
    'office': 'office, desk, bookshelf, window light',
    'garden': 'garden, outdoor, golden hour, flowers, trees',
    'barn': 'barn, rustic interior, hay bales, warm lantern light',
    'school': 'classroom, school, desk, windows',
    'beach': 'beach, ocean, sunset, sand',
    'forest': 'forest, trees, dappled light, nature',
    'cafe': 'café, coffee shop, warm lighting, table',
  };
  let envFound = false;
  for (const [k, v] of Object.entries(envMap)) { if (room.includes(k) || building.includes(k)) { tags.push(v); envFound = true; break; } }
  if (!envFound && room) tags.push(room);
  const sceneType = state.system?.sceneType || 'daily_life';
  if (sceneType === 'sex') { tags.push('dim lighting, candlelight, warm tones, intimate atmosphere'); }
  else if (sceneType === 'flirting') { tags.push('soft warm lighting, romantic atmosphere, golden tones'); }
  else { tags.push('soft cinematic lighting, photorealistic, natural color grading'); }
  const weather = (state.system?.weather || '').toLowerCase();
  if (weather.includes('night') || weather.includes('moon')) tags.push('moonlight, night scene, dark blue tones');
  else if (weather.includes('sun')) tags.push('sunlight, bright day, clear sky');
  else if (weather.includes('rain')) tags.push('rain, wet surfaces, dramatic lighting');
  return tags.join(', ');
}

function buildNegativePrompt() {
  return [
    'lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits',
    'cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark',
    'username, blurry, artist name, out of frame, ugly, duplicate, morbid, mutilated, deformed',
    'extra limbs, disfigured, gross proportions, malformed limbs, missing arms, missing legs',
    'extra arms, extra legs, fused fingers, too many fingers, long neck, fat, obese',
    'bad proportions, cross-eyed, poorly drawn face, cloned face, bad face, bad eyes',
    'unnatural colors, overexposed, underexposed, flat colors, plastic skin',
  ].join(', ');
}

function buildCameraPrompt(state) {
  const { progressions, sexModule } = state;
  const arousal = progressions?.arousal ?? 0;
  const affection = progressions?.affection ?? 0;
  const lines = [];
  lines.push('── SHOT / FRAMING SUGGESTIONS ──'); lines.push('');
  lines.push('Portrait / Character focus:'); lines.push('  close-up, face focus, upper body, soft background blur'); lines.push('');
  lines.push('Romantic / Intimate (affection ≥70):');
  if (affection >= 70) lines.push('  ★ ACTIVE — cowboy shot, looking at viewer, warm bokeh');
  else lines.push('  [affection too low — unlock at 70%]');
  lines.push('');
  lines.push('Suggestive / High arousal (arousal ≥60):');
  if (arousal >= 60) lines.push('  ★ ACTIVE — full body, dynamic composition, alluring angle');
  else lines.push('  [arousal too low — unlock at 60%]');
  lines.push('');
  lines.push('Explicit (sex scene active):');
  if (sexModule?.active && sexModule?.phase === 'sex') lines.push('  ★ ACTIVE — pov, dutch angle, close-up action');
  else lines.push('  [sex scene not active]');
  lines.push('');
  lines.push('Recommended aspect ratios:');
  lines.push('  Portrait: 2:3 (512×768, 640×960, 832×1216)');
  lines.push('  Landscape: 16:9 (768×432)');
  lines.push('  Square: 1:1 (768×768) for close-ups');
  return lines.join('\n');
}

function buildModelSettings(state) {
  const { sexModule, character, body } = state;
  const isNSFW = sexModule?.active && sexModule?.phase === 'sex';
  const hasFantasyTraits = !!(body?.description?.tail || body?.description?.horns || body?.description?.special);
  const lines = [];
  lines.push(`── RECOMMENDED CHECKPOINT ──`); lines.push('');
  if (isNSFW) {
    lines.push('NSFW Realistic:'); lines.push('  • RealisticVision v5.1 NSFW'); lines.push('  • ChilloutMix'); lines.push('  • Cyberrealistic / epiCRealism'); lines.push('');
    lines.push('NSFW Anime:'); lines.push('  • MeinaMix'); lines.push('  • AbyssOrangeMix3'); lines.push('  • PastelMix');
  } else {
    lines.push('SFW Realistic:'); lines.push('  • Deliberate v3'); lines.push('  • DreamShaper 8'); lines.push('  • RealisticVision v5'); lines.push('');
    lines.push('SFW Anime:'); lines.push('  • Anything v5 / v6'); lines.push('  • CounterfeitV3'); lines.push('  • GhostMix');
  }
  if (hasFantasyTraits) { lines.push(''); lines.push('Fantasy / Beast-folk:'); lines.push('  • NeverEnding Dream (NED)'); lines.push('  • Hassaku'); lines.push('  • Perfect World'); }
  lines.push(''); lines.push('── LORA SUGGESTIONS ──'); lines.push('');
  if (character?.role) lines.push(`  • Character LoRA: [${character.role} LoRA if available] wt:0.7`);
  lines.push('  • Detail enhancer: "add_detail"  wt:0.6');
  lines.push('  • Skin texture: "skin_texture_v1"  wt:0.4');
  if (isNSFW) lines.push('  • NSFW detail: [your explicit LoRA]  wt:0.7');
  if (hasFantasyTraits) lines.push('  • Beast-folk LoRA: "kemonomimi_v3"  wt:0.6');
  lines.push(''); lines.push('── SAMPLER SETTINGS ──'); lines.push('');
  lines.push('  Sampler: DPM++ 2M Karras'); lines.push('  Steps: 28–35'); lines.push('  CFG Scale: 7  (lower = softer, higher = sharper)');
  lines.push('  Clip Skip: 2'); lines.push('  ENSD: 31337');
  lines.push(''); lines.push('── HIRES FIX ──'); lines.push('');
  lines.push('  Upscaler: R-ESRGAN 4x+ Anime6B (anime) / ESRGAN 4x (realistic)');
  lines.push('  Hires steps: 15  |  Denoising: 0.35–0.45'); lines.push('  Upscale: ×2');
  return lines.join('\n');
}

function buildPhysiqueSummary(state) {
  const { character, body } = state;
  const desc = body?.description || {};
  const lines = [];
  const charName = character?.name || 'Character';
  lines.push(`── ${charName.toUpperCase()} — PHYSIQUE SUMMARY ──`); lines.push('');
  lines.push('(Copy these tags to anchor character appearance across images)'); lines.push('');
  const physiqueTags = [];
  if (desc.hair) physiqueTags.push(`${desc.hair} hair`);
  if (desc.eyes) physiqueTags.push(`${desc.eyes} eyes`);
  if (desc.face) physiqueTags.push(desc.face);
  if (desc.chest || desc.bust) physiqueTags.push(desc.chest || desc.bust);
  if (desc.waist) physiqueTags.push(desc.waist);
  if (desc.hips) physiqueTags.push(desc.hips);
  if (desc.legs) physiqueTags.push(desc.legs);
  if (desc.tail) physiqueTags.push(desc.tail);
  if (desc.horns) physiqueTags.push(desc.horns);
  if (desc.special) physiqueTags.push(desc.special);
  if (physiqueTags.length > 0) {
    lines.push('Detected traits:'); physiqueTags.forEach(t => lines.push(`  ${t}`)); lines.push('');
    lines.push('As prompt tags:'); lines.push(physiqueTags.join(', '));
  } else {
    lines.push('No physical description parsed yet.'); lines.push('');
    lines.push('Tips to populate this panel:');
    lines.push('  • Include a BODY_DESCRIPTION block in the AI output');
    lines.push('  • Use: "Hair: [description]", "Eyes: [description]" etc.');
    lines.push('  • Or ask the AI: "Describe {{char}}\'s appearance in detail"'); lines.push('');
    lines.push('Example tags to add manually:');
    lines.push('  1girl, long black hair, blue eyes, fair skin,');
    lines.push('  large breasts, slim waist, wide hips, long legs');
  }
  return lines.join('\n');
}

function buildComfyPositive(state) {
  const img = state?.img_module || {};
  const anchors = img.anchors || {};
  const scene = img.scene || {};
  const parts = [];
  if (anchors.char) parts.push(anchors.char);
  if (anchors.user) parts.push(anchors.user);
  if (scene.positive) parts.push(scene.positive);
  if (scene.camera_suggestions?.length) parts.push(scene.camera_suggestions.join(', '));
  if (parts.length === 0) return buildPositivePrompt(state);
  return parts.join(', ');
}

function buildComfyNegative(state) {
  const img = state?.img_module || {};
  if (img.scene?.negative) return img.scene.negative + ', ' + buildNegativePrompt();
  return buildNegativePrompt();
}

function buildComfyMetadata(state) {
  const img = state?.img_module || {};
  const params = img.params || {};
  const lines = [];
  lines.push('── COMFYUI / CIVITAI METADATA ──'); lines.push('');
  lines.push(`Checkpoint: ${params.checkpoint || '(not specified — see Model tab for suggestions)'}`); lines.push('');
  if (params.loras?.length) { lines.push('LoRAs:'); params.loras.forEach(l => lines.push(`  ${l.name}:${l.weight}`)); }
  else lines.push('LoRAs: (none specified)');
  lines.push('');
  lines.push(`Sampler: ${params.sampler || 'DPM++ 2M Karras'}`);
  lines.push(`Steps: ${params.steps || 28}`);
  lines.push(`CFG Scale: ${params.cfg || 7.0}`);
  lines.push(`Clip Skip: ${params.clip_skip || 2}`); lines.push('');
  const hf = params.hires_fix || {};
  lines.push(`Hires Fix: ${hf.enabled ? 'Enabled' : 'Disabled'}`);
  if (hf.enabled) { lines.push(`  Upscale: ×${hf.upscale || 2}`); lines.push(`  Denoising: ${hf.denoising || 0.4}`); }
  lines.push('');
  lines.push(`Aspect Ratio: ${params.aspect_ratio || '2:3'}`);
  lines.push(`Resolution: ${params.resolution || '832×1216'}`);
  const anchors = img.anchors || {};
  if (anchors.char || anchors.user) { lines.push(''); lines.push('── PHYSIQUE ANCHORS ──'); if (anchors.char) lines.push(`Char: ${anchors.char}`); if (anchors.user) lines.push(`User: ${anchors.user}`); }
  return lines.join('\n');
}

function ComfyPanel({ state }) {
  const positive = buildComfyPositive(state);
  const negative = buildComfyNegative(state);
  const metadata = buildComfyMetadata(state);
  const hasContract = !!(state?.img_module?.anchors?.char || state?.img_module?.scene?.positive);
  return (
    <div>
      {!hasContract && (
        <div className="mb-3 rounded p-2" style={{ border: '1px solid #FFD70020', background: '#FFD70005' }}>
          <div className="text-xs font-mono" style={{ color: '#FFD700', fontSize: '10px', lineHeight: '1.5' }}>
            💡 <b>AI-driven contract not yet populated.</b> Ask the AI to generate an IMG_MODULE block with anchors, scene prompts, and model params. Meanwhile, standard auto-generated prompts are shown.
          </div>
        </div>
      )}
      <CopyBlock label="🎛️ COMFYUI POSITIVE (anchors + scene)" content={positive} color="#39FF14" hint="Anchors (fixed physique) + Scene (current action). Ready for ComfyUI." />
      <CopyBlock label="🚫 COMFYUI NEGATIVE" content={negative} color="#FF2D78" hint="AI-generated negative + universal quality negatives." />
      <CopyBlock label="📋 METADATA (Checkpoint / LoRA / Params)" content={metadata} color="#00FFF5" hint="Copy-paste into ComfyUI metadata panel or Civitai generation form." />
    </div>
  );
}

export default function IMGPanel({ state, imgAuditIssues = [] }) {
  const [tab, setTab] = useState('positive');
  if (!state) return (<div className="flex items-center justify-center h-24 text-gray-700 text-xs font-mono">No state data available</div>);
  const pendingImgIssues = imgAuditIssues.filter(i => i.type === 'img' && i.status === 'pending');
  const positive = buildPositivePrompt(state);
  const negative = buildNegativePrompt();
  const camera = buildCameraPrompt(state);
  const modelSettings = buildModelSettings(state);
  const physique = buildPhysiqueSummary(state);
  const tabs = [
    { id: 'positive',  label: '✨ POS',     color: '#00FFF5' },
    { id: 'negative',  label: '🚫 NEG',     color: '#FF2D78' },
    { id: 'camera',    label: '📷 CAM',     color: '#39FF14' },
    { id: 'physique',  label: '🧬 PHYS',    color: '#FFD700' },
    { id: 'model',     label: '⚙️ MODEL',   color: '#BF5FFF' },
    { id: 'comfy',     label: '🎛️ COMFY',  color: '#39FF14' },
  ];
  return (
    <div className="mx-3 mb-2 rounded overflow-hidden" style={{ border: '1px solid #00FFF530' }}>
      <div className="px-3 py-1.5 flex items-center justify-between" style={{ background: '#00FFF508', borderBottom: '1px solid #00FFF520' }}>
        <span className="text-xs font-mono font-bold neon-cyan tracking-widest">🖼️ IMAGE GEN TAGS</span>
        <span className="text-xs font-mono text-gray-600">Auto-generated from state</span>
      </div>
      {pendingImgIssues.length > 0 && (
        <div className="px-3 py-2" style={{ background: '#FFD70005', borderBottom: '1px solid #FFD70020' }}>
          <div className="text-xs font-mono font-bold mb-1" style={{ color: '#FFD700' }}>⚠ IMG AUDITOR: {pendingImgIssues.length} mismatch{pendingImgIssues.length > 1 ? 'es' : ''}</div>
          {pendingImgIssues.map(issue => (<div key={issue.id} className="text-xs font-mono mb-1" style={{ color: '#FFD70080', fontSize: '10px' }}>• {issue.description}</div>))}
          <div className="text-xs font-mono mt-1" style={{ color: '#ffffff30', fontSize: '9px' }}>See AUDIT tab to accept or refuse corrections.</div>
        </div>
      )}
      <div className="flex overflow-x-auto" style={{ borderBottom: '1px solid #00FFF515', background: '#0A0A0A', scrollbarWidth: 'none' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className="flex-1 text-xs font-mono py-1.5 transition-all border-b-2 whitespace-nowrap px-1"
            style={{ borderBottomColor: tab === t.id ? t.color : 'transparent', color: tab === t.id ? t.color : '#ffffff30', background: tab === t.id ? `${t.color}10` : 'transparent', textShadow: tab === t.id ? `0 0 6px ${t.color}` : 'none', minWidth: '48px' }}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="px-3 py-2" style={{ background: '#0D0D0D' }}>
        {tab === 'positive' && (<div><div className="text-xs text-gray-600 mb-2 font-mono">Full positive prompt — auto-built from parsed state. Click to copy.</div><CopyBlock label="✨ POSITIVE PROMPT" content={positive} color="#00FFF5" /></div>)}
        {tab === 'negative' && (<div><div className="text-xs text-gray-600 mb-2 font-mono">Universal negative prompt for clean anatomy and composition.</div><CopyBlock label="🚫 NEGATIVE PROMPT" content={negative} color="#FF2D78" /></div>)}
        {tab === 'camera' && (<div><div className="text-xs text-gray-600 mb-2 font-mono">Shot framing suggestions based on scene intensity and relationship.</div><CopyBlock label="📷 CAMERA & FRAMING" content={camera} color="#39FF14" hint="Combine with the positive prompt for best results." /></div>)}
        {tab === 'physique' && (<div><div className="text-xs text-gray-600 mb-2 font-mono">Character physique tags — anchor consistency across all generated images.</div><CopyBlock label="🧬 PHYSIQUE ANCHOR TAGS" content={physique} color="#FFD700" hint="Add these first in your prompt to lock character appearance." /></div>)}
        {tab === 'model' && (<div><div className="text-xs text-gray-600 mb-2 font-mono">Recommended checkpoint, LoRA, and sampler settings for this scene.</div><CopyBlock label="⚙️ MODEL & SETTINGS" content={modelSettings} color="#BF5FFF" /></div>)}
        {tab === 'comfy' && (<ComfyPanel state={state} />)}
      </div>
    </div>
  );
}
```

### `src/components/terminal/AIConfigPanel.jsx`

> Config OpenRouter: API key, modelo, jailbreak editável, processar texto via LLM. ~340 linhas. Código completo preservado no repositório (`src/components/terminal/AIConfigPanel.jsx`). Contém: schema JSON embutido em comentário HTML, `DEFAULT_JAILBREAK` (system prompt em português), `MODELS`, sincronização com chaves compartilhadas `eros_openrouter_key`/`eros_selected_model`, `callOpenRouter` inline, `handleTest`, `handleProcess` (extrai JSON e chama `onParsed`), UI com seções API Key / Modelo / System Prompt (colapsável) / Processar Texto / Status / Resposta Raw / Como Usar.

### `src/components/terminal/AIProviderSection.jsx`

> Seletor de provedor IA com autocomplete ao vivo, grid de modelos, cache 24h, status footer. ~592 linhas. Código completo preservado no repositório (`src/components/terminal/AIProviderSection.jsx`). Contém: `getBrandInfo`, `tierFromPrice`, helpers de preço, cache localStorage (`eros_models_cache`), `buildModelList`, `ModelCard` (card expansível com metadata), componente principal com API key input + testar conexão + atualizar modelos + grid de modelos com busca local (lupa) + autocomplete ao vivo (debounce 400ms via `GET /api/v1/models`) + status footer.

### `src/components/terminal/SexPanel.jsx`

> Dashboard de sexo com tabs (overview/senses/anatomy/marking), ASCII position viewer, neon bars, marking table. ~224 linhas.

```jsx
import React, { useState } from 'react';
import { getSexPhaseColor, getMenstrualPhaseInfo } from '../../lib/erosParser';
import ASCIIPositionViewer from './ASCIIPositionViewer';

function Row({ label, value, color = '#00FFF580' }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 py-0.5 text-xs">
      <span className="flex-shrink-0 font-mono" style={{ color, minWidth: '72px' }}>{label}</span>
      <span className="font-mono text-gray-300 leading-relaxed">{value}</span>
    </div>
  );
}

function SenseRow({ emoji, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 py-0.5 text-xs">
      <span className="flex-shrink-0 text-sm">{emoji}</span>
      <span className="flex-shrink-0 font-mono text-gray-600 w-12">{label}</span>
      <span className="font-mono text-gray-300 leading-relaxed">{value}</span>
    </div>
  );
}

function NeonBar({ value = 0, color = '#FF2D78', label }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center gap-2 py-0.5 text-xs">
      <span className="flex-shrink-0 font-mono w-20" style={{ color: `${color}90` }}>{label}</span>
      <div className="flex-1 rounded-full overflow-hidden" style={{ height: '5px', background: '#ffffff08' }}>
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}bb)`, boxShadow: `0 0 6px ${color}, 0 0 12px ${color}50` }} />
      </div>
      <span className="font-mono text-xs w-8 text-right" style={{ color: `${color}80` }}>{pct}%</span>
    </div>
  );
}

function MarkingTable({ markingHistory = [] }) {
  if (!markingHistory.length) return (<div className="text-xs font-mono text-center py-2" style={{ color: '#ffffff20' }}>No marking events recorded</div>);
  return (
    <div className="overflow-hidden rounded" style={{ border: '1px solid #FF2D7820' }}>
      <table className="w-full text-xs font-mono">
        <thead>
          <tr style={{ background: '#FF2D7810', borderBottom: '1px solid #FF2D7820' }}>
            <th className="text-left px-2 py-1" style={{ color: '#FF2D7870' }}>Location</th>
            <th className="text-center px-2 py-1" style={{ color: '#FF2D7870' }}>Count</th>
            <th className="text-right px-2 py-1" style={{ color: '#FF2D7870' }}>Time</th>
          </tr>
        </thead>
        <tbody>
          {markingHistory.map((m, i) => (
            <tr key={i} style={{ borderBottom: i < markingHistory.length - 1 ? '1px solid #FF2D7810' : 'none' }}>
              <td className="px-2 py-1 text-gray-300">{m.location}</td>
              <td className="px-2 py-1 text-center" style={{ color: '#FF2D78' }}>×{m.count}</td>
              <td className="px-2 py-1 text-right text-gray-600">{m.timestamp || '--:--'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SexPanel({ sexModule }) {
  const [tab, setTab] = useState('overview');
  if (!sexModule?.active) return null;
  const phase = sexModule.phase || 'sex';
  const phaseColor = getSexPhaseColor(phase);
  const phaseLabels = { 'flirting': '💋 FLIRTING', 'sex': '🔥 SEX', 'post-sex': '✨ POST-SEX' };
  const hasSenses = Object.values(sexModule.senses || {}).some(Boolean);
  const hasMale = sexModule.male?.seminalVolume || sexModule.male?.ejaculationCount;
  const hasFemale = Object.values(sexModule.female || {}).some(v => v && typeof v !== 'object');
  const hasCycle = sexModule.female?.menstrualCycle?.phase;
  const hasMarking = (sexModule.marking_history || []).length > 0;
  const hasMetrics = sexModule.sensory_metrics?.intensity > 0 || sexModule.sensory_metrics?.threshold > 0;
  const tabs = [
    { id: 'overview', label: 'OVR' },
    ...(hasSenses || hasMetrics ? [{ id: 'senses', label: '5♻' }] : []),
    ...(hasFemale || hasCycle ? [{ id: 'anatomy', label: 'ANT' }] : []),
    ...(hasMarking ? [{ id: 'marking', label: 'MRK' }] : []),
  ];
  const cycleInfo = hasCycle ? getMenstrualPhaseInfo(sexModule.female.menstrualCycle.phase) : null;
  const intensity = sexModule.sensory_metrics?.intensity || 0;
  const threshold = sexModule.sensory_metrics?.threshold || 0;

  return (
    <div className="mx-3 mb-2 rounded overflow-hidden" style={{ border: `1px solid ${phaseColor}40` }}>
      {sexModule.position && (<ASCIIPositionViewer positionName={sexModule.position} phase={phase} />)}
      <div className="px-3 py-1.5 flex items-center justify-between" style={{ background: `${phaseColor}15`, borderBottom: `1px solid ${phaseColor}30` }}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold" style={{ color: phaseColor }}>{phaseLabels[phase] || '🔥 SEX MODULE'}</span>
          {sexModule.orgasmCount > 0 && (<span className="text-xs font-mono px-1.5 rounded" style={{ color: '#FFD700', background: '#FFD70015', border: '1px solid #FFD70030' }}>★×{sexModule.orgasmCount}</span>)}
        </div>
        {tabs.length > 1 && (
          <div className="flex gap-1">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className="text-xs font-mono px-1.5 py-0.5 rounded transition-all"
                style={{ color: tab === t.id ? phaseColor : '#ffffff40', background: tab === t.id ? `${phaseColor}15` : 'transparent', border: `1px solid ${tab === t.id ? phaseColor : '#ffffff10'}` }}>{t.label}</button>
            ))}
          </div>
        )}
      </div>
      <div className="px-3 py-2" style={{ background: '#0A0A0A' }}>
        {tab === 'overview' && (
          <div className="space-y-0.5">
            {sexModule.pace && <Row label="Pace" value={sexModule.pace} color={phaseColor} />}
            {sexModule.stimulusDescription && <Row label="Intimacy" value={sexModule.stimulusDescription} color={phaseColor} />}
            {(intensity > 0 || threshold > 0) && (
              <div className="mt-1.5 pt-1.5 space-y-1" style={{ borderTop: `1px solid ${phaseColor}20` }}>
                {intensity > 0 && <NeonBar value={intensity} color={phaseColor} label="Intensity" />}
                {threshold > 0 && <NeonBar value={threshold} color="#BF5FFF" label="Threshold" />}
              </div>
            )}
            {hasMale && (
              <div className="mt-1.5 pt-1.5" style={{ borderTop: `1px solid ${phaseColor}20` }}>
                <div className="text-xs font-mono mb-0.5" style={{ color: phaseColor, opacity: 0.6 }}>♂ MALE</div>
                {sexModule.male.seminalVolume && <Row label="Seminal" value={sexModule.male.seminalVolume} />}
                {sexModule.male.ejaculationCount > 0 && <Row label="Ejac" value={`×${sexModule.male.ejaculationCount}`} />}
                {sexModule.male.ejaculation_location && <Row label="Location" value={sexModule.male.ejaculation_location} color="#FF2D7880" />}
              </div>
            )}
          </div>
        )}
        {tab === 'senses' && (
          <div className="space-y-1">
            {(intensity > 0 || threshold > 0) && (
              <div className="space-y-1 mb-2 pb-2" style={{ borderBottom: `1px solid ${phaseColor}20` }}>
                {intensity > 0 && <NeonBar value={intensity} color={phaseColor} label="Intensity" />}
                {threshold > 0 && <NeonBar value={threshold} color="#BF5FFF" label="Threshold" />}
              </div>
            )}
            <SenseRow emoji="👁️" label="Sight" value={sexModule.senses?.sight} />
            <SenseRow emoji="👂" label="Sound" value={sexModule.senses?.sound} />
            <SenseRow emoji="👃" label="Smell" value={sexModule.senses?.smell} />
            <SenseRow emoji="🤚" label="Touch" value={sexModule.senses?.touch} />
            <SenseRow emoji="👅" label="Taste" value={sexModule.senses?.taste} />
            {!hasSenses && !hasMetrics && <div className="text-xs text-gray-700 text-center py-2">No sensory data detected</div>}
          </div>
        )}
        {tab === 'anatomy' && (
          <div className="space-y-0.5">
            <div className="text-xs font-mono mb-1" style={{ color: '#FF2D78', opacity: 0.6 }}>♀ FEMALE ANATOMY</div>
            {sexModule.female?.arousalState && <Row label="State" value={sexModule.female.arousalState} color="#FF2D7880" />}
            {sexModule.female?.lubrication && <Row label="Wetness" value={sexModule.female.lubrication} color="#FF2D7880" />}
            {sexModule.female?.vagina && <Row label="Vagina" value={sexModule.female.vagina} color="#FF2D7880" />}
            {sexModule.female?.cervix && <Row label="Cervix" value={sexModule.female.cervix} color="#FF2D7880" />}
            {sexModule.female?.uterus && <Row label="Uterus" value={sexModule.female.uterus} color="#FF2D7880" />}
            {sexModule.female?.ovaries && <Row label="Ovaries" value={sexModule.female.ovaries} color="#FF2D7880" />}
            {hasCycle && (
              <div className="mt-1.5 pt-1.5" style={{ borderTop: '1px solid #FF2D7820' }}>
                <div className="text-xs font-mono mb-1" style={{ color: cycleInfo.color }}>🩸 MENSTRUAL CYCLE</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ color: cycleInfo.color, background: `${cycleInfo.color}15`, border: `1px solid ${cycleInfo.color}30` }}>{cycleInfo.label}</span>
                  {sexModule.female.menstrualCycle.day > 0 && (<span className="text-xs font-mono text-gray-500">Day {sexModule.female.menstrualCycle.day}</span>)}
                  {sexModule.female.menstrualCycle.fertile && (<span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ color: '#39FF14', background: '#39FF1415', border: '1px solid #39FF1430' }}>♻ FERTILE</span>)}
                </div>
                <div className="text-xs text-gray-600 mt-1">Days: {cycleInfo.days}</div>
              </div>
            )}
            {!hasFemale && !hasCycle && <div className="text-xs text-gray-700 text-center py-2">No anatomy data detected</div>}
          </div>
        )}
        {tab === 'marking' && (
          <div>
            <div className="text-xs font-mono mb-1.5" style={{ color: '#FF2D7870' }}>💧 MARKING LOG</div>
            <MarkingTable markingHistory={sexModule.marking_history || []} />
          </div>
        )}
      </div>
    </div>
  );
}
```

---

*Próximo: `docs/05-TERMINAL_PANELS_B.md` — painéis avançados restantes (Config, Audit, Correction, Relationship, Notification, NTR, etc.).*