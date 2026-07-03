# Print & PDF Output

Every archflow output (report, diagram, slides) must produce a usable
PDF when the reader hits Cmd+P / Ctrl+P. Browsers default to dropping
backgrounds, ignoring `vw` units against page width, and capturing only
the first frame of any animation — so without an explicit print stylesheet
the on-screen design collapses on paper.

This doc is design principles. The exact selectors and tokens depend
on the project — adapt the skeleton, do not paste it verbatim.

===================================================================
1. PRINCIPLES
===================================================================

PRINT IS A FROZEN SNAPSHOT, NOT A SECOND DESIGN
  Don't redesign the page for print. Take what's on screen, freeze
  the animation, switch to a print-friendly theme, fix the page-break
  rules. The reader should recognize the printed page as the same
  document they saw on screen.

TWO PRINT STRATEGIES — PICK BY HOW THE PDF IS CONSUMED
  There is no single right theme for paper. Choose up front, because
  it changes the whole @media print block:

  A) LIGHT-ON-PAPER (default for PRINTED handouts)
     Ink-heavy dark backgrounds waste toner and look wrong when
     physically printed. Remap to the light theme, kill the
     atmospheres (see next principle), keep accent colors. This is
     the safe default when you don't know how the reader will use it,
     and the only sane choice for something going through an office
     printer.

  B) DARK-FIDELITY (for SCREEN-CONSUMED / AGENT-GENERATED PDFs)
     When the PDF will be READ ON A SCREEN (shared as a file, attached
     to a doc, viewed in a PDF app) and especially when a tool
     GENERATES the PDF headlessly rather than a human hitting Cmd+P,
     the reader expects the PDF to look like the site — dark ground,
     glows, lit diagram. Forcing light there feels like a broken,
     flattened downgrade. Keep the on-screen dark theme verbatim and
     paint EVERYTHING (including atmospheres) with
     print-color-adjust: exact. See section 4b for the skeleton.

  DECISION RULE
    - Human will physically print it, or you're unsure  → strategy A.
    - PDF is delivered as a screen artifact, or YOU (an agent) render
      it via headless Chromium  → strategy B.
    - When a user says "the PDF should look exactly like the screen"
      or "keep the dark theme" → strategy B, no argument.

  CRITICAL CAVEAT FOR STRATEGY B
    Browsers default the print dialog's "Background graphics" checkbox
    to OFF, which strips the dark ground and gives an all-white page —
    exactly the flattened look the user was trying to avoid. So a
    dark-fidelity PDF is only reliable when RENDERED HEADLESSLY (where
    backgrounds are on by default) or when the human is told to tick
    "Background graphics". If neither holds, strategy A is safer.
    Safari has no such checkbox but has its own clipping bugs — see
    section 5. This is why agent-rendered delivery is the dependable
    path for dark-fidelity.

KEEP BACKGROUNDS — DON'T LET THE BROWSER STRIP THEM
  By default Chrome/Safari/Firefox remove all backgrounds in print.
  This kills card depth and the surface tints that separate panels.
  Use `print-color-adjust: exact` (and `-webkit-print-color-adjust:
  exact` for older Safari) on the elements that carry color you care
  about — cards, KPI cells, diagram boxes, code terminals.

BUT KILL FULL-BLEED ATMOSPHERES ON PAPER — DON'T PRESERVE THEM
  This is the #1 way a print export gets *destroyed*, and it is the
  opposite failure from "my PDF is all white." Section atmospheres
  (radial glows, grid overlays, `repeating-linear-gradient` stripes)
  are almost always painted from the ACCENT variables — the one set
  of colors the light-theme remap deliberately leaves untouched. So
  when you slap `print-color-adjust: exact` on `.atmos`, you force
  those full-saturation teal/amber grids to render at full strength
  on white paper — as black grounds and neon vertical stripes across
  every page. The dark ground you thought you neutralized is the
  atmosphere layer, not `body`.

  The fix is not to remap yet another variable. Atmospheres are pure
  screen decoration; freeze them OUT of print entirely:

    @media print {
      .atmos, [class*="atmosphere"],
      .hero .atmos::after { display: none !important; background: none !important; }
    }

  Then apply `print-color-adjust: exact` ONLY to the meaningful,
  bounded color carriers (cards, boxes, code blocks) — never to a
  full-bleed decorative layer. Card surface tints and accent text
  survive; the page-wide glow noise does not.

  Litmus test before you ship: if any `.atmos`/atmosphere selector
  paints from `--accent`, `--signal`, or any accent-derived
  `color-mix`, it MUST be `display:none` in print. No exceptions.

