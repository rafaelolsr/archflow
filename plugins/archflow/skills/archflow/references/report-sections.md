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
LAYOUT COMPOSITION
===================================================================

Don't stack identical cards. Create visual rhythm:

  → Full-width hero card for overview
  → Multi-column grid for KPIs (auto-fit, minmax)
  → Full-width diagram section with background container
  → Table with scrollable wrapper
  → Asymmetric grid for insights (important one full-width)
  → Split panels for before/after comparisons
  → Collapsible details for secondary content

  At least one section should break the single-column pattern.
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
