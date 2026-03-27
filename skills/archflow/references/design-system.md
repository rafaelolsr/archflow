# Design System

CSS patterns, typography, and visual principles for archflow outputs.
This is a patterns library — adapt and compose freely per project.
Do NOT copy-paste rigidly. Design each report uniquely.

===================================================================
DESIGN PHILOSOPHY
===================================================================

Every archflow output should feel intentionally designed, not
template-stamped. Before writing CSS:

  1. THINK about the project's character (5 seconds)
  2. Pick a font pairing that matches
  3. Pick a color palette / aesthetic direction
  4. Pick a background atmosphere

Forbidden: generic Inter + purple gradients, uniform card styling,
emoji icons in headers, gradient text on headings, animated glowing
shadows, cyan-magenta-pink neon combos. If the swap test makes your
design indistinguishable from a generic template, redesign it.

===================================================================
THEME SYSTEM — DARK / LIGHT TOGGLE
===================================================================

Every generated file includes a toggle button. Dark is the default.
The .light class on <body> flips all CSS variable values.
Preference persists via localStorage.

  HTML — place immediately after <body>:

    <button class="theme-toggle" onclick="document.body.classList.toggle('light');localStorage.setItem('archflow-theme',document.body.classList.contains('light')?'light':'dark')">◐</button>

  JS — place at the top of the <script> block:

    if (localStorage.getItem('archflow-theme') === 'light') document.body.classList.add('light');

  CSS pattern for theme variables:

    :root {
      --bg: #0e1014;
      --bg2: #141720;
      --surface: #1e2330;
      --surface2: #252b3a;
      --border: #2a3045;
      --border2: #384054;
      --text: #e2e8f4;
      --text-dim: #6b7591;
      --text-muted: #9aa5bd;
      --accent: [primary accent from chosen palette];
      --accent2: [secondary accent];
      --font-body: [chosen body font];
      --font-mono: [chosen mono font];
    }
    body.light {
      --bg: #f8f9fa;
      --bg2: #f0f1f5;
      --surface: #ffffff;
      --surface2: #f5f6f9;
      --border: rgba(0,0,0,0.08);
      --border2: rgba(0,0,0,0.15);
      --text: #1a1a2e;
      --text-dim: #6b7280;
      --text-muted: #9aa5bd;
    }

  Accent colors stay the same in both themes — they are bright
  enough to work on both dark and light backgrounds.

===================================================================
TYPOGRAPHY
===================================================================

Always load fonts via Google Fonts CDN:

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=[Body]+[Mono]&display=swap" rel="stylesheet">

Font pairings — pick one per project, rotate across projects:

  Body Font              Mono Font           Feel           Best For
  DM Sans                Fira Code           Friendly       AI/ML, agents
  Instrument Serif       JetBrains Mono      Editorial      Plan reviews, docs
  IBM Plex Sans          IBM Plex Mono       Reliable       Architecture, APIs
  Bricolage Grotesque    Fragment Mono       Bold           Data tables, dashboards
  Plus Jakarta Sans      Azeret Mono         Approachable   Status reports
  Outfit                 Space Mono          Geometric      Flowcharts, pipelines
  Sora                   IBM Plex Mono       Precise        Schemas, databases
  Fraunces               Source Code Pro     Warm           Project recaps
  Geist                  Geist Mono          Sharp          Modern APIs
  Red Hat Display        Red Hat Mono        Cohesive       System overviews
  Libre Franklin         Inconsolata         Classic        Data-dense tables

  ANTI-PATTERNS — never use as body font:
    Inter, Roboto, Arial, Helvetica, system-ui alone.
    These signal "AI-generated default."

Typography scale (use clamp() for responsive sizing):

  Element              Size                          Weight
  Page title           clamp(28px, 5vw, 48px)        700
  Section heading      clamp(18px, 3vw, 28px)        600
  Body text            clamp(14px, 1.5vw, 16px)      400
  Section label        10-11px (mono, uppercase)      600-700
  Card label           9-10px (mono, uppercase)       700
  Code / mono text     12-13px                        400

