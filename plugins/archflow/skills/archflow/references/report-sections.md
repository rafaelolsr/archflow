# Report Structure

Guidance for composing architecture report pages.
Reports should be composed FREELY — not from a rigid template.
Include the sections the project needs. Skip what it doesn't.

===================================================================
MANDATORY SECTIONS
===================================================================

Every report must include:

  1. HEADER
     → Project name (large, bold heading)
     → One-line description
     → Date, branch, team (optional metadata)

  2. EXECUTIVE SUMMARY
     → 2-3 paragraph overview of the architecture
     → What does this system do? What's the primary pattern?
     → Key technologies and design decisions
     → Use a hero card with accent border

  3. ANIMATED ARCHITECTURE DIAGRAM (HERO)
     → This is the core of every archflow report
     → Pick the layout from layouts.md (pipeline, hub, medallion)
     → Use the phase engine from animation.md
     → Wrap in a diagram-section container
     → Include phase banner + insights row
     → Give it MAXIMUM visual weight — full width, prominent position

===================================================================
RECOMMENDED SECTIONS
===================================================================

Include when relevant to the project:

  KPI METRICS
    → 3-7 metric cards: component count, services, phases,
      primary language, performance numbers, etc.
    → Use grid layout with hover effects

  COMPONENT DIRECTORY
    → Table listing components with name, role, file path, layer
    → Color-code layers with tags

  DATA FLOW DETAIL
    → Mermaid sequence diagram for complex flows
    → CSS pipeline steps for linear flows
    → Choose based on complexity

  EXTERNAL SERVICES
    → Card grid of databases, APIs, caches, queues
    → Each card: name, type badge, connection method, purpose

  ARCHITECTURE INSIGHTS
    → 4-6 non-obvious findings from code analysis
    → Vary card accents (don't make them all the same color)
    → Use asymmetric layout if one insight is more important

  CODE REFERENCES
    → Collapsible section listing key files analyzed
    → File path + brief role description

  BENCHMARK RESULTS (when performance data exists)
    → Before/After comparison panels
    → Data tables with baseline vs optimized
    → Bar visualizations for metrics

===================================================================
BESPOKE SECTIONS
===================================================================

Create custom sections when the data demands it:

  → Match distribution bars (for search/classification results)
  → Before/After architecture comparison panels
  → Fix/optimization step lists with severity dots
  → Timeline of changes
  → Dependency graphs (via Mermaid)
  → Configuration tables
  → Error/warning summaries

Don't force data into a generic template. If the project has
unique data, create a unique visualization for it.

===================================================================
COMPOSITION RECIPES — MIX THESE, DON'T REPEAT
===================================================================

Each recipe has a visual weight. Sequence them to create rhythm.

MAGAZINE OPENER                                    weight: MAXIMUM
  Full-width hero card with oversized display heading, accent bar,
  and 3-4 stat pills inline. Sets the tone. First thing the reader sees.
  Use for: Executive summary, project identity.
  Largest text, most padding, accent gradient background.

METRIC STRIP                                       weight: HIGH
  A full-width divided bar with 3-5 large numbers side by side.
  Each cell: giant display-font number (48-60px) + tiny mono label.
  Separated by thin vertical borders. No card wrapper — it IS the section.
  Use for: KPI overview, project stats, performance summary.

INSIGHT PULL-QUOTE                                 weight: MEDIUM
  A single editorial serif sentence spanning 80% of the page width.
  Large (20-24px), italic, with accent-colored left border or top rule.
  Max 1-2 per report. Positioned between dense sections as a breather.
  Use for: Key finding, executive takeaway, architectural philosophy.

SPLIT COMPARISON                                   weight: HIGH
  Two-column panel: left side tinted warm, right side tinted cool.
  Each side has its own heading and content. Optional animated particles
  flowing between panels.
  Use for: Before/after, raw/processed, old/new architecture.

ASYMMETRIC GRID                                    weight: MEDIUM-HIGH
  First item spans full width (the important one). Remaining items
  form a 2-3 column grid beneath it. The full-width item gets hero
  depth; grid items get base depth.
  Use for: Insights where one is more important, services with a primary.

RECESSED TABLE                                     weight: LOW
  Dark inset panel (inset shadow, darker surface) containing a data
  table with mono headers and dim row text. Hover highlights rows.
  Use for: Component directory, file references, config details.

TERMINAL BLOCK                                     weight: LOW-MEDIUM
  Dark recessed panel with three colored dots (decorative) and mono
  content. Looks like a terminal window.
  Use for: CLI output, command examples, log excerpts, code samples.

TIMELINE FLOW                                      weight: MEDIUM
  Vertical line on the left with dot markers. Steps branch to the right
  with title + description. Numbers or phase labels on the far left.
  Use for: Process steps, deployment stages, historical changes.

===================================================================
SEQUENCING — CREATE VISUAL RHYTHM
===================================================================

Never place two sections with the same visual weight adjacent.
Alternate HIGH and LOW weight sections. Use pull-quotes as breathers.

  GOOD sequence:
    Magazine Opener (MAX) → Metric Strip (HIGH) → Pull-Quote (MED)
    → Diagram (MAX) → Recessed Table (LOW) → Asymmetric Grid (MED-HIGH)

  BAD sequence:
    Hero Card → Card Grid → Card Grid → Card Grid → Table

  At least one section should break the single-column card pattern.
  Use grid-template-columns with varied ratios (5fr 3fr, not 1fr 1fr).

===================================================================
PAGE LAYOUT
===================================================================

  Body: var(--font-body), background with atmosphere effect
  Max width: 1100-1320px centered, or grid with TOC sidebar

  With TOC (recommended for 5+ sections):
    display: grid;
    grid-template-columns: 170px 1fr;
    gap: 32px;

  Without TOC (shorter reports):
    max-width: 1100px;
    margin: 0 auto;
    padding: 48px 24px;

  Mobile: collapse to single column at max-width: 1000px

===================================================================
OUTPUT
===================================================================

  File: ./architecture-report.html
  Self-contained HTML with Google Fonts CDN + optional Mermaid CDN
  Dark/light theme toggle with localStorage
  Responsive design (works on mobile)
