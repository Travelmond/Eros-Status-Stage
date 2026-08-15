import { useState } from 'react';
import type { ErosStatusState, AuditIssue } from '@/types/eros-status';

interface ImagePromptPanelProps {
  state: ErosStatusState;
  imgAuditIssues?: AuditIssue[];
}

function copyToClipboard(text: string) {
  navigator.clipboard?.writeText(text).catch(() => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  });
}

function CopyBlock({ label, content, color = 'var(--neon-cyan)', hint }: { label: string; content: string; color?: string; hint?: string }) {
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
        <span className="text-xs font-mono font-bold tracking-widest" style={{ color }}>
          {label}
        </span>
        <button
          onClick={handleCopy}
          className="text-xs font-mono px-2 py-0.5 rounded transition-all"
          style={{
            border: `1px solid ${copied ? 'var(--neon-green)' : color + '40'}`,
            color: copied ? 'var(--neon-green)' : color + '99',
            background: copied ? 'color-mix(in srgb, var(--neon-green) 10%, transparent)' : 'transparent',
          }}
        >
          {copied ? '✓ COPIED' : 'COPY'}
        </button>
      </div>
      {hint && <div className="text-xs font-mono mb-1" style={{ color: 'var(--terminal-text-muted)' }}>{hint}</div>}
      <div
        className="text-xs font-mono leading-relaxed p-2 rounded select-all cursor-text"
        style={{
          background: 'var(--terminal-bg)',
          border: `1px solid color-mix(in srgb, ${color} 20%, transparent)`,
          color: '#c0c0c0',
          whiteSpace: 'pre-wrap',
          lineHeight: '1.7',
          fontSize: '10px',
        }}
        onClick={handleCopy}
      >
        {content}
      </div>
    </div>
  );
}

function buildPositivePrompt(state: ErosStatusState): string {
  const { character, body, clothingSlots, location, sexModule, progressions } = state;
  const tags: string[] = [];
  tags.push('masterpiece, best quality, highly detailed, ultra-sharp, 8k uhd');
  const role = character?.role?.toLowerCase().replace(/[[\]]/g, '').trim();
  if (role) tags.push(role);
  if (character?.name) tags.push('1girl, solo');
  const desc = body?.description || {};
  if (desc.hair) tags.push(`${desc.hair} hair`);
  if (desc.eyes) tags.push(`${desc.eyes} eyes`);
  if (desc.face) tags.push(desc.face);
  if (desc.chest || desc.bust) tags.push(desc.chest || desc.bust || '');
  if (desc.waist) tags.push(desc.waist);
  if (desc.hips) tags.push(desc.hips);
  if (desc.legs) tags.push(desc.legs);
  if (desc.tail) tags.push(`${desc.tail}, kemonomimi`);
  if (desc.horns) tags.push(`${desc.horns}, fantasy`);
  if (desc.special) tags.push(desc.special);

  const slots = clothingSlots || {};
  const clothingParts = [slots.upper, slots.lower, slots.underwear, slots.footwear, slots.accessories]
    .filter(Boolean)
    .filter((v) => v !== 'None');
  if (clothingParts.length > 0) tags.push(...clothingParts.map((c) => c!.toLowerCase()));
  if (slots.upper === 'None' && slots.lower === 'None') tags.push('nude, naked');
  else if (slots.underwear === 'None' && clothingParts.length < 2) tags.push('no underwear');

  const mood = (character?.mood || '').toLowerCase();
  const arousal = progressions?.arousal ?? 0;
  if (mood.includes('flustered')) tags.push('flushed cheeks, embarrassed expression, blushing');
  else if (mood.includes('aroused') || mood.includes('lustful')) tags.push('seductive expression, half-lidded eyes');
  else if (mood.includes('happy')) tags.push('smiling, cheerful expression');
  else if (mood.includes('sad')) tags.push('teary eyes, sad expression');
  if (arousal >= 80 && !mood.includes('aroused')) tags.push('aroused, heavy breathing');

  const posture = body?.posture || 'standing';
  if (posture.toLowerCase().includes('lying')) tags.push('lying down, supine');
  else if (posture.toLowerCase().includes('sitting')) tags.push('sitting, seated');
  else if (posture.toLowerCase().includes('kneeling')) tags.push('kneeling, on knees');
  else tags.push('standing, upright');

  if (arousal >= 70 || sexModule?.active) tags.push('full body, dynamic angle');
  else tags.push('upper body, portrait, looking at viewer');
  tags.push('depth of field, bokeh');

  if (sexModule?.active) {
    if (sexModule.position) tags.push(sexModule.position.toLowerCase());
    if (sexModule.phase === 'sex') tags.push('explicit, nsfw, nude, sex, intercourse');
    else if (sexModule.phase === 'flirting') tags.push('suggestive, seductive pose, revealing clothing');
    else if (sexModule.phase === 'post-sex') tags.push('lying down, afterglow, satisfied expression, messy hair, sweat');
  }

  const room = (location?.currentRoom || '').toLowerCase();
  if (room.includes('bedroom')) tags.push('bedroom, king bed, soft ambient lighting, intimate setting, curtains');
  else if (room.includes('kitchen')) tags.push('kitchen, modern kitchen, warm overhead lighting, countertop');
  else if (room.includes('bathroom')) tags.push('bathroom, tiles, mirror, steam, shower');
  else if (room) tags.push(room);

  return tags.filter(Boolean).join(', ');
}

