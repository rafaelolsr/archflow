# Design System

CSS patterns, typography, and visual principles for archflow outputs.
This is a patterns library — adapt and compose freely per project.
Do NOT copy-paste rigidly. Design each report uniquely.

===================================================================
DESIGN PHILOSOPHY
===================================================================

Every archflow output should feel like a bespoke editorial page —
NOT a generic developer dashboard with rows of identical cards.

Think MAGAZINE, not JIRA. Think PRODUCT PAGE, not ADMIN PANEL.

Before writing CSS:

  1. THINK about the project's character (5 seconds)
  2. Pick a DISPLAY FONT for the hero heading (bold, dramatic)
  3. Pick a body + mono font pairing
  4. Pick a color palette — MINIMAL (2-3 accent colors max)
  5. Pick a background texture (grain, grid, gradient, or clean)

Rules:
  → Use display fonts (Bebas Neue, Bricolage Grotesque, Red Hat Display)
    at LARGE sizes (80-148px) for hero headings. Not just 28-48px.
  → Keep the color palette TIGHT — 2 accent colors + neutrals.
    Don't use 6+ colors. Constraint creates elegance.
  → Every section should have UNIQUE layout. Don't repeat the same
    card grid pattern. Mix: full-bleed, split panels, stat bars,
    entity lists, code panels, timeline steps.
  → Add TEXTURE: film grain via SVG noise, dot grids, or subtle
    patterns. Flat solid backgrounds feel dead.
  → Use generous WHITESPACE. Padding 40-80px on sections.
    Don't cram content. Let it breathe.
  → Prefer FULL-WIDTH flowing layouts over sidebar + content grids.
    TOC sidebar is optional, not default.

Forbidden: generic Inter + purple gradients, uniform card grids,
emoji icons in headers, gradient text, animated glowing shadows,
cyan-magenta-pink neon combos, rows of identical cards.

If your design looks like a Bootstrap dashboard, redesign it.

===================================================================
TEXTURE OVERLAYS
===================================================================

Add subtle texture to avoid flat, dead backgrounds:

  Film grain (subtle, editorial feel):
    body::after {
      content: '';
      position: fixed; inset: 0;
      pointer-events: none; z-index: 9999;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
      opacity: 0.6;
    }

  SVG grid (technical, developer feel):
    <div style="position:fixed;inset:0;z-index:-1;opacity:0.25;pointer-events:none;">
      <svg width="100%" height="100%">
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="var(--accent)" stroke-width="0.4"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
      </svg>
    </div>

  Dot grid (minimal, enterprise):
    background-image: radial-gradient(circle, var(--border) 1px, transparent 1px);
    background-size: 24px 24px;

===================================================================
DISPLAY TYPOGRAPHY
===================================================================

Reports need a HERO heading that commands attention.
Use a display font at massive scale for the page title.

  Recommended display fonts (load via Google Fonts):
    Bebas Neue          → 72-148px, uppercase, industrial
    Bricolage Grotesque → 48-96px, bold, characterful
    Red Hat Display      → 48-80px, clean, enterprise
    Outfit               → 48-80px, weight 800, geometric

  Pattern:
    h1 {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(72px, 11vw, 148px);
      line-height: 0.9;
      letter-spacing: 0.01em;
    }

  Use em + color to highlight a key word in the title:
    h1 em { font-style: normal; color: var(--accent); }

===================================================================
STAT BARS / LARGE NUMBERS
===================================================================

For impressive metrics, use full-width stat bars with large numbers:

  .stats-bar {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    background: var(--bg2);
    border-top: 1px solid var(--border);
  }
  .stat-cell {
    padding: 40px 52px;
    border-right: 1px solid var(--border);
  }
  .stat-cell:last-child { border-right: none; }
  .stat-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 60px; line-height: 1;
    color: var(--text); letter-spacing: 0.02em;
  }
  .stat-lbl {
    font-family: var(--font-mono);
    font-size: 10.5px; letter-spacing: 0.16em;
    text-transform: uppercase; color: var(--text-dim);
    margin-top: 10px;
  }

===================================================================
SPLIT / COMPARISON PANELS
===================================================================

