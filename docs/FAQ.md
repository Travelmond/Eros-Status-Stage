# EROS STATUS SYSTEM 3.0 - FAQ

Frequently asked questions and common issues.

---

## GENERAL QUESTIONS

### Q: What is Eros Status System 3.0?
**A:** A comprehensive Lorebook framework for Chub Venus AI that tracks character status, relationships, body state, sexual activity, pregnancy, NTR scenarios, and more for 18+ roleplaying.

### Q: Do I need to use all modules?
**A:** No. The system is modular - enable only what you need. Start with basic status, add complexity as desired.

### Q: Is this only for NTR content?
**A:** No. NTR is one optional module. The system works for any relationship scenario - romantic, family,friendship, etc.

### Q: Does it work with non-adult roleplay?
**A:** Yes. Disable all adult modules and use for general RPG tracking (affection, location, items, NPCs).

---

## SETUP QUESTIONS

### Q: How do I install it?
**A:**
1. Create new character in Chub Venus AI
2. Create new Lorebook
3. Import `Eros Status System 3.0.json`
4. Configure settings (scan depth: 9999)
5. Start roleplaying

### Q: Where do I find the files?
**A:** All files are in the Eros Status folder:
- `Eros Status System 3.0.json` - Main Lorebook
- `presets/eros-status-preset.json` - Quick setup
- `docs/` - Documentation

### Q: Do I need both files?
**A:** `Eros Status System 3.0.json` is the main Lorebook. The preset is optional - provides quick configuration.

---

## STATUS QUESTIONS

### Q: Why isn't status showing in responses?
**A:**
1. Check Lorebook scan depth (set to 9999)
2. Verify Lorebook is at top of list
3. Ensure token budget is adequate
4. Try requesting explicitly: `<GET status>`

### Q: Values aren't updating after events
**A:**
- AI should auto-update based on narrative
- If not, request explicitly: `<UPDATE affection:50>`
- Check validator instructions are being read

### Q: Status is too long, consuming tokens
**A:** Use condensed view: `<GET status:condensed>`
Or reduce verbosity in character responses

---

## MODULE QUESTIONS

### Q: How do I enable the sex module?
**A:**
```
<SET sex_active:true>
```
Disable when scene ends: `<SET sex_active:false>`

### Q: What's the difference between NTR types?
**A:**
- **Cuckold**: Husband watches wife with another man
- **Bull**: The man having sex with another man's wife
- **Hotwife**: Wife with other partners (consensual)
- **None**: No NTR content

### Q: When should I enable personified_genitalia?
**A:** Only during breeding/pregnancy-focused scenes. Keep disabled otherwise for normal narration.

### Q: Can I use multiple NTR types?
**A:** Yes, the system supports dynamic switching based on story progression.

---

## TECHNICAL QUESTIONS

### Q: Colors aren't showing
**A:** Your platform may not support HTML. Use emoji fallback:
- ❤️ instead of red
- 🔥 instead of orange
- 💦 instead of blue

### Q: Unicode boxes aren't rendering
**A:** Use markdown fallback in configuration or plain text mode.

### Q: Commands aren't working
**A:**
- Verify spelling (case-insensitive)
- Check Lorebook position at top
- Increase scan depth

### Q: How do I save my progress?
**A:**
```
<EXPORT state>
```
Creates save file. Later: `<IMPORT state:filename>`

---

## STORY QUESTIONS

### Q: How does pregnancy work?
**A:**
1. Sex active + insemination occurs
2. Track menstrual cycle
3. Fertility peaks around day 14
4. Pregnancy check after cycle delay
5. Enable personified_genitalia for full tracking

### Q: Can characters get multiple partners?
**A:** Yes. The system tracks multiple NPCs, their relationship values, and interaction history.

### Q: How do I handle location changes?
**A:**
```
<SET room:bedroom>
<SET room:kitchen>
```
System tracks visited locations, unlocked areas, and available objects.

---

## TROUBLESHOOTING

### Q: AI keeps forgetting status
**A:**
1. Increase scan depth to 9999
2. Add memory anchor in first message
3. Use explicit GET commands periodically
4. Verify token budget is sufficient

### Q: Response quality degraded
**A:**
- Lower token usage with condensed view
- Disable unused modules
- Reduce scan depth temporarily
- Clear old messages in session

### Q: System is too complex
**A:** Start simple. Use only:
- General status module
- One module at a time
- Build up gradually

---

## BEST PRACTICES

### Q: What's the recommended workflow?
**A:**
1. Start: Basic status + one module
2. Progress: Add complexity as comfortable
3. Optimize: Adjust for your playstyle
4. Backup: Export state periodically

### Q: How often should I export?
**A:** After each significant story milestone, or before risky scenes.

### Q: When should I reset?
**A:**
- Starting new story arc
- New character/session
- Fixing broken state

---

## COMPARISON QUESTIONS

### Q: How is v3 different from v2?
**A:** v3 adds:
- Complete NTR module with dynamic types
- Personified genitalia option
- Species/kemonomimi support
- Enhanced genitalia tracking
- Better token optimization

### Q: Can I use this with other Lorebooks?
**A:** Yes. Place Eros Status at top of list for priority. Other Lorebooks work alongside.

---

**FAQ Version:** 1.0  
**For Eros Status System 3.0**