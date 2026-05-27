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

LIGHT THEME WINS ON PAPER
  Ink-heavy dark backgrounds waste toner and look wrong in PDF
  viewers. Force the light theme for print, regardless of what the
  user picked on screen. Keep accent colors — they're the only thing
  that survives black-and-white photocopying anyway.

KEEP BACKGROUNDS — DON'T LET THE BROWSER STRIP THEM
  By default Chrome/Safari/Firefox remove all backgrounds in print.
  This kills section atmospheres and card depth. Use
  `print-color-adjust: exact` (and `-webkit-print-color-adjust: exact`
  for older Safari) on the elements that carry color you care about.

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

    /* 5 -- page breaks */
    section            { break-inside: avoid; padding: 28pt 0; }
    section + section  { break-before: auto; }
    .hero              { break-after: page; padding: 24pt 0; }
    .diagram-wrap      { break-inside: avoid; }
    h1, h2, h3         { break-after: avoid; }
    table              { break-inside: auto; }
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
  □ Hero heading reads at the intended size (not ~19px)
  □ All KPI cells visible, not collapsed to one column
  □ Diagram shows EVERY group lit (composite snapshot active)
  □ Theme toggle hidden
  □ Section atmospheres visible (gradients survived)
  □ No section heading orphaned at end of page
  □ Page count is reasonable (target: 4-8 pages for report, 1
    for diagram-only, N+1 for slides where N = slide count)
  □ For slides: each slide on its own landscape page

If verifying via headless rendering for a generated PDF:
  - Use `--print-to-pdf` with `--no-pdf-header-footer`
  - Pass `--virtual-time-budget=2000` to let fonts load
  - Set `prefers-color-scheme: light` so any media-query branches
    pick the light path (the print stylesheet should also force it)

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
  → Leaving `position: fixed` elements unhandled
    (they stamp on every page — toggles, sticky nav, banners)
