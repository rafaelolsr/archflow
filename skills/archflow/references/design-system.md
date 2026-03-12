# Design System

Colors, typography, and CSS classes for the architecture diagram.
Copy the base CSS block into every generated HTML file.

===================================================================
COLOR PALETTE
===================================================================

  Theme-sensitive colors (change between dark / light mode):

    Variable           Dark          Light
    --bg-body          #080c10       #f4f5f7
    --bg-card          #0d1117       #ffffff
    --bg-storage       #0a0f14       #f0f1f3
    --border           #21262d       #d0d5dd
    --border-subtle    #30363d       #e2e5ea
    --border-banner    #333          #c0c5cc
    --text-primary     #e6edf3       #1a1a2e
    --text-secondary   #c9d1d9       #333344
    --text-muted       #8b949e       #666677
    --text-dim         #4a5568       #8b8b9e
    --shimmer          white         #333
    --shadow-alpha     44            22

  Semantic accent assignments — same in both themes:

    Cyan    #00d4ff   user / input / client layer
    Orange  #ff6b35   orchestrator / coordinator / router
    Purple  #a78bfa   agents / workers / sub-processes
    Yellow  #e8b84b   storage / external services / RAG
    Green   #3fb950   output / persistence / success state
    Amber   #f0883e   LLM / AI inference / model core
    Blue    #58a6ff   app layer / API responses / user-facing
    Red     #f85149   errors / warnings (use sparingly)

===================================================================
THEME TOGGLE
===================================================================

Every generated file includes a toggle button in the top-right corner.
Dark is the default. Clicking the button adds/removes the .light class
on <body>, which flips all CSS variable values. The preference is saved
to localStorage so it persists across page reloads.

  HTML — place immediately after <body>:

    <button class="theme-toggle" onclick="document.body.classList.toggle('light');localStorage.setItem('archflow-theme',document.body.classList.contains('light')?'light':'dark')">◐</button>

  JS — place at the top of the <script> block:

    if (localStorage.getItem('archflow-theme') === 'light') document.body.classList.add('light');

===================================================================
TYPOGRAPHY
===================================================================

  Font stack    → 'JetBrains Mono', 'Fira Code', monospace
  Title main    → 22px, weight 700, var(--text-primary), letter-spacing -0.5px
  Title sub     → 10px, weight 400, letter-spacing 4px, var(--text-dim), UPPERCASE
  Section label → 9px, letter-spacing 3px, UPPERCASE, accent color
  Card label    → 10px, weight 700, letter-spacing 1px, accent color
  Card sublabel → 9px, color var(--text-dim), line-height 1.4
  Card body     → 9px, color var(--text-muted), line-height 1.7
  Phase banner  → 11px, accent color, transitions on color/border change

===================================================================
BASE CSS — COPY INTO EVERY GENERATED FILE
===================================================================