FREEZE THE PHASE ENGINE
  Animations don't print. The phase engine cycles through 4-8 states;
  capturing one frame at random gives the reader an arbitrary slice
  of the architecture. Solve this by registering a `beforeprint`
  listener that pauses the cycle and lights up EVERY group + arrow
  simultaneously — the "composite snapshot." The reader sees the
  full architecture in one frame.

PAGE BREAKS ARE A FIRST-CLASS DESIGN CONCERN
  Every section must declare a break behavior. Hero stays on page 1.
  KPI strip, diagram, table, insights each get their own page (or
  share cleanly). Never let a heading separate from its body.

VIEWPORT UNITS DON'T WORK AGAINST PAGE WIDTH
  `clamp(48px, 9vw, 148px)` against an A4 page (210mm wide) becomes
  ~19px. Hero headings collapse to body text. Override clamp values
  with fixed pt sizes inside `@media print`.

HIDE WHAT BELONGS ONLY ON SCREEN
  Theme toggle, scroll indicators, hover-only affordances, sticky
  TOC sidebars — none of these belong on paper. Hide them with
  `display: none !important` inside the print block.

===================================================================
2. THE @page RULE — PAGE GEOMETRY
===================================================================

Set page size and margins explicitly. A4 portrait is the global
default; letter is fine if the project is US-targeted.

  @page {
    size: A4;
    margin: 16mm 14mm;
  }
  @page :first {
    margin-top: 0;        /* hero bleeds to top edge */
  }

Decide per project whether to bleed the hero. Editorial designs
benefit from a full-bleed first page; technical reports prefer
uniform margins.

===================================================================
3. SKELETON — STARTING POINT, NOT A TEMPLATE
===================================================================

Use this as a shape. The exact selectors must match the project's
class names. Keep what applies, drop what doesn't.

  @media print {

    /* 1 -- force light theme regardless of user choice */
    :root, [data-theme="dark"] {
      --bg:           #ffffff;
      --bg-soft:      #fafbfc;
      --bg-elevated:  #ffffff;
      --bg-recessed:  #f5f6f8;
      --surface:      #ffffff;
      --surface-2:    #f5f6f8;
      --border:       #d6dce6;
      --border-soft:  #e1e6ee;
      --text:         #0d1422;
      --text-dim:     #475063;
      --text-muted:   #7a8298;
      /* keep the accent colors as-is */
    }

    /* 2 -- preserve backgrounds and gradients */
    html, body, section, .card, .kpi-cell, .diagram-wrap,
    [class*="atmosphere"] {
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }

    /* 3 -- hide on-screen-only elements */
    .theme-toggle, .scroll-indicator, .nav-sidebar, [data-screen-only] {
      display: none !important;
    }

    /* 4 -- replace clamp() font sizes with fixed pt */
    body { font-size: 10pt; line-height: 1.5; }
    h1   { font-size: 36pt; line-height: 1.05; }
    h2   { font-size: 22pt; line-height: 1.1; }
    h3   { font-size: 13pt; line-height: 1.2; }
    .kpi-num { font-size: 28pt; }
    .label, .mono { font-size: 8pt; }

    /* 5 -- page breaks
       NEVER put break-inside:avoid on `section` itself. A section taller
       than one page then cannot be placed anywhere, and the renderer
       silently DROPS its overflow — the classic "the whole table/list
       vanished from the PDF" bug. Apply avoid only to atomic children
       that genuinely must not split (cards, rows, KPI cells). Let tall
       containers (sections, tables, .table-wrap) break freely.
       Also don't stack break-after:page on .hero AND break-before:page
       on the next section — the double break strands a blank page
       between them. Pick one side. */
    section            { padding: 28pt 0; overflow: visible; }  /* NOT break-inside:avoid; overflow:visible undoes any screen overflow:hidden that would clip */
    .hero              { padding: 24pt 0; }
    .diagram-section   { break-before: page; }                  /* break BEFORE the target, not after the hero */
    .diagram-wrap      { break-inside: avoid; }
    h1, h2, h3         { break-after: avoid; }
    table, .table-wrap { break-inside: auto; }                  /* tall tables split across pages */
    thead              { break-inside: avoid; }                 /* header row stays intact (and repeats per page) */
    tr, .kpi-cell, .insight-card { break-inside: avoid; }

    /* 6 -- shrink generous padding for paper */
    .shell { max-width: 100%; padding: 0; }

    /* 7 -- neutralize fixed positioning */
    [style*="position: fixed"], .sticky-toc { position: static !important; }

    /* 8 -- make links printable (optional) */
    a[href^="http"]::after {
      content: " (" attr(href) ")";
      font-size: 7pt;
      color: var(--text-muted);
    }
  }

===================================================================
4. THE COMPOSITE SNAPSHOT — FREEZING THE PHASE ENGINE
===================================================================

