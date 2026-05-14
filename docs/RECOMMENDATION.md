# Eros Status System - Final Recommendation Document

Based on comprehensive agent feedback analysis, the following recommendations define the core operational standards for the Eros Status System 3.1.

---

## Terminal Display Rules

**1. Compact Format (Default)**
Display as `[💕75% 🍑70% 🔥50%] [📍Home → Bedroom] [☀️]` for routine updates — requires ~50 tokens, maintains immersion.

**2. Expanded Format (Explicit Request Only)**
Display full ASCII-boxed terminal using `┌───────┐` borders when user enters `<GET status>` or `<GET full>` — requires ~180 tokens.

**3. Expansion Trigger**
Switch to expanded format when: user explicitly requests `<GET status>` OR affection exceeds 70% OR intimacy tier reaches level 3.

---

## Hidden Command Structure

**4. AI-Only Commands (Never User-Visible)**
Format: `<MODULE:sex>`, `<MODULE:ntr>`, `<STATE:aroused>`, `<NPC:NAME|importance:M|Mood:neutral>` — injected via Lorebook, never appears in terminal output.

**5. User-Visible Commands (Only 4 Needed)**
- `<GET status>` — full terminal display
- `<SET affection:X>` — manual override
- `<SET location:X>` — manual override
- `<RESET>` — reset all values

**6. AI Handles Everything Else**
All module activations, state updates, and transitions handled automatically via context keyword detection — users never need to type module commands.

---

## Dynamic Module Integration

**7. Module Activation via Keywords**
| Keyword Trigger | Module Activated |
|-----------------|------------------|
| kiss, touch, undress | SEX module |
| happy, angry, cry | REACTION module |
| cat ears, kemonomimi | SPECIES module |
| another man, cuckold | NTR module |

**8. Adding New Modules**
New modules follow pattern: `<MODULE:NAME>` in Lorebook, activate via keyword pairs, display in terminal bracket format `[MODULE:value]`.

**9. Module Priority Order**
Core modules (affection, location) load first at 80-100% probability; secondary modules (body, sex, NTR) load at 30-50% probability based on scene context.

---

## NPC Handling

**10. New NPC Auto-Addition**
When AI detects new character name in context, auto-create with: `<NPC:NAME|importance:Main/Supporting/Minor|Mood:neutral|Relation:0%>`.

**11. NPC Display Format**
Terminal shows: `[NPC: Elena | ★★★ | 🙂 | 0%]` — importance stars (★/★★/★★★), current mood emoji, relationship percentage.

**12. NPC Transition Handling**
NPC importance upgrades automatically: Minor → Supporting (after 3 interactions) → Main (after 10+ interactions + affection >50%).