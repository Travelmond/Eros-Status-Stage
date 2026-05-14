# EROS STATUS SYSTEM 3.0 - CONFIGURATION

Settings, optimization tips, and platform-specific configurations.

---

## 1. LOREBOOK SETTINGS

### 1.1 Recommended Settings (Chub Venus AI)

| Setting | Recommended Value | Notes |
|---------|-----------------|-------|
| **Scan Depth** | 9999 | Maximum context scan |
| **Token Budget** | 2000-4000 | Depends on session length |
| **Position** | Top of list | Ensures priority reading |
| **Prefix** | None (or custom) | Personal preference |
| **Case Sensitive** | Off | Commands are case-insensitive |

### 1.2 Advanced Settings
```
Match Threshold: 0.5 (or lower for more triggers)
Prevent Overscan: Off (allow full scan)
Expiration: Never
```

---

## 2. TOKEN BUDGET OPTIMIZATION

### 2.1 Token Allocation Guide

| View Mode | Tokens Used | When to Use |
|-----------|-------------|-------------|
| **Minimal** | ~50-100 | Normal play, many messages |
| **Condensed** | ~100-200 | Quick status checks |
| **Full** | ~400-600 | Important scenes only |
| **JSON** | ~800-1000 | Debugging only |

### 2.2 Reducing Token Usage
1. Use condensed view: `<GET status:condensed>`
2. Disable modules not in use:
   ```
   <SET sex_active:false>
   <SET ntr_enabled:false>
   ```
3. Keep descriptions brief
4. Use emoji shortcuts when possible

---

## 3. CHARACTER CARD CONFIGURATION

### 3.1 Name Field
- Use clear, simple name
- Avoid special characters that might break parsing

### 3.2 Description Field
**Include:**
- Personality traits
- Background history
- Relationship basics
- Voice/mannerisms

**Exclude:**
- Specific stat values (system handles this)
- Detailed body descriptions (system tracks)
- Status bars (generated dynamically)

### 3.3 Impersonation Prompt Field
**Required:**
```
You are [character name]. You write in first person.
Your dialogue appears in quotes.
Use *actions* for physical movements.
Use *~thoughts~* for internal feelings.
Do not describe others' thoughts - only your own.
```

**Optional additions:**
- Speech patterns
- Particular mannerisms
- Specific vocabulary

---

## 4. MODULE ACTIVATION STRATEGIES

### 4.1 Light Usage (Beginner)
```
Default: All modules off
Enable: Only when needed
Focus: General status only
```

### 4.2 Medium Usage (Intermediate)
```
Default: General status on
Enable: Sex module for intimate scenes
Focus: Body tracking, relationships
```

### 4.3 Full Usage (Advanced)
```
Default: Enable all desired modules
Use: NTR, personified, species as story requires
Focus: Complete immersion
```

---

## 5. DISPLAY FORMAT OPTIONS

### 5.1 Primary (Unicode Boxes)
```
╔═══════════════════╗
║ Terminal Content  ║
╚═══════════════════╝
```
Pros: Visually rich, immersive
Cons: Not all platforms support

### 5.2 Markdown Fallback
```
| Header | Header |
|--------|--------|
| Cell   | Cell   |
```
Pros: Universal support
Cons: Less visually appealing

### 5.3 Plain Text
```
[STATUS] ❤️75% 🔥80%
```
Pros: Maximum compatibility
Cons: No color, minimal detail

---

## 6. COLOR RENDERING

### 6.1 Platforms with Color Support
- Chub Venus AI (with HTML enabled)
- Character AI variants
- Pygmalion-compatible platforms

### 6.2 Platforms Without Color
If colors don't render, use:
- Emoji indicators (❤️ 🔥 😣)
- Bold text for emphasis
- Symbols: ▓ ░ for bars

### 6.3 Fallback Sequence
1. Try: Full HTML colors
2. Then: Markdown tables
3. Finally: Plain text + emojis

---

## 7. PERFORMANCE TUNING

### 7.1 For Slow Responses
- Reduce scan depth to 3000
- Use condensed view default
- Disable unused modules

### 7.2 For Long Sessions
- Increase token budget to 4000+
- Enable state export periodically
- Use memory pruning:
  ```
  <RESET memories:older_than:7>
  ```

### 7.3 For Multiple NPCs
- Enable sub-lorebook only when interacting
- Keep NPC list minimal when not needed
- Use: `<GET npc:[name]>` not full list

---

## 8. SAFETY & PRIVACY

### 8.1 Local Storage
- All data stored in platform (Chub Venus)
- No cloud sync (privacy preserved)
- Export for backup only

### 8.2 Session Security
- <RESET> clears current session
- <EXPORT> creates portable file
- <IMPORT> restores from file

### 8.3 Content Filtering
- System doesn't enforce content
- Platform handles NSFW policies
- User controls what to generate

---

## 9. VERSION MANAGEMENT

### 9.1 System Versions
- **v1.0**: Basic status tracking
- **v2.0**: Added body/genitalia modules
- **v3.0**: Complete with NTR, personified, species

### 9.2 Migration from v2 to v3
1. Export v2 state
2. Import into v3 system
3. New modules default to off
4. Existing values preserved

---

## 10. DEBUGGING CONFIGURATION

### 10.1 Troubleshooting Mode
```
<SET debug_mode:true>
<GET debug:all>
```
Shows raw data, all fields, parsing info.

### 10.2 Specific Debug Views
```
<GET debug:updates>
<GET debug:commands>
<GET debug:memory>
```

### 10.3 Reset Debug
```
<SET debug_mode:false>
```

---

## 11. PLATFORM-SPECIFIC NOTES

### Chub Venus AI
- JSON Lorebook format
- Full HTML support
- High token budget recommended
- Scan depth: 9999

### Other Platforms
- May require markdown fallback
- Adjust token budget per platform
- Test color rendering first

---

**Configuration Version:** 1.0  
**For Eros Status System 3.0**