<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }

  /* THEME VARIABLES — dark default */
  :root {
    --bg-body: #080c10;
    --bg-card: #0d1117;
    --bg-storage: #0a0f14;
    --border: #21262d;
    --border-subtle: #30363d;
    --border-banner: #333;
    --text-primary: #e6edf3;
    --text-secondary: #c9d1d9;
    --text-muted: #8b949e;
    --text-dim: #4a5568;
    --shimmer: white;
    --shadow-alpha: 44;
  }
  body.light {
    --bg-body: #f4f5f7;
    --bg-card: #ffffff;
    --bg-storage: #f0f1f3;
    --border: #d0d5dd;
    --border-subtle: #e2e5ea;
    --border-banner: #c0c5cc;
    --text-primary: #1a1a2e;
    --text-secondary: #333344;
    --text-muted: #666677;
    --text-dim: #8b8b9e;
    --shimmer: #333;
    --shadow-alpha: 22;
  }

  body {
    min-height: 100vh;
    background: var(--bg-body);
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px 16px;
    color: var(--text-secondary);
  }

  /* THEME TOGGLE */
  .theme-toggle {
    position: fixed; top: 16px; right: 16px; z-index: 100;
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 20px; padding: 6px 12px; cursor: pointer;
    font-size: 14px; color: var(--text-muted);
    transition: border-color 0.3s, background 0.3s;
  }
  .theme-toggle:hover { border-color: var(--text-muted); }

  /* TITLE */
  .title-sub {
    font-size: 10px; letter-spacing: 4px; color: var(--text-dim);
    margin-bottom: 6px; text-align: center; text-transform: uppercase;
  }
  .title-main {
    font-size: 22px; font-weight: 700; color: var(--text-primary);
    letter-spacing: -0.5px; text-align: center; margin-bottom: 28px;
  }

  /* PHASE BANNER */
  .phase-banner {
    background: var(--bg-card);
    border: 1px solid var(--border-banner);
    border-radius: 6px;
    padding: 10px 24px;
    margin-bottom: 32px;
    font-size: 11px;
    min-width: 400px;
    max-width: 700px;
    text-align: center;
    transition: color 0.4s, border-color 0.4s;
  }

  /* COMPONENT CARD */
  .component {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px;
    text-align: center;
    transition: border-color 0.4s, box-shadow 0.4s;
    min-width: 120px;
  }
  .component-icon  { font-size: 22px; margin-bottom: 6px; }
  .component-label { font-size: 10px; font-weight: 700;
                     letter-spacing: 1px; margin-bottom: 3px; }
  .component-sub   { font-size: 8px; color: var(--text-dim);
                     margin-bottom: 6px; line-height: 1.4; }
  .component-body  { font-size: 8px; color: var(--text-muted); line-height: 1.7; }

  /* AGENT CARD (lighter variant for parallel workers) */
  .agent-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 12px;
    text-align: center;
    flex: 1;
    transition: border-color 0.4s, box-shadow 0.4s;
  }

  /* ARROW */
  .arrow-col  { flex: 1; padding: 0 8px;
                display: flex; flex-direction: column; gap: 8px; }
  .arrow-wrap { display: flex; flex-direction: column; }
  .arrow-line {
    height: 2px; background: var(--border);
    border-radius: 1px; position: relative; overflow: hidden;
    transition: background 0.4s;
  }
  .arrow-line .shimmer {
    display: none; position: absolute; top: 0; left: -20%;
    width: 20%; height: 100%;
    background: var(--shimmer); opacity: 0.85;
    animation: slide 0.7s linear infinite;
  }
  .arrow-line.active .shimmer { display: block; }
  .arrow-lbl       { text-align: center; font-size: 9px;
                     color: var(--text-dim); margin-top: 3px; }
  .arrow-lbl.above { margin-top: 0; margin-bottom: 3px; }

  /* VERTICAL CONNECTOR */
  .vert-line {
    width: 2px; background: var(--border);
    transition: background 0.4s; margin: 0 auto;
  }

  /* STORAGE / EXTERNAL SERVICES ROW */
  .storage-pipeline {
    display: flex; align-items: center; gap: 0;
    background: var(--bg-storage);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 14px 12px;
    position: relative;
  }
  .storage-title {
    position: absolute; top: -10px; left: 16px;
    background: var(--bg-body); padding: 0 8px;
    font-size: 9px; letter-spacing: 3px;
    color: #e8b84b; text-transform: uppercase;
  }
  .storage-item {
    flex: 1; background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 8px; padding: 10px;
    text-align: center; min-width: 80px;
    transition: border-color 0.4s, box-shadow 0.4s;
  }
  .storage-sep { width: 16px; text-align: center;
                 font-size: 10px; color: var(--border); flex-shrink: 0; }

  /* INSIGHTS ROW */
  .insights {
    margin-top: 32px; display: flex; gap: 10px;
    flex-wrap: wrap; justify-content: center;
  }
  .insight-card {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 8px; padding: 10px 16px;
    text-align: center; min-width: 150px;
  }
  .insight-label { font-size: 9px; letter-spacing: 2px;
                   margin-bottom: 3px; text-transform: uppercase; }
  .insight-value { font-size: 10px; color: var(--text-muted); }

  /* KEYFRAMES */
  @keyframes slide { from { left: -20%; } to { left: 120%; } }
  @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
</style>

===================================================================
COMPONENT ICON GUIDE
===================================================================

  👤  User / client / human
  🌐  API / HTTP endpoint / gateway
  ⚙️  Orchestrator / engine / coordinator
  🤖  Agent / bot / AI worker
  🔍  Search / query / embed / lookup
  🗄️  Database / storage / warehouse
  📄  Document / file / chunk / record
  🧩  Augmentation / injection / compose
  📊  Analytics / dashboard / metrics
  🔄  Pipeline / loop / cycle / stream
  📡  Event / message / queue / pub-sub
  🏗️  Builder / generator / factory
  🔐  Auth / security / compliance
  📦  Package / artifact / output
  🧠  LLM / embedding / AI inference
  💾  Persistence / cache / write
  📬  Notification / webhook / emit
  🔀  Router / dispatcher / load balancer
  📥  Ingest / intake / collector
  🪄  Transform / enrich / process
