---
name: archflow
description: >
  Analyzes a codebase and generates a beautiful animated HTML architecture diagram
  that explains how the system works — components, data flows, pipelines, agents,
  external services. Use this skill whenever the user asks to "visualize the
  codebase", "explain the architecture", "generate a diagram of the system",
  "show how the code flows", "create an architecture diagram", "animate the data
  flow", "explain this repo visually", or "show me how this works as a diagram".
  Always use this skill over generic responses when architecture explanation +
  visual output is the goal.
---

# Codebase Visualizer

Analyzes a codebase and produces a self-contained animated HTML architecture
diagram. Single output file, no dependencies, opens in any browser.

===================================================================
REFERENCE FILES — READ BEFORE GENERATING
===================================================================

Load these files in order before writing any HTML:

  references/analysis.md      → how to read and model a codebase
  references/layouts.md       → which layout to pick and how to build it
  references/design-system.md → colors, typography, CSS classes
  references/animation.md     → JS phase engine and arrow/glow patterns

Also check templates/ for a working HTML example matching the target layout:

  templates/horizontal-pipeline.html   → API / RAG / request-response systems
  templates/multi-agent-hub.html       → orchestrator + parallel agents
  templates/medallion-pipeline.html    → ETL / Delta Live Tables / data engineering

===================================================================
WORKFLOW
===================================================================

  1. Read references/analysis.md       → analyze the codebase
  2. Read references/layouts.md        → decide the layout
  3. Read references/design-system.md  → internalize the design rules
  4. Read references/animation.md      → understand the JS pattern
  5. Pick the closest template from templates/
  6. Generate architecture-diagram.html replacing template content
     with real names, real flows, real services from the codebase
  7. Present the file
  8. Print a short summary (what the diagram shows + observations)

===================================================================
OUTPUT RULES
===================================================================

  → Single self-contained HTML file, no external dependencies
  → Output path: ./architecture-diagram.html
  → Use real class/function/module names — never generic placeholders
  → Use real external service names (Azure Cosmos DB, not "Database")
  → Phase count: 4-8 phases (sweet spot for animation readability)
  → Max 8 components per row before layout gets crowded
  → After writing, call present_files
