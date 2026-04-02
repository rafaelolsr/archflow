# SVG Architecture Diagram — Structural Exemplar

The gold-standard medium for architecture diagrams is inline SVG.
This file shows the structural pattern. Adapt names, groups,
connections, colors, and sizing per project — the structure stays.

===================================================================
CSS CLASS CONTRACTS
===================================================================

Five CSS classes drive all SVG diagram behavior:

  .arch-svg       Responsive container.
                  width:100%; height:auto; max-height:70vh

  .group-box      Subsystem container rect.
                  fill:var(--surface); stroke:var(--border); rx:8
                  transition:stroke .4s, filter .4s

  .source-box     External entity rect (inputs, outputs, consumers).
                  Same pattern as group-box, smaller.

  .arrow-path     Connection between groups.
                  stroke:var(--border); fill:none; stroke-width:1.5;
                  marker-end:url(#arrowhead)
                  transition:stroke .4s

  .lit            Phase-engine highlight state (added by JS).
                  .group-box.lit, .source-box.lit:
                    stroke:var(--glow-color);
                    filter:drop-shadow(0 0 12px var(--glow-color))
                  .arrow-path.lit:
                    stroke:var(--glow-color); stroke-width:2

All five classes use CSS custom properties (var(--surface), etc.)
so the dark/light theme toggle works automatically.

===================================================================
SVG SKELETON
===================================================================

  <svg class="arch-svg" viewBox="0 0 1100 520"
       xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Default arrowhead (dim) -->
      <marker id="arrowhead" viewBox="0 0 10 10"
              refX="9" refY="5" markerWidth="6" markerHeight="6"
              orient="auto-start-reverse">
        <path d="M0,1 L9,5 L0,9" fill="var(--text-muted)"/>
      </marker>
      <!-- Lit arrowhead (bright, used during phase highlight) -->
      <marker id="arrowLit" viewBox="0 0 10 10"
              refX="9" refY="5" markerWidth="6" markerHeight="6"
              orient="auto-start-reverse">
        <path d="M0,1 L9,5 L0,9" fill="var(--accent)"/>
      </marker>
    </defs>

    <!-- STRUCTURE GOES HERE (see annotated example below) -->
  </svg>

===================================================================
ANNOTATED STRUCTURE — ONE GROUP + SOURCE + ARROW
===================================================================

This shows the anatomy of one group container with nested step-rows,
one external source, and one arrow connecting them. Real diagrams
have 3-6 groups, 2-8 sources, and many arrows.

  <!-- ── SOURCE BOX (external entity on the left) ── -->
  <rect class="source-box" id="src-api"
        x="10" y="60" width="160" height="52"/>
  <text x="90" y="81" fill="var(--accent)"
        font-size="10" font-weight="600"
        text-anchor="middle">REST API</text>
  <text x="90" y="98" fill="var(--text-muted)"
        font-size="8" text-anchor="middle">Incoming Requests</text>

  <!-- ── ARROW: source → group ── -->
  <path class="arrow-path" id="arr-s1"
        d="M170,86 Q200,86 220,110 L240,130"/>

  <!-- ── GROUP CONTAINER (subsystem) ── -->
  <rect class="group-box" id="grp-process"
        x="240" y="30" width="260" height="170"
        stroke-width="1.5"/>

  <!-- Group label (mono, uppercase, near top edge) -->
  <text x="255" y="50" fill="var(--text-muted)"
        font-size="8" letter-spacing="1.5">
    PROCESSING LAYER
  </text>

  <!-- Step-row 1 (phase code + description) -->
  <rect x="255" y="60" width="230" height="32" rx="4"
        fill="var(--bg2)" stroke="var(--border)" stroke-width="1"/>
  <text x="270" y="80" fill="var(--accent)"
        font-size="9" font-weight="600">P0</text>
  <text x="295" y="80" fill="var(--text-dim)"
        font-size="9">Validate &amp; Route</text>

  <!-- Step-row 2 (increment y by 40) -->
  <rect x="255" y="100" width="230" height="32" rx="4"
        fill="var(--bg2)" stroke="var(--border)" stroke-width="1"/>
  <text x="270" y="120" fill="var(--accent)"
        font-size="9" font-weight="600">P1</text>
  <text x="295" y="120" fill="var(--text-dim)"
        font-size="9">Transform &amp; Enrich</text>

  <!-- Step-row 3 -->
  <rect x="255" y="140" width="230" height="32" rx="4"
        fill="var(--bg2)" stroke="var(--border)" stroke-width="1"/>
  <text x="270" y="160" fill="var(--accent)"
        font-size="9" font-weight="600">P2</text>
  <text x="295" y="160" fill="var(--text-dim)"
        font-size="9">Build Output Documents</text>

Anatomy:
  → Group-box rect wraps all step-rows with padding
  → Group label sits just below the top edge of the rect
  → Step-rows are inner rects, 32px tall, incrementing y by 40px
  → Each step has a phase code (bold, accent color) + description
  → Step-row width = group width minus ~30px padding (left+right)

===================================================================
ARROW ROUTING
===================================================================

Arrows use SVG path commands to route between groups:

  Straight horizontal:  d="M500,110 L540,110"
  Curved (Q = quadratic): d="M170,86 Q200,86 220,110 L240,130"
  Right-angle turn:     d="M170,58 L210,58 Q220,58 220,68 L220,100"

  Q curves produce smooth bends when arrows need to change direction.
  The control point of Q determines how tight the curve is.

  For complex routing (multiple turns):
    d="M170,58 L210,58 Q220,58 220,68 L220,100 Q220,110 230,110 L240,110"

  Arrow marker: marker-end="url(#arrowhead)" on every path.
  During phase highlight, JS can swap to url(#arrowLit) or just
  change the stroke color.

===================================================================
SIZING CONVENTIONS (starting defaults — adjust per content)
===================================================================

  viewBox:     1000-1100px wide, 400-520px tall
  Group-box:   240-280px wide, height = (step-rows × 40) + 50px header
  Source-box:  140-180px wide, 42-52px tall
  Step-row:    group width minus ~30px, 32px tall
  Gap between groups: 40-60px horizontal, 20px vertical

  Font sizes:
    Group labels    8-9px mono, letter-spacing 1.5-2px, uppercase
    Step codes      9px mono, bold, accent color
    Step text       9px body, text-dim color
    Source names    10-11px, font-weight 600
    Source detail   8px, text-muted color

  Semantic color per group:
    Each group gets its own accent color from the palette.
    Step codes inside a group inherit that group's accent.
    Source boxes get accent colors matching their destination group.

===================================================================
PHASE ENGINE DATA STRUCTURE
===================================================================

Declarative phase array — each phase declares WHAT to highlight:

  const phases = [
    {
      label: "Sources feed the pipeline — 5 data sources provide...",
      groups: [],
      sources: ["src-api", "src-db"],
      arrows: ["arr-s1", "arr-s2"],
      color: "#14b8a6"
    },
    {
      label: "P0-P2: Processing Layer — validate, transform, build...",
      groups: ["grp-process"],
      arrows: ["arr-s1"],
      color: "#06b6d4"
    },
    // ... 4-8 phases total
  ];

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

This is more maintainable than imperative if/else chains. Adding
a phase = adding one object to the array.

===================================================================
PHASE BANNER
===================================================================

A single-line text box positioned above the SVG, showing the
current phase description in that phase's color:

  <div class="s-phase-banner" id="phase-banner">Initializing...</div>

  .s-phase-banner {
    font-family: var(--font-mono);
    font-size: 12px;
    padding: 10px 16px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--surface);
    color: var(--accent);
    width: 100%;
    max-width: 1100px;   /* match SVG viewBox width */
    min-height: 38px;
    text-align: center;
    transition: color .3s, border-color .3s;
    margin-bottom: 16px;
  }

The JS applyPhase() updates both textContent and style.color
of this banner on each phase tick.

===================================================================
MULTIPLE SVG DIAGRAMS PER DECK
===================================================================

A slide deck typically has 2-4 SVG diagram slides:

  Slide 2 — HERO architecture (full pipeline, all groups, phase engine)
  Slide 3 — Data sources (source boxes → hub → output, static)
  Slide N — Output/consumers (index → consumer cards, static)
  Optional — Sequence detail (zoom into one group's internals)

Only the hero slide runs the phase engine. Other SVG slides are
static but use the same class vocabulary (source-box, group-box,
arrow-path) and theme variables for visual consistency.

Each SVG gets its own arrowhead marker IDs (ah2, ah3, etc.) to
avoid conflicts when multiple SVGs exist in the same HTML document.
