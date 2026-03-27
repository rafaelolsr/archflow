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

===================================================================
REPORT-MODE EXTENSIONS
===================================================================

The sections below apply ONLY to report and slide outputs.
Diagram-only mode uses only the base CSS above.
Report-mode adds a body font, richer card components, data tables,
and entrance animations alongside the existing phase engine.

===================================================================
GOOGLE FONTS — REPORT / SLIDE MODE ONLY
===================================================================

Reports and slides load a body font via Google Fonts CDN.
Diagram-only mode stays self-contained (no external fonts).

  HTML — place in <head>:

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">

  CSS — add to :root:

    --font-body: 'IBM Plex Sans', system-ui, sans-serif;
    --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  Font pairing options (rotate across projects for variety):

    Pairing               Body Font               Google import slug
    Technical (default)   IBM Plex Sans            IBM+Plex+Sans:wght@400;500;600;700
    Developer-friendly    DM Sans                  DM+Sans:wght@400;500;600;700
    Modern geometric      Outfit                   Outfit:wght@400;500;600;700
    Bold characterful     Bricolage Grotesque      Bricolage+Grotesque:wght@400;500;600;700

  JetBrains Mono is ALWAYS the mono font. Never substitute it.

===================================================================
REPORT BODY OVERRIDE
===================================================================

In report mode, the body needs different layout than the centered
diagram mode. Add this CSS AFTER the base body rule:

  body.report-mode {
    display: block;
    align-items: initial;
    justify-content: initial;
    padding: 0;
    font-family: var(--font-body);
    line-height: 1.6;
    overflow-wrap: break-word;
  }

  body.report-mode .report-wrap {
    max-width: 1100px;
    margin: 0 auto;
    padding: 48px 24px;
  }

Background atmosphere — add subtle radial glow on report pages:

  body.report-mode {
    background-image: radial-gradient(
      ellipse at 50% 0%,
      rgba(0, 212, 255, 0.06) 0%,
      transparent 60%
    );
  }

===================================================================
REPORT SECTION LABELS
===================================================================

  .af-section {
    margin-bottom: 48px;
    animation: fadeUp 0.4s ease-out both;
    animation-delay: calc(var(--i, 0) * 0.08s);
  }

  .af-section-label {
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .af-section-label::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
  }

===================================================================
REPORT CARD SYSTEM — .af-card
===================================================================

Cards for report sections. NOT used in the animated diagram area
(which keeps .component / .agent-card / .storage-item).

Base card:

  .af-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 20px 24px;
    position: relative;
  }

