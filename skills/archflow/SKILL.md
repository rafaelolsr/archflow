---
name: archflow
description: >
  Analyzes a codebase and generates animated HTML architecture reports —
  diagrams, data flows, component directories, metrics, and insights.
  Use this skill whenever the user asks to "visualize the codebase",
  "explain the architecture", "generate a diagram of the system",
  "show how the code flows", "create an architecture diagram", "animate
  the data flow", "explain this repo visually", "show me how this works
  as a diagram", or "generate an architecture report".
  Always use this skill over generic responses when architecture
  explanation + visual output is the goal.
---

# Codebase Visualizer

Analyzes a codebase and produces animated HTML architecture outputs.
Three output modes: full report (default), diagram-only, and slide deck.

===================================================================
OUTPUT MODES
===================================================================

  /archflow           → Full architecture report (default)
  /archflow-diagram   → Animated diagram only (legacy, self-contained)
  /archflow-slides    → Slide deck presentation

===================================================================
REFERENCE FILES — LOAD BEFORE GENERATING
===================================================================

  ALWAYS read (all modes):

    references/analysis.md      → how to read and model a codebase
    references/layouts.md       → which layout to pick and how to build it
    references/design-system.md → colors, typography, CSS classes
    references/animation.md     → JS phase engine and arrow/glow patterns

  REPORT MODE — also read:

    references/report-sections.md → report structure + component catalog
    references/navigation.md      → sticky TOC sidebar + scroll spy

  SLIDE MODE — also read:

    references/slide-patterns.md  → slide deck system + slide types

  Templates — pick the closest match:

    Diagram-only templates:
      templates/horizontal-pipeline.html   → API / RAG / request-response
      templates/multi-agent-hub.html       → orchestrator + parallel agents
      templates/medallion-pipeline.html    → ETL / Delta Live Tables

    Report templates:
      templates/report-pipeline.html       → full report with pipeline diagram
      templates/report-hub.html            → full report with hub diagram
      templates/report-medallion.html      → full report with medallion diagram

    Slide template:
      templates/slide-deck.html            → slide deck presentation

===================================================================
WORKFLOW — FULL REPORT (default: /archflow)
===================================================================

  1. Read references/analysis.md       → analyze the codebase
  2. Read references/layouts.md        → decide the layout pattern
  3. Read references/design-system.md  → internalize the design rules
  4. Read references/animation.md      → understand both animation systems
  5. Read references/report-sections.md → plan the report sections
  6. Read references/navigation.md     → plan the TOC sidebar
  7. Pick the closest report template from templates/report-*.html
  8. Generate architecture-report.html replacing all [PLACEHOLDER]
     content with real names, real flows, real services from the codebase
  9. Present the file
  10. Print a short summary (what the report covers + key observations)

===================================================================
WORKFLOW — DIAGRAM ONLY (/archflow-diagram)
===================================================================

  1. Read references/analysis.md       → analyze the codebase
  2. Read references/layouts.md        → decide the layout
  3. Read references/design-system.md  → internalize the design rules
  4. Read references/animation.md      → understand the JS pattern
  5. Pick the closest template from templates/ (diagram-only versions)
  6. Generate architecture-diagram.html replacing template content
     with real names, real flows, real services from the codebase
  7. Present the file
  8. Print a short summary (what the diagram shows + observations)

===================================================================
WORKFLOW — SLIDE DECK (/archflow-slides)
===================================================================

  1. Read references/analysis.md       → analyze the codebase
  2. Read references/layouts.md        → decide the layout
  3. Read references/design-system.md  → internalize the design rules
  4. Read references/animation.md      → understand the phase engine
  5. Read references/slide-patterns.md → understand the slide system
  6. Pick templates/slide-deck.html
  7. Generate architecture-slides.html replacing template content
     with real names, real flows, real services from the codebase
  8. Present the file
  9. Print a short summary

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

  REPORT MODE output:
    → File: ./architecture-report.html
    → External deps allowed: Google Fonts CDN (body font)
    → Optional: Mermaid CDN (only if data flow section uses Mermaid)
    → Include TOC sidebar for reports with 5+ sections (almost always)
    → 10-section structure as defined in report-sections.md

  DIAGRAM-ONLY MODE output:
    → File: ./architecture-diagram.html
    → Fully self-contained — zero external dependencies
    → No Google Fonts, no Mermaid, no CDNs

  SLIDE MODE output:
    → File: ./architecture-slides.html
    → External deps allowed: Google Fonts CDN
    → Animated diagram as the hero slide

===================================================================
ANALYSIS DEPTH — WHAT TO EXTRACT
===================================================================

  For diagram-only mode, extract:
    → Components and their roles
    → Data flows between components (4-8 phases)
    → External services
    → 3-4 architectural insights

  For report mode, ALSO extract:
    → Component count, external service count, flow phase count
    → Primary language / framework
    → File paths for each component (for the component directory table)
    → Layer classification per component (Input / Orchestration / Processing / Storage / Output)
    → Detailed data flow description (for the optional Mermaid or CSS pipeline section)
    → 4-6 architectural insights (more than diagram mode)
    → List of key files analyzed (for the code references section)

  For slide mode, use the same depth as report mode.

===================================================================
DATA FLOW SECTION — MERMAID vs CSS PIPELINE
===================================================================

  The report's Data Flow section (section 6) can use either:

  A) MERMAID SEQUENCE DIAGRAM
     → Best for: complex flows with multiple actors, async calls, branching
     → Requires Mermaid CDN script at end of body
     → Use for: API systems, multi-agent orchestration, event-driven
     → See design-system.md for Mermaid container CSS + CDN import

  B) CSS PIPELINE
     → Best for: simple linear flows with ≤6 steps
     → Fully self-contained, no CDN needed
     → Use for: ETL pipelines, simple request→process→response
     → See design-system.md for .af-pipeline CSS

  Choose the approach that best fits the codebase's data flow pattern.
  When in doubt, prefer CSS pipeline (simpler, no CDN dependency).