===================================================================
COLOR PALETTES — NAMED AESTHETICS
===================================================================

Pick a palette aesthetic per project. Don't use raw hex codes
blindly — choose a named direction and derive colors from it.

  BLUEPRINT (cool, technical — APIs, backend systems):
    --accent: #0891b2   (teal)
    --accent2: #22d3ee  (cyan)
    Warm: #d97706, Cool: #059669
    Surface: cool grays (#161b22 → #1c2333)

  TERMINAL MONO (code-first, developer tools):
    --accent: #22d87a   (neon green)
    --accent2: #00f5d4  (teal)
    Warn: #f5a623, Danger: #f85149
    Surface: deep charcoal (#0e1014 → #141720)

  WARM SIGNAL (editorial, data platforms):
    --accent: #14b8a6   (teal)
    --accent2: #f59e0b  (amber)
    Warm: #c2410c, Cool: #65a30d
    Surface: warm darks (#120f0e → #1a1614)

  NORDIC (calm, enterprise, cloud platforms):
    --accent: #88c0d0   (ice blue)
    --accent2: #a3be8c  (frost green)
    Warm: #ebcb8b, Cool: #81a1c1
    Surface: slate (#2e3440 → #3b4252)

  MIDNIGHT EDITORIAL (premium, executive summaries):
    --accent: #d4af37   (warm gold)
    --accent2: #c0a060  (muted gold)
    Surface: deep navy (#0a0e1a → #111827)

===================================================================
BACKGROUND ATMOSPHERE
===================================================================

Flat backgrounds feel dead. Add subtle depth:

  Radial glow (default — works with most palettes):
    background-image: radial-gradient(
      ellipse at 50% 0%, rgba(accent, 0.06) 0%, transparent 60%
    );

  Multi-glow (richer depth, 2-3 positioned radials):
    background-image:
      radial-gradient(ellipse 60% 50% at 75% 50%, rgba(accent, 0.06) 0%, transparent 60%),
      radial-gradient(ellipse 40% 40% at 20% 80%, rgba(accent2, 0.04) 0%, transparent 50%);

  Dot grid (minimal, enterprise):
    background-image: radial-gradient(circle, var(--border) 1px, transparent 1px);
    background-size: 24px 24px;

  SVG grid decoration (Terminal Mono aesthetic):
    <svg width="100%" height="100%">
      <defs>
        <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="var(--accent)" stroke-width="0.4"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)"/>
    </svg>

===================================================================
CARD COMPONENTS
===================================================================

The fundamental building block. Adapt per report — don't use
a single rigid .af-card class for everything.

  Base card:

    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 18px 20px;
      transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
    }
    .card:hover {
      border-color: var(--border2);
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      transform: translateY(-2px);
    }

  Depth tiers (vary within each report):

    /* Elevated — KPIs, key metrics, hero findings */
    .card--raised {
      background: var(--surface2);
      border-color: var(--border2);
    }

    /* Hero — executive summary, focal element */
    .card--hero {
      background: linear-gradient(135deg, var(--surface2) 0%, var(--surface) 100%);
      border-left: 3px solid var(--accent);
      padding: 28px 32px;
    }

    /* Recessed — secondary content, code blocks */
    .card--recessed {
      background: var(--bg2);
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.06);
    }

  Colored accent borders (use semantic colors):

    .card--green  { border-left: 3px solid var(--accent); }
    .card--red    { border-left: 3px solid #f85149; }
    .card--amber  { border-left: 3px solid #f5a623; }
    .card--blue   { border-left: 3px solid #58a6ff; }
    .card--purple { border-left: 3px solid #c084fc; }

===================================================================
KPI / METRIC CARDS
===================================================================

  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
  }

  .kpi-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px;
    transition: transform 0.2s, border-color 0.2s;
  }
  .kpi-card:hover { transform: translateY(-2px); border-color: var(--border2); }

  .kpi-card__val {
    font-family: var(--font-mono);
    font-size: clamp(22px, 3vw, 34px);
    font-weight: 700; letter-spacing: -1px; line-height: 1;
  }

  .kpi-card__lbl {
    font-family: var(--font-mono);
    font-size: 9px; letter-spacing: 2px;
    text-transform: uppercase; color: var(--text-dim);
    margin-top: 6px;
  }

===================================================================
DATA TABLES
===================================================================

Use real <table> elements for tabular data. Wrap in scrollable
container for wide tables.

  .table-wrap {
    overflow-x: auto;
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    line-height: 1.5;
  }

  .data-table th {
    background: var(--bg2);
    font-family: var(--font-mono);
    font-size: 9px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase;
    color: var(--text-dim);
    text-align: left;
    padding: 10px 14px;
    border-bottom: 2px solid var(--border2);
  }

  .data-table td {
    padding: 10px 14px;
    border-bottom: 1px solid var(--border);
    color: var(--text-muted);
    vertical-align: top;
  }

  .data-table tr:last-child td { border-bottom: none; }
  .data-table tr:hover td { background: rgba(255,255,255,0.02); }

  .data-table code {
    font-family: var(--font-mono); font-size: 11px;
    background: rgba(88,166,255,0.07); color: #58a6ff;
    padding: 1px 5px; border-radius: 3px;
  }

===================================================================
TAGS / BADGES
===================================================================

  .tag {
    display: inline-block;
    font-family: var(--font-mono);
    font-size: 10px; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase;
    padding: 3px 8px; border-radius: 4px;
    white-space: nowrap;
  }

  Color variants — create per-palette:
    .tag--green  { background: rgba(accent, 0.12); color: var(--accent); border: 1px solid rgba(accent, 0.2); }
    .tag--red    { background: rgba(248,81,73,0.12); color: #f85149; }
    .tag--amber  { background: rgba(245,166,35,0.12); color: #f5a623; }
    .tag--blue   { background: rgba(88,166,255,0.12); color: #58a6ff; }
    .tag--purple { background: rgba(192,132,252,0.12); color: #c084fc; }

===================================================================
CODE BLOCKS
===================================================================

  .code-block {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px 18px;
    font-family: var(--font-mono);
    font-size: 13px;
    line-height: 1.7;
    color: var(--text-muted);
    overflow: auto;
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 400px;
  }

  Syntax highlight classes (when useful):
    .kw  { color: #c792ea; }  /* keywords */
    .fn  { color: #82aaff; }  /* functions */
    .str { color: #c3e88d; }  /* strings */
    .cmt { color: #4a5568; font-style: italic; }  /* comments */
    .hl  { color: var(--accent); font-weight: 700; }  /* highlighted */

  With file header:
    .code-file { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
    .code-file__header {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 16px; background: var(--bg2);
      border-bottom: 1px solid var(--border);
      font-family: var(--font-mono); font-size: 12px; color: var(--text-dim);
    }
    .code-file__body { /* same as .code-block but no border/radius */ }

===================================================================
COLLAPSIBLE SECTIONS
===================================================================

  details.collapsible {
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
  }

  details.collapsible summary {
    padding: 14px 20px;
    background: var(--surface);
    font-family: var(--font-mono);
    font-size: 12px; font-weight: 600;
    cursor: pointer; list-style: none;
    display: flex; align-items: center; gap: 8px;
    color: var(--text);
    transition: background 0.15s ease;
  }

  details.collapsible summary:hover { background: var(--surface2); }
  details.collapsible summary::-webkit-details-marker { display: none; }
  details.collapsible summary::before {
    content: '▸'; font-size: 11px; color: var(--text-dim);
    transition: transform 0.15s ease;
  }
  details.collapsible[open] summary::before { transform: rotate(90deg); }

===================================================================
SECTION LABELS
===================================================================

  .section-label {
    font-family: var(--font-mono);
    font-size: 10px; font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 16px;
    display: flex; align-items: center; gap: 8px;
  }

  Optional dot indicator:
    .section-label::before {
      content: '';
      width: 8px; height: 8px;
      border-radius: 50%;
      background: currentColor;
    }

===================================================================
CONNECTORS AND FLOW ARROWS
===================================================================

  Vertical flow arrow (between stacked sections):
    .flow-arrow {
      display: flex; justify-content: center;
      padding: 6px 0;
      color: var(--text-dim);
    }
    .flow-arrow svg {
      width: 20px; height: 20px;
      fill: none; stroke: var(--border2);
      stroke-width: 2; stroke-linecap: round;
    }

  Horizontal arrow character:
    .h-arrow::after {
      content: '→';
      color: var(--border2);
      font-size: 18px; padding: 0 4px;
    }

  CSS pipeline (linear flow visualization):
    .pipeline-step {
      display: flex; align-items: flex-start; gap: 16px;
      padding: 14px 0;
      border-left: 2px solid var(--border);
      padding-left: 20px;
      position: relative;
    }
    .pipeline-step::before {
      content: '';
      position: absolute; left: -5px; top: 18px;
      width: 8px; height: 8px;
      border-radius: 50%;
      background: var(--border2);
      border: 2px solid var(--bg);
    }
    .pipeline-step:last-child { border-left-color: transparent; }

===================================================================
BAR VISUALIZATIONS
===================================================================

  Simple horizontal bar:
    .bar-track {
      height: 6px;
      background: var(--surface);
      border-radius: 3px;
      overflow: hidden;
    }
    .bar-fill {
      height: 100%;
      border-radius: 3px;
      transition: width 1s cubic-bezier(0.16,1,0.3,1);
    }

  Segmented distribution bar:
    .match-bar {
      display: flex;
      height: 8px;
      border-radius: 4px;
      overflow: hidden;
      gap: 2px;
    }
    .match-bar-seg { height: 100%; border-radius: 2px; }

===================================================================
SPLIT / COMPARISON PANELS
===================================================================

  Before/After comparison:
    .split-panels {
      display: grid;
      grid-template-columns: 1fr 1fr;
      border: 1px solid var(--border);
      border-radius: 10px;
      overflow: hidden;
    }
    .panel {
      padding: clamp(20px, 3vh, 40px) clamp(16px, 3vw, 32px);
    }
    .panel--before { background: rgba(248,81,73,0.03); }
    .panel--after  { background: rgba(34,216,122,0.03); border-left: 1px solid var(--border); }

===================================================================
ANIMATIONS
===================================================================

  Staggered fade-in (use --i variable per element):
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeScale {
      from { opacity: 0; transform: scale(0.92); }
      to   { opacity: 1; transform: scale(1); }
    }

    .card { animation: fadeUp 0.4s ease-out both; animation-delay: calc(var(--i, 0) * 0.05s); }

  Scroll-triggered reveal (preferred for report sections):
    Instead of animating everything on load, reveal sections
    as they enter the viewport via IntersectionObserver:

    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    Style: sections start with opacity:0, transform:translateY(20px),
    and transition to visible state when the .visible class is added.

  Reduced motion:
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }

  Archflow keyframes (always include for the diagram):
    @keyframes slide { from { left: -20%; } to { left: 120%; } }
    @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }

===================================================================
RESPONSIVE DESIGN
===================================================================

  @media (max-width: 768px) {
    body { padding: 16px; }
    .split-panels { grid-template-columns: 1fr; }
    .kpi-grid { grid-template-columns: 1fr 1fr; }
  }

===================================================================
OVERFLOW PROTECTION
===================================================================

  /* Every grid/flex child must be able to shrink */
  [style*="display: grid"] > *,
  [style*="display: flex"] > * {
    min-width: 0;
  }
  body { overflow-wrap: break-word; }

===================================================================
MERMAID CONTAINERS
===================================================================

When including Mermaid diagrams (sequence, ER, state), use:

  CDN import (at end of body):
    <script type="module">
      import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
      mermaid.initialize({
        startOnLoad: true,
        theme: 'base',
        themeVariables: {
          primaryColor: isDark ? '#1a2744' : '#e0f2fe',
          primaryBorderColor: 'var(--accent)',
          primaryTextColor: 'var(--text)',
          lineColor: 'var(--text-dim)',
          fontSize: '16px',
          fontFamily: 'var(--font-body)',
        }
      });
    </script>

  Container CSS:
    .mermaid-wrap {
      display: flex; justify-content: center; align-items: center;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 32px 24px;
      overflow: auto;
      min-height: 300px;
    }

  Never use .node as a CSS class — Mermaid uses it internally.

===================================================================
ANIMATED DIAGRAM — ARCHFLOW PHASE ENGINE
===================================================================

The animated architecture diagram is archflow's core differentiator.
Include it as a section within the report. The CSS classes below are
ONLY for the diagram section — the rest of the report uses the
patterns above.

  Diagram container:
    .diagram-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: var(--font-mono);
      padding: 24px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
    }

  Phase banner:
    .phase-banner {
      font-family: var(--font-mono);
      font-size: 11px;
      padding: 8px 20px;
      border: 1px solid var(--border);
      border-radius: 20px;
      background: var(--bg2);
      transition: color 0.4s, border-color 0.4s;
      margin-bottom: 24px;
    }

  Component card:
    .component {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 14px;
      text-align: center;
      transition: border-color 0.4s, box-shadow 0.4s;
      min-width: 120px;
    }
    .component-icon  { font-size: 20px; margin-bottom: 6px; }
    .component-label { font-family: var(--font-mono); font-size: 9px;
                       font-weight: 700; letter-spacing: 2px;
                       text-transform: uppercase; margin-bottom: 4px; }
    .component-sub   { font-family: var(--font-mono); font-size: 9px;
                       color: var(--text-dim); margin-bottom: 6px; }
    .component-body  { font-size: 11px; color: var(--text-muted);
                       line-height: 1.4; }

  Agent card (for multi-agent hub layout):
    .agent-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 10px 12px;
      text-align: center;
      flex: 1;
      transition: border-color 0.4s, box-shadow 0.4s;
    }

  Arrows:
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
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
      animation: slide 0.7s linear infinite;
    }
    .arrow-line.active .shimmer { display: block; }
    .arrow-lbl       { text-align: center; font-size: 9px;
                       color: var(--text-dim); margin-top: 3px; }
    .arrow-lbl.above { margin-top: 0; margin-bottom: 3px; }

  Vertical connector:
    .vert-line { width: 2px; background: var(--border);
                 transition: background 0.4s; margin: 0 auto; }

  Storage / external services row:
    .storage-pipeline {
      display: flex; align-items: center; gap: 0;
      background: var(--bg2);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 14px 12px;
      position: relative;
    }
    .storage-title {
      position: absolute; top: -10px; left: 16px;
      background: var(--bg);
      padding: 0 8px;
      font-size: 9px; letter-spacing: 3px;
      color: #e8b84b; text-transform: uppercase;
      font-family: var(--font-mono);
    }
    .storage-item {
      flex: 1;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 10px; text-align: center;
      min-width: 80px;
      transition: border-color 0.4s, box-shadow 0.4s;
    }
    .storage-sep { width: 16px; text-align: center;
                   font-size: 10px; color: var(--border);
                   flex-shrink: 0; }

  Diagram insights row:
    .diagram-insights { margin-top: 12px; display: flex; gap: 10px;
                        flex-wrap: wrap; justify-content: center; }
    .insight-chip {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 10px 16px;
      text-align: center; min-width: 150px;
    }

===================================================================
SEMANTIC ACCENT COLORS FOR DIAGRAMS
===================================================================

These are the semantic color assignments for the animated diagram
section ONLY. The rest of the report uses the chosen palette.

  Cyan    #00d4ff   user / input / client layer
  Orange  #ff6b35   orchestrator / coordinator / router
  Purple  #a78bfa   agents / workers / sub-processes
  Yellow  #e8b84b   storage / external services / RAG
  Green   #3fb950   output / persistence / success state
  Amber   #f0883e   LLM / AI inference / model core
  Blue    #58a6ff   app layer / API responses / user-facing
  Red     #f85149   errors / warnings (use sparingly)

===================================================================
COMPONENT ICON GUIDE (DIAGRAMS ONLY)
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
