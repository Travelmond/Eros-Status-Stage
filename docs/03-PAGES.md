# 03 — src/pages (Terminal, Demo, SRS)

> Parte 3/10. Código-fonte completo das páginas da aplicação. ❌ Todas usam `react-router-dom` e devem ser removidas no deploy standalone (ver `docs/10-DEPLOY.md`).

---

### `src/pages/Terminal.jsx`

> Preview local do terminal com chat simulado. ❌ **MIGRAÇÃO:** remover no deploy.

```jsx
/**
 * ── DEPLOY NO CHUB VENUS AI ─────────────────────────────────────
 * ❌ REMOVER ESTE ARQUIVO ao fazer deploy.
 *    O Chub Venus AI Stage não usa React Router.
 *    Este arquivo é apenas para preview local no Base44.
 *
 *    Ao fazer deploy, substitua src/main.jsx por:
 *
 *    import React from 'react';
 *    import ReactDOM from 'react-dom/client';
 *    import ErosTerminal from './components/terminal/ErosTerminal';
 *    import './index.css';
 *    ReactDOM.createRoot(document.getElementById('root')).render(
 *      <React.StrictMode><ErosTerminal /></React.StrictMode>
 *    );
 *
 * ── BASE44: REMOÇÃO ─────────────────────────────────────────────
 * ❌ REMOVER: import { Link } from 'react-router-dom'
 *    (react-router-dom não é necessário no deploy standalone)
 * ────────────────────────────────────────────────────────────────
 */
import React, { useState } from 'react';
import ErosTerminal from '../components/terminal/ErosTerminal';
import { Link } from 'react-router-dom';

export default function Terminal() {
  const [barStyle, setBarStyle] = useState('bar');

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#050505' }}>
      <div className="flex items-center justify-between px-4 py-2 flex-shrink-0" style={{ borderBottom: '1px solid #00FFF520', background: '#0A0A0A' }}>
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono neon-pink tracking-widest">EROS</span>
          <span className="text-xs font-mono" style={{ color: '#ffffff30' }}>|</span>
          <nav className="flex gap-3">
            <Link to="/" className="text-xs font-mono neon-cyan">TERMINAL</Link>
            <Link to="/demo" className="text-xs font-mono text-gray-600 hover:text-gray-300 transition-colors">DEMO</Link>
            <Link to="/srs" className="text-xs font-mono text-gray-600 hover:text-gray-300 transition-colors">SRS DOCS</Link>
          </nav>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs font-mono text-gray-600 mr-1">BARS:</span>
          {['bar', 'ascii', 'emoji'].map(s => (
            <button key={s} onClick={() => setBarStyle(s)}
              className="text-xs font-mono px-2 py-0.5 rounded transition-all"
              style={{ border: `1px solid ${barStyle === s ? '#00FFF5' : '#00FFF520'}`, color: barStyle === s ? '#00FFF5' : '#ffffff40', background: barStyle === s ? '#00FFF510' : 'transparent' }}>
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden" style={{ borderRight: '1px solid #00FFF520' }}>
          <div className="px-4 py-2 flex-shrink-0 text-xs font-mono" style={{ borderBottom: '1px solid #00FFF510', color: '#ffffff30' }}>
            CHUB VENUS AI — CHAT WINDOW (SIMULATED)
          </div>
          <SimulatedChat />
        </div>
        <div className="flex-shrink-0 overflow-hidden" style={{ width: '320px', minWidth: '280px', maxWidth: '380px' }}>
          <ErosTerminal barStyle={barStyle} />
        </div>
      </div>
    </div>
  );
}

const SAMPLE_MESSAGES = [
  { role: 'user', text: 'Good morning, Hanako.' },
  {
    role: 'ai',
    text: `*Hanako looks up from the kitchen counter, cheeks tinted pink*\n\n<span style="color:pink"><b>Hanako:</b></span> **"Oh — good morning! I was just making breakfast. Are you hungry?"**\n\n*~He's looking at me with that expression again... why does my heart beat faster?~*\n\n---\n\n[💕75% 🎯80% 🔥55% 🍑70%] [📍Bedroom → Home] [⏰08:15]\n\n😊 Mood: Flustered\nThoughts: 'He's looking at me again...'\nClothing: Light orange shirt, tight jeans\nLocation: Master Bedroom → Home\nInventory: Phone, Lipstick\nGoals: Prepare dinner, resist flirting\nNPCs: Neighbor (nearby)`,
  },
  { role: 'user', text: 'You look beautiful today.' },
  {
    role: 'ai',
    text: `*Hanako freezes mid-stir, a deep blush spreading across her cheeks*\n\n<span style="color:pink"><b>Hanako:</b></span> **"I — oh, please don't say things like that so suddenly!"**\n\n*~Why does he have to smile like that...~*\n\n---\n\n[💕82% 🎯80% 🔥65% 🍑78%] [📍Kitchen → Home] [⏰08:18] [☀️]\n\n😳 Mood: Flustered\nThoughts: 'Why does he have to smile like that...'\nClothing: Light orange shirt, tight jeans\nLocation: Kitchen → Home\nInventory: Phone, Lipstick, Spatula\nGoals: Prepare breakfast, maintain composure`,
  },
];

function SimulatedChat() {
  const [messages] = useState(SAMPLE_MESSAGES);
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm">
      {messages.map((msg, i) => (
        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className="max-w-md rounded p-3 text-xs leading-relaxed"
            style={{ background: msg.role === 'user' ? '#00FFF510' : '#FF2D7808', border: `1px solid ${msg.role === 'user' ? '#00FFF530' : '#FF2D7820'}`, color: msg.role === 'user' ? '#00FFF5' : '#e2e8f0', whiteSpace: 'pre-wrap' }}>
            {msg.role === 'ai' && <div className="text-xs mb-1" style={{ color: '#FF2D7880' }}>AI RESPONSE</div>}
            <div dangerouslySetInnerHTML={{ __html: msg.text }} />
          </div>
        </div>
      ))}
    </div>
  );
}
```

