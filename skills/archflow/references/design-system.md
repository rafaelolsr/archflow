# Design System

Design principles and building blocks for archflow outputs.
This is a design brief, not a CSS reference. You make the design
decisions fresh per project. Do not copy-paste patterns between reports.

===================================================================
1. DESIGN PHILOSOPHY
===================================================================

Every archflow output should feel like a bespoke editorial page --
NOT a generic developer dashboard with rows of identical cards.

Think MAGAZINE, not JIRA. Think PRODUCT PAGE, not ADMIN PANEL.

Before writing any CSS, make five conscious decisions:

  1. CHARACTER -- What personality fits this project?
     A CLI tool feels different from an ML pipeline feels different
     from an enterprise data platform. Let the subject matter drive
     the aesthetic.

  2. TYPOGRAPHY -- Pick a 3-voice font set (see section 2).

  3. COLOR -- Pick a named palette direction (see section 3).
     Limit yourself to 2 accent colors + neutrals. Constraint
     creates elegance; 6+ colors creates noise.

  4. TEXTURE -- Every section needs a background treatment.
     Flat solid backgrounds feel dead (see section 4).

  5. VARIETY -- Every section must have a unique layout shape.
     Do not repeat the same card grid. Mix: full-bleed panels,
     stat displays, editorial quotes, terminal mockups, split
     comparisons, timeline steps, code panels, entity clusters.

Rules:
  -> Display fonts belong at LARGE sizes (60-148px) for hero
     headings. A display font at 28px is wasted.
  -> Use generous WHITESPACE. Padding 40-80px on sections.
     Do not cram content. Let it breathe.
  -> Prefer FULL-WIDTH flowing layouts over sidebar + content.
     TOC sidebar is optional, not the default.
  -> Use em + color to highlight a key word in the hero title:
     h1 em { font-style: normal; color: var(--accent); }

If your design looks like a Bootstrap dashboard, redesign it.

===================================================================
2. TYPOGRAPHY -- THREE-VOICE FONT SETS
===================================================================

Every report REQUIRES three distinct font voices:

  DISPLAY -- The hero heading font. Bold, dramatic, large.
  BODY    -- Running text. Readable, neutral, professional.
  MONO    -- Code, labels, data. Technical, compact.

The display and body fonts MUST come from different families.
Using the same family (e.g., Red Hat Display + Red Hat Text)
produces bland uniformity.

Load all fonts via Google Fonts CDN:
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=...&display=swap" rel="stylesheet">

DISPLAY FONT OPTIONS (hero headings only):

  Sans-serif display:
    Bebas Neue             uppercase, industrial, 72-148px
    Bricolage Grotesque    bold, characterful, 48-96px
    Outfit                 geometric, weight 800, 48-80px

  Serif display (editorial, premium feel):
    Instrument Serif       elegant, high contrast, 48-96px
    Playfair Display       classic editorial, 48-96px
    Fraunces               warm, soft serif, 48-80px

BODY FONT OPTIONS:
    DM Sans                friendly, works with any display font
    IBM Plex Sans          reliable, enterprise
    Plus Jakarta Sans      approachable, modern
    Sora                   precise, geometric
    Geist                  sharp, contemporary
    Libre Franklin         classic, data-dense layouts

MONO FONT OPTIONS:
    Fira Code              ligatures, friendly
    JetBrains Mono         sharp, developer-oriented
    IBM Plex Mono          pairs naturally with IBM Plex Sans
    Space Mono             geometric, distinctive
    Geist Mono             pairs with Geist body
    Source Code Pro         warm, readable

EDITORIAL SERIF (for quotes, callouts, pull-quotes):
    Newsreader             newspaper editorial feel
    Source Serif 4          pairs with Source Code Pro
    Crimson Pro            elegant long-form text

EXAMPLE 3-VOICE SETS (rotate across projects):
    Instrument Serif + DM Sans + Fira Code        (editorial)
    Bebas Neue + IBM Plex Sans + IBM Plex Mono     (technical)
    Playfair Display + Sora + JetBrains Mono       (premium)
    Fraunces + Plus Jakarta Sans + Space Mono      (warm)
    Bricolage Grotesque + Geist + Geist Mono       (bold modern)
    Outfit + Libre Franklin + Source Code Pro       (geometric)