Depth tiers — vary card prominence to signal importance:

  /* Elevated: KPIs, key metrics, important findings */
  .af-card--elevated {
    background: var(--bg-card);
    box-shadow: 0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
  }

  /* Recessed: secondary content, code blocks, detail panels */
  .af-card--recessed {
    background: color-mix(in srgb, var(--bg-body) 70%, var(--bg-card) 30%);
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.06);
  }

  /* Hero: executive summary, focal element — demands attention */
  .af-card--hero {
    background: color-mix(in srgb, var(--bg-card) 92%, #00d4ff 8%);
    box-shadow: 0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04);
    border-color: color-mix(in srgb, var(--border) 50%, #00d4ff 50%);
  }

  /* Glass: special-occasion overlay (use sparingly) */
  .af-card--glass {
    background: color-mix(in srgb, var(--bg-card) 60%, transparent 40%);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-color: rgba(255,255,255,0.1);
  }

  /* Left accent stripe by semantic color */
  .af-card--accent-cyan   { border-left: 3px solid #00d4ff; }
  .af-card--accent-orange { border-left: 3px solid #ff6b35; }
  .af-card--accent-purple { border-left: 3px solid #a78bfa; }
  .af-card--accent-yellow { border-left: 3px solid #e8b84b; }
  .af-card--accent-green  { border-left: 3px solid #3fb950; }

===================================================================
KPI / METRIC CARDS — .af-kpi
===================================================================

  .af-kpi-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
  }

  .af-kpi {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    animation: fadeScale 0.35s ease-out both;
    animation-delay: calc(var(--i, 0) * 0.06s);
  }

  .af-kpi__value {
    font-size: 36px;
    font-weight: 700;
    letter-spacing: -1px;
    line-height: 1.1;
    font-variant-numeric: tabular-nums;
    color: var(--text-primary);
  }

  .af-kpi__label {
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--text-dim);
    margin-top: 6px;
  }

  .af-kpi__detail {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 4px;
  }

===================================================================
DATA TABLE — .af-data-table
===================================================================

  .af-table-wrap {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 32px;
  }

  .af-table-scroll {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .af-data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    line-height: 1.5;
  }

  .af-data-table th {
    background: var(--bg-storage);
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-dim);
    text-align: left;
    padding: 12px 16px;
    border-bottom: 2px solid var(--border);
    white-space: nowrap;
  }

  .af-data-table td {
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    vertical-align: top;
    color: var(--text-secondary);
  }

  .af-data-table tbody tr:nth-child(even) {
    background: rgba(0, 212, 255, 0.03);
  }

  .af-data-table tbody tr:hover {
    background: rgba(0, 212, 255, 0.06);
    transition: background 0.15s ease;
  }

  .af-data-table tbody tr:last-child td { border-bottom: none; }

  .af-data-table code {
    font-family: var(--font-mono);
    font-size: 11px;
    background: rgba(0, 212, 255, 0.08);
    color: #00d4ff;
    padding: 1px 5px;
    border-radius: 3px;
  }

===================================================================
CALLOUT BOXES — .af-callout
===================================================================

  .af-callout {
    padding: 16px 20px;
    border-radius: 8px;
    border-left: 4px solid var(--callout-color);
    background: color-mix(in srgb, var(--callout-color) 8%, var(--bg-card) 92%);
    margin-bottom: 24px;
    font-size: 13px;
    line-height: 1.6;
  }

  .af-callout--info    { --callout-color: #00d4ff; }
  .af-callout--warning { --callout-color: #f0883e; }
  .af-callout--success { --callout-color: #3fb950; }
  .af-callout--error   { --callout-color: #f85149; }

  .af-callout__title {
    font-family: var(--font-mono);
    font-weight: 600;
    margin-bottom: 6px;
    color: var(--callout-color);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

===================================================================
CODE BLOCKS — .af-code-block
===================================================================

  .af-code-file {
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 16px;
  }

  .af-code-file__header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: var(--bg-storage);
    border-bottom: 1px solid var(--border);
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text-dim);
  }

  .af-code-file__body {
    font-family: var(--font-mono);
    font-size: 13px;
    line-height: 1.5;
    padding: 16px;
    background: var(--bg-card);
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 400px;
    overflow: auto;
    color: var(--text-secondary);
  }

===================================================================
DIRECTORY TREE — .af-dir-tree
===================================================================

  .af-dir-tree {
    font-family: var(--font-mono);
    font-size: 13px;
    line-height: 1.7;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px 20px;
    overflow-x: auto;
    white-space: pre;
    color: var(--text-secondary);
  }

  .af-dir-tree .hl { color: #00d4ff; font-weight: 600; }
  .af-dir-tree .ann { color: var(--text-dim); font-size: 11px; font-style: italic; }

===================================================================
TAGS / BADGES — .af-tag
===================================================================

  .af-tag {
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 500;
    padding: 2px 7px;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .af-tag--cyan    { background: rgba(0,212,255,0.12);  color: #00d4ff; }
  .af-tag--orange  { background: rgba(255,107,53,0.12); color: #ff6b35; }
  .af-tag--purple  { background: rgba(167,139,250,0.12);color: #a78bfa; }
  .af-tag--yellow  { background: rgba(232,184,75,0.12); color: #e8b84b; }
  .af-tag--green   { background: rgba(63,185,80,0.12);  color: #3fb950; }

===================================================================
STATUS INDICATORS — .af-status
===================================================================

  .af-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 500;
    padding: 3px 10px;
    border-radius: 6px;
    white-space: nowrap;
  }

  .af-status--match   { background: rgba(63,185,80,0.1);  color: #3fb950; }
  .af-status--gap     { background: rgba(248,81,73,0.1);  color: #f85149; }
  .af-status--warn    { background: rgba(240,136,62,0.1); color: #f0883e; }
  .af-status--info    { background: rgba(0,212,255,0.1);  color: #00d4ff; }

===================================================================
COLLAPSIBLE SECTIONS — .af-collapsible
===================================================================

  details.af-collapsible {
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 16px;
  }

  details.af-collapsible summary {
    padding: 14px 20px;
    background: var(--bg-card);
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    list-style: none;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-primary);
    transition: background 0.15s ease;
  }

  details.af-collapsible summary:hover {
    background: var(--bg-storage);
  }

  details.af-collapsible summary::-webkit-details-marker { display: none; }

  details.af-collapsible summary::before {
    content: '▸';
    font-size: 11px;
    color: var(--text-dim);
    transition: transform 0.15s ease;
  }

  details.af-collapsible[open] summary::before {
    transform: rotate(90deg);
  }

  details.af-collapsible .af-collapsible__body {
    padding: 16px 20px;
    border-top: 1px solid var(--border);
    font-size: 13px;
    line-height: 1.6;
    color: var(--text-secondary);
  }

===================================================================
ENTRANCE ANIMATIONS — REPORT SECTIONS
===================================================================

These fire once on page load (staggered via --i).
They coexist with the phase engine, which runs in the
animated diagram section only.

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeScale {
    from { opacity: 0; transform: scale(0.92); }
    to   { opacity: 1; transform: scale(1); }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

===================================================================
RESPONSIVE BREAKPOINT
===================================================================

  @media (max-width: 768px) {
    body.report-mode .report-wrap { padding: 24px 16px; }
    .af-kpi-row { grid-template-columns: 1fr 1fr; }
    .af-data-table { font-size: 12px; }
    .af-data-table th,
    .af-data-table td { padding: 10px 12px; }
  }

===================================================================
CSS PIPELINE — DATA FLOW VISUALIZATION
===================================================================

When a simple CSS pipeline is preferred over Mermaid (e.g., for
linear flows with ≤6 steps), use this pattern:

  .af-pipeline {
    display: flex;
    align-items: stretch;
    gap: 0;
    overflow-x: auto;
    padding-bottom: 8px;
    margin-bottom: 32px;
  }

  .af-pipeline__step {
    flex: 1;
    min-width: 120px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 14px 12px;
    text-align: center;
  }

  .af-pipeline__step-label {
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 4px;
  }

  .af-pipeline__step-detail {
    font-size: 12px;
    color: var(--text-muted);
    line-height: 1.4;
  }

  .af-pipeline__arrow {
    display: flex;
    align-items: center;
    padding: 0 6px;
    color: var(--border);
    font-size: 18px;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    .af-pipeline { flex-direction: column; gap: 8px; }
    .af-pipeline__arrow { display: none; }
  }

===================================================================
MERMAID CONTAINER — OPTIONAL CDN
===================================================================

When the report includes a Mermaid diagram (sequence, ER, state),
add these classes. Only include Mermaid CDN when this section
is present in the report.

  CDN import (place at end of <body>, before closing </body>):

    <script type="module">
      import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
      const isDark = !document.body.classList.contains('light');
      mermaid.initialize({
        startOnLoad: true,
        theme: 'base',
        themeVariables: {
          primaryColor: isDark ? '#0d2847' : '#e0f2fe',
          primaryBorderColor: isDark ? '#00d4ff' : '#0891b2',
          primaryTextColor: isDark ? '#e6edf3' : '#1a1a2e',
          lineColor: isDark ? '#4a5568' : '#94a3b8',
          fontSize: '16px',
          fontFamily: 'var(--font-body)',
        }
      });
    </script>

  CSS container:

    .af-mermaid-wrap {
      position: relative;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 32px 24px;
      overflow: auto;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 300px;
      margin-bottom: 32px;
    }

    .af-mermaid-wrap .mermaid {
      font-family: var(--font-body);
    }

  Never use .node as a CSS class — Mermaid uses it internally.