function buildNegativePrompt(): string {
  return [
    'lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits',
    'cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark',
    'username, blurry, artist name, out of frame, ugly, duplicate, morbid, mutilated, deformed',
    'extra limbs, disfigured, gross proportions, malformed limbs, missing arms, missing legs',
    'bad proportions, cross-eyed, poorly drawn face, cloned face, bad face, bad eyes',
    'unnatural colors, overexposed, underexposed, flat colors, plastic skin',
  ].join(', ');
}

function buildCameraPrompt(state: ErosStatusState): string {
  const arousal = state.progressions?.arousal ?? 0;
  const affection = state.progressions?.affection ?? 0;
  const lines: string[] = [];
  lines.push('── SHOT / FRAMING SUGGESTIONS ──\n');
  lines.push('Portrait / Character focus:');
  lines.push('  close-up, face focus, upper body, soft background blur\n');
  lines.push('Romantic / Intimate (affection ≥70):');
  lines.push(affection >= 70 ? '  ★ ACTIVE — cowboy shot, looking at viewer, warm bokeh' : '  [affection too low — unlock at 70%]\n');
  lines.push('Suggestive / High arousal (arousal ≥60):');
  lines.push(arousal >= 60 ? '  ★ ACTIVE — full body, dynamic composition, alluring angle' : '  [arousal too low — unlock at 60%]\n');
  lines.push('Recommended aspect ratios:');
  lines.push('  Portrait: 2:3 (512×768, 640×960, 832×1216)');
  lines.push('  Landscape: 16:9 (768×432)');
  lines.push('  Square: 1:1 (768×768) for close-ups');
  return lines.join('\n');
}

function buildPhysiqueSummary(state: ErosStatusState): string {
  const { character, body } = state;
  const desc = body?.description || {};
  const lines: string[] = [];
  lines.push(`── ${(character?.name || 'Character').toUpperCase()} — PHYSIQUE SUMMARY ──\n`);
  const physiqueTags: string[] = [];
  if (desc.hair) physiqueTags.push(`${desc.hair} hair`);
  if (desc.eyes) physiqueTags.push(`${desc.eyes} eyes`);
  if (desc.face) physiqueTags.push(desc.face);
  if (desc.chest || desc.bust) physiqueTags.push(desc.chest || desc.bust || '');
  if (desc.waist) physiqueTags.push(desc.waist);
  if (desc.hips) physiqueTags.push(desc.hips);
  if (desc.legs) physiqueTags.push(desc.legs);
  if (desc.tail) physiqueTags.push(desc.tail);
  if (desc.horns) physiqueTags.push(desc.horns);
  if (desc.special) physiqueTags.push(desc.special);

  if (physiqueTags.length > 0) {
    lines.push('Detected traits:');
    physiqueTags.forEach((t) => lines.push(`  ${t}`));
    lines.push('\nAs prompt tags:');
    lines.push(physiqueTags.filter(Boolean).join(', '));
  } else {
    lines.push('No physical description parsed yet.');
    lines.push('Include a BODY_DESCRIPTION block in the AI output.');
  }
  return lines.join('\n');
}

function buildModelSettings(state: ErosStatusState): string {
  const isNSFW = state.sexModule?.active && state.sexModule.phase === 'sex';
  const lines: string[] = [];
  lines.push('── RECOMMENDED CHECKPOINT ──\n');
  if (isNSFW) {
    lines.push('NSFW Realistic: RealisticVision v5.1, ChilloutMix, Cyberrealistic');
    lines.push('NSFW Anime: MeinaMix, AbyssOrangeMix3, PastelMix');
  } else {
    lines.push('SFW Realistic: Deliberate v3, DreamShaper 8, RealisticVision v5');
    lines.push('SFW Anime: Anything v5/v6, CounterfeitV3, GhostMix');
  }
  lines.push('\n── SAMPLER SETTINGS ──');
  lines.push('  Sampler: DPM++ 2M Karras');
  lines.push('  Steps: 28–35');
  lines.push('  CFG Scale: 7');
  lines.push('  Clip Skip: 2');
  return lines.join('\n');
}

