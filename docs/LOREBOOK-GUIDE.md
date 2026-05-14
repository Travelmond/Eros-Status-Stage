<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eros Status System 3.1 - Lorebook Guide</title>
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
        .reference-link { color: #e94560; text-decoration: none; font-weight: 500; }
        .reference-link:hover { text-decoration: underline; }
        .quick-start { background: #f8f9fa; padding: 25px; border-radius: 12px; border-left: 4px solid #10b981; margin: 25px 0; }
        .highlight { background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 15px 0; }
    </style>
</head>
<body>

<div class="hero-section">
    <h1>🎭 Eros Status System 3.1 - Lorebook</h1>
    <p class="tagline">Automated Character Status Tracking for 18+ Roleplaying</p>
    <div class="badges">
        <span class="badge new">Version 3.1</span>
        <span class="badge secondary">Chub Venus AI</span>
        <span class="badge secondary">Automated</span>
    </div>
</div>

<div class="content">

<h2>1. What's New in v3.1 (Enhanced)</h2>

<div class="success-box">
    <h3>🚀 Major Improvements</h3>
    <ul>
        <li><strong>Auto-Scan:</strong> Automatically detects character metadata on first message</li>
        <li><strong>Auto-Evaluate:</strong> Structure evaluation runs every turn for conflict resolution</li>
        <li><strong>Auto-Activate:</strong> AI automatically activates/deactivates modules based on context</li>
        <li><strong>Simplified Commands:</strong> Only 4 commands for users - AI handles everything else</li>
        <li><strong>Third-Party Support:</strong> Auto-maps existing character stats to our system</li>
    </ul>
</div>

<div class="success-box" style="background: linear-gradient(135deg, #ff6b81 0%, #ff4757 100%);">
    <h3>🌟 ENHANCED v3.1 Content (from v1)</h3>
    <ul>
        <li><strong>Color Schemes:</strong> HTML span tags for character names, locations, items, mood</li>
        <li><strong>Progress Bars:</strong> Multiple formats (Unicode, emoji, box)</li>
        <li><strong>Detailed BODY:</strong> Clothing by area, breast states, skin condition, health, body odor</li>
        <li><strong>Detailed SEX:</strong> Positions, pace, actions, orgasm states, cum details</li>
        <li><strong>Enhanced NPC:</strong> Importance levels (Main/Supporting/Minor), sub-lorebook system</li>
        <li><strong>More Emojis:</strong> Rich emoji sets for every mood, state, action</li>
        <li><strong>Variable System:</strong> Format for dynamic values like &lt;variable:type=default&gt;</li>
    </ul>
</div>

<h2>2. Overview</h2>

<p>The <strong>Eros Status System 3.1 Lorebook</strong> is a comprehensive JSON-based system designed for <strong>Chub Venus AI</strong> that provides <strong>fully automated</strong> character status tracking.</p>

<div class="info-box">
    <strong>📦 File:</strong> <code>lorebook/Eros Status System 3.0.json</code><br>
    <strong>🎯 Purpose:</strong> Data structure with 18 automated entries<br>
    <strong>✨ Key Feature:</strong> AI handles most commands automatically!
</div>

<h2>3. How Automation Works</h2>

<h3>3.1 First Message (Metadata Scanner)</h3>
<p>When a <strong>new conversation</strong> starts, the system automatically:</p>
<ul>
    <li>Scans {{char}} description for gender, age, body type, personality</li>
    <li>Detects relationship keywords ("husband", "wife", "married")</li>
    <li>Identifies location from scene context</li>
    <li>Maps third-party stats (if character already has stats like "Love: 50%")</li>
    <li>Initializes all module variables</li>
</ul>
<p><em>This happens automatically - invisible to the user!</em></p>

<h3>3.2 Every Turn (Structure Evaluation)</h3>
<p>On <strong>every subsequent message</strong>, the system automatically:</p>
<ul>
    <li>Evaluates context to determine which modules should be active</li>
    <li>Enforces priority order: NTR > Sex > Personified > Body > General</li>
    <li>Detects and resolves conflicts</li>
    <li>Updates all progression values based on narrative</li>
    <li>Generates appropriate status display</li>
</ul>

<h3>3.3 Module Auto-Activation</h3>
<p>AI automatically activates modules based on context signals:</p>

<table>
    <thead>
        <tr>
            <th>Context Signal</th>
            <th>Auto-Activates</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Room/place keywords</td>
            <td>Location module</td>
        </tr>
        <tr>
            <td>Touching, kissing, undressing</td>
            <td>Sex module</td>
        </tr>
        <tr>
            <td>"another man", "cuckold"</td>
            <td>NTR module</td>
        </tr>
        <tr>
            <td>"cat ears", "kemonomimi"</td>
            <td>Species module</td>
        </tr>
        <tr>
            <td>Breeding, impregnation</td>
            <td>Personified genitalia</td>
        </tr>
    </tbody>
</table>

<h2>4. User Commands (Only 4!)</h2>

<div class="highlight">
    <strong>🎯 Important:</strong> Only these 4 commands need to be entered by users. AI handles everything else automatically!
</div>

<table>
    <thead>
        <tr>
            <th>Command</th>
            <th>Purpose</th>
            <th>When to Use</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>&lt;IMG&gt;</code></td>
            <td>Generate image prompt for AI art tools</td>
            <td>User wants to create AI art</td>
        </tr>
        <tr>
            <td><code>&lt;GET status&gt;</code></td>
            <td>Full terminal status display</td>
            <td>User explicitly requests</td>
        </tr>
        <tr>
            <td><code>&lt;GET status:condensed&gt;</code></td>
            <td>Quick status view</td>
            <td>Token saving</td>
        </tr>
        <tr>
            <td><code>&lt;RESET&gt;</code></td>
            <td>Full reset (values + metadata)</td>
            <td>Start fresh</td>
        </tr>
    </tbody>
</table>

<p><strong>ALL OTHER COMMANDS:</strong> AI handles automatically based on narrative context!</p>

<h2>5. Modules (18 Entries)</h2>

<table>
    <thead>
        <tr>
            <th>#</th>
            <th>Module</th>
            <th>Automation</th>
        </tr>
    </thead>
    <tbody>
        <tr><td>1</td><td>[AUTO_SCAN] Metadata Scanner</td><td>Runs once per new conversation</td></tr>
        <tr><td>2</td><td>[PRIORITY] Structure Evaluation</td><td>Runs every turn</td></tr>
        <tr><td>3</td><td>[STATUS] Terminal Display</td><td>Auto-display</td></tr>
        <tr><td>4</td><td>[PROGRESSION] Character Values</td><td>Auto-update</td></tr>
        <tr><td>5</td><td>[RELATIONSHIPS] Relationships</td><td>Auto-detect</td></tr>
        <tr><td>6</td><td>[LOCATION] Location System</td><td>Auto-detect</td></tr>
        <tr><td>7</td><td>[INVENTORY] Objects & Items</td><td>Auto-track</td></tr>
        <tr><td>8</td><td>[NPCS] NPC Management</td><td>Auto-track</td></tr>
        <tr><td>9</td><td>[BODY] Body State</td><td>Auto-track</td></tr>
        <tr><td>10</td><td>[GENITALIA] Genitalia & Reproduction</td><td>Auto-activate in sexual context</td></tr>
        <tr><td>11</td><td>[SEX] Sex Module</td><td>Auto-activate</td></tr>
        <tr><td>12</td><td>[NTR] NTR Module</td><td>Auto-activate (disabled by default)</td></tr>
        <tr><td>13</td><td>[PERSONIFIED] Personified Genitalia</td><td>Auto-activate in breeding context</td></tr>
        <tr><td>14</td><td>[SPECIES] Species & Kemonomimi</td><td>Auto-activate for non-human</td></tr>
        <tr><td>15</td><td>[COMMANDS] User Commands</td><td>Reference</td></tr>
        <tr><td>16</td><td>[MEMORY] Memory & History</td><td>Auto-track</td></tr>
        <tr><td>17</td><td>[IMAGE] Image Generation</td><td>User command</td></tr>
        <tr><td>18</td><td>[DEFAULT] Default Values</td><td>Reference</td></tr>
    </tbody>
</table>

<h2>6. Third-Party Character Handling</h2>

<p>For characters not originally designed for our system (like "Hanako (V2"):</p>

<ul>
    <li>On first message: System auto-scans existing stats</li>
    <li>Same stat names: Maps directly (Love → Affection: 50 = 50)</li>
    <li>Different names: Applies formula (Love → Affection = value × 0.6)</li>
    <li>Overrides character description with our format</li>
</ul>

<h2>7. Import Instructions</h2>

<div class="quick-start">
    <h3>🚀 Quick Start Guide</h3>
    <ol>
        <li><strong>Open Chub Venus AI</strong> and go to Lorebooks section</li>
        <li><strong>Create new Lorebook</strong> named "Eros Status System 3.1"</li>
        <li><strong>Import the JSON file</strong> from <code>lorebook/Eros Status System 3.0.json</code></li>
        <li><strong>Configure settings:</strong>
            <ul>
                <li>Scan Depth: <code>9999</code></li>
                <li>Token Budget: <code>3000</code></li>
                <li>Position: <strong>Top of list</strong></li>
            </ul>
        </li>
        <li><strong>Start roleplaying!</strong> - Automation handles everything</li>
    </ol>
</div>

<h2>8. Reset Command</h2>

<p>The <code>&lt;RESET&gt;</code> command now resets <strong>everything</strong>:</p>
<ul>
    <li>All progression values to defaults</li>
    <li>All modules to disabled state</li>
    <li>Location to Home</li>
    <li><strong>Auto-scanned metadata (clears for re-scan on next message)</strong></li>
    <li>Memories cleared</li>

</ul>

<h2>9. Related Documentation</h2>

<table>
    <tr>
        <td><a href="PRESET-GUIDE.md" class="reference-link">PRESET-GUIDE.md</a></td>
        <td>Preset configuration guide</td>
    </tr>
    <tr>
        <td><a href="USER-MANUAL.md" class="reference-link">USER-MANUAL.md</a></td>
        <td>End-user guide</td>
    </tr>
    <tr>
        <td><a href="TUTORIAL.md" class="reference-link">TUTORIAL.md</a></td>
        <td>Step-by-step implementation</td>
    </tr>
    <tr>
        <td><a href="FAQ.md" class="reference-link">FAQ.md</a></td>
        <td>Frequently asked questions</td>
    </tr>
</table>

---

<div class="success-box" style="text-align: center;">
    <strong>🎭 Eros Status System 3.1</strong><br>
    <em>Automated. Simplified. Powerful.</em>
</div>

</div>

</body>
</html>