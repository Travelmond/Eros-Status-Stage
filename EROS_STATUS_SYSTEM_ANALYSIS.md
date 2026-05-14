# Eros Status System 3.1 — Narration & Prompt Positioning Analysis

This document provides structural recommendations for integrating the Eros Status System into Chub Venus AI's prompt chain, optimizing token usage, and defining clean output positioning for status displays.

---

## 1. Prompt Chain Order — Where Lorebook Entries Fit

### Current Chain (Chub Venus AI)

```
System Prompt → Character Definitions → Chat History → Post History → Prefill
```

### Where Eros Status Should Activate

The Eros Status System is **dynamic context that must respond to scene triggers**, which makes it a perfect fit for the **Lorebook / Character Book system**, not for static placement in Character Definitions.

**Recommended placement:**

- **Primary:** Lorebook (Character Book) with keyword triggers
- **Secondary:** Post History for narrative steering directives
- **Avoid:** Hardcoding into Character Definitions — this wastes tokens and creates static bloat

### Rationale

- Lorebooks activate **only when keywords are detected** in recent chat (scan depth controls how far back)
- Eros Status needs to shift rapidly (affection changes, body state updates, scene phase transitions)
- Static placement in Character Definitions would require manual editing per message — inefficient
- Post History can hold **phase-transition directives** (e.g., "Enter sex module — prioritize explicit narration")

**Result:** You are in the right position — Lorebooks. Ensure scan depth is set to at least 2–3 messages to catch multi-word triggers.

---

## 2. Story Progression — Phase Triggers & Flow

### Recommended Narrative Flow

| Phase | Trigger | What Activates |
|-------|---------|----------------|
| **First Message / Scan** | Character greeting | Auto-scan character metadata (name, personality, basic relationship) — handled by Character Definition, not Lorebook |
| **Early Scene** | First 3–5 exchanges | Build affection, establish location, introduce mood — Lorebook entry: `affection_low`, `location_[name]`, `mood_[type]` |
| **Mid Scene** | Affection threshold reached (>30%), intimate actions detected | Increase intimacy, track body state — Lorebook entry: `affection_growing`, `body_state_active`, `intimacy_tier_1` |
| **Climax** | Explicit keywords detected ("sex", "moan", "orgasm", etc.) | Full sex module, NTR if applicable — Lorebook entry: `sex_scene_active`, `ntr_flag_check`, `climax_phase` |
| **Aftercare** | Scene ends, user message includes "after", "rest", "hold", or explicit scene closes | Emotional tracking, memory logging — Lorebook entry: `aftercare_phase`, `relationship_updated` |

### What Triggers Each Phase

- **Keyword pairs** are more reliable than single keywords. Example: `kiss` + `passionate` = activate `intimacy_tier_2`, but `kiss` alone = `affection_growing` only.
- Use **secondary keywords** in Lorebook entries to prevent false triggers. Example: Keyword `bed` + Secondary `night` = activate `sex_scene_context`; `bed` alone = location context only.
- **Recursive scanning** can chain entries: `kiss` triggers `affection_growing`, which contains the word `intimate` that triggers `body_state_active`.

### Is This Flow Correct?

Yes, this matches how Lorebooks perform best in Chub AI — phase-based activation with keyword gates. The key is to use **Insertion Order** to prioritize core status (affection, location) before detailed state (body, NTR).

---

## 3. Example Messages — Showing the AI How to Display Status

### Should You Add Example Messages?

**Yes, but sparingly and strategically.** Example dialogue in Character Definitions shows the AI how to format output, but you don't want to bloat the definition with status display examples that distract from character voice.

### Where to Put Status Display Examples

Option A: **Post History** — Add a brief directive like: `Display status updates in italic brackets at the end of narration. Do not break character to explain status.`

Option B: **System Prompt** (if you control it) — Add a single line: `End each response with a brief status update in *italics* if relevant to the scene progression.`

Option C: **Character Definition example dialogues** — Include 1–2 examples showing the format:

```
{{user}}: *kisses her neck softly*
{{char}}: *she gasps, fingers gripping your shirt* ... *affection: 45, intimacy: rising*
```

### Example Output Formats

**Inline at end of narration (recommended):**

> She pulls back, breath warm against your ear. *affection: 62 | body: aroused | location: bedroom*

**Separate block (less immersive):**

> She pulls back, breath warm against your ear.
>
> *[Status: Affection 62 | Intimacy Tier 2 | Body State: Aroused]*

**Inline with actions (most immersive):**