Full-width split views for before/after, raw/clean, etc.:

  .split-grid {
    display: grid;
    grid-template-columns: 1fr 72px 1fr;
    border: 1px solid var(--border);
    min-height: 480px;
    overflow: hidden;
  }

  .side-raw {
    background: linear-gradient(135deg, #0a0500 0%, #060400 100%);
    border-right: 1px solid rgba(accent-color, 0.15);
    padding: 32px;
  }

  .blade {
    background: var(--bg);
    display: flex; align-items: center; justify-content: center;
  }

  .side-clean {
    background: linear-gradient(135deg, #020806 0%, #030806 100%);
    border-left: 1px solid rgba(accent-color, 0.15);
    padding: 32px;
  }

  Add animated particles between panels for dynamic feel.

===================================================================
STICKY NAV BAR
===================================================================

Alternative to TOC sidebar — a top navigation bar:

  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 52px;
    border-bottom: 1px solid var(--border);
    position: sticky; top: 0;
    background: rgba(5,5,5,0.92);
    backdrop-filter: blur(12px);
    z-index: 100;
  }

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

  Vertical connector with label (for animated diagrams):
    .vert-connector {
      display: flex; flex-direction: column; align-items: center;
      gap: 4px; padding: 4px 0;
    }
    .vert-connector .vert-line {
      width: 2px; height: 28px;
      background: var(--border);
      transition: background 0.4s;
      position: relative; overflow: hidden;
    }
    .vert-connector .vert-line .shimmer {
      display: none; position: absolute; top: -20%;
      width: 100%; height: 20%;
      background: var(--text); opacity: 0.85;
      animation: slideV 0.7s linear infinite;
    }
    .vert-connector .vert-line.active .shimmer { display: block; }
    @keyframes slideV { from { top: -20%; } to { top: 120%; } }
    .vert-connector .conn-label {
      font-family: var(--font-mono);
      font-size: 8px; letter-spacing: 0.5px;
      color: var(--text-dim);
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

  1. fadeUp — staggered page load reveal

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    CRITICAL: always use animation-fill-mode: both — elements stay
    hidden before the animation starts. No flash of unstyled content.

    Hero elements stagger on page load with increasing delays:

      .hero-label   { animation: fadeUp 0.5s ease both; }
      h1            { animation: fadeUp 0.5s ease 0.08s both; }
      .subline      { animation: fadeUp 0.5s ease 0.16s both; }
      .ctas         { animation: fadeUp 0.5s ease 0.24s both; }
      .transform    { animation: fadeUp 0.7s ease 0.35s both; }

    The word "both" is the key. Claude Code tends to forget it and
    the stagger collapses — elements flash visible then animate.

  2. blink — live indicator dots

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.25; }
    }

    Use on small colored dots next to section headers or status labels.
    Signals "active system" without being aggressive. 1.8-2s loop.

      .live-dot {
        width: 5px; height: 5px;
        border-radius: 50%;
        background: var(--accent);
        animation: blink 1.8s infinite;
      }

    Can also use as ::before pseudo-element on labels:
      .label::before {
        content: '';
        width: 5px; height: 5px;
        border-radius: 50%;
        background: currentColor;
        animation: blink 2s infinite;
      }

  3. pulse — highlighted data fields

    @keyframes pulse {
      0%, 100% { color: var(--accent); }
      50% { color: color-mix(in srgb, var(--accent) 60%, var(--text-dim)); }
    }

    Apply to specific data values that need attention — the fields
    that matter to the narrative. Draws the eye without being garish.
    Tied directly to the story the report tells.

      .field-highlight { animation: pulse 2.5s ease infinite; }

  4. cascade — animated particles for transform visualizations

    @keyframes cascade {
      0%   { top: -6px; opacity: 0; }
      8%   { opacity: 1; }
      92%  { opacity: 1; }
      100% { top: calc(100% + 6px); opacity: 0; }
    }

    Six particles flowing through a blade/divider between panels.
    Each particle is absolutely positioned with varied duration,
    delay, and opacity so they NEVER sync up:

      particle 1 → accent-color,  3.4s, delay 0s
      particle 2 → white,         2.8s, delay 0.6s, opacity 0.5
      particle 3 → accent2-color, 3.8s, delay 1.2s
      particle 4 → accent-color,  2.6s, delay 1.9s, opacity 0.7
      particle 5 → accent2-color, 4.0s, delay 0.4s
      particle 6 → white,         3.1s, delay 2.4s, opacity 0.4

    Different durations + different delays = never looks mechanical.
    Color sequence should echo the transformation story
    (e.g., orange entering → teal exiting).

    HTML:
      <div class="blade">
        <div class="particle" style="background:var(--accent);
             animation:cascade 3.4s linear infinite;"></div>
        <div class="particle" style="background:#fff;opacity:0.5;
             animation:cascade 2.8s linear 0.6s infinite;"></div>
        <div class="particle" style="background:var(--accent2);
             animation:cascade 3.8s linear 1.2s infinite;"></div>
        <!-- ... 3 more particles with varied timing -->
      </div>

    CSS:
      .particle {
        position: absolute;
        left: 50%; width: 4px; height: 4px;
        border-radius: 50%;
        transform: translateX(-50%);
      }

    IMPORTANT: Claude Code will try to simplify or remove cascade
    particles because they look complex. Never replace CSS keyframe
    animations with JS. Keep all 6 particles with varied timing.

  5. fadeScale — for KPI cards and badges

    @keyframes fadeScale {
      from { opacity: 0; transform: scale(0.92); }
      to   { opacity: 1; transform: scale(1); }
    }

  6. Hover transitions (NOT keyframe animations — CSS transitions):

    Primary buttons → background shifts to accent, translateY(-2px)
    Secondary buttons → border and text brighten
    Cards → border brightens, subtle box-shadow, translateY(-2px)
    Nav links → color eases to --text

    All use transition: 0.2s — fast enough to feel responsive,
    slow enough to be perceptible. Always 0.2s, not 0.3s.

  7. Scroll-triggered reveal (for below-fold sections):

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
    Use cubic-bezier(0.16, 1, 0.3, 1) for smooth deceleration.

  Reduced motion:
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }

  Archflow diagram keyframes (always include for the phase engine):
    @keyframes slide { from { left: -20%; } to { left: 120%; } }

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
It should be BIG, RICH, and READABLE — not tiny monospace boxes.