### `src/pages/Demo.jsx`

> Demo interativa com 7 cenários pré-configurados (Morning, Tension, NPC, Evening, Sex, Reaction, JSON). ❌ **MIGRAÇÃO:** remover no deploy.

```jsx
/**
 * ── DEPLOY NO CHUB VENUS AI ─────────────────────────────────────
 * ❌ REMOVER ESTE ARQUIVO ao fazer deploy.
 *    A página de Demo é exclusiva do ambiente Base44/desenvolvimento.
 *    O Chub Venus AI Stage roda apenas ErosTerminal diretamente.
 *
 * ── BASE44: REMOÇÃO ─────────────────────────────────────────────
 * ❌ REMOVER: react-router-dom (Link, useNavigate, etc.)
 * ────────────────────────────────────────────────────────────────
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import ErosTerminal from '../components/terminal/ErosTerminal';
import { Link } from 'react-router-dom';

const DEMO_SCENARIOS = [
  {
    label: '🌅 Morning Scene',
    tag: 'Daily Life',
    tagColor: '#00FFF5',
    text: `Day 5 | 08:15 | ☀️ Sunny | 📍 Kitchen\n\n#Hanako [MILF]\n\n[💕75% 🎯80% 🔥55% 🍑45%] [📍Kitchen → Home] [⏰08:15]\n\n😊 Mood: Cheerful\nThoughts: 'What should I make for breakfast today?'\nClothing: Light orange shirt, tight blue jeans, no bra\nLocation: Kitchen → Home\nInventory: Phone, Lipstick, Apron\nGoals: Prepare breakfast, greet husband\nNPCs: none`,
    aiLine: '*Hanako hums softly while stirring eggs, her back turned to you, hips swaying gently with the rhythm.*\n\n**"Oh! Good morning — I didn\'t hear you come down. Hungry?"**\n\n*~He always looks at me like that first thing in the morning... I don\'t hate it~*',
    userPrompts: ['Good morning!', 'You look lovely today.', 'What are you making?'],
  },
  {
    label: '😳 Tension Rising',
    tag: 'Romance',
    tagColor: '#FF2D78',
    text: `Day 5 | 14:32 | ☀️ Sunny | 📍 Bedroom\n\n#Hanako [MILF]\n\n[💕82% 🎯75% 🔥72% 🍑70%] [📍Master Bedroom → Home] [⏰14:32]\n\n😳 Mood: Flustered\nThoughts: 'He keeps staring... why does my heart beat faster?'\nClothing: Light orange shirt (unbuttoned top), tight jeans\nLocation: Master Bedroom → Home\nInventory: Phone, Lipstick\nGoals: Maintain composure, avoid eye contact\nNPCs: Neighbor Kenji (downstairs, unaware)`,
    aiLine: '*Hanako freezes mid-fold of the laundry, cheeks flooding pink as your shadow falls across the doorframe.*\n\n**"I — oh. How long have you been standing there?"**\n\n*~He\'s looking at me again. My hands are shaking for no reason. This is ridiculous.~*',
    userPrompts: ['Can I help you?', 'Your shirt is unbuttoned.', 'You\'re cute when flustered.'],
  },
  {
    label: '😰 NPC Encounter',
    tag: 'Tension',
    tagColor: '#FFD700',
    text: `Day 6 | 15:45 | ☁️ Cloudy | 📍 Living Room\n\n#Hanako [MILF]\n\n[💕70% 🎯65% 🔥80% 🍑75%] [📍Living Room → Home] [⏰15:45]\n\n😰 Mood: Nervous\nThoughts: 'Kenji is here again... and looking at me like that'\nClothing: White blouse, black skirt, heels\nLocation: Living Room → Home\nInventory: Phone, Handbag\nGoals: Keep distance from Kenji, call husband\nNPCs: Kenji (neighbor, suspicious), Yuki (friend, visiting)`,
    aiLine: '*Hanako stands stiffly near the kitchen entrance, eyes darting between Kenji\'s too-long stare and the door.*\n\n**"Ah — yes, Kenji stopped by to return some tools. He was just leaving."**\n\n*~Please just leave. Please.~*',
    userPrompts: ['Are you okay?', 'I\'ll handle Kenji.', 'Let\'s go upstairs.'],
  },
  {
    label: '🌙 Evening Intimacy',
    tag: 'Romantic',
    tagColor: '#BF5FFF',
    text: `Day 7 | 21:00 | 🌙 Night | 📍 Bedroom\n\n#Hanako [MILF]\n\n[💕90% 🎯85% 🔥88% 🍑92%] [📍Master Bedroom → Home] [⏰21:00] [🌙]\n\n😍 Mood: Loving\nThoughts: 'I love him so much...'\nShameful Thought: '~I wonder if he knows how much I think about him during the day~'\nClothing: Silk nightgown, no underwear\nLocation: Master Bedroom → Home\nInventory: Phone\nGoals: Be close to husband, express feelings\nNPCs: none`,
    aiLine: '*Hanako sits on the edge of the bed in low amber light, the silk of her nightgown catching every soft curve. She looks up as you enter — a slow, warm smile.*\n\n**"I was waiting for you."**\n\n*~Tell him. Just tell him.~*',
    userPrompts: ['I missed you.', '*sit beside her*', 'You\'re beautiful.'],
  },
  {
    label: '🔥 Sex Scene',
    tag: 'NSFW',
    tagColor: '#FF2D78',
    text: `Day 8 | 23:15 | 🌙 Night | 📍 Master Bedroom\n\n#Hanako [MILF]\n\n[💕95% 🎯88% 🔥98% 🍑97%] [📍Master Bedroom → Home] [⏰23:15] [🌙]\n\n😍 Mood: Passionate\n\n╔══════════════════════════════════════╗\n║ 🔥 SEXUAL_STATUS                     ║\n╠══════════════════════════════════════╣\n║ 💖 Intimacy Level: Full Consummation ║\n║ Position: Missionary (deep)           ║\n║ Pace: Slow and tender                 ║\n║ Orgasm Count: 1                       ║\n╠══════════════════════════════════════╣\n║ 👁️ Sight: Tears of joy in her eyes   ║\n║ 🔊 Sound: Soft moans, whispered names ║\n║ 👃 Smell: Jasmine perfume, warmth     ║\n║ 🤚 Touch: Fingers intertwined        ║\n║ 👅 Taste: Salt of her tears           ║\n╠══════════════════════════════════════╣\n║ ♀ FEMALE ANATOMY                     ║\n║ Lubrication: Fully aroused, wet      ║\n║ Vagina: Tight, gripping, warm        ║\n║ Cervix: Kissed repeatedly             ║\n║ Uterus: Contracting with pleasure    ║\n║ Cycle: Day 14 — Ovulation (Fertile)  ║\n╠══════════════════════════════════════╣\n║ ♂ MALE                               ║\n║ Seminal Volume: High                  ║\n║ Ejaculation Count: 1                  ║\n╚══════════════════════════════════════╝\n\n*~I've waited so long for this moment... I never want it to end~*\n\nClothing: None\nLocation: Master Bedroom → Home\nGoals: Express love fully\nNPCs: none`,
    aiLine: '*Hanako arches into you, her voice a breathless whisper against your neck —*\n\n**"Don\'t stop... please... I love you..."**\n\n*Her fingers tighten in your hair. A single tear traces the curve of her cheek — not from pain.*',
    userPrompts: ['*hold her closer*', 'I love you too.', '*increase pace*'],
  },
  {
    label: '🧠 Reaction Module',
    tag: 'Special',
    tagColor: '#BF5FFF',
    text: `Day 9 | 10:00 | ☀️ Sunny | 📍 Kitchen\n\n#Blondie [Holstaurus]\n\n[💕60% 🎯55% 🔥82% 🍑78%] [📍Kitchen → Home] [⏰10:00]\n\n😏 Mood: Seductive\n\n╔══════════════════════════════════════════════════╗\n║ 🧠 REACTION MODULE                               ║\n╠══════════════════════════════════════════════════╣\n║ Character: Blondie                               ║\n║ Stimulus: Sight of Fabiano's confident gaze      ║\n╠══════════════════════════════════════════════════╣\n║ 😍 Awe: He's perfect… for me…                   ║\n║ 🥵 Desire: Need him closer now!                 ║\n║ 😖 Anxiety: Will it work out?                   ║\n║ 😳 Shame: Why am I trembling already?           ║\n╚══════════════════════════════════════════════════╝\n\nThoughts: 'He's looking at me like I'm the only one in the room...'\nLocation: Kitchen → Home\nGoals: Get closer to him\nNPCs: none`,
    aiLine: '*Blondie\'s large amber eyes lock onto yours, her fluffy tail flicking nervously behind her. She sets down her milk pail with a soft clunk.*\n\n**"You\'re... staring again."** *[A smile she can\'t suppress]* **"...I don\'t mind."**',
    userPrompts: ['You\'re beautiful.', '*step closer*', 'Tell me what you\'re thinking.'],
  },
  {
    label: '📦 JSON Injection',
    tag: 'Dev',
    tagColor: '#39FF14',
    text: 'Day 3 | 16:00 | ☁️ Cloudy | 📍 Library\n\n#Sakura [Step-Sister]\n\n*Sakura glances up from her book, cheeks flushing as you sit beside her.*\n\n**"W-what are you doing here?"**\n\n```json\n{\n  "character": { "name": "Sakura", "role": "Step-Sister", "mood": "Flustered", "expression": "flustered" },\n  "system": { "day": 3, "time": "16:00", "weather": "Cloudy", "sceneType": "flirting" },\n  "progressions": { "affection": 62, "obedience": 70, "libido": 45, "arousal": 38, "trust": 58, "embarrassment": 71, "happiness": 55 },\n  "location": { "currentRoom": "Library", "building": "School", "visitedRooms": ["Classroom", "Cafeteria"] },\n  "clothing": { "upperBody": "School uniform, white shirt", "lowerBody": "Navy pleated skirt", "underwear": "White cotton" },\n  "body": { "thoughts": "Why does he always sit so close...", "posture": "hunched over book, looking sideways" },\n  "inventory": { "items": ["Textbook", "Pencil case", "Water bottle"] },\n  "npcs": [{ "name": "Yui", "relation": "classmate", "mood": "curious" }]\n}\n```',
    aiLine: '*Sakura pretends to return to her book but keeps glancing at you from the corner of her eye.*\n\n```json\n{"character":{"name":"Sakura","role":"Step-Sister","mood":"Embarrassed","expression":"flustered"},"progressions":{"affection":63,"embarrassment":78,"arousal":42,"libido":46}}\n```',
    userPrompts: ['Just wanted to study nearby.', 'You look cute when reading.', 'Can I sit here?'],
  },
];

