# EROS STATUS SYSTEM 3.0 - COMMAND REFERENCE

Complete command list for interacting with the system.

---

## 1. GET COMMANDS

### 1.1 Status Retrieval

| Command | Function | Output |
|---------|----------|--------|
| `<GET status>` | Full detailed status | Complete terminal |
| `<GET status:condensed>` | Quick summary | Minimal view |
| `<GET status:minimal>` | Quick summary | Minimal view |
| `<GET progressions>` | All progression values | Affection, mood, etc. |
| `<GET relationships>` | Relationship data | Romantic, family, NPC |
| `<GET location>` | Current location | Room, building, visited |
| `<GET objects>` | Objects in room | All interactables |
| `<GET genitalia>` | Full genital data | Both if applicable |
| `<GET sex_status>` | Current sex state | Position, arousal, etc. |
| `<GET ntr>` | NTR module data | Type, emotions, etc. |
| `<GET npcs>` | All NPC data | Tags, relationships |
| `<GET npc:NAME>` | Specific NPC | Single character |
| `<GET memories>` | Character memories | History log |
| `<GET actions>` | Available actions | Menu options |

### 1.2 Conditional GET

```html
<!-- Only returns if sex_active is true -->
<GET sex_status>

<!-- Only returns if ntr_enabled is true -->
<GET ntr>

<!-- Only returns if personified_genitalia is true -->
<GET personified_genitalia>
```

---

## 2. UPDATE COMMANDS

### 2.1 Progression Updates

```html
<UPDATE favorability:75>
<UPDATE obedience:80>
<UPDATE libido:55>
<UPDATE mood:Happy>
<UPDATE trust:85>
<UPDATE corruption:20>
```

### 2.2 Body Updates

```html
<UPDATE body:mouth:open>
<UPDATE body:chest:exposed>
<UPDATE body:wetness:dripping>
<UPDATE body:arousal:95>
```

### 2.3 Clothing Updates

```html
<UPDATE clothing:upper:removed>
<UPDATE clothing:bra:removed>
<UPDATE clothing:panty:removed>
```

### 2.4 Genitalia Updates

```html
<UPDATE genitalia:wetness:soaking>
<UPDATE genitalia:cervix:open>
<UPDATE genitalia:orgasm:3>
<UPDATE genitalia:cum_inside:true>
<UPDATE genitalia:pregnancy_chance:95>
<UPDATE sperm_days:5>
<UPDATE sperm_volume:large>
```

---

## 3. SET COMMANDS (Toggle Modules)

### 3.1 Core Toggles

```html
<SET sex_active:true>
<SET sex_active:false>

<SET ntr_enabled:true>
<SET ntr_enabled:false>

<SET personified_genitalia:true>
<SET personified_genitalia:false>
```

### 3.2 NTR Type

```html
<SET ntr_type:cuckold>
<SET ntr_type:bull>
<SET ntr_type:hotwife>
<SET ntr_type:none>
```

### 3.3 Species (Kemonomimi)

```html
<SET species_module:cat>
<SET species_module:dog>
<SET species_module:rabbit>
<SET species_module:fox>
<SET species_module:none>
```

### 3.4 Location

```html
<SET room:master_bedroom>
<SET room:kitchen>
<SET room:living_room>
<SET room:locked>
```

### 3.5 Scene Type

```html
<SET scene:quiet>
<SET scene:conversation>
<SET scene:flirt>
<SET scene:foreplay>
<SET scene:sex>
<SET scene:aftercare>
```

---

## 4. INSERT COMMANDS

### 4.1 Add NPC

```html
<INSERT npc:NAME:importance:main>
<INSERT npc:NAME:importance:supporting>
<INSERT npc:NAME:importance:minor>
```

### 4.2 Add Memory

```html
<INSERT memory:First kiss>
<INSERT memory:First time>
<INSERT memory:Confessed love>
```

### 4.3 Add to Inventory

```html
<INSERT inventory:Phone>
<INSERT inventory:Key>
<INSERT inventory:Weapon>
```

---

## 5. SPECIAL COMMANDS

### 5.1 Reset

```html
<RESET>
<!-- Resets all values to default -->

<RESET progressions>
<!-- Resets only progression values -->

<RESET location>
<!-- Resets only location data -->
```

### 5.2 Export/Import (For Saved Games)

```html
<EXPORT state>
<!-- Creates save file -->

<IMPORT state:filename>
<!-- Loads saved state -->
```

### 5.3 Pregnancy Specific

```html
<UPDATE pregnancy:positive>
<UPDATE pregnancy:weeks:4>
<UPDATE menstrual:day:14>
<UPDATE menstrual:phase:ovulation>
<SET fertility:peak>
```

---

## 6. NTR SPECIFIC COMMANDS

```html
<SET ntr:cuckold:husband:CharacterName>
<SET ntr:cuckold:bull:CharacterName>
<SET ntr:cuckold:participation:watch_close>

<SET ntr:gene_quality:husband:inferior>
<SET ntr:gene_quality:bull:superior>

<UPDATE ntr:humiliation_level:80>
<UPDATE ntr:comparison_count:3>
```

---

## 7. PERSONIFIED GENITALIA COMMANDS

```html
<SET personified_genitalia:true>
<!-- Activates during sex/breeding scenes -->

<SET personified_genitalia:false>
<!-- Deactivate when not needed -->

<UPDATE personified:womb:mood:satisfied>
<UPDATE personified:womb:ovulation_triggered:true>
<UPDATE personified:balls:fullness:full>
<UPDATE personified:balls:production:maximum>
```

---

## 8. CONDITIONAL FORMATS

### 8.1 Minimal Format Output

```html
<!-- AI outputs this when <GET status:condensed> is used -->
[❤️75% 🔥85% 😫3x 💦YES] [📍Bedroom] [⏰14:32]
```

### 8.2 Full Format Output

```html
<!-- AI outputs this when <GET status> is used -->
╔═══════════════════════════════════════╗
║ Full detailed terminal output         ║
╚═══════════════════════════════════════╝
```

---

## 9. QUICK REFERENCE

| Action | Command |
|--------|---------|
| Get status | `<GET status>` |
| Quick view | `<GET status:condensed>` |
| Update value | `<UPDATE field:value>` |
| Enable module | `<SET module:true>` |
| Move room | `<SET room:name>` |
| Add NPC | `<INSERT npc:name:main>` |
| Reset all | `<RESET>` |

---

**Command Reference Version:** 1.0  
**For Eros Status System 3.0**