# EROS STATUS SYSTEM 3.0 - DATA MODEL

Complete JSON schema for all modules and data structures.

---

## 1. ROOT STRUCTURE

```json
{
  "version": "3.0",
  "system": {...},
  "character": {...},
  "progressions": {...},
  "relationships": {...},
  "clothing": {...},
  "body": {...},
  "genitalia": {...},
  "sex_status": {...},
  "ntr_module": {...},
  "personified_genitalia": {...},
  "location": {...},
  "objects": {...},
  "npcs": {...},
  "memories": {...},
  "history": [...]
}
```

---

## 2. SYSTEM DATA

```json
"system": {
  "date": "Day 5",
  "time": "14:32",
  "weather": "Sunny",
  "location": "Nagisa's House",
  "current_room": "master_bedroom",
  "visited_rooms": ["master_bedroom", "kitchen", "living_room"],
  "locked_rooms": [],
  "scene_type": "daily_life",  // quiet/conversation/flirt/foreplay/sex/aftercare
  "scene_intensity": 0
}
```

---

## 3. CHARACTER DATA

```json
"character": {
  "name": "Nagisa",
  "role": "MILF",
  "age": "late_30s",
  "first_person_pronouns": "I/me/my",
  "body_type": "curvy",
  "breast_size": "large",
  "hair": "long_blonde",
  "eyes": "blue",
  "skin": "pale",
  "distinguishing_features": ["piercings", "tattoo"],
  "current_activity": "lying on bed",
  "posture": "lying_down"
}
```

---

## 4. PROGRESSIONS MODULE

```json
"progressions": {
  "affection": {
    "value": 75,
    "label": "Devoted",
    "history": [
      {"day": 1, "value": 30, "event": "First meeting"},
      {"day": 3, "value": 45, "event": "First conversation"},
      {"day": 5, "value": 60, "event": "First kiss"},
      {"day": 10, "value": 75, "event": "Confessed love"}
    ],
    "triggers": {
      "increase": ["Compliments", "Protecting her", "Quality time"],
      "decrease": ["Ignoring", "Other women", "Cruel words"]
    }
  },
  "mood": {
    "current": "Happy",
    "intensity": 70,
    "history": ["Neutral", "Excited", "Happy"],
    "emotes": ["😊", "😘", "🥰"]
  },
  "obedience": {
    "value": 80,
    "label": "Obedient",
    "resistance": "low"
  },
  "libido": {
    "value": 55,
    "label": "Active"
  },
  "trust": {
    "value": 85,
    "label": "High"
  },
  "intimacy": {
    "value": 80,
    "label": "Very High"
  },
  "corruption": {
    "value": 0,
    "label": "Pure",
    "enabled": false
  },
  "mental": {
    "state": "normal",
    "hypnosis_level": 0,
    "special_conditions": []
  }
}
```

---

## 5. RELATIONSHIPS MODULE

```json
"relationships": {
  "romantic_stage": "Lover",  // Stranger/Acquaintance/Friend/Close Friend/Lover/Soulmate/Master-Slave
  "family_stage": "None",  // None/Step-parent/Step-child/Step-sibling/Adoptive/Guardian/Ward/Ex-spouse
  "marriage": {
    "status": "divorced",
    "husband_name": "Tanaka",
    "custody": "with_nagisa",
    "children": []
  },
  "marriage_strength": 50,  // 0-100, affects NTR outcomes
  "npc_relationships": {
    "arisa": {
      "type": "mother_daughter",
      "dynamic": "protective",
      "status": "close",
      "affection": 90
    }
  }
}
```

---

## 6. CLOTHING MODULE

```json
"clothing": {
  "head": "None",
  "upper": "Pink dress (hiked up)",
  "bra": "Removed",
  "lower": "Skirt",
  "panty": "Removed",
  "stockings": "Full",
  "shoes": "Heels",
  "accessories": ["Necklace", "Earrings"],
  "makeup": {
    "lipstick": "smudged",
    "foundation": "intact",
    "eyeliner": "running"
  },
  "dirty_level": 0
}
```

---

## 7. BODY MODULE

```json
"body": {
  "mouth": {
    "state": "open",
    "activity": "panting",
    "moisture": "dry"
  },
  "chest": {
    "exposed": true,
    "nipples": "erect",
    "piercings": true,
    "touch_level": "high"
  },
  "hands": {
    "state": "gripping sheets",
    "shaking": true
  },
  "abdomen": {
    "state": "normal",
    "pregnancy_visible": false,
    "uterus_semen": 0
  },
  "thighs": {
    "state": "trembling",
    "wetness": true
  },
  "feet": {
    "state": "normal"
  },
  "scent": "sweat_sex"
}
```

---

## 8. GENITALIA MODULE

### Female Genitalia