The phase engine cycles through phases via `setInterval`. For print,
every group, source, and arrow must be lit at once so the diagram
renders as a complete architecture, not a single phase.

Add this to the script block alongside the phase engine. It assumes
the existing pattern in animation.md (declarative phases array,
`applyPhase()`, `resetSvg()`):

  // -- composite snapshot for print --
  function applyCompositePhase() {
    if (typeof stopPhases === 'function') stopPhases();
    if (typeof resetSvg === 'function') resetSvg();

    const banner = document.getElementById('phase-banner');
    if (banner) banner.textContent = '▶ Architecture overview — all phases';

    // collect every ID referenced in any phase
    const allGroups  = new Set();
    const allSources = new Set();
    const allArrows  = new Set();
    (phases || []).forEach(p => {
      (p.groups  || []).forEach(id => allGroups.add(id));
      (p.sources || []).forEach(id => allSources.add(id));
      (p.arrows  || []).forEach(id => allArrows.add(id));
    });

    const litColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent').trim() || '#0891b2';

    [...allGroups, ...allSources, ...allArrows].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.style.setProperty('--glow-color', litColor);
      el.classList.add('lit');
    });
  }

  window.addEventListener('beforeprint', applyCompositePhase);
  window.addEventListener('afterprint', () => {
    if (typeof startPhases === 'function') startPhases();
  });

  // also run if the page loads in print preview directly
  if (window.matchMedia && window.matchMedia('print').matches) {
    applyCompositePhase();
  }

WHY THIS WORKS
  - `beforeprint` fires synchronously before the browser captures
    the page. The cycle stops and every component is lit before
    rasterization begins.
  - `afterprint` resumes the animation when the user returns to
    the live page.
  - Reusing the existing `applyPhase` machinery (CSS custom properties
    + .lit class) means no new visual states to design.

===================================================================
4b. DARK-FIDELITY PRINT — KEEP THE SCREEN THEME ON PAPER
===================================================================

