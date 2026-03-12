# archflow

**A Claude Code plugin that turns any codebase into an animated HTML architecture diagram.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude_Code-Plugin-orange?style=for-the-badge)](https://claude.ai/code)

Ask Claude to explain a system architecture. Instead of a wall of text or ASCII art, it reads your codebase, identifies the real components and flows, and generates a self-contained animated HTML file you open in any browser.

```
/archflow:archflow
```

---

## What it produces

A single `architecture-diagram.html` file — no server, no dependencies, just open in a browser.

The diagram animates through the key phases of a typical request flowing through your system, lighting up components and arrows at each step. Real names from your code — actual class names, module paths, method names, and external service names — not generic placeholder boxes.

### Layouts

| System type | Layout |
|---|---|
| API / RAG / request-response | Horizontal pipeline |
| Multi-agent / ReAct loops | Multi-agent hub with parallel workers |
| ETL / Databricks / Delta Live Tables | Medallion pipeline |

---

## Why

Every coding agent defaults to text when you ask for an architecture explanation. Bullet points, nested lists, prose paragraphs. It works for trivial cases but anything beyond a 3-component system becomes hard to follow.

Diagrams are better. But asking an agent to "draw a diagram" usually gets you Mermaid syntax that doesn't render, ASCII art that breaks on resize, or a generic boxes-and-arrows template with no real names from your code.

archflow fixes that. It reads the actual code first, builds a mental model of the system, then generates a polished animated HTML diagram using real component names, real service names, and real data flows.

---

## Install

**Option 1 — Local plugin (development / testing):**

```bash
git clone https://github.com/rafaelolsr/archflow.git
claude --plugin-dir ./archflow
```

**Option 2 — Permanent install:**

```bash
git clone https://github.com/rafaelolsr/archflow.git
claude plugin install archflow --plugin-dir ./archflow
```

No restart needed — run `/reload-plugins` to pick up the plugin.

---

## Usage

Navigate to any project in Claude Code and run:

```
/archflow:archflow
```

Or trigger it with natural language — any of these work:

```
"visualize the codebase"
"generate an architecture diagram"
"explain how this repo works as a diagram"
"show me the data flow as an animation"
"create an architecture diagram of this system"
```

Claude Code will:

1. Map the directory structure
2. Read entry points and key orchestration files
3. Identify components, flows, and external services
4. Pick the best layout for the system shape
5. Generate `architecture-diagram.html` in your project root
6. Print a short summary with architectural observations

---

## Plugin structure

```
archflow/
├── .claude-plugin/
│   └── plugin.json               ← plugin manifest
├── skills/
│   └── archflow/
│       ├── SKILL.md              ← workflow orchestrator (model-invoked)
│       ├── references/
│       │   ├── analysis.md       ← how to read and model a codebase
│       │   ├── layouts.md        ← layout decision guide + HTML skeletons
│       │   ├── design-system.md  ← colors, typography, base CSS
│       │   └── animation.md      ← JS phase engine and animation patterns
│       └── templates/
│           ├── horizontal-pipeline.html  ← API / RAG systems
│           ├── multi-agent-hub.html      ← orchestrator + parallel agents
│           └── medallion-pipeline.html   ← ETL / Delta Live Tables
├── commands/
│   └── archflow.md               ← /archflow:archflow slash command
├── README.md
└── .gitignore
```

The skill routes to the right layout automatically. It reads only the files it needs — entry points, orchestration files, config — then fills in the closest template with real names and flows from your code.

---

## Design system

Dark and light themes with a toggle button in the top-right corner of every diagram. Theme preference persists across page reloads via localStorage.

**Semantic accent colors** (same in both themes):

| Color | Hex | Role |
|---|---|---|
| Cyan | `#00d4ff` | Input / user layer |
| Orange | `#ff6b35` | Orchestrator / coordinator |
| Purple | `#a78bfa` | Agents / workers |
| Yellow | `#e8b84b` | Storage / external services |
| Green | `#3fb950` | Output / persistence |
| Amber | `#f0883e` | LLM / AI core |

**Theme colors** (flip between dark and light):

| Element | Dark | Light |
|---|---|---|
| Background | `#080c10` | `#f4f5f7` |
| Cards | `#0d1117` | `#ffffff` |
| Borders | `#21262d` | `#d0d5dd` |
| Primary text | `#e6edf3` | `#1a1a2e` |

Font stack: `JetBrains Mono`, `Fira Code`, monospace.

---

## Limitations

- Requires a browser to view the output
- Works best on projects with clear entry points and orchestration files
- Shows one typical request flowing end-to-end — not a full dependency graph
- For monorepos, `cd` into the relevant service directory first

---

## License

MIT
