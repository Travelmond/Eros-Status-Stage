<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eros Status System 3.1 - Preset Guide</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', system-ui, sans-serif; line-height: 1.7; color: #333; max-width: 900px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
        .hero-section { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 50px 40px; border-radius: 16px; color: white; text-align: center; margin-bottom: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); }
        .hero-section h1 { font-size: 2.5em; margin-bottom: 10px; }
        .tagline { font-size: 1.3em; opacity: 0.9; margin-bottom: 25px; }
        .badges { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; }
        .badge { background: #e94560; padding: 8px 20px; border-radius: 25px; font-weight: 600; font-size: 0.9em; }
        .badge.secondary { background: rgba(255,255,255,0.2); }
        .badge.new { background: #10b981; }
        .content { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        h2 { color: #1a1a2e; margin: 35px 0 15px 0; padding-bottom: 10px; border-bottom: 3px solid #e94560; }
        h3 { color: #16213e; margin: 25px 0 10px 0; }
        p { margin-bottom: 15px; }
        ul, ol { margin: 15px 0 15px 25px; }
        li { margin-bottom: 8px; }
        code { background: #1a1a2e; color: #f0f0f0; padding: 3px 8px; border-radius: 4px; font-family: 'Consolas', monospace; font-size: 0.9em; }
        pre { background: #1a1a2e; color: #f0f0f0; padding: 20px; border-radius: 8px; overflow-x: auto; margin: 15px 0; font-size: 0.85em; }
        .info-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
        .success-box { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
        .warning-box { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #1a1a2e; color: white; }
        tr:hover { background: #f8f9fa; }
        .highlight { background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 15px 0; }
        .step { background: #e8f5e9; padding: 15px 20px; border-radius: 10px; margin: 15px 0; border-left: 4px solid #4caf50; }
        .step-num { display: inline-block; background: #4caf50; color: white; width: 28px; height: 28px; border-radius: 50%; text-align: center; line-height: 28px; margin-right: 12px; font-weight: bold; }
    </style>
</head>
<body>

<div class="hero-section">
    <h1>⚙️ Eros Status System 3.1 - Preset</h1>
    <p class="tagline">Configuration Guide for Chub Venus AI Preset</p>
    <div class="badges">
        <span class="badge new">Version 3.1</span>
        <span class="badge secondary">Automated</span>
    </div>
</div>

<div class="content">

<h2>1. What's New in v3.1</h2>

<div class="success-box">
    <h3>🚀 Key Changes</h3>
    <ul>
        <li><strong>Simplified Setup:</strong> Only 4 user commands needed</li>
        <li><strong>Pre/Post History:</strong> AI auto-scans on first message, evaluates every turn</li>
        <li><strong>Conditional Activation:</strong> Modules activate based on context</li>
        <li><strong>Status Formats:</strong> Full and condensed display options</li>
    </ul>
</div>

<h2>2. Overview</h2>

<p>The <strong>Eros Status Preset</strong> provides the <strong>model parameters</strong> and <strong>instructional context</strong> that work together with the Lorebook to enable automated status tracking.</p>

<div class="info-box">
    <strong>📄 Files:</strong> presets/eros-status-preset.json + presets/PRESET-MANUAL-CONFIG.md<br>
    <strong>🎯 Purpose:</strong> Model configuration + AI instructions<br>
    <strong>⚡ Result:</strong> Automated status tracking with minimal user input!
</div>

<h2>3. Configuration Components</h2>

<h3>3.1 Model Parameters</h3>
<table>
    <thead>
        <tr>
            <th>Parameter</th>
            <th>Value</th>
            <th>Notes</th>
        </tr>
    </thead>
    <tbody>
        <tr><td>Temperature</td><td>0.85</td><td>Balance creativity/coherence</td></tr>
        <tr><td>Repetition Penalty</td><td>1.1</td><td>Light prevention</td></tr>
        <tr><td>Frequency Penalty</td><td>0.3</td><td>Word diversity</td></tr>
        <tr><td>Presence Penalty</td><td>0.8</td><td>Topic variety</td></tr>
        <tr><td>Top P</td><td>1</td><td>Nucleus sampling</td></tr>
        <tr><td>Top K</td><td>50</td><td>Token range</td></tr>
        <tr><td>Max New Tokens</td><td>350</td><td>Response length</td></tr>
        <tr><td>Context Size</td><td>4096</td><td>Memory</td></tr>
    </tbody>
</table>

<h3>3.2 Lorebook Settings</h3>
<table>
    <thead>
        <tr>
            <th>Setting</th>
            <th>Value</th>
            <th>Notes</th>
        </tr>
    </thead>
    <tbody>
        <tr><td>Scan Depth</td><td>9999</td><td>Maximum - catches all triggers</td></tr>
        <tr><td>Token Budget</td><td>3000</td><td>Full content allowed</td></tr>
        <tr><td>Recursive Scanning</td><td>ON</td><td>Entries can trigger other entries</td></tr>
        <tr><td>Match Whole Words</td><td>ON</td><td>Precise matching</td></tr>
    </tbody>
</table>

<h3>3.3 Toggle Settings</h3>
<table>
    <thead>
        <tr>
            <th>Toggle</th>
            <th>Recommended</th>
            <th>Notes</th>
        </tr>
    </thead>
    <tbody>
        <tr><td>Include Names</td><td>ON</td><td>Character names in output</td></tr>
        <tr><td>Ban Emojis</td><td>OFF</td><td>Status display needs emojis</td></tr>
        <tr><td>Text Streaming</td><td>ON</td><td>Better UX</td></tr>
        <tr><td>Use Lorebooks</td><td>ON</td><td>ESSENTIAL</td></tr>
        <tr><td>Use Auto Summarization</td><td>ON</td><td>Long conversation handling</td></tr>
    </tbody>
</table>

<h2>4. Pre History Instructions</h2>

<p><strong>Paste this into Pre History field:</strong></p>

<pre>
### SYSTEM DIRECTIVE ###
CONTENT RATING: NC-21 / ADULT
TONE: Japanese doujin/hentai game style

### AUTOMATION ###
This system automatically:
- Scans character metadata on first message
- Evaluates structure every turn
- Activates modules based on context
- Tracks all values automatically

### OUTPUT FORMAT ###
Character dialogue: "dialogue text..."
Actions: *action description*
Thoughts: *~thoughts~*
Status: See below format

### STATUS DISPLAY ###
Full: ╔═══════════════════╗
      ║ ❤️{aff}% 🔥{ar}% ║
      ╚═══════════════════╝
Condensed: [❤️{aff}% 🔥{ar}%] [📍{location}]
</pre>

<h2>5. Post History Instructions</h2>

<p><strong>Paste this into Post History field:</strong></p>

<pre>
### STATUS FORMAT ###
Use condensed format: [❤️{affection}% 🔥{arousal}% 😫{orgasm_count}x 💦{wetness}] [📍{location}]

### AUTOMATION ###
AI automatically:
- Updates all progression values
- Activates/deactivates modules based on context
- Resolves conflicts
- Generates appropriate status display

### MODULE PRIORITY ###
When multiple active: NTR > Sex > Personified > Body > General

### IMAGE GENERATION ###
Use &lt;IMG&gt; command for AI art prompts
</pre>

<h2>6. How Automation Works</h2>

<h3>6.1 First Message Behavior</h3>
<div class="step">
    <span class="step-num">1</span>
    <strong>New conversation starts</strong> → System detects fresh context
</div>
<div class="step">
    <span class="step-num">2</span>
    <strong>[AUTO_SCAN] triggers</strong> → Scans {{char}} description
</div>
<div class="step">
    <span class="step-num">3</span>
    <strong>Extracts metadata</strong> → gender, age, body, personality
</div>
<div class="step">
    <span class="step-num">4</span>
    <strong>Detects relationship</strong> → married/single from keywords
</div>
<div class="step">
    <span class="step-num">5</span>
    <strong>Sets initial location</strong> → from scene context
</div>
<div class="step">
    <span class="step-num">6</span>
    <strong>Initializes values</strong> → all modules to default state
</div>
<p><em>User sees only the normal character first message - automation is invisible!</em></p>

<h3>6.2 Every Turn Behavior</h3>
<div class="step">
    <span class="step-num">1</span>
    <strong>User/AI message received</strong> → Context available
</div>
<div class="step">
    <span class="step-num">2</span>
    <strong>[PRIORITY] triggers</strong> → Evaluates current state
</div>
<div class="step">
    <span class="step-num">3</span>
    <strong>Activates relevant modules</strong> → based on context signals
</div>
<div class="step">
    <span class="step-num">4</span>
    <strong>Updates values</strong> → based on narrative
</div>
<div class="step">
    <span class="step-num">5</span>
    <strong>Resolves conflicts</strong> → enforces priority rules
</div>
<div class="step">
    <span class="step-num">6</span>
    <strong>Generates status display</strong> → appropriate for context
</div>

<h2>7. Status Display Formats</h2>

<h3>7.1 Full Format</h3>
<pre>╔═══════════════════╗
║ ❤️50% 🔥30%      ║
║ 📍Home           ║
╚═══════════════════╝</pre>

<h3>7.2 Condensed Format</h3>
<pre>[❤️50% 🔥30%] [📍Home]</pre>

<h3>7.3 Extended Format (with more stats)</h3>
<pre>[❤️50% 🔥30% 😫3x 💦80%] [📍Home] [👗Casual] [😺Happy]</pre>

<h2>8. Context Signal → Module Activation</h2>

<table>
    <thead>
        <tr>
            <th>Context Signal</th>
            <th>Auto-Activates</th>
        </tr>
    </thead>
    <tbody>
        <tr><td>"home", "bedroom", "kitchen"</td><td>Location module</td></tr>
        <tr><td>"kiss", "touch", "undress"</td><td>Sex module</td></tr>
        <tr><td>"another man", "cuckold"</td><td>NTR module</td></tr>
        <tr><td>"cat ears", "kemonomimi"</td><td>Species module</td></tr>
        <tr><td>"breed", "impregnate"</td><td>Personified genitalia</td></tr>
        <tr><td>"toy", "vibrator"</td><td>Sex toys</td></tr>
    </tbody>
</table>

<h2>9. Third-Party Character Handling</h2>

<p>When importing characters that already have stats:</p>
<ul>
    <li><strong>Same stat name:</strong> Direct value mapping (Love → 50 = Affection: 50)</li>
    <li><strong>Different stat name:</strong> Formula conversion (Love → Affection = value × 0.6)</li>
    <li><strong>No stats:</strong> Initialize to defaults (Affection: 50, Arousal: 0)</li>
</ul>

<h2>10. Import Instructions</h2>

<div class="step">
    <span class="step-num">1</span>
    <strong>Create/Edit Preset</strong> → In Chub Venus AI, create new preset
</div>
<div class="step">
    <span class="step-num">2</span>
    <strong>Set Model Parameters</strong> → Use table from Section 3.1
</div>
<div class="step">
    <span class="step-num">3</span>
    <strong>Add Pre History</strong> → Paste from Section 4
</div>
<div class="step">
    <span class="step-num">4</span>
    <strong>Add Post History</strong> → Paste from Section 5
</div>
<div class="step">
    <span class="step-num">5</span>
    <strong>Import Lorebook</strong> → lorebook/Eros Status System 3.0.json
</div>
<div class="step">
    <span class="step-num">6</span>
    <strong>Configure Lorebook</strong> → Scan Depth: 9999, Position: Top
</div>
<div class="step">
    <span class="step-num">7</span>
    <strong>Start roleplaying!</strong> → Automation handles everything
</div>

<h2>11. Only 4 User Commands</h2>

<div class="highlight">
    <strong>🎯 Remember:</strong> Users only need these 4 commands. Everything else is automatic!
</div>

<table>
    <thead>
        <tr>
            <th>Command</th>
            <th>When to Use</th>
        </tr>
    </thead>
    <tbody>
        <tr><td><code>&lt;IMG&gt;</code></td><td>Want AI art</td></tr>
        <tr><td><code>&lt;GET status&gt;</td><td>Full status</td></tr>
        <tr><td><code>&lt;GET status:condensed&gt;</td><td>Quick status</td></tr>
        <tr><td><code>&lt;RESET&gt;</td><td>Start fresh</td></tr>
    </tbody>
</table>

<h2>12. Related Documentation</h2>

<ul>
    <li><a href="LOREBOOK-GUIDE.md">LOREBOOK-GUIDE.md</a> - Lorebook structure and entries</li>
    <li><a href="USER-MANUAL.md">USER-MANUAL.md</a> - End-user quick reference</li>
    <li><a href="TUTORIAL.md">TUTORIAL.md</a> - Step-by-step setup</li>
    <li><a href="FAQ.md">FAQ.md</a> - Common questions</li>
</ul>

---

<div class="success-box" style="text-align: center;">
    <strong>⚙️ Eros Status Preset 3.1</strong><br>
    <em>Configure once. Play forever.</em>
</div>

</div>

</body>
</html>