# Animation Reference

The JS phase engine that drives all diagram animation.
Use this engine as infrastructure — the phase cycling, element
targeting by ID, and resetAll logic are required. The visual
treatment of highlighting is flexible: design it to match
the project's aesthetic.

===================================================================
HIGHLIGHTING STYLES (choose what fits the design)
===================================================================

Default: border glow + box-shadow (shown in core pattern below).

Alternatives the agent may use instead:
  - Background color shift:  el.style.background = `${color}15`;
  - Opacity change:          el.style.opacity = '1'; (dim = '0.4')
  - Scale transform:         el.style.transform = 'scale(1.04)';
  - Border-left accent:      el.style.borderLeft = `3px solid ${color}`;
  - Class toggle + CSS:      el.classList.add('phase-active');

Mix and match per element type. The lit* helpers below show the
default glow approach — adapt or replace them to suit the design.

===================================================================
CORE PATTERN
===================================================================

The phase engine targets elements by ID regardless of whether they
are HTML or SVG elements. For architecture diagrams (the primary
use case), targets are SVG elements: <rect>, <path>, <circle>,
and <text> within an inline <svg>. See svg-exemplar.md for the
full structural pattern and CSS class contracts.

-------------------------------------------------------------------
PRIMARY: SVG ELEMENT TARGETING (architecture diagrams)
-------------------------------------------------------------------

For SVG diagrams, use the DECLARATIVE phase data structure.
Each phase is an object declaring what to highlight:

  const phases = [
    {
      label: "Sources feed the pipeline — description...",
      groups: [],                          // group-box IDs
      sources: ["src-api", "src-db"],      // source-box IDs
      arrows: ["arr-s1", "arr-s2"],        // arrow-path IDs
      color: "#14b8a6"
    },
    {
      label: "P0-P2: Processing — validate, transform...",
      groups: ["grp-process"],
      sources: [],
      arrows: ["arr-h1"],
      color: "#f59e0b"
    },
    // 4-8 phases total
  ];

  let phase = 0;

  function resetSvg() {
    document.querySelectorAll('.group-box, .source-box').forEach(el => {
      el.classList.remove('lit');
      el.style.removeProperty('--glow-color');
    });
    document.querySelectorAll('.arrow-path').forEach(el => {
      el.classList.remove('lit');
      el.style.removeProperty('--glow-color');
      el.setAttribute('marker-end', 'url(#arrowhead)');
    });
  }

  function applyPhase() {
    const p = phases[phase];
    const banner = document.getElementById('phase-banner');
    banner.textContent = '▶ ' + p.label;
    banner.style.color = p.color;
    banner.style.borderColor = p.color + '55';

    resetSvg();

    (p.groups || []).forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.style.setProperty('--glow-color', p.color); el.classList.add('lit'); }
    });
    (p.sources || []).forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.style.setProperty('--glow-color', p.color); el.classList.add('lit'); }
    });
    (p.arrows || []).forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.style.stroke = p.color; el.style.strokeWidth = '2'; el.classList.add('lit'); }
    });
  }

  applyPhase();
  setInterval(() => { phase = (phase + 1) % phases.length; applyPhase(); }, 2200);

This declarative pattern is more maintainable than imperative
if/else chains. Adding a phase = adding one object to the array.

The CSS for SVG highlight states:

  .group-box.lit, .source-box.lit {
    stroke: var(--glow-color);
    filter: drop-shadow(0 0 12px var(--glow-color));
  }
  .arrow-path.lit {
    stroke: var(--glow-color);
    stroke-width: 2;
  }

-------------------------------------------------------------------
SECONDARY: HTML ELEMENT TARGETING (card-based layouts)
-------------------------------------------------------------------

For non-SVG layouts (card grids, report sections), the imperative
pattern still applies. Theme-aware helpers read CSS custom properties:

  // ── THEME RESTORE (place at top of script) ─────────────────
  if (localStorage.getItem('archflow-theme') === 'light') document.body.classList.add('light');

  const borderColor = () => getComputedStyle(document.documentElement).getPropertyValue('--border').trim();
  const shadowAlpha = () => getComputedStyle(document.documentElement).getPropertyValue('--shadow-alpha').trim();

  function litComponent(id, color) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.borderColor = color;
    el.style.boxShadow = `0 0 18px ${color}${shadowAlpha()}`;
  }

  function litArrow(id, color, shimmer = false) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.background = color;
    if (shimmer) el.classList.add("active");
  }

  function litStorage(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.borderColor = "#e8b84b";
    el.style.boxShadow = "0 0 14px #e8b84b33";
  }

  function resetAll() {
    const bc = borderColor();
    document.querySelectorAll(".component, .agent-card, .storage-item").forEach(el => {
      el.style.borderColor = bc; el.style.boxShadow = "none";
    });
    document.querySelectorAll(".arrow-line, .vert-line").forEach(el => {
      el.style.background = bc; el.classList.remove("active");
    });
  }

===================================================================
LAYOUT-AGNOSTIC
===================================================================

The phase engine works with ANY layout direction — horizontal,
vertical, hub, medallion. It targets elements by ID, not by
position. The same JS pattern works for:

  → Inline SVG diagrams (primary — rect, path, circle elements)
  → Horizontal pipeline (flex-direction: row)
  → Vertical pipeline (flex-direction: column)
  → Multi-agent hub (mixed row + column)
  → Medallion pipeline (sequential stages)
  → Flow-row horizontal boxes

For slide decks, the phase engine almost always targets SVG
elements. For single-page reports, it may target a mix of SVG
and HTML elements.

