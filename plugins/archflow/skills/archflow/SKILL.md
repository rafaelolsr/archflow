---
name: archflow
description: >
  Analyzes a codebase and generates animated HTML architecture reports —
  beautiful, bespoke visualizations with interactive animated diagrams
  showing how the system works. Use this skill whenever the user asks to
  "visualize the codebase", "explain the architecture", "generate a diagram",
  "show how the code flows", "create an architecture diagram", "animate the
  data flow", "explain this repo visually", "show me how this works",
  or "generate an architecture report".
---

# Codebase Visualizer

Analyzes a codebase and produces beautiful, self-contained HTML
architecture outputs with animated flow diagrams.

===================================================================
OUTPUT MODES
===================================================================

  /archflow           → Full architecture report (default)
  /archflow-diagram   → Animated diagram only (legacy, self-contained)
  /archflow-slides    → Slide deck presentation

===================================================================
WORKFLOW — 7-STAGE PIPELINE (all modes)
===================================================================

Every output mode follows the same pipeline. Mode-specific behavior
is noted inline. After each stage completes, print a one-line status.

-------------------------------------------------------------------
STAGE 1: ANALYZE
-------------------------------------------------------------------

  Read references/analysis.md → scan the codebase.
  Read references/layouts.md  → decide the diagram layout pattern.

  Extract: components, groups, flows, external services.

  After completion, print:
    ANALYZE   ✓  {N} files scanned, {M} components, {K} external services

-------------------------------------------------------------------
STAGE 2: PLAN
-------------------------------------------------------------------

  Read references/design-system.md → CSS patterns library
  Read references/libraries.md     → fonts, Mermaid, CDN imports
  Read references/design-qa.md     → quality gates
  Read references/animation.md     → phase engine for the diagram
  Read references/navigation.md    → TOC sidebar (if needed)

  Produce a visible, structured architecture map BEFORE any HTML.

  Decide:
    → Font pairing that matches the project character
    → Color palette aesthetic (Blueprint, Terminal Mono, etc.)
    → Background atmosphere (radial glow, dot grid, mesh)
    → Layout pattern (pipeline, hub, medallion)

  Do NOT default to the same choices every time.

  Plan the content:
    REPORT MODE — plan report sections. Include at minimum:
      → Header (project name, description, date)
      → Executive summary
      → KPI metrics
      → Animated architecture diagram (MANDATORY — the hero section)
      → Component directory or data table
      → Supporting content as the project demands
      → Code references
      Compose FREELY. Add sections the project needs. Skip ones it doesn't.

    DIAGRAM-ONLY MODE — plan diagram layout and phases only.

    SLIDE MODE — plan content → slide type mapping and chunk boundaries
      (5-7 slides per chunk for chunked generation in BUILD).

  Output the architecture map to the user:

    PLAN
      Architecture: {N} components in {M} groups
      Layout: {horizontal-pipeline | multi-agent-hub | medallion-pipeline}
      Spine: {entry} → {group1} → {group2} → ... → {exit} ({P} phases)
      Design: {font pairing} · {palette} · {atmosphere}
      Sections: {N} sections planned
      ─────────────────────────────────
      Groups:
        HERO     {group name} — {description}
        ELEVATED {group name} — {description}
        DEFAULT  {group name} — {description}
        ...

  This is the CONTRACT. The BUILD stage implements this map — it does
  not re-decide architecture.

  After completion, print:
    PLAN      ✓  {M} groups, {P} phases, {layout} layout

-------------------------------------------------------------------
STAGE 3: BUILD
-------------------------------------------------------------------

  Read remaining reference docs as needed (svg-exemplar.md, etc.).
  Write HTML/CSS/SVG implementing the architecture map from PLAN.

  Use the design-system.md patterns as BUILDING BLOCKS, not templates.
  Compose unique CSS per project. Design each component fresh.

  REPORT MODE:
    → Write CUSTOM CSS for this specific report
    → Dark/light theme toggle with localStorage persistence
    → Responsive layout, prefers-reduced-motion support
    → The animated diagram is the hero section — maximum visual weight

  DIAGRAM-ONLY MODE:
    → Fully self-contained — zero external dependencies
    → Self-contained fonts: 'JetBrains Mono', 'Fira Code', monospace
    → Reference examples (for layout patterns, not rigid templates):
        templates/horizontal-pipeline.html
        templates/multi-agent-hub.html
        templates/medallion-pipeline.html

  SLIDE MODE (chunked generation with per-chunk review):
    1. PLAN stage defined chunk boundaries (5-7 slides per chunk)
    2. For each chunk:
       a. BUILD chunk:
          - Chunk 1: <head>, CSS, opening <div class="deck">, slides 1-N
          - Middle chunks: <section class="slide"> elements only
          - Last chunk: remaining slides, closing </div>, SlideEngine JS
       b. REVIEW chunk: spawn reviewer agent (see references/reviewer-agent.md)
          on the chunk HTML (subset checks relevant to slides)
       c. FIX chunk if CRITICAL or ERROR found (max 2 fix cycles per chunk)
       d. Print per-chunk progress:
            Chunk {i}/{M} (slides {start}-{end}): BUILD ✓  REVIEW ✓  (0C 0E 1W)
    3. Assemble all validated chunks into single file
    4. FINAL REVIEW on the assembled deck for cross-chunk issues:
       - Duplicate CSS definitions or mismatched variables
       - Slide count matching navigation dots
       - Consistent styling across all sections

  After completion, print:
    BUILD     ✓  {output-mode} generated ({lines} lines, {M} chunks)

