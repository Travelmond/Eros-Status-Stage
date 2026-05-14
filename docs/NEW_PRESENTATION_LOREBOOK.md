# 🎭 Eros Status System - Lorebook Presentation

---

## 🎯 so basically i found this and my brain is SCREWED

ok look. i know we're all here for the same reason. we got into roleplay thinking it would be a fun little hobby and now we're spending more time tracking character arousal levels than actually living our real lives. SAME. anyway.

i've been using this **Eros Status System** for like a month now and honestly? this thing is KINDA a big deal ngl. it's basically a lorebook on STEROIDS for 18+ roleplay and i need to talk about it because NONE of my friends understand and you guys will GET IT.

the amount of times this saved my scenes is honestly embarrassing lol 😅 i used to spend so much time manually tracking "oh wait what position were they in again" or "was this their third orgasm or fourth" and NOW I DON'T HAVE TO. the system just... does it. while i focus on the actually fun parts. chef's kiss honestly 👨‍🍻👵

> *"It's not just a lorebook — it's your character's living, breathing relationship memory!"* 🎉

---

## 💕 what does it actually DO tho

### the stuff that'll make your life easier (and your scenes way hotter)

- 🎯 **Auto-Scan** — scans character info on the FIRST MESSAGE. gender, age, personality, relationship status, all that good stuff. zero effort on your part.
- 🔥 **Auto-Evaluate** — runs evaluation EVERY SINGLE TURN so conflicts get resolved automatically
- 🚀 **Auto-Activate** — the AI is actually smart enough to turn modules on/off based on context (sex, NTR, breeding, species) so you don't have to manual spam stuff
- 📊 **Terminal Display** — pretty ascii status bars that show you EVERYTHING at a glance
- 💦 **Sex Module** — tracks positions, pace, actions, orgasm count, cum details, wetness levels... yeah it's THAT detailed lol. no more "wait what position were we in again"
- 🏠 **Location System** — auto-detects rooms, buildings, places your character has been
- 📦 **Inventory Tracking** — objects, items, interactables managed automatically
- 👥 **NPC Management** — full relationship tracking with importance levels (Main/Supporting/Minor) so you know who's who
- 👙 **Body State** — clothing by area, breast states, skin condition, health, body odor (yes really)
- 🎭 **NTR Module** — cuckold, bull, hotwife scenarios with emotional tracking. for those of us with degenerate tastes apparently (me. i'm the degenerate. hi 👋)
- 🐱 **Species/Kemonomimi** — cat ears, bunny ears, fox features auto-detected
- 👶 **Reproduction** — pregnancy tracking, fertility cycles, menstrual system
- 🧠 **Memory & History** — automatic logging of first kiss, first time, confessions, all those spicy milestones
- 🎨 **Image Generation** — AI art prompts generated from your scene context so you can visualize what's happening

### v3.1 update stuff (the new hotness)

- 🌈 **Color Schemes** — html span tags for character names, locations, items, mood
- 📈 **Progress Bars** — multiple formats (unicode, emoji, box drawing)
- ✨ **More Emojis** — richer emoji sets for every mood, state, action
- 🔧 **Variable System** — dynamic values like `<variable:type=default>`

---

## ⚙️ how it works (super simplified)

basically there's **three automated layers** that do everything for you:

1. **First Message (Metadata Scanner)** — scans character description, picks up relationship keywords, identifies location, maps stats from third-party stuff
2. **Every Turn (Structure Evaluation)** — evaluates context, enforces priority order (NTR > Sex > Personified > Body > General), resolves conflicts, updates all values automatically
3. **Module Auto-Activation** — AI turns relevant modules on/off based on context signals

### Module Breakdown (what tracks what)

| Module | What It Tracks | Trigger |
|--------|----------------|---------|
| **SEX** 🔴 | positions, pace, actions, orgasm count, cum details, wetness | touching, kissing, undressing |
| **REACTION** 💚 | affection, arousal, resistance, feeling, mood | literally every interaction |
| **CHAOS** 💜 | NTR scenarios, humiliation level, comparison count | "another man", "cuckold" keywords |
| **BODY** 💙 | clothing, breast state, skin condition, health | physical descriptions |
| **LOCATION** 🧡 | current room, building, visited places | room/place keywords |
| **INVENTORY** 💛 | objects, items, interactables | object mentions |
| **MEMORY** 🖤 | first kiss, first time, confessions | narrative milestones |

### Stats Explained (what the numbers mean)

| Stat | Meaning | Range |
|------|---------|-------|
| **❤️ Affection** | emotional attachment/love level | 0-100% |
| **🔥 Arousal** | sexual excitement level | 0-100% |
| **😫 Resistance** | willingness to resist or accept | 0-100% |
| **💞 Feeling** | overall emotional state | variable |

---

## 💻 the commands you actually need

### the only 4 commands you'll use 99% of the time

the AI handles everything else automatically so you can focus on, you know, roleplaying:

| Command | Purpose | Example |
|---------|---------|---------|
| `<GET status>` | full terminal display | shows complete status |
| `<GET status:condensed>` | quick view | `[❤️75% 🔥85% 😫3x 💦YES]` |
| `<IMG>` | generate image prompt | creates AI art prompt |
| `<RESET>` | full reset | clears everything |

### all the commands if you're a control freak like me

```html
<!-- GET Commands -->
<GET status>              <!-- Full terminal -->
<GET status:condensed>     <!-- Quick view -->
<GET progressions>         <!-- All values -->
<GET relationships>        <!-- Romantic/family/NPC -->
<GET location>            <!-- Current room -->
<GET objects>             <!-- Inventory -->
<GET genitalia>           <!-- Full genital data -->
<GET sex_status>           <!-- Current sex state -->
<GET ntr>                 <!-- NTR data -->
<GET npcs>                <!-- All NPCs -->
<GET memories>            <!-- History log -->

<!-- UPDATE Commands -->
<UPDATE favorability:75>
<UPDATE obedience:80>
<UPDATE libido:55>
<UPDATE mood:Happy>
<UPDATE body:mouth:open>
<UPDATE clothing:upper:removed>
<UPDATE genitalia:wetness:soaking>
<UPDATE genitalia:orgasm:3>

<!-- SET Commands -->
<SET sex_active:true>
<SET ntr_enabled:true>
<SET room:master_bedroom>
<SET scene:sex>
<SET species_module:cat>

<!-- INSERT Commands -->
<INSERT npc:NAME:main>
<INSERT memory:First kiss>
<INSERT inventory:Phone>

<!-- Special -->
<RESET>                    <!-- Full reset -->
<EXPORT state>             <!-- Save game -->
<IMPORT state:filename>    <!-- Load game -->
```

### what the terminal looks like (honestly looks kinda cool ngl)

```
╔═══════════════════════════════════════════════════╗
║  🎭 EROS STATUS TERMINAL                          ║
╠═══════════════════════════════════════════════════╣
║  ❤️ AFFECTION: ████████░░ 80%   🔥 AROUSAL: ████░░░░ 40%  ║
║  😫 RESISTANCE: ██░░░░░░░░ 20%   💞 FEELING: 赫赫         ║
╠═══════════════════════════════════════════════════╣
║  📍 LOCATION: Master Bedroom                      ║
║  👤 STATE: Aroused | Clothing: Bikini             ║
║  💦 WETNESS: Soaking | 🎭 ORGASM: 3x              ║
║  🎭 SCENE: Foreplay                               ║
╠═══════════════════════════════════════════════════╣
║  👙 CLOTHING: Bra(✗) Panty(✗) Heels(✓)           ║
║  🍑 BODY: Breasts(exposed) Mouth(open)            ║
║  📦 INVENTORY: Phone, Key                         ║
║  👥 NPC: Husband(Tom)                             ║
╚═══════════════════════════════════════════════════╝
```

### formatting examples if you want the pretty colors

```html
<!-- Color Tags -->
<span name="CharacterName">Name</span>
<span location="Bedroom">Bedroom</span>
<span item="Phone">Phone</span>
<span mood="Aroused">😏</span>

<!-- Progress Bars -->
❤️ Affection: ████████░░ 80%
🔥 Arousal:  ████░░░░░░ 40%
😫 Resistance: ██░░░░░░░░ 20%

<!-- Emoji Status -->
[❤️75% 🔥85% 😫3x 💦YES] [📍Bedroom] [⏰14:32]
```

---

## 🔧 troubleshooting (for when things go sideways)

### how to FORCE the lorebook to respond (important!)

sometimes the AI won't play nice and won't give you the lorebook format. when this happens, use the **force triggers**:

```html
<!-- Force Full Status -->
((())) <GET status>

<!-- Force Condensed Status -->
((())) <GET status:condensed>

<!-- Force Specific Module -->
((())) <GET sex_status>
((())) <GET ntr>
((())) <GET progressions>

<!-- Force Update -->
((())) <UPDATE mood:Excited>
((())) <UPDATE arousal:90>

<!-- Force Reset -->
((())) <RESET>
```

### common problems and fixes

| Problem | Solution |
|---------|----------|
| AI not showing status | add `((()))` before command |
| wrong room detected | use `<SET room:name>` to override |
| stats not updating | use `<UPDATE field:value>` explicitly |
| module not activating | use `<SET module:true>` to force |
| character info wrong | start new conversation for re-scan |
| NTR module stuck | use `<SET ntr_enabled:false>` to disable |

### priority order (when modules fight)

when multiple modules want attention at once, the system follows this hierarchy:

1. 🔴 **NTR** — cuckold/bull scenarios (highest priority, obviously)
2. 🔴 **SEX** — intimate/sexual content
3. 🟣 **PERSONIFIED** — breeding/pregnancy content
4. 🔵 **BODY** — physical state changes
5. 🟠 **GENERAL** — location, inventory, relationships

---

## 🚀 QUICK START (how to actually set this up)

1. **Import** the JSON lorebook file into your AI chatbot (the one you're using rn)
2. **Configure** scan depth to 9999 and token budget to 3000
3. **Place** it at the TOP of your lorebook list (important!)
4. **Start roleplaying!** automation handles everything from here! 🎉

---

## 📚 more docs if you need em

- [PRESET-GUIDE.md](./PRESET-GUIDE.md) — preset configuration
- [USER-MANUAL.md](./USER-MANUAL.md) — end-user guide
- [TUTORIAL.md](./TUTORIAL.md) — step-by-step setup
- [FAQ.md](./FAQ.md) — common questions
- [COMMANDS.md](./COMMANDS.md) — full command reference

---

<div align="center">

### 🎭 Eros Status System 3.1

**Automated. Simplified. Powerful.** ✨

*Your characters never forget — and neither will you!* 💕

</div>

---

**TL;DR** — if you do 18+ roleplay and you're tired of manually tracking everything, this lorebook system automates ALL of it. worth it? absolutely. would i admit it publicly? absolutely not 👀

worth it? absolutely. would i admit it publicly? absolutely not 👀

anyway that's my Ted talk. use it or don't idrc but my scenes have been way better since i started so. you're welcome i guess lol

edit: for those asking, no i didn't make this, i just found it and wanted to share since it's been super useful. not promotional i just think it's neat 🤷

edit 2: YES it works with most major AI chatbots that support lorebook/json import. check your platform's import instructions

edit 3: to the person asking if it tracks multiple characters — yes it can handle multiple npcs with different relationship levels! main/supporting/minor

---
*posted from my phone at 2am because i was too excited to wait until morning. send help. i have a problem.*