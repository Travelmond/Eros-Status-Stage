# Eros Status Stage - UI Design Specification

## 1. Overview

This document defines the visual interface design for the Eros Status Stage, a terminal-style status panel overlay for the Chub Venus AI platform. The interface provides real-time character status tracking with interactive category navigation.

---

## 2. Visual Layout Structure

### 2.1 Overall Layout Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER BAR (Always Visible)                                    │
│  [Day/Time/Weather/Location Summary]                            │
├─────────────────────────────────────────────────────────────────┤
│  MAIN CONTENT AREA                                              │
│  ┌─────────────────┬───────────────────────────────────────────┐│
│  │ CATEGORY        │                                           ││
│  │ BUTTONS         │  DETAIL PANEL / SUMMARY TERMINAL         ││
│  │ (Left Sidebar)  │  (Main Content Area)                      ││
│  │                 │                                           ││
│  │ [Overview]      │  Displays selected category content       ││
│  │ [Stats]         │  or default summary terminal              ││
│  │ [Body]          │                                           ││
│  │ [Inventory]     │                                           ││
│  │ [Location]      │                                           ││
│  │ [Relationships] │                                           ││
│  │ [Moments]       │                                           ││
│  │ [Prompts]       │                                           ││
│  └─────────────────┴───────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│  FOOTER (Optional - Quick Actions)                             │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Hierarchy

| Component | Description | Position |
|-----------|-------------|----------|
| `StatusContainer` | Main wrapper, full viewport | Root |
| `HeaderBar` | Day/Time/Weather/Location strip | Top, fixed |
| `CategorySidebar` | Vertical button list | Left, 180px |
| `DetailPanel` | Main content area | Right, flex |
| `SummaryTerminal` | Default view in DetailPanel | DetailPanel default |
| `CategoryModal` | Slide-out detail view | Overlay/Slide from right |

### 2.3 Dimensions

| Element | Desktop | Mobile |
|---------|---------|--------|
| Container Max Width | 600px | 100% |
| Header Height | 48px | 40px |
| Sidebar Width | 160px | 100% (horizontal tabs) |
| Detail Panel Min Width | calc(100% - 160px) | 100% |
| Button Height | 40px | 36px |
| Progress Bar Height | 20px | 18px |
| Border Radius | 8px | 6px |

---

## 3. Color Palette

### 3.1 Primary Colors (from Lorebook CSS)

| Purpose | Color Name | Hex Value | Usage |
|---------|------------|-----------|-------|
| Character Names | `red` | `#FF0000` | Name highlights, emphasis |
| Locations | `cyan` | `#00FFFF` | Current location, room names |
| Items/Clothing | `green` | `#008000` | Inventory items, objects |
| Personality | `orange` | `#FFA500` | Traits, mood descriptors |
| Mood | `purple` | `#800080` | Emotional states |
| Sex/Body Elements | `pink` | `#FFC0CB` | Body stats, intimacy data |
| Time/Date | `yellow` | `#FFFF00` | Day, time, weather |
| Narrator Text | `gray` | `#808080` | Secondary information |
| Warnings/NTR | `red` | `#FF0000` | Alert indicators |
| Success/Safe | `lightgreen` | `#90EE90` | Positive status |

### 3.2 Terminal UI Colors

| Element | Color | Hex |
|---------|-------|-----|
| Terminal Background | `#0D1117` | Dark charcoal |
| Terminal Border | `#30363D` | Subtle gray |
| Terminal Border Accent | `#58A6FF` | Bright blue accent |
| Header Background | `#161B22` | Darker panel |
| Button Inactive | `#21262D` | Muted dark |
| Button Hover | `#30363D` | Light hover |
| Button Active | `#388BFD` | Active blue |
| Text Primary | `#E6EDF3` | Off-white |
| Text Secondary | `#8B949E` | Muted gray |
| Progress Bar Fill | `cyan` | `#58A6FF` |
| Progress Bar Empty | `#30363D` | Dark placeholder |

### 3.3 CSS Variables

