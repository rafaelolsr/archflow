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
WORKFLOW — FULL REPORT (default: /archflow)
===================================================================

  1. ANALYZE
     Read references/analysis.md → scan the codebase
     Read references/layouts.md  → decide the diagram layout pattern

  2. THINK (commit to a visual direction before coding)
     Read references/design-system.md → CSS patterns library
     Read references/libraries.md     → fonts, Mermaid, CDN imports
     Read references/design-qa.md     → quality gates

     Pick:
       → A font pairing that matches the project character
       → A color palette aesthetic (Blueprint, Terminal Mono, etc.)
       → A background atmosphere (radial glow, dot grid, mesh)

     Do NOT default to the same choices every time.
     Each report should feel intentionally designed.

  3. STRUCTURE
     Read references/animation.md    → phase engine for the diagram
     Read references/navigation.md   → TOC sidebar (if needed)

     Plan the report sections. Include at minimum:
       → Header (project name, description, date)
       → Executive summary
       → KPI metrics
       → Animated architecture diagram (MANDATORY — the hero section)
       → Component directory or data table
       → Supporting content as the project demands
         (data flow, benchmarks, external services, insights, etc.)
       → Code references

     Compose FREELY. Don't follow a rigid 10-section template.
     Add sections the project needs. Skip sections it doesn't.
     Create bespoke components (bar charts, comparison panels,
     distribution bars) when the data calls for them.

  4. STYLE
     Write CUSTOM CSS for this specific report.
     Don't reuse a generic template — design each report uniquely.
     Use the patterns from design-system.md as building blocks,
     but adapt them to this project's needs.

     The animated diagram section uses its own CSS classes
     (.component, .arrow-line, .vert-line, etc.) — keep those
     as documented in design-system.md and animation.md.

  5. DELIVER
     → Output to ./architecture-report.html
     → Single self-contained HTML file
     → External deps: Google Fonts CDN + optional Mermaid CDN
     → Present the file
     → Print a short summary

===================================================================
WORKFLOW — DIAGRAM ONLY (/archflow-diagram)
===================================================================

  1. Read references/analysis.md       → analyze the codebase
  2. Read references/layouts.md        → decide the layout
  3. Read references/design-system.md  → internalize diagram CSS
  4. Read references/animation.md      → understand the JS pattern
  5. Pick the closest template from templates/
  6. Generate architecture-diagram.html
  7. Present the file
  8. Print a short summary

  Templates (diagram-only mode):
    templates/horizontal-pipeline.html   → API / RAG / request-response
    templates/multi-agent-hub.html       → orchestrator + parallel agents
    templates/medallion-pipeline.html    → ETL / Delta Live Tables

===================================================================
WORKFLOW — SLIDE DECK (/archflow-slides)
===================================================================

  1. Read references/analysis.md       → analyze the codebase
  2. Read references/layouts.md        → decide the layout
  3. Read references/design-system.md  → CSS patterns
  4. Read references/libraries.md      → fonts, CDN imports
  5. Read references/animation.md      → phase engine
  6. Read references/slide-patterns.md → slide system
  7. Compose slide deck freely with animated diagram as hero slide
  8. Output to ./architecture-slides.html
  9. Present + summary

===================================================================
DESIGN PRINCIPLES
===================================================================

  → THINK before coding. Commit to an aesthetic direction first.
  → Write CUSTOM CSS per report. Don't reuse a generic template.
  → Pick DISTINCTIVE fonts. Never Inter, Roboto, Arial.
  → Use NAMED PALETTES (Blueprint, Terminal Mono, etc.), not random hex.
  → Create DEPTH through card tiers (hero, raised, recessed).
  → Build VISUAL HIERARCHY with varying sizes, weights, and space.
  → Add ATMOSPHERE with background gradients, grids, or SVG decoration.
  → The ANIMATED DIAGRAM is the hero — give it maximum visual weight.
  → Use MERMAID for supplementary diagrams (sequence, ER, state).
  → Create BESPOKE components when the data demands them.
  → Apply the SQUINT TEST: sections must be distinct when blurred.
  → Apply the SWAP TEST: design must survive font/color changes.

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