CRITICAL: The diagram components must be full-width horizontal cards
with SVG icons, descriptions, and technology tags. NOT small centered
boxes with emoji. Think of each component as a rich card that tells
a story, not a label on a flowchart.

  Diagram container:
    .arch-flow {
      display: flex;
      flex-direction: column;
      gap: 0;
      max-width: 860px;
      margin: 0 auto;
    }

  Phase banner:
    .phase-banner {
      font-family: var(--font-mono);
      font-size: 13px;
      padding: 10px 24px;
      border: 1px solid var(--border);
      border-radius: 20px;
      background: var(--bg2);
      transition: color 0.4s, border-color 0.4s;
      margin-bottom: 24px;
      max-width: 860px;
    }

  Architecture layer card (the PRIMARY component pattern):
    .arch-layer {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px 28px;
      display: flex;
      align-items: center;
      gap: 20px;
      transition: border-color 0.4s, box-shadow 0.4s, background 0.3s;
    }
    .arch-layer:hover {
      border-color: var(--accent);
    }
    .arch-layer.lit {
      border-color: var(--glow-color, var(--accent));
      background: linear-gradient(135deg, var(--surface) 0%,
        color-mix(in srgb, var(--glow-color, var(--accent)) 5%, var(--surface)) 100%);
      box-shadow: 0 0 40px color-mix(in srgb, var(--glow-color, var(--accent)) 15%, transparent);
    }

  Layer icon (SVG in colored rounded background, NOT emoji):
    .arch-icon {
      width: 48px; height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      flex-shrink: 0;
    }
    Use inline SVG icons (24x24, stroke-width 1.5) with colored
    backgrounds like: background: rgba(accent, 0.15); color: accent;

  Layer name + description:
    .arch-name {
      font-family: var(--font-mono);
      font-size: 13px;
      font-weight: 600;
      color: var(--accent);
    }
    .arch-desc {
      font-size: 14px;
      color: var(--text-dim);
      margin-top: 2px;
      line-height: 1.5;
    }

  Layer tags (technology badges, aligned right):
    .arch-tags {
      display: flex;
      gap: 6px;
      margin-left: auto;
      flex-wrap: wrap;
    }
    .arch-tag {
      font-family: var(--font-mono);
      font-size: 10px;
      padding: 3px 8px;
      border-radius: 6px;
      background: var(--accent-dim, rgba(var(--accent), 0.1));
      color: var(--accent);
      font-weight: 600;
    }

  Vertical connector between layers:
    .arch-connector {
      width: 2px;
      height: 14px;
      background: linear-gradient(to bottom, var(--accent), transparent);
      margin: 0 auto;
      opacity: 0.4;
      transition: opacity 0.4s, background 0.4s;
    }
    .arch-connector.lit {
      opacity: 1;
      background: var(--glow-color, var(--accent));
      box-shadow: 0 0 8px color-mix(in srgb, var(--glow-color, var(--accent)) 40%, transparent);
    }

  PHASE ENGINE with rich cards — JS helpers:

    The litComponent function targets .arch-layer elements by ID:

      function litLayer(id, color) {
        const el = document.getElementById(id);
        if (!el) return;
        el.style.setProperty('--glow-color', color);
        el.classList.add('lit');
      }

      function litConnector(id, color) {
        const el = document.getElementById(id);
        if (!el) return;
        el.style.setProperty('--glow-color', color);
        el.classList.add('lit');
      }

      function resetAll() {
        document.querySelectorAll('.arch-layer, .arch-connector').forEach(el => {
          el.classList.remove('lit');
          el.style.removeProperty('--glow-color');
        });
      }

  External services (below the flow):
    Use a horizontal row of cards below the arch-flow:
    .services-row {
      display: flex; gap: 12px;
      margin-top: 20px;
      max-width: 860px;
    }
    .service-card {
      flex: 1;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 14px;
      text-align: center;
      transition: border-color 0.4s, box-shadow 0.4s;
    }
    .service-card.lit {
      border-color: #e8b84b;
      box-shadow: 0 0 14px rgba(232,184,75,0.2);
    }

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
RICH DIAGRAM COMPONENTS — BEYOND BOXES AND ARROWS
===================================================================

