# EROS STATUS SYSTEM 3.0 - SPECIFICATION DOCUMENT

**Version:** 3.0  
**Status:** V1 Complete  
**Platform:** Chub Venus AI  
**Date:** May 2026

---

## 1. PROJECT OVERVIEW

### 1.1 Purpose
Eros Status System 3.0 is a comprehensive Lorebook framework for generating immersive 18+ roleplaying experiences in Chub Venus AI. It provides persistent character state tracking, dynamic terminal displays, and intelligent narrative systems.

### 1.2 Problem Statement
- AI forgets character status across turns
- Hallucination of stats and values
- Inconsistent tracking of sexual content
- Lack of depth in romantic/NTR scenarios
- No persistent memory system

### 1.3 Solution
A structured Lorebook with:
- Data storage system the AI reads from
- Command system for state updates
- Conditional module activation
- Persistent memory across turns

---

## 2. USER STORIES

### 2.1 Core User Stories

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| US-01 | As a user, I want the AI to remember character status across turns so it doesn't forget or hallucinate values. | AI reads from storage before outputting status |
| US-02 | As a user, I want status values to update based on narrative events so the status reflects reality. | After significant events, AI uses `<UPDATE>` commands |
| US-03 | As a user, I want sex status to only appear when relevant so the display stays clean. | Sex module activates only when `sex_active:true` |
| US-04 | As a user, I want NTR features to be opt-in so it's only used when the story calls for it. | Activation via command OR keywords |
| US-05 | As a user, I want color-coded status terminals for quick visual scanning. | Different colors for different categories |
| US-06 | As a user, I want the terminal to look like an RPG game for immersive feel. | Box characters or markdown tables |
| US-07 | As a user, I want personified genitalia for breeding-focused narratives. | Toggle on during sex/breeding scenes |
| US-08 | As a user, I want sperm tracking for realistic impregnation scenarios. | Days since ejaculation affects volume |
| US-09 | As a user, I want imminent insemination dialogue for tension building. | Countdown dialogue during climax |
| US-10 | As a user, I want NTR-specific reactions when that module is enabled. | Different dialogue for cuckold/bull/hotwife |

---

## 3. FUNCTIONAL REQUIREMENTS

### 3.1 Data Storage System

**Structure:**
```json
{
  "system": {
    "date": "Day X",
    "time": "HH:MM",
    "weather": "string",
    "location": "string",
    "current_room": "string"
  },
  "character": {
    "name": "string",
    "favorability": 0-100,
    "obedience": 0-100,
    "libido": 0-100,
    "mood": "string",
    "relationship": "string"
  },
  "clothing": {
    "upper": "string",
    "bra": "string",
    "lower": "string",
    "panty": "string",
    "stockings": "string",
    "shoes": "string",
    "accessories": []
  },
  "body": {
    "mouth": "string",
    "chest": "string",
    "hands": "string",
    "abdomen": "string",
    "thighs": "string",
    "feet": "string",
    "posture": "string"
  },
  "genitalia": {
    "gender": "male/female",
    "vagina": {...},
    "cervix": {...},
    "uterus": {...},
    "menstrual_cycle": {...},
    "pregnancy": {...},
    "penis": {...},
    "testicles": {...},
    "ejaculation": {...}
  },
  "ntr_module": {
    "enabled": false,
    "type": "none/cuckold/bull/hotwife"
  },
  "personified_genitalia": {
    "enabled": false
  },
  "sex_active": false,
  "sex_status": {
    "position": "string",
    "arousal": 0-100,
    "orgasm_count": 0,
    "cum_inside": false
  },
  "relationships": {...},
  "npcs": {...},
  "location_data": {...},
  "objects": {...}
}
```

### 3.2 Command System

| Command | Function | Example |
|---------|----------|---------|
| `<GET status>` | Get full detailed status | Returns complete JSON |
| `<GET status:condensed>` | Get minimal summary | Returns quick view |
| `<UPDATE field:value>` | Update single value | `<UPDATE favorability:75>` |
| `<SET module:value>` | Enable/disable module | `<SET ntr_enabled:true>` |
| `<SET personified_genitalia:true>` | Toggle personified genitalia | For breeding scenes |
| `<INSERT npc:name:importance:main>` | Add new NPC | Creates new character |
| `<RESET>` | Reset all values | Returns to defaults |

