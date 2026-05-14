# EROS STATUS SYSTEM 3.0 - TUTORIAL

Step-by-step guide to implementing in Chub Venus AI.

---

## PHASE 1: SETUP

### 1.1 Create New Character
1. Open Chub Venus AI
2. Click "Create New Character"
3. Fill in basic details:
   - Name: [Your character]
   - Description: Brief backstory
   - Tags: Adult, RPG, [other tags]

### 1.2 Import Lorebook
1. Go to "Lorebooks" section
2. Click "Create New Lorebook"
3. Name: "Eros Status System 3.0"
4. Copy content from `Eros Status System 3.0.json`
5. Save

### 1.3 Configure Settings
In Lorebook settings:
- **Scan depth**: 9999 (maximum)
- **Prefix**: None or custom
- **Token budget**: High (2000+)
- **Position**: Top of list

---

## PHASE 2: CHARACTER CARD SETUP

### 2.1 Basic Info Tab
```
Name: Nagisa
Age: 28
Occupation: Housewife
Personality: Shy, caring, maternal
```

### 2.2 Description Tab
Write character description but DO NOT include:
- Individual stat values (handled by system)
- Status bar details (generated dynamically)

Include instead:
- Character personality
- Background story
- Relationships overview

### 2.3 Additional Info Tab
```
Species: Human
Gender: Female
Orientation: Heterosexual
```

---

## PHASE 3: IMPERSONATION PROMPT

### 3.1 What Goes Here
This is where {{user}} perspective lives (NOT visible in output):

```
You are [your character name]. You write in first person.
Your dialogue appears in quotes. You observe and react to the scene.
Use *actions* for your physical movements.
Use *~internal thoughts~* for private feelings.
Do not describe other people's thoughts - only your own.

The system will track your status automatically.
Write naturally as if you are this person.
```

### 3.2 What NOT to Include
- Don't write actual dialogue here
- Don't write actions here
- This is just the "instructions" for how to write

---

## PHASE 4: FIRST INTERACTION

### 4.1 Starting the Scene
**In your first message**, write normally. The AI will:
1. Read the Lorebook
2. See initial values (Affection 30, Obedience 30, etc.)
3. Generate appropriate response

### 4.2 Initial Status Display
The AI should output something like:
```
╔═══════════════════════════════════════════════════════╗
║ 📅 Day 1 | 🕐 Morning | ☀️ Sunny | 📍 Home           ║
╠═══════════════════════════════════════════════════════╣
║ 👙 NAGISA                                         ║
║ ❤️ Affection: [███░░░░] 30%  😣 Obedience: [███░░░░] 30% ║
║ 🥵 Libido: [██░░░░░] 20%  😊 Mood: Neutral          ║
╚═══════════════════════════════════════════════════════╝
```

### 4.3 Verify It's Working
- Check status appears in response
- Check colors render correctly
- Check values are within expected range

---

## PHASE 5: UPDATING STATUS

### 5.1 Natural Progression
The AI should update values based on story:

**Positive interaction:**
```
<UPDATE affection:40>
<UPDATE mood:Happy>
```

**Negative interaction:**
```
<UPDATE affection:25>
<UPDATE mood:Sad>
```

### 5.2 Manual Updates (If Needed)
You can explicitly request:
```
Update affection to 50 please
```

### 5.3 Verify Updates
After significant events, check status reflects changes.

---

## PHASE 6: ENABLING MODULES

### 6.1 Sex Module
**When:** Starting any sexual activity
**Command:**
```
<SET sex_active:true>
```

**Response should include:**
- Sex status terminal
- Body state details
- Genital responses

### 6.2 NTR Module
**When:** Beginning NTR storyline
**Commands:**
```
<SET ntr_enabled:true>
<SET ntr_type:cuckold>
```

**You can also set:**
```
<SET ntr:cuckold:husband:[name]>
<SET ntr:cuckold:bull:[name]>
```

### 6.3 Personified Genitalia
**When:** Breeding-focused scenes
**Command:**
```
<SET personified_genitalia:true>
```

**Response includes:**
- Womb thoughts/feelings
- Internal dialogue
- Species-specific responses

---

## PHASE 7: MOVING & OBJECTS

### 7.1 Change Location
**Command:**
```
<SET room:bedroom>
<SET room:kitchen>
<SET room:office>
```

### 7.2 Add Objects
**Command:**
```
<INSERT inventory:Phone>
<INSERT inventory:Key>
```

### 7.3 Interact with Objects
Use standard roleplay - system tracks what's available.

---

## PHASE 8: NPC MANAGEMENT

### 8.1 Add NPC
**Command:**
```
<INSERT npc:Tanaka:importance:supporting>
```

### 8.2 View NPC Info
**Command:**
```
<GET npcs>
<GET npc:Tanaka>
```

---

## PHASE 9: PREGNANCY TRACKING

### 9.1 Enable Tracking
The system tracks automatically when sex_active is true.

### 9.2 View Fertility
**Command:**
```
<GET genitalia>
```

Shows:
- Menstrual cycle day
- Fertility phase
- Pregnancy status
- Sperm days remaining

### 9.3 Breeding Scenes
Enable personified_genitalia for full breeding focus.

---

## PHASE 10: SESSION MANAGEMENT

### 10.1 Save State
```
<EXPORT state>
```
Creates save data for later import.

### 10.2 Load State
```
<IMPORT state:filename>
```
Restores previous session.

### 10.3 Reset
```
<RESET>
```
Resets all values to default.

---

## COMMON ISSUES & FIXES

### Issue: Status Not Appearing
**Fix:** Increase Lorebook scan depth to 9999

### Issue: Commands Not Working
**Fix:** Ensure Lorebook is at top of list

### Issue: Terminal Too Long
**Fix:** Request condensed view: `<GET status:condensed>`

### Issue: Colors Not Showing
**Fix:** Some platforms don't support HTML - use Markdown fallback

---

## NEXT STEPS

1. **Practice Basic Usage**: Start with just status tracking
2. **Add Sex Module**: Try one intimate scene
3. **Explore NTR**: If desired, enable and test
4. **Optimize**: Adjust token budget and scan depth

---

**Tutorial Version:** 1.0  
**For Eros Status System 3.0**