The arch-flow + arch-layer pattern above is the BASE for the
animated phase engine. But a good architecture visualization
needs MORE than a vertical stack of cards. Combine multiple
techniques to tell the full story:

  LAYER CARDS (for tier breakdowns like Bronze/Silver/Gold):
    .layer-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
    .layer-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 24px;
      position: relative;
      overflow: hidden;
      transition: border-color 0.3s, transform 0.3s;
    }
    .layer-card:hover { transform: translateY(-2px); }
    .layer-card::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0;
      height: 3px;
      background: var(--card-accent);
    }
    .layer-card .count {
      font-size: 2.2rem; font-weight: 800;
      line-height: 1; margin-bottom: 0.5rem;
    }

    Use for: medallion tiers, service categories, module groups.
    Each card shows a big number + title + list of items.

  ENTITY CARDS (for component relationships, ER-like):
    .er-grid {
      display: flex; flex-wrap: wrap;
      gap: 12px; justify-content: center;
    }
    .er-entity {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px 20px;
      min-width: 160px;
      text-align: center;
      transition: all 0.3s;
    }
    .er-entity:hover {
      border-color: var(--accent);
      transform: translateY(-2px);
    }
    .er-entity.central {
      border-color: var(--accent);
      background: linear-gradient(135deg, var(--surface) 0%,
        color-mix(in srgb, var(--accent) 5%, var(--surface)) 100%);
      box-shadow: 0 0 30px color-mix(in srgb, var(--accent) 6%, transparent);
    }

    Use for: microservices, agent networks, database entities.

  QUALITY / FEATURE GRID (for listing capabilities):
    .quality-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 12px;
    }
    .quality-item {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 14px;
      display: flex;
      gap: 10px;
      align-items: flex-start;
    }
    .quality-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      margin-top: 5px;
      flex-shrink: 0;
      background: var(--accent);
      box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 40%, transparent);
    }

  HORIZONTAL BAR CHART (for performance/size comparisons):
    .bar-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-family: var(--font-mono);
      font-size: 0.72rem;
      margin-bottom: 0.5rem;
    }
    .bar-label {
      width: 7rem;
      color: var(--text-dim);
      text-align: right;
      flex-shrink: 0;
    }
    .bar-track {
      flex: 1;
      height: 28px;
      background: rgba(255,255,255,0.03);
      border-radius: 6px;
      overflow: hidden;
    }
    .bar-fill {
      height: 100%;
      border-radius: 6px;
      display: flex;
      align-items: center;
      padding-left: 0.75rem;
      font-size: 0.7rem;
      font-weight: 600;
    }

  MERMAID DIAGRAM (for complex flows, ER, sequences):
    Use Mermaid for flows that are too complex for CSS.
    Especially good for: multi-path branching, sequence diagrams,
    entity relationships with cardinality, state machines.
    See the MERMAID CONTAINERS section below for setup.

COMBINING TECHNIQUES IN ONE REPORT:
  A great architecture visualization uses MULTIPLE techniques:
    1. arch-flow with phase engine for the OVERVIEW (animated)
    2. layer-cards for TIER DETAIL (Bronze/Silver/Gold, etc.)
    3. Mermaid for COMPLEX FLOWS (sequence diagrams, ER)
    4. bar-charts for PERFORMANCE DATA
    5. quality-grid for CAPABILITY LISTS
    6. entity-cards for RELATIONSHIP MAPS

  Don't just stack 4 boxes with arrows and call it done.
  The diagram should be as rich as the architecture it describes.

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
