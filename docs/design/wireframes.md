# Eros Status Terminal — Wireframes

> Design system e wireframes de referência para a interface do Stage Chub.

---

## 1. Design Tokens

| Token | Valor | Uso |
|-------|-------|-----|
| `--terminal-bg` | `#0A0A0A` | Fundo geral |
| `--terminal-card` | `#0D0D0D` | Cards / painéis |
| `--terminal-panel` | `#111111` | Superfícies secundárias |
| `--terminal-border` | `#00FFF540` | Bordas neon suaves |
| `--neon-cyan` | `#00FFF5` | Primária / informação |
| `--neon-pink` | `#FF2D78` | Sex / alertas / NTR |
| `--neon-green` | `#39FF14` | Status positivo / live |
| `--neon-purple` | `#BF5FFF` | Relacionamentos / NTR / config |
| `--neon-gold` | `#FFD700` | Metas / imagem / destaque |
| `--font-mono` | `JetBrains Mono`, `Share Tech Mono` | Tipografia global |
| `--radius` | `0.25rem` | Cantos sutis |

---

## 2. Wireframe Desktop (painel lateral direito, ≥1024px)

```text
┌──────────────────────────────────────────────────────────────────────┐
│ CHUB CHAT WINDOW                                  │ EROS STATUS TERMINAL │
│                                                   │ ┌──────────────────┐ │
│ Hanako: Day 5 already? Time flies...              │ │ EROS STATUS TERM │ │
│ User: You seem flustered.                         │ │ Day 5 │ 14:32 │ ☀️ │ │
│                                                   │ │ 📍 Bedroom       │ │
│                                                   │ ├──────────────────┤ │
│                                                   │ │ [😳] Hanako [MILF│ │
│                                                   │ │ MOOD: Flustered  │ │
│                                                   │ ├──────────────────┤ │
│                                                   │ │ [STATUS][INV][CH │ │
│                                                   │ │ [MAP][NPCs][SEX][ │ │
│                                                   │ │ [RAW][AUDIT][CONF │ │
│                                                   │ ├──────────────────┤ │
│                                                   │ │ PROGRESSIONS     │ │
│                                                   │ │ 💕 Affection  75%│ │
│                                                   │ │ 🎯 Obedience  80%│ │
│                                                   │ │ 🔥 Libido     55%│ │
│                                                   │ │ 🍑 Arousal    70%│ │
│                                                   │ ├──────────────────┤ │
│                                                   │ │ 🤝 RELATIONSHIPS │ │
│                                                   │ │ Hanako → User    │ │
│                                                   │ │ ✓ Romance ✓ Erot │ │
│                                                   │ ├──────────────────┤ │
│                                                   │ │ ▸ [parse input]  │ │
│                                                   │ │ T#5 • ESS v3.0 ●L │ │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 3. Wireframe Mobile (320px, posição `ADJACENT`)

```text
┌──────────────────────────┐
│ EROS STATUS TERMINAL     │
│ Day 5 │ 14:32 │ ☀️ │ 📍 │
│ ┌──────────────────────┐ │
│ │ 😳 Hanako [MILF]     │ │
│ │ MOOD: Flustered      │ │
│ └──────────────────────┘ │
│ [ST][IN][CH][MP][NP]     │
│ [SX][RE][NT][IM][RW]     │
│ [AU][CF][AI]             │
│ ┌──────────────────────┐ │
│ │ 💕 Affection  75%    │ │
│ │ 🎯 Obedience  80%    │ │
│ │ 🔥 Libido     55%    │ │
│ │ 🍑 Arousal    70%    │ │
│ └──────────────────────┘ │
│ ▸ [paste AI output...]   │
│ T#5  •  ESS v3.0  ●LIVE  │
└──────────────────────────┘
```

---

## 4. Estrutura de Abas

| Aba | Conteúdo principal |
|-----|--------------------|
| STATUS | Progressions + Relationships |
| INV | Inventory + Body Description |
| CHAR | Emotion panel + Physical description detalhada |
| MAP | MiniMap 3×3 + Location details |
| NPCs | NPC roster + Goals |
| SEX | Sex module (condicional) |
| REACT | Reaction module (condicional) |
| NTR | NTR module (requer ativação) |
| IMG | Image Prompt Panel |
| RAW | JSON/texto bruto parseado |
| AUDIT | Auditor issues + histórico |
| CONFIG | Memória, toggles, AI provider |
| AI | Processamento via OpenRouter |

---

## 5. Estados de Componente

### NeonProgressBar
- **default**: track escuro, fill gradiente neon.
- **style=ascii**: barras ASCII `████░░`.
- **style=emoji**: corações ♥♥♥♡♡.

### Tabs
- **inactive**: ícone + label com opacidade 30%, sem borda inferior.
- **active**: cor neon do tab, fundo 10% da cor, border-bottom 2px, glow de texto.
- **condicional**: exibido apenas quando o módulo correspondente está ativo.

### CorrectionAlert
- **warning**: borda dourada, ícone ⚠️.
- **critical/error**: borda rosa, ícone 💔, animação pulse-neon.

### NTRModal
- Dois passos: aviso educativo → confirmação explícita.
- Botão de ativação em destaque vermelho/rosa neon.

---

## 6. Acessibilidade

- Contraste mínimo 4.5:1 para textos principais (cinza claro `#e2e8f0` sobre `#0A0A0A` → ~14:1).
- Foco visível em botões e inputs (`focus-visible:ring-ring`).
- Animações reduzidas via `prefers-reduced-motion` (Tailwind `motion-reduce:`).
- Labels semânticos em todos os ícones de ação.
