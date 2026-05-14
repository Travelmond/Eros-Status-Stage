# Eros Status Preset v3.1 - Manual Configuration Guide

**Version:** 3.1 (Automated)
**Platform:** Chub Venus AI
**Key Feature:** AI automatically handles most commands - only 4 user commands needed!

---

## 1. Model Parameters (FINAL OPTIMIZED)

| Parameter | Value | Notes |
|-----------|-------|-------|
| Temperature | **0.7** | ✅ OPTIMAL for roleplay (was 0.8) |
| Repetition Penalty | 1.1 | Light repetition prevention |
| Frequency Penalty | 0.0-0.2 | Reduced from 0.3 |
| Presence Penalty | **0.3** | ✅ FIXED (was 0.4 - prevents rambling) |
| Top P | **0.95** | ✅ NEW - Quality control |
| Top K | 50 | Token selection range |
| Max new token | **1000** | ✅ INCREASED (allows detailed output) |
| Context Size | 4096 | Memory |

---

## 2. Lorebook Settings

| Setting | Value | Notes |
|---------|-------|-------|
| Scan Depth | 9999 | Maximum - catches all triggers |
| Token Budget | 3000 | Full content allowed |
| Recursive Scanning | ON | Entries can trigger other entries |
| Match Whole Words | ON | Precise matching |

---

## 3. Toggle Settings

| Setting | Recommended | Notes |
|---------|-------------|-------|
| Include Names | ON | Character/user names in output |
| Ban Emojis | OFF | Needed for status display |
| Text Streaming | ON | Better UX |
| Use Lorebooks | ON | **ESSENTIAL** |
| Use Auto Summarization | ON | Long conversation handling |

---

## 4. Pre History Instructions (COMPRESSED - ~80 tokens)

**Copy and paste into Pre History field:**

```
### DIRECTIVE ###
NC-21 / ADULT roleplay. Japanese doujin style.

### OUTPUT ###
Dialogue: "text"
Actions: *action*
Thoughts: *~thoughts~*

### EXAMPLE (inline status):
*affection:45 | arousal:30 | body:neutral | location:living room*

### STATUS FORMAT ###
Condensed: [💕{aff}% 🍑{ar}% 🎯{obd}% 🔥{lib}%] [📍{location}]
```

---

## 5. Post History Instructions (EXPANDED - ~60 tokens)

**Copy and paste into Post History field:**

```
### STATUS ###
Auto-update: [💕{aff}% 🍑{ar}% 🎯{obd}% 🔥{lib}%] [📍{loc}]
Include: narrative beat, emotional subtext, active stakes.
Format: inline after narration, present tense.
Priority: NTR>Sex>Body>General

### WRITING STYLE ###
Japanese doujin/hentai style:
- Short fragmented sentences during climax
- Onomatopoeia: ah, haaa, nnn, mmm, sluurp, squelch
- Repetition for rhythm: ah, ah, ahn!
- Elongated vowels: a---a---a
- Action+sound: *thrust* "AHN!"
- Don't over-explain; let sounds convey

Use <IMG> for AI art prompts.
```

---

## 6. Only 4 User Commands

| Command | Purpose |
|---------|---------|
| `<IMG>` | Generate image prompt |
| `<GET status>` | Full terminal |
| `<GET status:condensed>` | Quick view |
| `<RESET>` | Full reset (values + metadata) |

**ALL OTHER COMMANDS** - AI handles automatically!

The system auto-detects context and updates values without user intervention.

---

## 7. Import Lorebook

1. Go to **Lorebooks** in Chub Venus AI
2. Create new: "Eros Status System 3.1"
3. Import: `lorebook/Eros Status System 3.0.json`
4. Settings: Scan Depth 9999, Token Budget 3000, Position: Top

---

## 8. First Message Behavior

When starting a **new conversation**:
1. System auto-scans {{char}} description
2. Extracts metadata (gender, age, body, personality)
3. Detects relationship context (married/single)
4. Sets location from scene
5. Initializes all values

User sees normal first message - automation is invisible!

---

## 9. Every Turn Behavior

Every subsequent message:
1. System evaluates context
2. Auto-activates relevant modules
3. Updates values based on narrative
4. Resolves any conflicts
5. Displays appropriate status

Everything automatic - no manual commands needed!

---

## Quick Checklist

- [ ] Set Model Parameters
- [ ] Set Lorebook Settings
- [ ] Configure Toggles
- [ ] Add Pre History
- [ ] Add Post History
- [ ] Import Lorebook (9999 scan depth)
- [ ] Start roleplaying!

**That's it!** The system handles everything else automatically.