function ChatMessage({ msg, onQuickSend }) {
  return (
    <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className="max-w-xs rounded p-2.5 text-xs leading-relaxed"
        style={{
          background: msg.role === 'user' ? '#00FFF510' : '#FF2D7808',
          border: `1px solid ${msg.role === 'user' ? '#00FFF530' : '#FF2D7820'}`,
          color: msg.role === 'user' ? '#00FFF5' : '#e2e8f0',
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace',
        }}
      >
        {msg.role === 'ai' && (
          <div className="text-xs mb-1 font-bold" style={{ color: '#FF2D7860' }}>
            {msg.charName || 'AI'} ▸
          </div>
        )}
        <div>{msg.text}</div>
        {msg.role === 'ai' && msg.quickReplies && (
          <div className="flex flex-wrap gap-1 mt-2 pt-2" style={{ borderTop: '1px solid #FF2D7820' }}>
            {msg.quickReplies.map((qr, i) => (
              <button key={i} onClick={() => onQuickSend(qr)}
                className="text-xs px-2 py-0.5 rounded transition-all font-mono"
                style={{ border: '1px solid #00FFF520', color: '#00FFF560', background: '#00FFF508' }}>
                {qr}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function extractBaseStats(text) {
  const m = text.match(/\[💕(\d+)%.*?🎯(\d+)%.*?🔥(\d+)%.*?🍑(\d+)%\]/);
  if (m) return { affection: +m[1], obedience: +m[2], libido: +m[3], arousal: +m[4] };
  return { affection: 70, obedience: 70, libido: 50, arousal: 40 };
}

function generateResponse(userText, scenario, turnCount) {
  const charName = scenario.text.match(/#([^\[]+)/)?.[1]?.trim() || 'AI';
  const isIntimate = scenario.tag === 'NSFW' || scenario.tag === 'Romantic';
  const isTense = scenario.tag === 'Tension';

  const baseStats = extractBaseStats(scenario.text);
  const delta = Math.min(turnCount * 3, 15);
  const newAffection = Math.min(99, (baseStats.affection || 70) + delta);
  const newArousal = Math.min(99, (baseStats.arousal || 50) + (isIntimate ? delta * 1.5 : delta * 0.5));

  const responses = isIntimate ? [
    { text: `*${charName} pulls you closer, breath warm against your neck.*\n\n**"You always know what to say..."**\n\n*~Don't let go. Please.~*`, qr: ['*hold tighter*', 'I love you.', '*kiss her*'] },
    { text: `*A soft sound escapes her as her fingers trace your jaw.*\n\n**"Stay like this... just a little longer."**`, qr: ['Always.', '*whisper her name*', '*nod silently*'] },
  ] : isTense ? [
    { text: `*${charName} averts her gaze but doesn't move away.*\n\n**"I... I'm fine. Don't worry about me."**\n\n*~He noticed. Of course he noticed.~*`, qr: ['I\'m here.', 'Tell me what\'s wrong.', '*take her hand*'] },
  ] : [
    { text: `*${charName} smiles softly, a light flush on her cheeks.*\n\n**"That's... very sweet of you."**\n\n*~He makes everything feel easier somehow.~*`, qr: ['I mean it.', 'Tell me more.', '*smile back*'] },
    { text: `*${charName} tilts her head, studying you with warm eyes.*\n\n**"You're different from what I expected."**`, qr: ['How so?', 'Good different?', '*shrug playfully*'] },
  ];

  const picked = responses[Math.floor(Math.random() * responses.length)];
  const thoughtMatch = picked.text.match(/~([^~]+)~/);

  const parseText = [
    scenario.text.split('\n')[0],
    scenario.text.match(/^#[^\n]+/m)?.[0] || '',
    `[💕${newAffection}% 🎯${baseStats.obedience || 75}% 🔥${baseStats.libido || 60}% 🍑${Math.round(newArousal)}%]`,
    `😊 Mood: ${isIntimate ? 'Loving' : 'Flustered'}`,
    `Thoughts: '${thoughtMatch ? thoughtMatch[1] : 'He makes my heart race...'}'`,
    ...scenario.text.split('\n').filter(l => l.startsWith('Clothing:')),
    ...scenario.text.split('\n').filter(l => l.startsWith('Location:')),
    ...scenario.text.split('\n').filter(l => l.startsWith('NPCs:')),
  ].join('\n');

  return { text: picked.text, quickReplies: picked.qr, parseText };
}

export default function Demo() {
  const [activeScenario, setActiveScenario] = useState(null);
  const [barStyle, setBarStyle] = useState('bar');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [terminalKey, setTerminalKey] = useState(0);
  const [lastParseText, setLastParseText] = useState('');
  const [viewMode, setViewMode] = useState('chat');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadScenario = useCallback((scenario) => {
    setActiveScenario(scenario);
    setTerminalKey(k => k + 1);
    setLastParseText(scenario.text);
    setMessages([{
      role: 'ai',
      text: scenario.aiLine,
      charName: scenario.text.match(/#([^\[]+)/)?.[1]?.trim() || 'AI',
      quickReplies: scenario.userPrompts,
      parseText: scenario.text,
    }]);
  }, []);

  const sendMessage = useCallback((text) => {
    if (!text.trim() || !activeScenario) return;
    const charName = activeScenario.text.match(/#([^\[]+)/)?.[1]?.trim() || 'AI';
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInputValue('');
    setTimeout(() => {
      const resp = generateResponse(text, activeScenario, messages.length);
      setLastParseText(resp.parseText);
      setTerminalKey(k => k + 1);
      setMessages(prev => [...prev, {
        role: 'ai',
        text: resp.text,
        charName,
        quickReplies: resp.quickReplies,
        parseText: resp.parseText,
      }]);
    }, 600 + Math.random() * 400);
  }, [activeScenario, messages.length]);

  return (
    <div className="min-h-screen flex flex-col font-mono" style={{ background: '#050505' }}>
      <div className="flex items-center justify-between px-4 py-2 flex-shrink-0"
        style={{ borderBottom: '1px solid #00FFF520', background: '#0A0A0A' }}>
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono neon-pink tracking-widest">EROS</span>
          <span className="text-xs font-mono" style={{ color: '#ffffff30' }}>|</span>
          <nav className="flex gap-3">
            <Link to="/" className="text-xs font-mono text-gray-600 hover:text-gray-300 transition-colors">TERMINAL</Link>
            <Link to="/demo" className="text-xs font-mono neon-cyan">DEMO</Link>
            <Link to="/srs" className="text-xs font-mono text-gray-600 hover:text-gray-300 transition-colors">SRS DOCS</Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-600">BARS:</span>
          {['bar', 'ascii', 'emoji'].map(s => (
            <button key={s} onClick={() => setBarStyle(s)}
              className="text-xs font-mono px-2 py-0.5 rounded transition-all"
              style={{ border: `1px solid ${barStyle === s ? '#00FFF5' : '#00FFF520'}`, color: barStyle === s ? '#00FFF5' : '#ffffff40', background: barStyle === s ? '#00FFF510' : 'transparent' }}>
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col overflow-y-auto flex-shrink-0"
          style={{ width: '190px', borderRight: '1px solid #00FFF520', background: '#080808' }}>
          <div className="px-3 py-2 text-xs neon-cyan tracking-widest sticky top-0 z-10"
            style={{ background: '#080808', borderBottom: '1px solid #00FFF515' }}>
            SCENARIOS
          </div>
          <div className="p-2 space-y-1.5">
            {DEMO_SCENARIOS.map((scenario, i) => {
              const isActive = activeScenario?.label === scenario.label;
              return (
                <button key={i} onClick={() => loadScenario(scenario)}
                  className="w-full text-left p-2 rounded text-xs font-mono transition-all"
                  style={{
                    border: `1px solid ${isActive ? scenario.tagColor : '#ffffff15'}`,
                    background: isActive ? `${scenario.tagColor}10` : '#0D0D0D',
                    color: isActive ? scenario.tagColor : '#ffffff50',
                  }}>
                  <div className="font-bold text-xs mb-0.5">{scenario.label}</div>
                  <div className="text-xs px-1 py-0 rounded inline-block"
                    style={{ background: `${scenario.tagColor}20`, color: scenario.tagColor, fontSize: '9px' }}>
                    {scenario.tag}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="p-3 mt-auto" style={{ borderTop: '1px solid #00FFF520' }}>
            <div className="text-xs text-gray-700 mb-1.5 tracking-wider">VIEW</div>
            <div className="flex gap-1">
              {['chat', 'raw'].map(m => (
                <button key={m} onClick={() => setViewMode(m)}
                  className="flex-1 text-xs py-0.5 rounded font-mono transition-all"
                  style={{ border: `1px solid ${viewMode === m ? '#00FFF5' : '#00FFF520'}`, color: viewMode === m ? '#00FFF5' : '#ffffff30', background: viewMode === m ? '#00FFF510' : 'transparent' }}>
                  {m.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden" style={{ borderRight: '1px solid #00FFF520' }}>
          <div className="px-4 py-2 flex items-center justify-between flex-shrink-0"
            style={{ borderBottom: '1px solid #00FFF515', background: '#0A0A0A' }}>
            <div className="text-xs font-mono" style={{ color: '#ffffff40' }}>
              {activeScenario ? `${activeScenario.label}` : 'SELECT A SCENARIO TO BEGIN'}
            </div>
            {activeScenario && (
              <div className="text-xs font-mono px-2 py-0.5 rounded"
                style={{ border: `1px solid ${activeScenario.tagColor}40`, color: activeScenario.tagColor, background: `${activeScenario.tagColor}10` }}>
                {viewMode === 'chat' ? '💬 INTERACTIVE' : '📄 RAW'}
              </div>
            )}
          </div>

          {!activeScenario ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="text-gray-700 font-mono text-xs text-center">
                <div className="text-4xl mb-3">⌨️</div>
                <div className="neon-cyan mb-1">Choose a scenario on the left</div>
                <div className="text-gray-700">Terminal updates live with each message</div>
              </div>
              <div className="grid grid-cols-2 gap-2 max-w-xs px-4">
                {DEMO_SCENARIOS.slice(0, 4).map((s, i) => (
                  <button key={i} onClick={() => loadScenario(s)}
                    className="p-2 rounded text-xs font-mono transition-all text-center"
                    style={{ border: `1px solid ${s.tagColor}40`, color: s.tagColor, background: `${s.tagColor}08` }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          ) : viewMode === 'chat' ? (
            <>
              <div className="flex-1 overflow-y-auto p-4">
                {messages.map((msg, i) => (
                  <ChatMessage key={i} msg={msg} onQuickSend={sendMessage} />
                ))}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(inputValue); }}
                className="p-3 flex-shrink-0" style={{ borderTop: '1px solid #00FFF515', background: '#080808' }}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    placeholder={`Say something to ${activeScenario.text.match(/#([^\[]+)/)?.[1]?.trim() || 'char'}...`}
                    className="flex-1 bg-transparent outline-none text-xs font-mono text-gray-300 placeholder-gray-700 px-3 py-2 rounded"
                    style={{ border: '1px solid #00FFF520', background: '#050505' }}
                  />
                  <button type="submit"
                    className="px-3 py-2 rounded text-xs font-mono transition-all"
                    style={{ border: '1px solid #00FFF540', color: '#00FFF5', background: '#00FFF510' }}>
                    SEND
                  </button>
                </div>
                <div className="mt-1 text-xs font-mono" style={{ color: '#ffffff20' }}>
                  Quick replies appear below AI messages • Terminal updates live
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="text-xs font-mono mb-2" style={{ color: '#00FFF570' }}>LATEST PARSED TEXT ↓</div>
              <div className="rounded p-3 text-xs font-mono leading-relaxed"
                style={{ background: '#0D0D0D', border: '1px solid #00FFF520', color: '#00FFF5', whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
                {lastParseText || activeScenario.text}
              </div>
            </div>
          )}
        </div>

        <div className="flex-shrink-0 overflow-hidden" style={{ width: '320px' }}>
          <ErosTerminal barStyle={barStyle} key={terminalKey} initialText={lastParseText || activeScenario?.text} />
        </div>
      </div>
    </div>
  );
}
```

### `src/pages/SRS.jsx`

> Documentação SRS in-app (16 seções). ❌ **MIGRAÇÃO:** remover `react-router-dom`. Código completo (~940 linhas) preservado no repositório. Por restrição de volume deste arquivo de docs, o conteúdo integral de `SRS.jsx` está disponível no arquivo fonte `src/pages/SRS.jsx` do repositório. Ele renderiza: Overview, Proposal, Scope, Requirements (FR-01 a FR-27, NF-01 a NF-05), Relationship System (Family Tier + Affection Tier + forbidden escalation), Body Description, IMG Module, Architecture (Mermaid), Wireframes (ASCII), UML, ERD, Sequence Diagrams, Component Tree, Tools, Interface Prototype (iframe `/demo`) e Changelog (v1.0, v1.1, v2.0). Componentes auxiliares: `Section`, `CodeBlock` (com copy), `MermaidBlock`, `Req`.

> ℹ️ **Nota:** O conteúdo de `SRS.jsx` é majoritariamente a própria documentação SRS já reproduzida em `docs/01-ARQUITETURA.md` (seções 5–6 e diagramas). Para evitar duplicação massiva, o código-fonte integral de `SRS.jsx` permanece no repositório e sua estrutura está refletida na documentação de arquitetura.

---

*Próximo: `docs/04-TERMINAL_CORE.md` — `ErosTerminal.jsx` + painéis base.*