```scss
:root {
  // Terminal Foundation
  --terminal-bg: #0D1117;
  --terminal-border: #30363D;
  --terminal-border-accent: #58A6FF;
  --header-bg: #161B22;

  // Button States
  --btn-inactive: #21262D;
  --btn-hover: #30363D;
  --btn-active: #388BFD;

  // Text Colors
  --text-primary: #E6EDF3;
  --text-secondary: #8B949E;

  // Progress Bar
  --progress-fill: #58A6FF;
  --progress-empty: #30363D;

  // Lorebook Semantic Colors
  --color-char-name: red;
  --color-location: cyan;
  --color-items: green;
  --color-personality: orange;
  --color-mood: purple;
  --color-body: pink;
  --color-time: yellow;
  --color-narrator: gray;
  --color-warning: red;
  --color-success: lightgreen;

  // Sizing
  --header-height: 48px;
  --sidebar-width: 160px;
  --btn-height: 40px;
  --border-radius: 8px;
  --transition-speed: 200ms;
}
```

---

## 4. Typography

### 4.1 Font Stack

```scss
// Primary: Monospace for terminal aesthetic
$font-terminal: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;

// Fallback: System monospace
$font-fallback: 'SF Mono', 'Monaco', 'Inconsolata', monospace;

// Unicode Support Required: █ ░ ▓ │ ═ ╔ ═ ╗ ║ ╠ ╣ ╚ ╝
```

### 4.2 Font Sizes

| Element | Desktop | Mobile |
|---------|---------|--------|
| Header Time/Date | 14px | 12px |
| Section Title | 16px | 14px |
| Body Text | 13px | 12px |
| Progress Label | 12px | 11px |
| Button Text | 13px | 12px |
| Small/Meta | 11px | 10px |

### 4.3 Line Heights

- Headers: 1.4
- Body: 1.5
- Progress Bars: 1.2

---

## 5. Component Designs

### 5.1 Header Bar

```text
┌─────────────────────────────────────────────────────────────┐
│ 📅 Day 1  │  🕐 7:55 AM  │  ☀️ Sunny  │  📍 Home Kitchen    │
└─────────────────────────────────────────────────────────────┘
```

**Structure:**
- Flexbox row, space-between distribution
- Each segment wrapped in span with semantic color
- Divider: `│` Unicode pipe character
- Height: 48px (desktop), 40px (mobile)

**States:**
- Default: Normal display
- Transition: Values animate on change (CSS transition 300ms)

### 5.2 Category Buttons

```text
┌────────────┐
│ 📊 Overview│
├────────────┤
│ 📈 Stats   │
├────────────┤
│ 💃 Body    │
├────────────┤
│ 🎒 Inventory
├────────────┤
│ 🏠 Location│
├────────────┤
│ 💕 Relations
├────────────┤
│ 🎬 Moments │
├────────────┤
│ 🎨 Prompts │
└────────────┘
```

**Button Design:**
- Background: `--btn-inactive`
- Padding: 12px 16px
- Border: 1px solid transparent
- Border-radius: `--border-radius`
- Icon + Label layout (icon left, text right)
- Gap between icon and text: 8px

**Button States:**

| State | Background | Border | Text Color |
|-------|------------|--------|------------|
| Default | `#21262D` | transparent | `#E6EDF3` |
| Hover | `#30363D` | `#58A6FF` | `#E6EDF3` |
| Active/Selected | `#388BFD` | `#58A6FF` | `#FFFFFF` |
| Disabled | `#161B22` | transparent | `#484F58` |

**Transition:** All state changes: `200ms ease-out`

### 5.3 Progress Bars (Unicode Box Characters)

```text
❤️ Love:     [██████████░░░░░░░] 65%
🔮 Magic:    [████░░░░░░░░░░░░░] 25%
⚡ Energy:   [██████████████░░░] 85%
```

**Structure:**
- Label: Left-aligned, semantic color
- Colon separator after label
- Bar container: Fixed width proportional
- Fill: Unicode `█` (U+2588) full block
- Empty: Unicode `░` (U+2591) light shade
- Percentage: Right-aligned, gray text

**Bar Configuration:**

