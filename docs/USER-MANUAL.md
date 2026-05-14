# EROS STATUS SYSTEM 3.0 - USER MANUAL

End-user guide for using the system in Chub Venus AI.

---

## 1. QUICK START

### 1.1 Setup Steps
1. Import **eros-status-preset.json** to Chub Venus AI
2. Import **Eros Status System 3.0.json** as Lorebook
3. Set your character name in the character card
4. Configure Impersonation Prompt for {{user}}
5. Start roleplaying!

### 1.2 First Session
- Default values: Affection 30, Obedience 30, Libido 20
- Character starts neutral/curious
- NTR module disabled by default
- Personified genitalia disabled by default

---

## 2. BASIC USAGE

### 2.1 Getting Status Updates
```html
<!-- AI automatically includes status in response based on scan -->
<!-- Or request specific view: -->

<GET status>        <!-- Full detailed status -->
<GET status:condensed>  <!-- Quick summary -->
```

### 2.2 Updating Values
```html
<!-- AI should update values after narrative events: -->
<UPDATE favorability:75>
<UPDATE mood:Aroused>
<UPDATE arousal:85>
```

### 2.3 Enabling Modules
```html
<!-- When entering sex scene: -->
<SET sex_active:true>

<!-- When NTR story desired: -->
<SET ntr_enabled:true>

<!-- When breeding focus: -->
<SET personified_genitalia:true>
```

---

## 3. MODULE TOGGLES

### When to Enable Each Module

| Module | When to Enable | When to Disable |
|--------|---------------|-----------------|
| **Sex Module** | Any sexual activity | End of scene |
| **NTR Module** | NTR storylines | Non-NTR stories |
| **Personified Genitalia** | Breeding/pregnancy scenes | Normal scenes |
| **Kemonomimi** | Non-human characters | Human-only |

---

## 4. STATUS DISPLAYS

### Condensed (Quick Check)
```
[❤️75% 🔥85% 😫3x 💦YES] [📍Bedroom]
```
Use: Normal play, token saving

### Full (Detailed)
```
╔═══════════════════════════════════════╗
║ Full terminal with all details       ║
╚═══════════════════════════════════════╝
```
Use: Important scenes, reviewing state

---

## 5. NPC MANAGEMENT

### Adding NPCs
```html
<INSERT npc:Yuki:importance:main>
<INSERT npc:Neighbor:importance:supporting>
```

### Viewing NPCs
```html
<GET npcs>
<GET npc:Nagisa>
```

---

## 6. LOCATION SYSTEM

### Moving Between Rooms
```html
<SET room:kitchen>
<SET room:living_room>
<SET room:master_bedroom>
```

### Visiting New Areas
- Automatically tracked in visited list
- Locked rooms require conditions to unlock
- Building expands as story progresses

---

## 7. RELATIONSHIP TRACKING

### Romantic Progression
Stranger → Acquaintance → Friend → Close Friend → Lover → Soulmate

### Family Progression
None → Step-parent → Step-child → Step-sibling → Ex-spouse

### Viewing Relationships
```html
<GET relationships>
```

---

## 8. NTR FEATURES

### Activating NTR
```html
<SET ntr_enabled:true>
<SET ntr_type:cuckold>  <!-- or bull or hotwife -->
```

### NTR Roles
- **Cuckold**: Husband watches wife with other man
- **Bull**: Man having sex with another man's wife
- **Hotwife**: Wife with other partners (consensual)

### Deactivating NTR
```html
<SET ntr_enabled:false>
```

---

## 9. PREGNANCY TRACKING

### View Fertility Status
```html
<GET genitalia>
```

### Key Data Points
- Menstrual cycle day (1-28)
- Fertility phase (ovulation = peak)
- Pregnancy status
- Sperm retention level

### Breeding Scenes
```html
<SET personified_genitalia:true>
<!-- Use during breeding-focused scenes -->
```

---

## 10. TROUBLESHOOTING

### "AI Not Remembering Status"
- Increase Lorebook scan depth to 9999
- Verify commands are being used
- Check token budget is adequate

### "Status Not Updating"
- Confirm AI reads from Lorebook
- Use explicit commands: `<UPDATE value:number>`
- Check validator is active

### "Terminal Too Long"
- Use condensed view: `<GET status:condensed>`
- Reduce verbosity in descriptions

### "NTR Not Working"
- Verify NTR module enabled: `<SET ntr_enabled:true>`
- Check specific role set: `<SET ntr_type:cuckold>`

---

## 11. BEST PRACTICES

1. **Start Simple**: Use basic modules first
2. **Add Complexity Gradually**: Enable NTR/personified as needed
3. **Use Condensed View**: Save tokens for important scenes
4. **Track Changes**: AI should update after significant events
5. **Review Status**: Check terminal regularly for accuracy

---

## 12. DEFAULT VALUES

| Parameter | Default | Notes |
|-----------|---------|-------|
| Affection | 30 | Neutral start |
| Obedience | 30 | Neutral start |
| Libido | 20 | Low start |
| Mood | Neutral | Can change |
| NTR | Disabled | Must enable |
| Personified | Disabled | Must enable |
| Species | Human | Must set if not |

---

## 13. COMMAND QUICK REFERENCE

| Need | Command |
|------|----------|
| Full status | `<GET status>` |
| Quick status | `<GET status:condensed>` |
| Enable sex | `<SET sex_active:true>` |
| Enable NTR | `<SET ntr_enabled:true>` |
| Move room | `<SET room:name>` |
| Update value | `<UPDATE field:value>` |
| Reset all | `<RESET>` |

---

**User Manual Version:** 1.0  
**For Eros Status System 3.0**