-------------------------------------------------------------------
STAGE 4: DELIVER
-------------------------------------------------------------------

  Write the output file:
    REPORT MODE:   ./architecture-report.html
    DIAGRAM MODE:  ./architecture-diagram.html
    SLIDE MODE:    ./architecture-slides.html

  Single self-contained HTML file. Call present_files.

  After completion, print:
    DELIVER   ✓  {output-path}

-------------------------------------------------------------------
STAGE 5: REVIEW (independent agent)
-------------------------------------------------------------------

  Spawn a separate reviewer agent (Sonnet) to validate the output.
  See references/reviewer-agent.md for the full agent specification.

  The reviewer reads the HTML cold — it did not build the output and
  has no memory of what was intended. It only sees what was produced.
  This objectivity catches issues that self-review misses.

  The reviewer reads the generated HTML file and validates against
  the STRUCTURED REVIEW PROTOCOL in design-qa.md.

  It runs ALL check categories and produces a severity-scored report:

    REVIEW
      HTML validity ✓  All tags closed, no broken nesting
      Typography    ✓  2 font families (Instrument Serif + DM Sans + Fira Code)
      Palette       ✓  2 accents (cyan, orange) + neutrals
      Depth tiers   ✓  3 tiers used (hero, elevated, recessed)
      Color variety ✓  No monochrome grids
      Layout rhythm ✓  5 distinct section layouts
      Backgrounds   ✓  Each section has unique treatment
      SVG structure ✓  No orphan groups, all arrows connect
      SVG text fit  ⚠  WARNING: "VectorStoreIndex" may overflow rect at x=290 (est 148px, rect 150px)
      SVG labels    ✓  All flow labels inside gaps, no border overlap
      Animation     ✓  6 phases, all groups highlighted
      Theme toggle  ✓  CSS variables used throughout
      Accessibility ✓  prefers-reduced-motion supported
      ─────────────────────────────────
      VERDICT: PASS (0 CRITICAL, 0 ERROR, 1 WARNING)

  Severity levels:
    CRITICAL  Broken output (missing phase engine, no SVG, HTML syntax error)
    ERROR     Quality gate failure (single font, flat backgrounds, orphan SVG groups, text overflow)
    WARNING   Minor issue (tight text fit, same card shape 3x adjacent, could improve variety)
    INFO      Suggestion (could add a quote slide for breathing room)

  After completion, print:
    REVIEW    ✓  {VERDICT} ({C}C {E}E {W}W)

-------------------------------------------------------------------
STAGE 6: FIX (conditional)
-------------------------------------------------------------------

  Skip this stage if REVIEW verdict is PASS or CONDITIONAL PASS
  with only WARNINGs.

  If REVIEW has CRITICAL or ERROR findings:
    → Fix CRITICAL findings first — they break the output entirely.
    → Apply targeted fixes. One edit per finding.
    → Do NOT redesign — surgical corrections only.
    → After EACH edit, verify the fix took effect by re-reading the
      modified lines. A fix that doesn't change the output is not a fix.
    → After all fixes applied, re-run the full REVIEW (Stage 5).
      The re-review must confirm every previously-CRITICAL and
      previously-ERROR finding is now resolved. If any CRITICAL
      or ERROR persists, that is a failed fix cycle — loop again.
    → Keep looping (fix → review) until the verdict is PASS or
      CONDITIONAL PASS. Do not stop while CRITICAL or ERROR remain.
    → Hard ceiling: 5 cycles. If still failing after 5 cycles,
      something is fundamentally broken — present the full review
      report to the user and ask for guidance. Do not continue.

  After completion, print:
    FIX       ✓  {N} cycle(s) ({M} finding(s) resolved)