```scss
.progress-bar {
  width: 120px;           // Fixed width for consistency
  height: 20px;           // Bar height
  background: var(--progress-empty);
  border-radius: 4px;
  overflow: hidden;
  display: inline-flex;

  .fill {
    background: var(--progress-fill);
    transition: width 300ms ease;
  }
}
```

**Visual Variations by Stat Type:**

| Stat Type | Fill Color | Unicode Character |
|-----------|------------|-------------------|
| Positive (Love, Trust) | `lightgreen` | █ |
| Negative (Corruption) | `red` | ▓ |
| Neutral (Arousal) | `pink` | █ |
| Special (NTR) | `orange` | ▓ |

### 5.4 Summary Terminal (Default View)

```text
╔══════════════════════════════════════════════════════════╗
║ 📅 Day 1 | 🕐 7:55 AM | ☀️ Sunny | 📍 Home Kitchen        ║
╠══════════════════════════════════════════════════════════╣
║ Hanako - 42yo Japanese Wife (Mother of Two)               ║
║ ❤️ Love: [██████████░░░░░░░] 65%  😣 Corruption: [░░░] 0%║
║ 😊 Mood: Hopeful/Emotional                                ║
╚══════════════════════════════════════════════════════════╝
```

**Terminal Box Drawing:**
- Top: `╔` `═` `╗` (Unicode box drawing)
- Divider: `╠` `═` `╣`
- Bottom: `╚` `═` `╝`
- Vertical: `║`

**Container:**
- Background: `--terminal-bg`
- Border: 2px solid `--terminal-border`
- Border-radius: `--border-radius`
- Padding: 16px
- Box-shadow: `0 4px 12px rgba(0, 0, 0, 0.4)`

### 5.5 Detail Panel Views

Each category button opens a detail panel in the main content area:

**Overview View:**
- Character summary card
- Current mood/expression
- Day/Location quick stats
- Recent events list (last 3)

**Stats View:**
- Full stat grid (affection, obedience, libido, etc.)
- Each stat as labeled progress bar
- Expandable for detailed history

**Body View:**
- Clothing status
- Exposure level
- Expression display
- Pose/position indicator
- Body condition tags

**Inventory View:**
- Grid of carried items (icon + name)
- Room objects list
- Special story items highlighted

**Location View:**
- Current room name (large)
- Building name
- Visited rooms history
- Available actions in room

**Relationships View:**
- List of NPCs with relationship stage
- User relationship prominent at top
- Affection meters for each

**Moments View:**
- Timeline of important scenes
- NSFW flag indicators
- Screenshot-ready moments
- Date/day stamps

**Prompts View:**
- Facial expression presets
- Pose suggestions
- Clothing combinations
- Lighting/setting notes

---

## 6. Modal/Slide-out Animation Behavior

### 6.1 Animation Specifications

**Entry Animation (Button Click):**
- Type: Slide-in from right
- Duration: 250ms
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`
- Transform: `translateX(100%)` → `translateX(0)`

**Exit Animation (Close/Back):**
- Type: Slide-out to right
- Duration: 200ms
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`
- Transform: `translateX(0)` → `translateX(100%)`

**Backdrop Overlay:**
- Background: `rgba(0, 0, 0, 0.6)`
- Fade-in: 150ms
- Click to close enabled

### 6.2 Component Transition States