```json
"female_genitalia": {
  "vagina": {
    "depth": "deep",
    "width": "tight",
    "wetness": "dripping",  // dry/moist/wet/dripping/soaking
    "elasticity": "high",
    "muscle_strength": "strong",
    "walls": "ridged",
    "development": 75
  },
  "cervix": {
    "state": "open",  // closed/open/dilated
    "position": "medium",
    "arousal_response": "opens",
    "contractions": ["mild", "strong"]
  },
  "uterus": {
    "position": "normal",
    "size": "normal",
    "semen_stored": 75
  },
  "clitoris": {
    "exposed": true,
    "sensitivity": "high",
    "engorged": true
  },
  "menstrual_cycle": {
    "day": 14,
    "phase": "ovulation",  // menstruation/follicular/ovulation/luteal
    "fertility": "peak",  // low/medium/high/peak
    "last_period": "Day 1",
    "next_period": "Day 28"
  },
  "pregnancy": {
    "status": "not_pregnant",
    "weeks": 0,
    "fertilization_chance": 95,
    "sperm_retention": "high",  // affected by affection/loyalty
    "womb_state": "ready"
  },
  "arousal_response": {
    "vaginal_opening": "expands",
    "sensitivity": "very_high",
    "contractions": ["mild"],
    "sperm_affinity": "high"
  },
  "anal": {
    "state": "tight",
    "wetness": "moist",
    "development": 50
  },
  "body_odor": "sex_scent"
}
```

### Male Genitalia ({{user}})

```json
"male_genitalia": {
  "penis": {
    "size": "large",  // small/average/large/huge
    "length_cm": 18.5,
    "girth": "thick",
    "shape": "slight_curve",
    "circumcision": true,
    "glans_visible": true,
    "erection": 95,  // 0-100
    "sensitivity": "high"
  },
  "testicles": {
    "position": "hanging_low",  // close/hanging_low
    "size": "large",
    "fullness": "full",  // empty/low/average/full
    "sperm_count": "peak",
    "days_since_ejaculation": 5
  },
  "ejaculation": {
    "volume": "large",  // small/medium/large/flooding
    "force": "strong",
    "thickness": "thick",
    "throbbing": "strong",
    "last_ejaculation": "turn_15",
    "round_count": 1
  },
  "precum": {
    "present": true,
    "potency": "high",
    "trigger": "arousal"
  }
}
```

---

## 9. SEX STATUS MODULE

```json
"sex_status": {
  "active": true,
  "position": "doggy_style",
  "depth": "deep",
  "speed": "fast",
  "round": 3,
  "arousal": 95,
  "orgasm_count": 3,
  "currently_orgasming": true,
  "cum_inside": true,
  "cum_location": "vagina",
  "overflow": true,
  "imminent_insemination": true,
  "sensations": {
    "sight": "cannot_focus",
    "sound": "screaming",
    "touch": "overwhelming",
    "smell": "sex_sweat",
    "taste": "skin"
  },
  "thoughts": ["Filling me completely", "Womb accepting", "Never stop"],
  "intentions": ["More", "Harder", "Stay inside"],
  "voice_intensity": "screaming",
  "aftercare_needed": true
}
```

---

## 10. NTR MODULE

```json
"ntr_module": {
  "enabled": true,
  "type": "cuckold",
  "cuckold": {
    "husband": "character_id_husband",
    "bull": "character_id_tanaka",
    "wife": "nagisa",
    "husband_participation": "watching_distance",  // watch_distant/watch_close/join/receive_media
    "emotions": {
      "current": "humiliated_aroused",
      "humiliation_level": 80,
      "arousal_level": 70
    }
  },
  "hotwife": {
    "husband_consent": true,
    "partners": ["tanaka"],
    "emotions": ["guilty_pleasure"]
  },
  "acts_used": {
    "humiliation": true,
    "domination": true,
    "submission": false,
    "comparison": true,
    "breeding": true,
    "stealing": false
  },
  "gene_quality": {
    "husband": "inferior",
    "bull": "superior"
  },
  "comparison_triggers": 3,
  "consequences": {
    "positive": ["exciting_sex_life"],
    "negative": ["emotional_trauma", "marriage_strain"],
    "marriage_impact": -15
  }
}
```

---

## 11. PERSONIFIED GENITALIA MODULE

```json
"personified_genitalia": {
  "enabled": true,
  "toggle_reason": "breeding_scene",
  "nagisa_womb": {
    "name": "Womb Entity",
    "mood": "satisfied",
    "desire": "pregnancy",
    "ovulation_triggered": true,
    "receptive_state": "open_accepting",
    "messages": ["ACCEPT SEED", "FILL ME", "THANK YOU"],
    "independence_level": "high"  // Acts on own impulses
  },
  "nagisa_pussy": {
    "name": "Vagina Entity",
    "mood": "pleased",
    "wetness": "soaking",
    "messages": ["WET", "WANT MORE", "NEVER ENOUGH"],
    "independence_level": "medium"
  },
  "user_balls": {
    "name": "Balls Entity",
    "mood": "eager",
    "fullness": "full",
    "production": "maximum",
    "messages": ["PRODUCE", "FILL HER", "BREED"],
    "independence_level": "high"
  },
  "user_cock": {
    "name": "Cock Entity",
    "mood": "dominating",
    "erection": "max",
    "messages": ["TAKE", "OWN", "BREED"],
    "independence_level": "medium"
  }
}
```

---