TYPOGRAPHY SCALE (use clamp() for responsive sizing):

  Element              Size                          Weight
  Page title           clamp(48px, 9vw, 148px)       700-900
  Section heading      clamp(18px, 3vw, 28px)        600
  Body text            clamp(14px, 1.5vw, 16px)      400
  Section label        10-11px (mono, uppercase)      600-700
  Card label           9-10px (mono, uppercase)       700
  Code / mono text     12-13px                        400

ANTI-PATTERNS -- never use as body font:
  Inter, Roboto, Arial, Helvetica, system-ui alone.
  These signal "AI-generated default."

FORBIDDEN:
  -> Single font family for display + body (e.g., Red Hat Display
     + Red Hat Text, or Inter for everything)
  -> Display font used at body sizes (under 36px)
  -> Body font used for the hero heading

===================================================================
3. COLOR PALETTES -- NAMED AESTHETICS
===================================================================

Pick a palette direction per project. Derive your actual colors
from the aesthetic -- do not use raw hex codes blindly.

BLUEPRINT (cool, technical -- APIs, backend systems):
  Accents: teal + cyan range
  Surface: cool grays
  Feel: calm engineering precision

TERMINAL MONO (code-first, developer tools):
  Accents: neon green + teal range
  Surface: deep charcoal
  Feel: hacker terminal, high contrast data

WARM SIGNAL (editorial, data platforms):
  Accents: teal + amber range
  Surface: warm darks
  Feel: magazine data journalism

NORDIC (calm, enterprise, cloud platforms):
  Accents: ice blue + frost green range
  Surface: slate grays
  Feel: Scandinavian restraint

MIDNIGHT EDITORIAL (premium, executive summaries):
  Accents: warm gold range
  Surface: deep navy
  Feel: luxury annual report

Choose accent colors that work on BOTH dark and light backgrounds
(they need to survive the theme toggle). Pick 2 accents maximum.
Derive warn/danger/success states from your palette direction,
not from a fixed table.

===================================================================
4. BACKGROUND ATMOSPHERE -- PER-SECTION REQUIREMENT
===================================================================

RULE: No two adjacent sections may share the same background
treatment. Every section MUST have its own atmosphere.

TECHNIQUES (combine and vary per section):

  Radial glow -- A soft elliptical gradient from one edge.
    Position the center differently per section (top-left,
    bottom-right, center). Vary the accent color and opacity.

  Multi-glow -- Two or three positioned radial gradients layered.
    Creates depth and dimension. Each glow can use a different
    accent color at low opacity.

  Dot grid -- Repeating radial-gradient dots. Minimal, enterprise.
    Vary the spacing and dot size per section.

  SVG grid -- A fixed pattern overlay with thin lines. Technical,
    terminal aesthetic.

  Linear sweep -- A diagonal or horizontal gradient using two
    surface tones. Subtle tonal shift across the section.

  Film grain -- SVG noise texture overlay at very low opacity.
    Adds editorial print texture.

PRINCIPLES:
  -> Background gradients should be SUBTLE (3-8% opacity for
     accent colors). If you can see the gradient without squinting,
     it is too strong.
  -> Vary the gradient DIRECTION and POSITION between sections.
     If section 1 glows from top-left, section 2 should glow from
     bottom-right or use a different technique entirely.
  -> Texture overlays (grain, grids) are fixed/absolute-positioned
     with pointer-events:none and low z-index.

===================================================================
5. COMPONENT TYPES -- DESIGN PRINCIPLES, NOT CSS
===================================================================

These are the building blocks available for report sections.
Design the exact CSS fresh per project -- what follows describes
WHAT each component is and WHEN to use it, not HOW to style it.

STAT DISPLAY
  A large prominent number with a small label beneath it.
  The number should be the largest element -- bold, mono or display
  font. The label is tiny, uppercase, tracked-out mono text.
  Use for: KPIs, counts, percentages, key metrics.
  Arrange in a grid row or a full-width divided bar.