```scss
.modal-enter {
  opacity: 0;
  transform: translateX(100%);
}

.modal-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-exit {
  opacity: 1;
  transform: translateX(0);
}

.modal-exit-active {
  opacity: 0;
  transform: translateX(100%);
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 7. Responsive Design

### 7.1 Breakpoint Strategy

| Breakpoint | Width | Layout Transformation |
|------------|-------|----------------------|
| Desktop | ≥768px | Sidebar + Detail panel side-by-side |
| Mobile | <768px | Horizontal tabs + full-width detail |

### 7.2 Mobile Adaptations

**Sidebar → Tab Bar:**
- Vertical button list becomes horizontal scrollable tabs
- Fixed at top of content area (below header)
- Tabs: Icon only + label below, or icon only with tooltip
- Active tab: Bottom border highlight

**Detail Panel:**
- Full width, no sidebar offset
- Padding reduced: 16px → 12px
- Progress bars: Full width instead of fixed

**Header:**
- Truncated long location text with ellipsis
- Smaller font: 14px → 12px
- Vertical separators between segments

### 7.3 Touch Interactions

| Interaction | Behavior |
|-------------|----------|
| Button tap | 200ms feedback, open detail |
| Swipe left/right | Navigate between tabs (mobile) |
| Long press | Show tooltip with full name |
| Pull down | Refresh data (optional) |

---

## 8. Visual Effects

### 8.1 Hover States

**Buttons:**
```scss
.category-btn:hover {
  background: var(--btn-hover);
  border-color: var(--terminal-border-accent);
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(88, 166, 255, 0.2);
}
```

**Progress Bars:**
```scss
.progress-bar:hover {
  filter: brightness(1.1);
  cursor: pointer;
}
```

### 8.2 Transitions

| Element | Property | Duration | Easing |
|---------|----------|----------|--------|
| Button hover | background, transform | 200ms | ease-out |
| Progress bar fill | width | 300ms | ease |
| Modal open | transform, opacity | 250ms | cubic-bezier(0.4, 0, 0.2, 1) |
| Header values | color (on change) | 300ms | ease |
| Tab switch | opacity | 150ms | ease |

### 8.3 Special Effects

**Glitch Effect (Optional - for NTR warnings):**
```scss
@keyframes glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
}

.warning-text {
  animation: glitch 0.3s infinite;
  color: red;
}
```

**Pulse Effect (for high arousal/critical stats):**
```scss
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.critical-stat {
  animation: pulse 2s infinite;
  color: pink;
}
```

---

## 9. Component State Summary

### 9.1 Button States

```
┌────────────────────────────────────────────────────────────┐
│ CATEGORY BUTTON STATE MACHINE                             │
├────────────────────────────────────────────────────────────┤
│                                                            │
│   [INACTIVE]  ──click──▶  [HOVER]  ──click──▶  [ACTIVE]  │
│      ↓                              ↓                      │
│      └───mouseout──────►  [DEFAULT] ◄──click──┘          │
│                                                            │
│ STATE DEFINITIONS:                                         │
│ - INACTIVE: Not selected, default appearance              │
│ - HOVER: Mouse over, highlight effect                     │
│ - ACTIVE: Currently selected, accent border              │
│ - DEFAULT: Base appearance (after hover leave)            │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### 9.2 Progress Bar States

| State | Visual Indicator |
|-------|-------------------|
| Normal | Solid fill color |
| Low (<25%) | Gray tint, no animation |
| High (>75%) | Brighter color, subtle glow |
| Critical (100%) | Pulsing animation |
| Decreasing | Brief red flash on change |

---

## 10. Implementation Notes

### 10.1 Technology Stack

- **Framework**: React (via Stage.tsx)
- **Styling**: SCSS modules
- **Animations**: CSS transitions + keyframes
- **Icons**: Unicode emoji (native) or Lucide React

### 10.2 Key Design Principles

1. **Terminal Aesthetic**: Use monospace fonts and box-drawing characters
2. **Semantic Colors**: Apply lorebook color mapping for data types
3. **Always Visible Summary**: Header bar persists across all views
4. **Smooth Transitions**: No jarring layout shifts
5. **Mobile First**: Touch-friendly targets (min 44px)
6. **Accessible**: High contrast, keyboard navigation support

### 10.3 Performance Considerations

- Lazy load detail panel content
- Memoize stat calculations
- Use CSS transforms for animations (GPU acceleration)
- Limit re-renders with React.memo for static elements

---

## 11. Acceptance Criteria

- [ ] Header bar displays day/time/weather/location with correct colors
- [ ] Category buttons navigate between all 8 detail views
- [ ] Summary terminal visible by default on load
- [ ] Progress bars use Unicode █░ characters correctly
- [ ] Slide-out animation smooth (250ms)
- [ ] Mobile responsive below 768px breakpoint
- [ ] Hover states provide visual feedback
- [ ] All lorebook semantic colors applied correctly
- [ ] Terminal box-drawing characters render properly

---

*Design specification created for Eros Status Stage v1.0*
*Reference: Lorebook color mapping + terminal aesthetic requirements*