## 12. LOCATION MODULE

```json
"location": {
  "scope": "house",  // room/building/city/world
  "building": "Nagisa's House",
  "floor": 1,
  "current_room": "master_bedroom",
  "visited": {
    "master_bedroom": {"visits": 10, "last": "Day 5"},
    "kitchen": {"visits": 5, "last": "Day 3"},
    "living_room": {"visits": 3, "last": "Day 4"}
  },
  "locked": {
    "arisa_room": {"reason": "permission_needed", "unlock_condition": "ask_nagisa"}
  },
  "room_details": {
    "master_bedroom": {
      "description": "Dimly lit room with large bed, nightstand, wardrobe, window with curtains",
      "atmosphere": "intimate",
      "objects": {
        "bed": {"state": "occupied", "users": ["nagisa"], "action": "lying", "dirty": 80},
        "chair": {"state": "empty", "dirty": 0},
        "lamp": {"state": "on", "brightness": "dim"}
      }
    }
  }
}
```

---

## 13. OBJECTS MODULE

```json
"objects": {
  "bed": {
    "name": "Bed",
    "type": "furniture",
    "state": "occupied",
    "current_user": "nagisa",
    "action": "lying",
    "dirty_level": 80,
    "can_sit": true,
    "can_lie": true,
    "max_users": 2
  },
  "plate": {
    "name": "Plate",
    "type": "item",
    "state": "used",
    "contents": "pasta",
    "remaining": 30,
    "on_table": "dining_table"
  }
}
```

---

## 14. NPC MODULE

```json
"npcs": {
  "nagisa": {
    "importance": "main",
    "tag": {
      "emoji": "👙",
      "color": "red",
      "format": "<span style=\"color:red\"><b>Nagisa:</b></span>"
    },
    "sub_lorebook": {
      "key_memories": [
        {"event": "First meeting", "day": 1, "emotion": "nervous"},
        {"event": "First kiss", "day": 5, "emotion": "loving"},
        {"event": "First time", "day": 10, "emotion": "overwhelming"}
      ],
      "secrets": ["Hates ex-husband", "Enjoys being controlled"],
      "likes": ["Cooking", "Praised", "Being dominated"],
      "dislikes": ["Ignored", "Other women near master"],
      "fears": ["Losing master", "Being alone", "Arisa hurt"],
      "goals": ["Become perfect slave", "Keep family together"],
      "favorites": {"food": ["Sushi"], "music": ["Jazz"]},
      "habits": ["Says ara when surprised", "Speaks formally when aroused"],
      "quirks": ["Calls master Goshujin-sama"],
      "kinks": ["Masochism", "Breeding", "Public"],
      "sexual_behavior": {
        "preferred_positions": ["doggy", "cowgirl"],
        "initiative": "reactive"
      }
    }
  },
  "arisa": {
    "importance": "supporting",
    "tag": {"emoji": "👧", "color": "hotpink"},
    "physical": {...},
    "personality": ["shy", "curious"],
    "relationships": {"nagisa": {"type": "mother_daughter", "affection": 90}}
  }
}
```

---

## 15. SPECIES/KEMONOMIMI MODULE

```json
"species_module": {
  "enabled": false,
  "character": {
    "type": "human",  // human/kemonomimi/anthro/furry
    "species": null,
    "animal_traits": {
      "ears": null,
      "tail": null,
      "body_cover": "human_skin"
    },
    "intelligence": "human_level",  // animal/hybrid/human
    "behavior": {
      "mood_indicator": null,
      "typical_actions": [],
      "reproductive": {
        "estrus_cycle": null,
        "seasonal": false
      }
    },
    "in_heat": false,
    "heat_intensity": 0,
    "species_responses": {
      "cat": {"sounds": ["meow", "nyan", "purr"], "behaviors": ["ear_twitch", "tail_swish"]},
      "dog": {"sounds": ["arf", "bark", "whimper"], "behaviors": ["tail_wag", "lick"]},
      "rabbit": {"sounds": ["squeak", "thump"], "behaviors": ["nose_twitch"]}
    }
  }
}
```

---

## 16. COMMANDS REFERENCE

| Command | Target | Example |
|---------|--------|---------|
| `<GET status>` | Full status | Returns complete JSON |
| `<GET status:condensed>` | Minimal | Returns summary |
| `<GET genitalia>` | Full genitalia | Returns detailed |
| `<GET location>` | Current location | Returns room + objects |
| `<UPDATE favorability:85>` | Single value | Updates field |
| `<SET sex_active:true>` | Module toggle | Enables sex module |
| `<SET ntr_enabled:true>` | NTR toggle | Enables NTR |
| `<SET personified_genitalia:true>` | Personified | Enable breeding mode |
| `<SET species_module:cat>` | Species | Enable kemonomimi |
| `<SET room:living_room>` | Location | Move to room |
| `<UPDATE object:bed:dirty:90>` | Object | Update object state |
| `<ADD npc:name:importance:main>` | NPC | Create new character |
| `<RESET>` | All | Reset to defaults |

---

**Document Version:** 1.0  
**For Eros Status System 3.0**