-------------------------------------------------------------------
STAGE 7: PRESENT
-------------------------------------------------------------------

  Print final summary with the accumulated progress report.

  REPORT / DIAGRAM MODE:

    ARCHFLOW: {project-name}
    ━━━━━━━━━━━━━━━━━━━━━━━━

      ANALYZE   ✓  {N} files scanned, {M} components found
      PLAN      ✓  {M} groups, {P} phases, {layout} layout
      BUILD     ✓  {output-mode} generated ({lines} lines)
      DELIVER   ✓  {output-path}
      REVIEW    ✓  PASS (0C 0E 1W)
      {FIX      ✓  1 cycle (1 warning resolved)}

    ━━━━━━━━━━━━━━━━━━━━━━━━
    OUTPUT: {path}
    QUALITY: {percentage}% ({warnings}W)

  SLIDE MODE (includes per-chunk detail):

    ARCHFLOW: {project-name}
    ━━━━━━━━━━━━━━━━━━━━━━━━

      ANALYZE   ✓  {N} files scanned, {M} components found
      PLAN      ✓  {M} groups, {P} phases, {N} slides in {M} chunks

      BUILD + REVIEW
        Chunk 1/{M} (slides 1-{n}):       BUILD ✓  REVIEW ✓  (0C 0E 1W)
        Chunk 2/{M} (slides {n+1}-{m}):   BUILD ✓  REVIEW ✗ → FIX ✓  (0C 0E 0W)
        ...

      ASSEMBLE  ✓  {M} chunks → {N} slides
      DELIVER   ✓  {output-path}
      FINAL REVIEW  ✓  PASS (0C 0E 1W)
      {FIX      ✓  1 cycle (1 warning resolved)}

    ━━━━━━━━━━━━━━━━━━━━━━━━
    OUTPUT: {path}
    QUALITY: {percentage}% ({warnings}W)
    FIX CYCLES: {count} (chunks {list})

===================================================================
DESIGN PRINCIPLES
===================================================================

Think MAGAZINE, not JIRA. Think PRODUCT PAGE, not ADMIN PANEL.

  → Each report should feel INTENTIONALLY DESIGNED for this specific
    project. If you swapped the CSS between two reports and nobody
    would notice, you haven't designed anything.
  → TYPOGRAPHY IS THE DESIGN. Use at least 2 distinct font families.
    Mix serif display (Instrument Serif, Playfair Display) with
    sans-serif body. Add a third voice for quotes/callouts.
    Never use one font family for everything.
  → The design-system.md provides BUILDING BLOCKS, not templates.
    Compose unique CSS per project. Don't copy class definitions —
    design each component fresh, guided by the principles.
  → BACKGROUNDS CREATE ATMOSPHERE. Each section is a different room.
    Every section MUST have its own unique background treatment
    (radial gradient, linear sweep, texture). No uniform flat
    backgrounds across all sections.
  → Keep the palette TIGHT — 2 accent colors + neutrals. Don't use 6+.
  → Use GENEROUS whitespace — 40-80px section padding. Let it breathe.
  → Every section has a UNIQUE layout AND component shape. Don't repeat
    card grids. Mix: full-bleed, split panels, stat bars, entity lists,
    editorial quotes, terminal mockups, SVG charts.
  → The ANIMATED DIAGRAM is the hero section — maximum visual weight.
  → SINGLE-PAGE DIAGRAMS: prefer compact layouts where the full
    architecture is visible in 1-2 viewport scrolls. Use horizontal
    flow-rows for linear 4-7 layer systems; vertical stacks only
    when layers have nested sub-components.
  → ALL diagrams on the page highlight in SYNC during phase animation.
  → Apply the SQUINT TEST: sections must be distinct when blurred.
  → Apply the SWAP TEST: hierarchy must work without color alone.
  → If it looks like a Bootstrap dashboard, redesign it.

===================================================================
OUTPUT RULES
===================================================================

  ALL MODES:
    → Single self-contained HTML file
    → Use real class/function/module names — never generic placeholders
    → Use real external service names (Azure Cosmos DB, not "Database")
    → Phase count: 4-8 phases (sweet spot for animation readability)
    → Max 8 components per row before layout gets crowded
    → After writing, call present_files

  REPORT MODE:
    → File: ./architecture-report.html
    → External deps: Google Fonts CDN + optional Mermaid CDN
    → Dark/light theme toggle with localStorage persistence
    → Responsive layout (works on mobile)
    → prefers-reduced-motion support

  DIAGRAM-ONLY MODE:
    → File: ./architecture-diagram.html
    → Fully self-contained — zero external dependencies

  SLIDE MODE:
    → File: ./architecture-slides.html
    → External deps: Google Fonts CDN

===================================================================
ANALYSIS DEPTH
===================================================================

  For diagram-only: components, data flows (4-8 phases), external
  services, 3-4 insights.

  For report/slides: ALSO extract component counts, file paths,
  layer classifications, detailed data flow descriptions, 4-6
  insights, and list of key files analyzed. Create bespoke
  visualizations when the data supports it (benchmarks, metrics,
  comparison panels, distribution charts).
