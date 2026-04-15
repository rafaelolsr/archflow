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

This shows the anatomy of one group container with nested components,
one external source, a flow label, and one arrow connecting them.
Real diagrams have 3-5 groups, 1-2 sources, and arrows between.

  <!-- ── SOURCE BOX (external entity on the left) ── -->
  <rect class="source-box" id="src-user"
        x="20" y="180" width="140" height="70" rx="8"/>
  <text x="90" y="208" fill="var(--text)"
        font-size="14" font-weight="600"
        text-anchor="middle">🧑 User</text>
  <text x="90" y="227" fill="var(--text-dim)"
        font-size="10" text-anchor="middle">Chainlit · Teams</text>

  <!-- ── FLOW LABEL (above the arrow, natural language) ── -->
  <text x="215" y="200" fill="var(--text-muted)"
        font-size="9" text-anchor="middle">sends dashboard</text>

  <!-- ── ARROW: source → group (straight horizontal) ── -->
  <path class="arrow-path" id="arr-1"
        d="M160,215 L270,215"/>

  <!-- ── GROUP CONTAINER (subsystem) ── -->
  <rect class="group-box" id="grp-routing"
        x="270" y="140" width="190" height="150" rx="10"/>

  <!-- Group label (mono, uppercase, near top edge) -->
  <text x="290" y="165" fill="var(--text-muted)"
        font-size="11" letter-spacing="1.5" font-weight="600">
    ENTRY &amp; ROUTING
  </text>

  <!-- Component 1 (name only, no phase code) -->
  <rect x="290" y="178" width="150" height="36" rx="6"
        fill="var(--surface)" stroke="var(--border)" stroke-width="1"/>
  <text x="365" y="200" fill="var(--text)"
        font-size="12" font-weight="500"
        text-anchor="middle">WelcomeRouter</text>

  <!-- Component 2 -->
  <rect x="290" y="222" width="150" height="36" rx="6"
        fill="var(--surface)" stroke="var(--border)" stroke-width="1"/>
  <text x="365" y="244" fill="var(--text)"
        font-size="12" font-weight="500"
        text-anchor="middle">InputClassifier</text>

Anatomy:
  → Source box: 140×70px, 14px name, 10px subtitle — large and readable
  → Flow label: 9px, text-muted, positioned ABOVE the arrow (y=200 vs arrow y=215)
  → Arrow: straight horizontal M/L only, at consistent ARROW Y
  → Group-box: wraps components with 20px padding on all sides
  → Group label: 11px mono, uppercase, near top edge
  → Components: simple inner rects with 12px name, no phase codes
  → Component height: 36px, incrementing y by 44px (36 + 8px gap)

===================================================================
ARROW ROUTING
===================================================================