### 3.3 Module Activation Rules

| Module | Trigger Condition | Deactivation |
|--------|-------------------|--------------|
| **General Status** | Always | Never |
| **Sex Module** | `sex_active:true` | End of sex scene |
| **NTR Module** | `ntr_enabled:true` OR NTR keywords | User disables |
| **Personified Genitalia** | Toggle during sex/breeding | Toggle off |
| **Kemonomimi** | Species set to non-human | Character changes |

---

## 4. NON-FUNCTIONAL REQUIREMENTS

### 4.1 Performance
- Token budget: 2000 max for terminal display
- Scan depth: 9999 for Lorebook
- Response time: Immediate

### 4.2 Reliability
- All tags/blocks properly closed
- Consistent data validation
- Module priority system prevents conflicts

### 4.3 Usability
- Color-coded categories for quick scanning
- Progressive disclosure (condensed vs full)
- Toggle-based modules for user control

---

## 5. TECHNICAL SPECIFICATIONS

### 5.1 Lorebook Configuration
```json
{
  "scan_depth": 9999,
  "token_budget": 2000,
  "recursive_scanning": false,
  "is_creation": false
}
```

### 5.2 Character Card Configuration
- Pre-history Instructions: Character context
- Post-history Instructions: Format rules
- Impersonation Prompt: {{user}} personality

### 5.3 Preset Configuration
```json
{
  "include_names": true,
  "v2_spec": true,
  "use_lorebooks": true,
  "lorebook_scan_depth": 9999,
  "lorebook_token_budget": 2000,
  "temperature": 0.7,
  "max_new_tokens": 500
}
```

---

## 6. MODULE DETAILS

### 6.1 Progressions Module
- Affection (0-100) + history + triggers
- Mood (dynamic)
- Obedience (0-100)
- Libido (0-100)
- Trust & Intimacy (0-100)
- Corruption (0-100, optional)

### 6.2 NTR Module
- Cuckold/Bull/Hotwife roles
- Dynamic (multiple roles can exist)
- Activation: Command OR keywords
- Gene quality tracking

### 6.3 Personified Genitalia
- Toggle-based: `<SET personified_genitalia:true>`
- Story-dependent activation
- Independent entity behavior for narrative depth

### 6.4 Sperm Production Tracking
- Days since last ejaculation
- Ball fullness levels
- Pre-cum potency
- Volume based on abstinence

---

## 7. ACCEPTANCE CRITERIA

- [ ] AI reads from data storage before outputting status
- [ ] Status values update correctly after narrative events
- [ ] Sex module only appears when appropriate
- [ ] NTR module activates/deactivates properly
- [ ] Personified genitalia toggles on/off correctly
- [ ] Terminal displays with color coding
- [ ] Condensed and full views work
- [ ] All modules integrate without conflicts
- [ ] Documentation is clear and complete

---

## 8. RISKS & MITIGATION

| Risk | Mitigation |
|------|-------------|
| Token limit exceeded | Use condensed view, progressive disclosure |
| AI forgetting state | Increase scan depth, verify with validator |
| Conflicting module data | Priority system (NTR > Sex > Body > General) |
| NTR accidentally activating | Default disabled, explicit enable required |

---

## 9. GLOSSARY

| Term | Definition |
|------|------------|
| **Lorebook** | Chub Venus AI memory system |
| **Terminal** | Status display in response |
| **Module** | Functional unit (can be toggled) |
| **Personified Genitalia** | Independent entity narrative for breeding |
| **NTR** | Non-consensual/Consensual cuckolding themes |
| **Condensed View** | Minimal status summary |
| **Full View** | Complete detailed status |

---

**Document Version:** 1.0  
**Last Updated:** May 2026  
**Author:** Eros Status System Development