Use this INSTEAD of the section-3 light-remap when strategy B applies
(screen-consumed / agent-rendered PDF; "make it look like the site").
It is the inverse of everything the light path does: keep the dark
tokens, and paint the atmospheres rather than hiding them.

  @media print {
    /* 1 -- FORCE the dark tokens, overriding body.light if the user
       toggled the theme on screen. Use the project's real dark values. */
    :root, body, body.light {
      --bg: #0a0f16; --bg2: #0d141d;
      --surface: #121a24; --surface-2: #172231;
      --border: #223145; --border-2: #2e415b;
      --text: #e6edf6; --text-dim: #9fb0c6; --text-muted: #64758c;
      /* accents unchanged */
    }
    html, body { background: #0a0f16 !important; }

    /* 2 -- paint EVERYTHING, atmospheres INCLUDED. This is the one
       case where .atmos KEEPS print-color-adjust:exact — the dark
       ground and glows are the whole point. List every colored
       surface: sections, atmospheres, cards, diagram boxes, inner
       boxes, code terminals, chips, table cells, state dots. */
    html, body, section, .atmos, .card, .diagram-wrap, .kpi-cell,
    .group-box, .source-box, .inner-box, .code-term, .chip,
    .table-wrap, table, thead th, tbody td, .state-dot {
      print-color-adjust: exact; -webkit-print-color-adjust: exact;
    }

    /* 3 -- everything else (fonts, page breaks, overflow, SVG bounds,
       freeze) is IDENTICAL to the light path. Reuse sections 3 & 5.
       The ONLY differences from light-on-paper are steps 1 and 2. */
  }

DELIVERY IS PART OF THE DESIGN FOR STRATEGY B
  Dark-fidelity only survives if backgrounds are actually painted.
  Two reliable delivery paths:

  1. Ship a dedicated dark-print variant file and RENDER IT HEADLESSLY:
       chrome --headless=new --disable-gpu --no-pdf-header-footer \
         --virtual-time-budget=3000 \
         --print-to-pdf=out.pdf "file:///abs/report.dark-print.html"
     Headless Chromium paints backgrounds by default — no checkbox to
     miss. This is how an AGENT should deliver a dark PDF.

  2. If a human must Cmd+P it themselves, tell them explicitly to
     enable "Background graphics" in the dialog, and to use Chrome or
     Edge (Safari's clipping bugs, section 5, bite the dark path too).

  Keeping the light-on-paper @media print in the primary file and
  emitting a SEPARATE `*.dark-print.html` for headless rendering is a
  clean split: browser-Cmd+P users get the safe light default; the
  screen-artifact PDF gets full dark fidelity. Don't try to serve both
  from one @media print block — the "Background graphics" default
  makes a single dark block unreliable for interactive printing.

===================================================================
5. PRINT-SPECIFIC RULES PER OUTPUT MODE
===================================================================

REPORT MODE
  - Hero on its own page (`break-after: page` on .hero).
  - Diagram on its own page if it spans more than 60% of viewport
    height — otherwise let it ride with the next section.
  - KPI strip and exec summary share a page if they fit.
  - Tables use `break-inside: auto` so long rows split cleanly;
    individual rows use `break-inside: avoid`.

DIAGRAM-ONLY MODE
  - The diagram fills one page. Force `@page { size: A4 landscape; }`
    if the diagram is wide.
  - Hide phase banner controls — only the banner text and SVG
    should print.

SLIDE MODE
  - Each `.slide` element gets `break-after: page` so one slide
    per printed page.
  - Set `@page { size: A4 landscape; margin: 0; }` so slides
    print at full bleed (slides are designed for 16:9 viewports;
    landscape A4 is the closest paper match).
  - Hide slide navigation dots, prev/next buttons, slide counter.
  - Disable scroll-snap for print: `html { scroll-snap-type: none; }`
    inside `@media print`.

===================================================================
6. VERIFICATION
===================================================================

Before declaring print support done, verify in the browser's print
preview (Cmd+P / Ctrl+P), not just by reading the CSS:

  □ Light theme renders — no dark backgrounds bleeding ink
  □ NO full-bleed atmosphere noise — zero teal/amber grids, stripes,
    or radial glows painted across the page. If you see vertical
    lines or a dark ground on any page, an .atmos layer survived
    print and must be `display:none` (see "KILL FULL-BLEED
    ATMOSPHERES" above). This is the single most destructive bug.
  □ Hero heading reads at the intended size (not ~19px)
  □ All KPI cells visible, not collapsed to one column
  □ Diagram shows EVERY group lit (composite snapshot active)
  □ Theme toggle hidden
  □ Card surfaces + accent text survived (depth preserved) — this is
    the GOOD color; distinct from the atmosphere noise above
  □ Every section's full content is present — scroll each printed
    page and confirm nothing was dropped. A tall table or list that
    silently disappears means a section carries break-inside:avoid
    or overflow:hidden (see section 5).
  □ Tall tables split cleanly across pages with the header repeating
  □ No blank/near-empty pages between sections (double page-break)
  □ No section heading orphaned at end of page
  □ Page count is reasonable (target: 4-8 pages for report, 1
    for diagram-only, N+1 for slides where N = slide count)
  □ For slides: each slide on its own landscape page

ALWAYS verify by actually rendering the PDF, not just reading the CSS.
Print bugs (dropped content, atmosphere bleed, stranded pages) are
invisible in the source and only appear in the rasterized output.
Render headless and read back the pages:

  CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  # macOS fallbacks if Chrome is absent: Microsoft Edge, Brave, Chromium
  "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
    --virtual-time-budget=3000 \
    --print-to-pdf=/tmp/archflow-print-check.pdf \
    "file:///ABSOLUTE/PATH/report.html"

  - `--virtual-time-budget=3000` lets web fonts + the composite
    snapshot settle before capture.
  - `prefers-color-scheme: light` so any media-query branches pick
    the light path (the print stylesheet should also force it).
  - Then open/read the resulting PDF and walk the checklist above
    against the actual pages — that is the only reliable gate.

===================================================================
7. ANTI-PATTERNS
===================================================================

  → Building a separate "print version" of the report
    (duplication rots; one design, two media)
  → Replacing all colors with grayscale in print
    (loses semantic accent meaning; keep accents)
  → Hiding the diagram on print "because animations don't work"
    (the diagram IS the report — show the snapshot)
  → Using `display: none` on entire sections to fit on fewer pages
    (if it's not worth printing, it's not worth on screen either)
  → Forgetting `print-color-adjust: exact`
    (the most common cause of "my PDF is all white")
  → Applying `print-color-adjust: exact` to full-bleed atmosphere
    layers (the most common cause of "my PDF is all BLACK with neon
    stripes" — accent-driven grids/glows paint at full strength on
    white paper; `display:none` the atmospheres instead)
  → Putting `break-inside: avoid` on `section` / any container taller
    than a page (renderer can't place it and silently drops the
    overflow — content vanishes from the PDF)
  → Stacking `break-after: page` on one section AND `break-before:
    page` on the next (double break strands a blank page between them)
  → Leaving screen-only `overflow: hidden` on sections in print
    (clips any content that extends past the box; reset to
    `overflow: visible` in the print block)
  → Declaring print "done" by reading the CSS instead of rendering
    the actual PDF (every bug above is invisible in source)
  → Leaving `position: fixed` elements unhandled
    (they stamp on every page — toggles, sticky nav, banners)