STAT PILL
  A compact inline badge combining a number and a short label.
  Small, pill-shaped, colored background at low opacity.
  Use for: inline metrics within prose, status counts in headers.

EDITORIAL QUOTE
  Large serif italic text spanning most of the page width.
  Use an editorial serif font (Newsreader, Crimson Pro, etc.).
  Color the text or add a colored left border for attribution.
  Use for: key findings, executive takeaways, section epigraphs.
  Position as a section break between dense content areas.

TERMINAL MOCKUP
  A dark recessed panel with three colored dots (red, yellow, green)
  in the top bar, followed by monospace content.
  Use for: CLI output, command examples, log excerpts.
  The dots and the bar are decorative -- the content is code-styled.

CARD (general purpose)
  A bordered container with surface background and padding.
  Vary the depth treatment per report: some cards are raised
  (brighter surface, stronger border), some are recessed (darker,
  inset shadow), some are hero-level (accent left border, gradient).
  Do not use the same card variant for every section.

DATA TABLE
  A real <table> element. Headers should be compact mono uppercase
  with dim color. Row text in muted body color. Wrap in a scrollable
  container for wide tables. Add subtle hover highlighting on rows.

TAG / BADGE
  Small mono uppercase pills with color-coded backgrounds at low
  opacity. Border optional. Use for: technology labels, status
  indicators, category markers.

CODE PANEL
  Dark recessed background, mono font, pre-wrapped text.
  Optional: file header bar with filename and language label.
  Optional: syntax highlighting with a few keyword color classes.

COLLAPSIBLE SECTION
  Use <details> / <summary> for content that is useful but not
  primary. The summary line should be mono, compact, with a
  rotation indicator (triangle or chevron).

COMPARISON PANEL
  A two-column split for before/after, raw/clean, old/new.
  Each side gets a subtly tinted background (warm for "before",
  cool for "after"). Optional: animated particles flowing between
  the panels to show transformation.

BAR VISUALIZATION
  Horizontal bars for quantity comparison. Label on the left,
  filled track on the right. The fill color should come from the
  palette. Use for: performance metrics, size comparisons,
  distribution breakdowns.

SECTION LABEL
  A tiny mono uppercase header with wide letter-spacing.
  Optional: a small colored dot indicator (animated blink for
  "live" sections). This marks the start of a content block.

FLOW / PIPELINE
  A sequence of connected steps. Can be horizontal (boxes with
  arrows) or vertical (timeline with dot markers on a left border).
  Each step should have a different border or accent color.
  Use for: data pipelines, deployment stages, process flows.

SVG ORBIT / RADIAL DIAGRAM
  Nodes arranged in a circle around a central node. Lines or arcs
  connecting nodes to the center. Good for showing relationships
  where one component is central and others surround it.
  Use inline SVG for pixel-perfect control.

INLINE SVG DIAGRAM
  For complex mixed layouts where CSS grid is insufficient.
  SVG gives pixel-perfect control over boxes of varying sizes,
  embedded tables, arrow connectors of any length and direction,
  and circle badges. Use CSS variables (var(--accent), var(--surface))
  inside SVG attributes so themes still work.

  Arrow markers:
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5"
              markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10" fill="var(--accent)"/>
      </marker>
    </defs>

COMBINING TECHNIQUES:
  A great report uses 4-6 DIFFERENT component types across its
  sections. Do not build an entire report from cards alone.
  Mix stat displays, editorial quotes, terminal mockups, tables,
  flow diagrams, and bar charts. The visual rhythm should vary.

===================================================================
6. DIAGRAM PRINCIPLES
===================================================================

DENSITY -- SINGLE-PAGE PREFERENCE
  The animated architecture diagram should prefer COMPACT, DENSE
  layouts that fit within 1-2 viewport heights. Stack layers
  top-to-bottom in a single scrollable column. Each layer is a
  full-width card with icon, title, description, and tags.

  Layers with sub-components EXPAND INLINE: a parent layer card
  contains a nested grid of child components inside it. This keeps
  detail in context with its parent, not as a disconnected section.

  Why: The reader sees the full architecture at once. Animated
  phase highlighting is more impactful when all layers are visible
  simultaneously.

  Avoid:
    -> Spreading components across wide horizontal rows with tiny
       8px labels that need zooming
    -> Putting diagram components and their detail (tables, grids)
       in separate report sections
    -> Using separate pages for one logical diagram