> *She gasps, pressing closer — affection climbing toward 65, body responding to your touch.*

**Recommendation:** Use **inline at end of narration** for free tier (minimal tokens). Avoid separate blocks — they break immersion and consume extra tokens.

---

## 4. Token Optimization — Free Tier Strategy (Under 120 Words)

### The Challenge

Pre History + Post History combined can reach 300+ tokens. Free tier users need under 120 words (~160 tokens). You need to compress without losing functionality.

### Optimization Strategies

#### Strategy 1: Use Lorebook probability and priority

- Set `Probability: 80–100%` for core status entries (affection, location)
- Set `Probability: 30–50%` for optional flavor entries (mood, ambient details)
- This lets the token budget prioritize what matters without loading everything

#### Strategy 2: Compress Lorebook entry content

Instead of:

```
{{char}}'s affection level for {{user}} is currently 45/100. She feels warmly toward them
and is beginning to trust them. Recent positive interactions: holding hands, shared meal.
```

Use:

```
affection: 45 (trust building, recent: holding hands)
```

#### Strategy 3: Post History — single directive, not detailed rules

Instead of:

```
Maintain awareness of {{char}}'s affection level (starting at 20), track intimate moments,
update body state after physical contact, remember NTR flags if applicable, show
emotional shifts in dialogue, end aftercare with relationship reflection.
```

Use:

```
Track affection shifts and body state. Display *affection: X | body: Y* in each response
during intimate scenes.
```

#### Strategy 4: Use macros intelligently

- Use `{{char}}` and `{{user}}` instead of hardcoded names — more portable, less redundancy
- Use `{{time}}` macro if available to compress time-based context

#### Strategy 5: Leverage constant entries wisely

- Mark the **current affection tier** as `Constant: true` so it's always injected
- Mark phase-specific entries (sex scene, NTR) as **non-constant** — they activate only when triggered

### Token Budget Recommendation

| Component | Target Tokens (Free Tier) |
|-----------|---------------------------|
| System Prompt | ~50 |
| Character Definition | ~800–1000 (this is separate from your control) |
| Lorebook (active entries) | ~100–150 |
| Post History | ~30–50 |
| **Total beyond character** | ~180–250 |

To hit under 120 words / ~160 tokens for Pre+Post History combined, keep Post History under 30 tokens and Lorebook entries highly compressed.

---

## 5. Output Positioning — Where Status Displays Appear

### Recommended: End of narration, inline, italic

Format: `*affection: 58 | body: aroused | scene: mid-intimacy*`

Rationale:

- **Lowest token cost** — single line, no block separators
- **Least intrusive** — italic brackets signal metadata without breaking narrative flow
- **Consistent with roleplay conventions** — asterisks for actions/ thoughts are standard; italic brackets for metadata follow naturally
- **Easy for AI to generate** — it already uses `*action*` format; adding `*key: value*` is a small delta

### Placement Options Comparison

| Position | Immersion | Tokens | AI Reliability |
|----------|------------|--------|----------------|
| End of narration, inline | High | Low | High |
| Inline with actions | Medium-High | Medium | Medium (AI may forget) |
| Separate block (`[Status: ...]`) | Low | Medium-High | High |
| Start of response | Low | Low | Medium |

### Additional Recommendations

- **Never** put status in a separate block that breaks the narrative — it reads like an OOC announcement and breaks immersion.
- **Avoid** putting status at the start of the response — the AI should establish scene first.
- **Consider** dynamic positioning: during non-intimate scenes, omit status entirely or show only `affection: X`. During sex scenes, show full status.
- Use **selective display** — don't show every metric every time. Show what changed since the last message.

---

## Summary of Key Recommendations

1. **Prompt Chain:** Use Lorebook system for Eros Status entries — keyword-triggered insertion is the correct approach. You're in the right position.

2. **Story Progression:** Phase-based flow is correct. Use keyword pairs + secondary keywords to gate each phase. Enable recursive scanning for chained state updates.

3. **Example Messages:** Add 1–2 compact examples in Character Definition or a single directive in Post History. Show inline format: `*affection: 45 | body: neutral*`.

4. **Token Optimization:** Compress Lorebook entries to single-line format. Set probability and priority to filter what loads. Keep Post History under 30 tokens. Target ~180–250 tokens for all non-character content.

5. **Output Positioning:** End of narration, inline, italic brackets. Format: `*affection: X | body: Y*`. Avoid separate blocks. Dynamic display (show more during sex scenes, less otherwise).

---

*Document prepared for Eros Status System 3.1 integration with Chub Venus AI.*