export function ImagePromptPanel({ state, imgAuditIssues = [] }: ImagePromptPanelProps) {
  const [tab, setTab] = useState('positive');
  if (!state) return <div className="flex items-center justify-center h-24 text-gray-700 text-xs font-mono">No state data available</div>;

  const pendingImgIssues = imgAuditIssues.filter((i) => i.category === 'img' && !i.corrected && !i.ignored);
  const positive = buildPositivePrompt(state);
  const negative = buildNegativePrompt();
  const camera = buildCameraPrompt(state);
  const physique = buildPhysiqueSummary(state);
  const modelSettings = buildModelSettings(state);

  const tabs = [
    { id: 'positive', label: '✨ POS', color: 'var(--neon-cyan)' },
    { id: 'negative', label: '🚫 NEG', color: 'var(--neon-pink)' },
    { id: 'camera', label: '📷 CAM', color: 'var(--neon-green)' },
    { id: 'physique', label: '🧬 PHYS', color: 'var(--neon-gold)' },
    { id: 'model', label: '⚙️ MODEL', color: 'var(--neon-purple)' },
  ];

  return (
    <div
      className="mx-3 mb-2 rounded overflow-hidden"
      style={{ border: '1px solid var(--terminal-border)' }}
    >
      <div
        className="px-3 py-1.5 flex items-center justify-between"
        style={{ background: 'color-mix(in srgb, var(--neon-cyan) 8%, transparent)', borderBottom: '1px solid var(--terminal-border)' }}
      >
        <span className="text-xs font-mono font-bold neon-cyan tracking-widest">🖼️ IMAGE GEN TAGS</span>
        <span className="text-xs font-mono text-gray-600">Auto-generated from state</span>
      </div>

      {pendingImgIssues.length > 0 && (
        <div
          className="px-3 py-2"
          style={{ background: 'color-mix(in srgb, var(--neon-gold) 5%, transparent)', borderBottom: '1px solid color-mix(in srgb, var(--neon-gold) 20%, transparent)' }}
        >
          <div className="text-xs font-mono font-bold mb-1" style={{ color: 'var(--neon-gold)' }}>
            ⚠ IMG AUDITOR: {pendingImgIssues.length} mismatch{pendingImgIssues.length > 1 ? 'es' : ''}
          </div>
          {pendingImgIssues.map((issue) => (
            <div key={issue.id} className="text-xs font-mono mb-1" style={{ color: 'color-mix(in srgb, var(--neon-gold) 80%, transparent)', fontSize: '10px' }}>
              • {issue.message}
            </div>
          ))}
        </div>
      )}

      <div
        className="flex overflow-x-auto"
        style={{ borderBottom: '1px solid color-mix(in srgb, var(--neon-cyan) 15%, transparent)', background: 'var(--terminal-bg)', scrollbarWidth: 'none' }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex-1 text-xs font-mono py-1.5 transition-all border-b-2 whitespace-nowrap px-1"
            style={{
              borderBottomColor: tab === t.id ? t.color : 'transparent',
              color: tab === t.id ? t.color : 'var(--terminal-text-muted)',
              background: tab === t.id ? `color-mix(in srgb, ${t.color} 10%, transparent)` : 'transparent',
              textShadow: tab === t.id ? `0 0 6px ${t.color}` : 'none',
              minWidth: '48px',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-3 py-2" style={{ background: 'var(--terminal-card)' }}>
        {tab === 'positive' && (
          <CopyBlock label="✨ POSITIVE PROMPT" content={positive} color="var(--neon-cyan)" />
        )}
        {tab === 'negative' && (
          <CopyBlock label="🚫 NEGATIVE PROMPT" content={negative} color="var(--neon-pink)" />
        )}
        {tab === 'camera' && (
          <CopyBlock label="📷 CAMERA & FRAMING" content={camera} color="var(--neon-green)" />
        )}
        {tab === 'physique' && (
          <CopyBlock
            label="🧬 PHYSIQUE ANCHOR TAGS"
            content={physique}
            color="var(--neon-gold)"
            hint="Add these first in your prompt to lock character appearance."
          />
        )}
        {tab === 'model' && (
          <CopyBlock label="⚙️ MODEL & SETTINGS" content={modelSettings} color="var(--neon-purple)" />
        )}
      </div>
    </div>
  );
}