ALL ARROWS USE ONLY STRAIGHT HORIZONTAL AND VERTICAL LINES.

  Every arrow path uses M (move) and L (line-to) commands ONLY.
  No Q commands. No C commands. No curves of any kind. No diagonals.
  Sharp 90° corners are correct and intentional — do not soften them.

  The ONLY path commands allowed in arrow-path elements are:
    M (moveto)  — starting point
    L (lineto)  — straight segment to next point

  Straight horizontal:  d="M500,110 L640,110"
  Straight vertical:    d="M300,200 L300,340"
  Right-angle turn:     d="M500,110 L520,110 L520,200 L640,200"
  Two turns:            d="M200,300 L200,420 L700,420 L700,150"

  FORBIDDEN — do not use in any arrow-path:
    Q (quadratic curve) — NEVER, not even for "cosmetic rounding"
    C (cubic bezier)    — NEVER
    A (arc)             — NEVER
    Diagonal L segments (where both x AND y change) — NEVER
    Example of forbidden diagonal: d="M200,100 L500,300"

  Each L segment must change EITHER x OR y, never both.
  This guarantees every arrow is a clean staircase of H/V lines.

  Arrow marker: marker-end="url(#arrowhead)" on every path.
  During phase highlight, JS swaps stroke color (not the marker).

  COLLISION AVOIDANCE — CRITICAL:
    Arrows must NEVER pass through a box they don't connect to.
    This applies to ALL boxes — spine groups, branch groups, and
    source boxes. Before writing any arrow path, trace the route
    and check: "does this path cross any rect I did not intend
    to connect?" If yes, reroute.

    The most common collision: an arrow from a spine group to a
    branch group on the LEFT passes through a branch group in
    the CENTER. Fix: rearrange branch groups so each one sits
    directly below its parent spine group, or route the arrow
    around the obstacle.

    If rerouting is needed:
    → Route below:  go down past the bottom edge of the blocker,
      travel horizontally, then go back up to the target.
    → Route above:  same principle using the top edge.
    → Rearrange:    move the branch group so it's directly below
      its parent — often the cleanest fix.

    Bad (arrow crosses a branch group it doesn't connect to):
      d="M620,260 L620,310 L240,310 L240,410"
      (this horizontal segment at y=310 crosses any branch group
       between x=240 and x=620)

    Good (branch group moved directly below parent — straight drop):
      d="M240,260 L240,340"

  CLEARANCE GAPS:
    Arrows should maintain at least 15px clearance from any box
    edge they pass near but don't connect to. This prevents the
    visual ambiguity of "does this arrow touch that box?"

  FLOW LABELS — ABOVE THE ARROW, NEVER ON IT:
    Flow labels are freestanding <text> elements that describe what
    data moves between groups. They sit ABOVE the arrow line, not
    on top of it and not behind it.

    For horizontal arrows: place the label centered in the gap
    between two groups, with its y-coordinate 10-15px ABOVE the
    arrow's y-coordinate.

    For vertical arrows: place the label to the LEFT of the arrow
    line using text-anchor="end", with x offset 15px left of the
    arrow's x-coordinate.

    Flow labels use natural language (9-10px body font, text-muted):
      Good: "sends dashboard screenshot"
      Good: "human-approved analysis results"
      Good: "routes to vision or text analyzer"
      Bad:  "classify → vision / text"
      Bad:  "approved analysis"
      Bad:  single words like "export" or "advisor"

    If space is too tight for a label, omit it — the phase banner
    tells the story during animation.

===================================================================
FLOW COMPLETENESS RULES
===================================================================

Every SVG architecture diagram must satisfy these structural rules
before the phase engine or styling concerns are considered:

  NO ORPHAN GROUPS:
    Every group-box and source-box needs at least one arrow-path
    connecting it to another element. If a group has no arrows in
    or out, it is either missing a connection or should not be in
    the diagram.

  NO DEAD-END ARROWS:
    Every arrow-path must originate from a box and terminate at a
    box. An arrow that starts or ends in empty space is a bug.

  COMPLETE ENTRY-TO-EXIT PATH:
    A viewer must be able to trace arrows from the leftmost source
    to the rightmost output without gaps. If the path breaks, add
    the missing arrow.

  ARROW ID CONVENTIONS:
    Spine arrows (sequential L→R between groups): arr-1, arr-2,
    arr-3, etc. — numbered in flow order.
    Branch arrows (spine group → subordinate element): descriptive
    names like arr-orch-tools, arr-proc-storage.
    This naming makes the phase engine declarations self-documenting.

  SPINE vs BRANCH ARROWS:
    Spine arrows connect groups sequentially left-to-right along
    the primary data path — always straight horizontal at ARROW Y.
    Branch arrows connect a spine group to a subordinate element
    (storage, services, tools) — always vertical or orthogonal
    H/V routing. Never diagonal.

  BRANCH GROUP PLACEMENT:
    Branch groups sit BELOW their parent spine group or to the
    RIGHT of the rightmost spine group — never wedged between
    two spine groups. This keeps spine arrows clean and prevents
    branch groups from blocking the main flow path.

===================================================================
VISUAL PHILOSOPHY — MINIMALIST AND CLEAR
===================================================================

Architecture diagrams must be readable at a glance. Prioritize
whitespace, large text, and few elements over information density.
A diagram that requires zooming in has failed.

  LESS IS MORE:
    → 3-5 groups maximum on the spine. If the system has more
      subsystems, collapse related ones into a single group.
    → 1-3 items inside each group. Show the key components, not
      every function. Use a subtitle or count badge for detail
      (e.g., "11 tools" not all 11 listed).
    → No step-row codes (P0, P1, etc.) inside groups. The phase
      banner already tells the animation story. Components inside
      groups just need a name and optional one-line subtitle.

  WHITESPACE IS STRUCTURE:
    → Gaps between groups: 80-120px horizontal. This space is for
      arrows AND freestanding flow labels above the arrows.
    → Padding inside groups: 20-24px on all sides.
    → The diagram should feel airy, not packed.

  ICONS OVER CODES:
    Where possible, use a small emoji or Unicode symbol next to
    component names instead of phase codes. This conveys function
    at a glance: 💬 Chat, 🧠 LLM, 🔍 Search, 📊 Output.

===================================================================
LAYOUT GRID — PLAN BEFORE DRAWING
===================================================================

Before placing any SVG element, define a layout grid in a comment
at the top of the SVG. This prevents overlapping and ensures
consistent spacing.

  STEP 1 — DEFINE ROWS:
    Spine row:    y range for all spine groups (e.g., y=120..300)
    Gap:          y range between spine and branch rows (~40-60px)
    Branch row:   y range for branch groups (e.g., y=370..500)

    All spine groups share the same ARROW Y — a single horizontal
    line where all spine arrows run (e.g., y=210). Flow labels sit
    10-15px ABOVE this line.

  STEP 2 — DEFINE COLUMNS:
    List each element left-to-right with x ranges:
      Source:     x=20..160
      Gap:        x=160..270   (flow label + arrow)
      Group A:    x=270..460
      Gap:        x=460..580   (flow label + arrow)
      Group B:    x=580..780
      ...etc

    Each gap must be 80-120px wide — enough for the arrow and a
    flow label above it.

  STEP 3 — PLACE BRANCH GROUPS:
    Branch groups go in the branch row, positioned DIRECTLY BELOW
    their parent spine group (same x column) or to the RIGHT of
    the rightmost spine group. Never place a branch group between
    two spine groups.

    CRITICAL: each branch group must sit in its own column space.
    Branch groups must NOT overlap horizontally — if Group A is at
    x=20..220 and Group B is at x=270..620, there must be a gap
    between them. This ensures arrows from the spine can drop
    straight down into each branch without crossing the other.

    Dependency groups (services, storage, infrastructure) go to the
    RIGHT of the rightmost spine group they serve. This keeps the
    spine row clean and puts dependencies visually "downstream."

  STEP 4 — ROUTE ARROWS:
    Spine arrows: straight horizontal at ARROW Y.

    Branch-down arrows: STRAIGHT VERTICAL from the parent spine
    group's bottom edge to the branch group's top edge. The
    branch must be directly below the spine group (same x column)
    so the arrow is a simple vertical line with no turns.

    If a branch group is NOT directly below its parent, use a
    single L-turn: vertical down, then horizontal to the branch.
    Never cross another branch group with this route.

    Branch-return arrows: route OUTSIDE all branch groups — go
    below the lowest branch group, then horizontally, then up.
    Never route through or across another branch group.

    Dependency arrows: short vertical or horizontal from spine
    group edge to dependency group.

  STEP 5 — VERIFY NO CROSS-BRANCH COLLISIONS:
    After placing all arrows, check: does any arrow from spine
    group A to branch group A pass through branch group B?
    If yes, rearrange the branch groups so each one has a clear
    vertical corridor from its parent spine group.

  Write the grid as an SVG comment so it's auditable:

    <!--
      LAYOUT GRID:
      Spine row:   y=120..300 (arrow y=210)
      Branch row:  y=370..500
      Columns: User 20..160 | Gap | Routing 270..460 | Gap | ...
      Branch columns: Grounding 20..220 | Tools 270..620 | Eval 660..880
      Verify: each branch arrow drops straight down with no crossings
    -->

===================================================================
SIZING CONVENTIONS
===================================================================

  viewBox:     1100-1300px wide, 400-600px tall
  Group-box:   200-300px wide, 80-160px tall (keep compact)
  Source-box:  140-200px wide, 60-80px tall
  Inner items: simple rects, 36-40px tall, with name + subtitle
  Gap between groups: 80-120px horizontal, 40-60px vertical

  Font sizes (LARGER than typical — readability first):
    Group labels    11-12px mono, letter-spacing 1.5-2px, uppercase
    Component names 12-13px body, font-weight 600
    Component detail 10-11px body, text-dim color
    Source names    13-14px body, font-weight 600
    Source detail   10-11px, text-muted color
    Flow labels     10-11px body, text-dim, centered in gap

  Semantic color per group:
    Each group gets its own accent color from the palette.
    Components inside a group inherit that group's accent.
    Source boxes get accent colors matching their destination group.

===================================================================
TEXT CONTAINMENT — NO OVERFLOW
===================================================================

Every text element must fit inside its parent rect. Text that
overflows a box is the most common visual bug in generated SVGs.

  SIZE THE BOX TO THE TEXT, NOT THE OTHER WAY AROUND:
    1. Estimate text width: character count × font-size × 0.55
       (monospace) or × 0.50 (sans-serif). This is approximate —
       always add 20-30px horizontal padding.
    2. Set rect width ≥ estimated text width + padding.
    3. If the text is too long, either:
       a. Shorten the label (abbreviate, drop redundant words)
       b. Widen the rect (and shift downstream elements)
       c. Split into two <text> lines (increment y by line-height)
    Never truncate text hoping it fits — verify the math.

  MULTI-LINE TEXT IN SVG:
    SVG <text> does not word-wrap. For multi-line content, use
    <tspan> elements with explicit x and dy attributes:

      <text x="20" y="40" font-size="8">
        <tspan x="20" dy="0">Line one of the label</tspan>
        <tspan x="20" dy="12">Line two continues here</tspan>
      </text>

    Each tspan resets x to the left edge. dy="12" for 8px font,
    dy="14" for 9px font, dy="16" for 10px font.

  VERTICAL FIT:
    Group-box height must accommodate:
      header padding (20px) + group label (14px) +
      gap (8px) + (step-rows × row-pitch) + bottom padding (12px)

    If content overflows vertically, increase the group-box height.
    Never leave content hanging below the rect's bottom edge.

  INNER RECTS STAY INSIDE OUTER RECTS:
    For every inner rect, verify:
      inner.x ≥ outer.x + padding
      inner.x + inner.width ≤ outer.x + outer.width - padding
      inner.y ≥ outer.y + header-space
      inner.y + inner.height ≤ outer.y + outer.height - padding

===================================================================
CONSTRUCTION CHECKLIST
===================================================================

Run this mental checklist before finalizing any SVG diagram:

  1. TEXT FIT: Does every label fit inside its rect with padding?
     Scan each <text> element — is its x,y inside the parent rect
     bounds? Is the estimated text width less than the rect width
     minus padding?

  2. ARROW CLEARANCE: Does every arrow path avoid crossing boxes
     it doesn't connect to? Trace each path visually against the
     group/source rects.

  3. BOX OVERLAP: Do any rects overlap unintentionally? Check that
     no two group-boxes share coordinate space unless one is nested
     inside the other by design.

  4. VERTICAL BUDGET: Does the total content height fit the
     viewBox? Sum up: top padding + tallest column of groups +
     branch groups below spine + bottom padding + spine label.
     Adjust viewBox height if needed.

  5. HORIZONTAL BUDGET: Do all spine groups fit left-to-right with
     gaps between them? Sum up: left margin + group widths + gaps +
     right margin. Adjust viewBox width or group widths if tight.

  6. PHASE COVERAGE: Does the phase engine highlight every group
     and every spine arrow at least once? An unhighlighted group
     feels broken.

  7. READABILITY AT SCALE: Zoom the browser to 75%. Can you still
     read group labels and step codes? If not, increase font sizes
     or reduce the number of elements.

===================================================================
PHASE ENGINE DATA STRUCTURE
===================================================================

PHASE ORDERING PRINCIPLES:
  → Phases follow the flow spine. Phase 0 = entry/trigger. Each
    subsequent phase = the next spine group + the arrow leading to
    it. The last phase = exit/output.
  → Branch phases are interleaved, not appended. If the orchestrator
    calls services, that branch phase comes right after the
    orchestrator phase — not at the end of the array.
  → Each phase advances the story. A phase must move attention
    forward along the flow. No backtracking, no repeating a group
    that was already highlighted.

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