ANIMATED PHASE ENGINE -- JS INTERFACE CONTRACT
  The phase engine animates an architecture diagram by highlighting
  components sequentially. The design-system.md does NOT prescribe
  the exact CSS. You design the layer cards, connectors, and
  service cards fresh per project. But the JS interface requires:

  REQUIREMENTS:
    -> Each diagram component needs a unique ID attribute
    -> The phase engine JS sets visual highlighting via:
       - Setting a --glow-color CSS custom property on the element
       - Adding a .lit class (or applying inline styles directly)
    -> You must design a .lit state for your components (brighter
       border, glow shadow, tinted background -- your choice)
    -> A phase banner element shows the current phase description

  JS PATTERN (adapt the selectors to your class names):

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
      document.querySelectorAll('[class*="layer"], [class*="connector"]')
        .forEach(el => {
          el.classList.remove('lit');
          el.style.removeProperty('--glow-color');
        });
    }

  The full phase engine logic (phase definitions, auto-play,
  prev/next navigation) is documented in animation.md.

RICH COMPONENTS -- NOT FLOWCHART BOXES
  Diagram components should be full-width horizontal cards with
  SVG icons, descriptions, and technology tags. NOT small centered
  boxes with emoji. Think of each component as a rich card that
  tells a story, not a label on a flowchart.

  Use inline SVG icons (24x24, stroke-width 1.5) with colored
  backgrounds -- not emoji. Emoji icons look unprofessional.

MULTIPLE DIAGRAM TECHNIQUES
  A great architecture visualization combines techniques:
    -> Vertical layered stack for the animated overview
    -> Horizontal flow row for linear pipelines
    -> Inline SVG for complex mixed layouts
    -> Side-by-side cards for methodology comparison
    -> Bar charts for performance data
    -> Entity clusters for relationship maps
  The diagram should be as rich as the architecture it describes.

===================================================================
7. THEME SYSTEM -- DARK / LIGHT TOGGLE
===================================================================

Every generated file includes a toggle button. Dark is the default.
The .light class on <body> flips CSS variable values.
Preference persists via localStorage.

HTML -- place immediately after <body>:
  <button class="theme-toggle" onclick="document.body.classList.toggle('light');localStorage.setItem('archflow-theme',document.body.classList.contains('light')?'light':'dark')">&#9684;</button>

JS -- place at the top of the <script> block:
  if (localStorage.getItem('archflow-theme') === 'light') document.body.classList.add('light');

CSS PATTERN -- define :root variables and override in body.light:
  :root should define: --bg, --bg2, --surface, --surface2,
  --border, --border2, --text, --text-dim, --text-muted,
  --accent, --accent2, --font-body, --font-mono.

  body.light overrides the neutral tones (bg, surface, border,
  text) to light equivalents. Accent colors stay the same in
  both themes -- they should be bright enough to work on both
  dark and light backgrounds.

===================================================================
8. ANIMATIONS -- TOOLKIT
===================================================================

1. fadeUp -- staggered page load reveal

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  CRITICAL: always use animation-fill-mode: both so elements stay
  hidden before animation starts. No flash of unstyled content.
  Stagger hero elements with increasing delays (0s, 0.08s, 0.16s...).

2. blink -- live indicator dots

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.25; }
  }

  Use on small colored dots next to section headers or status labels.
  Signals "active system" without aggression. 1.8-2s loop.

3. pulse -- highlighted data fields

  @keyframes pulse {
    0%, 100% { color: var(--accent); }
    50% { color: color-mix(in srgb, var(--accent) 60%, var(--text-dim)); }
  }

  Apply to specific data values that need attention. 2.5s loop.

