# Report Structure

Guide for building full architecture report pages.
The report wraps the animated diagram in a richer multi-section page
with summary, metrics, component directory, and data flow details.

===================================================================
REPORT SECTIONS — 10-SECTION STRUCTURE
===================================================================

  1. HEADER

     Project name as h1 (38px, font-weight 700, var(--text-primary)).
     One-line description (16px, var(--text-muted)).
     Generated date (font-mono, 11px, var(--text-dim)).
     Centered, max-width 800px, margin-bottom 48px.
     Stagger index --i: 0.

  2. EXECUTIVE SUMMARY

     2-3 sentence prose overview of the architecture.
     Use .af-card--hero with .af-section-label reading "OVERVIEW"
     in cyan (#00d4ff). Content is paragraph text in var(--font-body),
     15px, line-height 1.7.

     Should answer:
       → What does this system do?
       → What is its primary pattern (pipeline, hub-spoke, medallion)?
       → What are the main technologies?

     Stagger --i: 1.

  3. KPI ROW

     3-5 metric cards using .af-kpi-row > .af-kpi.
     Metrics to extract from codebase analysis:

       → Total components    count of major modules/services
       → External services   databases, APIs, queues
       → Data flow phases    number of animation phases
       → Primary language    language/framework
       → Optional            lines of code, test coverage if available

     Each .af-kpi gets a --i value for staggered fadeScale entrance.
     Stagger --i: 2-6.

  4. ANIMATED ARCHITECTURE DIAGRAM (HERO)

     This is the existing archflow diagram wrapped in a report section.
     Use .af-section with .af-section-label reading "ARCHITECTURE FLOW"
     in orange (#ff6b35).

     Inside: the phase-banner, then the full diagram HTML from the
     matching layout template (horizontal-pipeline, multi-agent-hub,
     or medallion-pipeline), then the insights row.

     The phase engine JS handles all animation in this section.
     This section should have NO max-width constraint — the diagram
     spans the full report width.

     Stagger --i: 7.

  5. COMPONENT DIRECTORY

     Data table (.af-table-wrap > .af-data-table) listing every
     component from the diagram. Columns:

       Name     the component label from the diagram
       Role     one-line description
       File     source file path, wrapped in <code>
       Layer    Input / Orchestration / Processing / Storage / Output
                use .af-tag with matching color

     Section label: "COMPONENT DIRECTORY" in purple (#a78bfa).
     Stagger --i: 8.

  6. DATA FLOW DETAIL (optional)

     Include ONLY when the system has a clear request/response or
     pipeline flow worth detailing beyond the animated diagram.

     Choose between two approaches based on complexity:

     A) Mermaid sequence diagram — for complex flows with multiple
        actors, async calls, or branching. Use .af-mermaid-wrap
        container with a <pre class="mermaid"> inside. Include the
        Mermaid CDN script when using this.

        Best for: API systems with client→gateway→service→db patterns,
        multi-agent systems with orchestrator dispatching.

     B) CSS pipeline — for simple linear flows (≤6 steps). Use
        .af-pipeline with .af-pipeline__step cards and
        .af-pipeline__arrow between them. Self-contained, no CDN needed.

        Best for: ETL pipelines, simple request→process→response flows.

     Section label: "DATA FLOW" in cyan (#00d4ff).
     Stagger --i: 9.

  7. EXTERNAL SERVICES

     Grid of .af-card elements:

       display: grid;
       grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
       gap: 16px;

     Each card shows:

       → Service name       font-weight 600, 14px
       → Type badge          .af-tag — Database, API, Cache, Queue, etc.
       → Connection detail   how the system connects: SDK, REST, gRPC, etc.
       → Purpose             one line, var(--text-muted)

     Section label: "EXTERNAL SERVICES" in yellow (#e8b84b).
     Stagger --i: 10.

  8. ARCHITECTURE INSIGHTS

     Grid of .af-card--elevated elements (same grid as External
     Services). 4-6 findings from the code analysis. Each insight has:

       → A short title       font-weight 600
       → 1-2 sentence explanation
       → Optional            file reference in <code>

     These should be non-obvious observations: design patterns found,
     potential bottlenecks, interesting architectural choices,
     technology-specific patterns.

     Section label: "INSIGHTS" in green (#3fb950).
     Stagger --i: 11.

  9. CODE REFERENCES

     Collapsible section using details.af-collapsible.
     Summary reads "Key Files (N files analyzed)".

     Inside: a list of the key files read during analysis, each with
     file path in <code> and a brief role description.

     NOT full code dumps — just paths + one-line descriptions.
     Stagger --i: 12.

  10. FOOTER

      Minimal. Centered text: "Generated by archflow · [date]".
      Font-size 11px, var(--text-dim), margin-top 64px, padding 24px.

===================================================================
PAGE LAYOUT
===================================================================

  The report page uses body.report-mode class (see design-system.md).

  Structure:

    <body class="report-mode">
      <button class="theme-toggle">◐</button>
      <!-- optional: TOC sidebar (see navigation.md) -->
      <div class="report-wrap">
        <!-- all 10 sections here -->
      </div>
    </body>

  The .report-wrap container is max-width 1100px, centered.
  The animated diagram section (section 4) should break out of
  this constraint if the diagram is wider — use:

    .af-section--diagram {
      max-width: none;
      margin-left: -24px;
      margin-right: -24px;
      padding: 0 24px;
    }

===================================================================
WHEN TO INCLUDE TABLE OF CONTENTS
===================================================================

  Include the TOC sidebar (see navigation.md) when the report
  has 5+ visible sections. Most reports will have 8-10 sections,
  so the TOC is typically included.

  If the data flow section (6) is omitted, the report may have
  as few as 9 sections — still include TOC.

  For very simple systems with only 4-5 components, consider
  omitting sections 6 and 9 to keep the report concise.

===================================================================
OUTPUT FILE
===================================================================

  Full report output: ./architecture-report.html
  Single self-contained HTML file.
  External dependencies (report mode only):

    → Google Fonts CDN     body font
    → Mermaid CDN          only when section 6 uses Mermaid approach

===================================================================
SECTION ORDERING RULES
===================================================================

  Sections 1-4 are always present. Section 4 (animated diagram)
  is the hero — it should have the most visual weight.

  Sections 5-9 are content sections. All should be present unless
  the project is very simple (fewer than 4 components).

  Section 10 (footer) is always present.

  Do not reorder sections. The flow is:
  context → metrics → visual hero → reference data → details → close

===================================================================
CONTENT GUIDELINES
===================================================================

  - Use REAL names from the codebase. Never "Component A" or "Service 1".
  - The executive summary should be prose, not bullet points.
  - KPI values should be real numbers extracted from analysis.
  - Component directory must match the animated diagram components exactly.
  - Insights should be non-obvious — not "the system uses a database".
  - Code references should only include files actually read during analysis.
  - Phase descriptions in the animated diagram should use actual
    function/class/method names from the code.