===================================================================
CROSS-DIAGRAM HIGHLIGHTING
===================================================================

When a report has MULTIPLE diagrams (inline SVG, HTML cards,
flow-row pipeline), the phase engine should highlight elements
ACROSS ALL OF THEM simultaneously.

Each phase lights up the corresponding elements in EVERY diagram
on the page — telling a coherent story across all visualizations.

  SVG element highlighting (primary):
    The declarative phase data structure (see CORE PATTERN above)
    handles SVG elements via the groups/sources/arrows arrays.
    Each array entry is an element ID. The applyPhase() function
    sets --glow-color + .lit on matching elements.

  HTML element highlighting (secondary):
    For HTML card layouts alongside SVG diagrams, include the
    element IDs in the phase object and add lit* calls:

      if (phase === 2) {
        litComponent("card-timeseries", color);
        litFlowBox("flow-timeseries", color);
      }

    function litFlowBox(id, color) {
      const el = document.getElementById(id);
      if (!el) return;
      el.style.borderColor = color;
      el.style.boxShadow = `0 0 20px ${color}30`;
    }

  Reset must clear ALL diagram types:
    function resetAll() {
      // SVG elements (primary)
      resetSvg();  // clears .group-box, .source-box, .arrow-path
      // HTML cards (secondary)
      document.querySelectorAll('.arch-layer,.flow-box,.service-card').forEach(el => {
        el.classList.remove('lit');
        el.style.removeProperty('--glow-color');
        el.style.borderColor = '';
        el.style.boxShadow = '';
      });
    }

  IMPORTANT: Every diagram element that participates in the phase
  animation needs a unique ID. Use prefixes to avoid collisions:
    grp-*     for SVG group-box containers
    src-*     for SVG source-box entities
    arr-*     for SVG arrow-path connections
    con-*     for SVG consumer-box entities
    layer-*   for HTML arch-layer cards
    flow-*    for HTML flow-row boxes
    svc-*     for HTML service cards

===================================================================
THEME TOGGLE
===================================================================

The toggle button adds/removes the .light class on <body>.
All theme-sensitive colors are read from CSS custom properties,
so the phase engine works in both modes without changes.

  borderColor() reads --border     (dark: #21262d, light: #d0d5dd)
  shadowAlpha() reads --shadow-alpha (dark: 44, light: 22)

Accent colors (phaseColors, litStorage yellow) are the same in
both themes — they don't need CSS variables.

===================================================================
TIMING GUIDE
===================================================================

  1500ms    → default, works for 4-6 phases
  1800ms    → use for 7-8 phases (more reading time per label)
  1200ms    → minimum — below this feels rushed

===================================================================
SPOTLIGHT VS CUMULATIVE
===================================================================

  SPOTLIGHT (===)
    Only the currently active components glow.
    Everything else resets to dim.
    Best for: most diagrams, especially pipelines with 5+ phases.

  CUMULATIVE (>=)
    Each phase adds to what's already lit.
    Components stay glowing once activated.
    Best for: short 3-4 phase flows where you want to show
    the full path building up visually.

===================================================================
STORAGE ITEM ANIMATION
===================================================================

Storage items always use yellow (#e8b84b) regardless of phase color.
This visually distinguishes the external services tier from the
main processing layer at all times.

  litStorage("s-vectordb");   // always yellow glow
  litStorage("s-llm");        // always yellow glow

===================================================================
PROCESSING INDICATOR (optional)
===================================================================

For components that represent a slow/async operation (LLM call,
heavy transform), add a blinking indicator while active:

  HTML inside the component:
    <div class="proc-indicator" id="proc-llm">● PROCESSING</div>

  CSS:
    .proc-indicator { display:none; font-size:9px; color:#f0883e;
                      margin-top:8px; }
    .proc-indicator.visible { display:block;
                               animation:blink 0.5s linear infinite; }

  JS — toggle in applyPhase():
    document.getElementById("proc-llm")
      .classList.toggle("visible", phase === 2);

===================================================================
ENTRANCE ANIMATIONS — REPORT SECTIONS
===================================================================

In report mode, two animation systems coexist independently:

  1. PHASE ENGINE (this file, above)
     → Runs via setInterval in the animated diagram hero section
     → Controls component glow, arrow shimmer, phase banner
     → Loops continuously

  2. ENTRANCE ANIMATIONS (CSS only)
     → Fire once on page load for report sections
     → Staggered via --i CSS variable per element
     → Defined in design-system.md (fadeUp, fadeScale keyframes)

These do NOT conflict. The phase engine targets elements by ID
inside the diagram section (.component, .agent-card, .arrow-line,
.storage-item). Entrance animations target .af-section and .af-kpi
elements that live OUTSIDE the diagram section.

  Stagger index assignments (--i values):

    Section          --i    Animation
    Header            0     fadeUp
    Executive Summary 1     fadeUp
    KPI cards       2-6     fadeScale
    Diagram hero      7     fadeUp
    Component table   8     fadeUp
    Data flow         9     fadeUp
    External services 10    fadeUp
    Insights          11    fadeUp
    Code references   12    fadeUp

  How to apply:

    <section class="af-section" style="--i: 8" id="components">
      ...
    </section>

  The animated diagram section (--i: 7) gets the fadeUp entrance
  like other sections, but its internal components are controlled
  by the phase engine, not CSS animations.

===================================================================
REDUCED MOTION
===================================================================

Both animation systems respect prefers-reduced-motion:

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

This disables both entrance animations AND the phase engine's
CSS transitions (border-color, box-shadow). The setInterval
still runs but visual changes are instantaneous rather than
animated — content remains visible and functional.