4. cascade -- animated particles for transform visualizations

  @keyframes cascade {
    0%   { top: -6px; opacity: 0; }
    8%   { opacity: 1; }
    92%  { opacity: 1; }
    100% { top: calc(100% + 6px); opacity: 0; }
  }

  Use 5-6 particles with DIFFERENT durations (2.6-4.0s) and
  DIFFERENT delays so they never sync up. Color sequence should
  echo the transformation story. Never replace CSS keyframe
  animations with JS. Keep all particles with varied timing.

5. fadeScale -- for cards and badges

  @keyframes fadeScale {
    from { opacity: 0; transform: scale(0.92); }
    to   { opacity: 1; transform: scale(1); }
  }

6. slide -- for diagram phase shimmer effects

  @keyframes slide { from { left: -20%; } to { left: 120%; } }

7. Hover transitions (CSS transitions, not keyframes):
  Cards, buttons, and nav links should use transition: 0.2s for
  hover states. Always 0.2s -- fast enough to feel responsive,
  slow enough to be perceptible.

8. Scroll-triggered reveal:
  Use IntersectionObserver to add a .visible class to sections
  as they enter the viewport. Sections start with opacity:0 and
  translateY(20px), then transition to their visible state.
  Use cubic-bezier(0.16, 1, 0.3, 1) for smooth deceleration.

REDUCED MOTION:
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

===================================================================
9. QUALITY GATES
===================================================================

Before considering a report finished, apply these tests:

THE SQUINT TEST
  Blur your eyes and look at the page. If two adjacent sections
  have the same SHAPE (both are 3-column card grids, both are
  full-width text blocks), redesign one of them. Adjacent sections
  must have visually distinct silhouettes.

THE SWAP TEST
  If you could swap the CSS between two of your reports and nobody
  would notice, you have not designed anything. Each report must
  have a distinct personality driven by its subject matter.

THE VARIETY CHECK
  Count the distinct component types used across all sections.
  If fewer than 4 different types appear in a report with 6+
  sections, add variety. A report should not be built from a
  single component type.

THE ADJACENT SECTION CHECK
  Walk through each pair of adjacent sections. Verify:
    -> Different background treatment
    -> Different component layout (not both card grids)
    -> Different dominant visual weight

THE FONT CHECK
  Verify that:
    -> At least 2 distinct font families are loaded
    -> Display and body fonts are from different families
    -> Mono font is used for labels, code, and data

===================================================================
10. FORBIDDEN PATTERNS
===================================================================

Visual:
  -> Generic Inter or Roboto as the only font
  -> Uniform flat solid background across all sections
  -> All sections using the same card grid pattern
  -> More than 3 adjacent sections with bordered-rectangle cards
  -> Emoji icons in headers or diagram components
  -> Gradient text (background-clip: text)
  -> Animated glowing box-shadows that pulse aggressively
  -> Cyan + magenta + pink neon color combos
  -> Purple gradients as the default (the "AI look")

Typography:
  -> Single font family for display + body + labels
  -> Display font used below 36px
  -> Body font used for the hero heading
  -> system-ui or sans-serif as the sole font-family

Layout:
  -> Rows of identical cards repeated section after section
  -> TOC sidebar as the default layout
  -> Tiny flowchart boxes with 8px labels
  -> Diagram components and their detail in separate sections

Code:
  -> Using .node as a CSS class (Mermaid uses it internally)
  -> Replacing CSS keyframe animations with JS equivalents

===================================================================
11. RESPONSIVE AND OVERFLOW PROTECTION
===================================================================

OVERFLOW:
  Every grid and flex child must be able to shrink:
    [style*="display: grid"] > *,
    [style*="display: flex"] > * {
      min-width: 0;
    }
    body { overflow-wrap: break-word; }

RESPONSIVE:
  At 768px and below:
    -> Body padding reduces to 16px
    -> Multi-column grids collapse to 1-2 columns
    -> Stat displays stack vertically
    -> Flow rows wrap or switch to vertical layout

===================================================================
12. MERMAID DIAGRAMS
===================================================================

When including Mermaid diagrams (sequence, ER, state):

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

Container: center the diagram in a bordered panel with surface
background, rounded corners, and padding. Allow overflow scrolling
for wide diagrams. Never use .node as a CSS class.
