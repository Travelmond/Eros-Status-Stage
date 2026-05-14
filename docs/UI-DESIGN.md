# EROS STATUS SYSTEM 3.0 - UI DESIGN SPECIFICATIONS

Terminal display formatting, color schemes, and visual layouts.

---

## 1. DISPLAY MODES

### 1.1 Condensed View (Minimal)
```
[❤️75% 🔥85% 😫3x 💦YES] [📍Bedroom] [⏰14:32]
```
**Use when:** Token saving needed, quick status check

### 1.2 Full View (Detailed)
```
╔═══════════════════════════════════════════════════╗
║ 📅 Day 5 | 🕐 14:32 | ☀️ Sunny | 📍 Bedroom    ║
╠═══════════════════════════════════════════════════╣
║ 👙 NAGISA [MILF]                                ║
║ ❤️ Fav: [██████░░░] 75%  😣 Obed: [██████░░] 80% ║
║ 🥵 Libido: [████░░░░] 55%  🔥 Arousal: [█████] ║
╚═══════════════════════════════════════════════════╝
```
**Use when:** Full immersion, detailed tracking

---

## 2. COLOR SCHEME (RPG THEME)

| Element | Color Tag | Example |
|---------|-----------|---------|
| Character Names | `<span style="color:red">` | Nagisa |
| Locations | `<span style="color:deepskyblue">` | Bedroom |
| Items/Clothing | `<span style="color:limegreen">` | Dress |
| Personality | `<span style="color:orange">` | Shy |
| Mood | `<span style="color:mediumpurple">` | Happy |
| Sex/Body | `<span style="color:hotpink">` | Wet |
| Time/Date | `<span style="color:gold">` | Day 5 |
| Narrator | `<span style="color:gray">` | (gray italic) |
| Warnings/NTR | `<span style="color:red">` | NTR ALERT |
| Success/Safe | `<span style="color:limegreen">` | Safe |

---

## 3. TERMINAL BOX FORMATS

### 3.1 Unicode Box (Primary)
```
╔═══════════════════════════════╗
║ CONTENT HERE                ║
╠═══════════════════════════════╣
║ More content                ║
╚═══════════════════════════════╝
```

### 3.2 Markdown Fallback (If Unicode fails)
```
| Header | Header |
|--------|--------|
| Cell   | Cell   |
```

### 3.3 ASCII Fallback (Minimal)
```
+===================+
| CONTENT HERE      |
+===================+
```

---

## 4. STATUS BAR FORMATS

### 4.1 Progress Bars (Text-based)
```
❤️ Favorability: [████████░░] 75%
😣 Obedience:   [████████████░░] 80%
🥵 Libido:      [█████░░░░░░░░] 55%
🔥 Arousal:     [████████████] 100%
```

### 4.2 Emoji Progress
```
❤️ FAV: ❤️❤️❤️❤️❤️♡♡♡♡♡ (5/10)
😣 OBD: 😣😣😣😣😣😣😣😣♡♡ (8/10)
```

### 4.3 Segment Progress
```
▓▓▓▓▓▓▓▓░░░ 75%
██████████ 100%
```

---

## 5. CONDITIONAL DISPLAY RULES

| Module | Condition | Display |
|--------|-----------|---------|
| General Status | Always | Full or condensed |
| Sex Status | `sex_active:true` | Full detail |
| Genitalia | Character gender + scene | Full if applicable |
| Personified | `personified_genitalia:true` | Entity descriptions |
| NTR | `ntr_enabled:true` | Special indicators |
| Kemonomimi | `species_module:cat/dog/etc` | Species traits |

---

## 6. SAMPLE OUTPUTS

### 6.1 Quiet Scene (Minimal)
```
[Narrator]: The room is quiet, afternoon sunlight filtering through curtains.
<span style="color:red"><b>Nagisa:</b></span> "Would you like some tea?"

[STATUS] ❤️75% 😣80% 🥵20% ☀️
```

### 6.2 Sex Scene (Full)
```
╔══════════════════════════════════════════════════════╗
║ 🔞 SEX SCENE ACTIVE                                 ║
╠══════════════════════════════════════════════════════╣
║ Position: Doggy | Arousal: 95% | Orgasms: 3         ║
║ 💦 Cum Inside: YES | Pregnancy Risk: HIGH        ║
╠═══════════════════════════════════════════════════╣
║ <span style="color:red"><b>Nagisa:</b></span>    ║
║ "FUCK!! HARDER!! AAAAAHHH!!" *GUCHOGUCHO!!*        ║
║ *My womb is drinking his seed...~*                ║
╚══════════════════════════════════════════════════════╝
```

### 6.3 NTR Scene
```
╔══════════════════════════════════════════════════════╗
║ ⚠️ NTR MODULE ACTIVE                               ║
╠═══════════════════════════════════════════════════╣
║ Role: Cuckold | Bull: Tanaka | Humiliation: 80%   ║
║ Gene Quality: Bull SUPERIOR > Husband INFERIOR   ║
╠═══════════════════════════════════════════════════╣
║ <span style="color:deepskyblue"><b>Tanaka:</b></span>║
║ "Your wife takes cock better than you ever did."║
╚══════════════════════════════════════════════════════╝
```

---

## 7. MOBILE RESPONSIVENESS

### Desktop (Primary)
- Full Unicode boxes: ╔═╗║╠╚
- Color coding: Full
- Complete details: Yes

### Mobile (Fallback)
- Emoji-focused: 📍 💋 🔥
- Limited colors: Use icons only
- Condensed: Default to minimal

### API Only (JSON)
- No visual formatting
- Raw data only
- Parse as needed

---

## 8. TOKEN OPTIMIZATION

| View | Tokens | When to Use |
|------|--------|--------------|
| **Condensed** | ~100 | Normal play, token saving |
| **Full** | ~500 | Important scenes, documentation |
| **JSON** | ~1000 | Debugging, data extraction |

---

## 9. THEME OPTIONS

### Dark Mode (Default)
- Background: Dark
- Text: Light colors
- Accent: Neon/bright

### Light Mode (Optional)
- Background: Light
- Text: Dark colors
- Accent: Pastels

### Sepia (Reading)
- Warm tones
- Easy on eyes
- Less immersive

---

**UI Design Version:** 1.0  
**Part of Eros Status System 3.0**