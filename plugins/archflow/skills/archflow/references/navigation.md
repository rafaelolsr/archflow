# Navigation

Sticky table-of-contents sidebar for report pages.
Include when the report has 5 or more sections.

===================================================================
WHEN TO INCLUDE
===================================================================

  Include the TOC sidebar when:
    - Report has 5+ visible sections (most reports qualify)
    - The page requires scrolling past 2 viewports of content

  Skip the TOC when:
    - Diagram-only mode (no report wrapper)
    - Slide deck mode (has its own nav system)
    - Very short reports (fewer than 5 sections)

===================================================================
HTML STRUCTURE
===================================================================

Place the <nav> BEFORE the .report-wrap div, both inside a grid wrapper.

  <body class="report-mode">
    <button class="theme-toggle">&#9684;</button>

    <div class="report-layout">
      <nav class="toc" id="toc">
        <div class="toc__inner">
          <div class="toc__title">CONTENTS</div>
          <a class="toc__link active" href="#overview">Overview</a>
          <a class="toc__link" href="#metrics">Metrics</a>
          <a class="toc__link" href="#architecture">Architecture Flow</a>
          <a class="toc__link" href="#components">Components</a>
          <a class="toc__link" href="#dataflow">Data Flow</a>
          <a class="toc__link" href="#services">External Services</a>
          <a class="toc__link" href="#insights">Insights</a>
          <a class="toc__link" href="#references">Code References</a>
        </div>
      </nav>

      <div class="report-wrap">
        <section class="af-section" id="overview">...</section>
        <section class="af-section" id="metrics">...</section>
        <!-- etc -->
      </div>
    </div>
  </body>

Each <section> in the report needs a matching id attribute
that corresponds to the TOC link href.

===================================================================
CSS — DESKTOP LAYOUT
===================================================================

  .report-layout {
    display: grid;
    grid-template-columns: 170px 1fr;
    gap: 32px;
    max-width: 1320px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .toc {
    position: sticky;
    top: 24px;
    align-self: start;
    max-height: calc(100vh - 48px);
    overflow-y: auto;
    padding-top: 48px;
  }

  .toc__inner {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .toc__title {
    font-family: var(--font-mono);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 3px;
    color: var(--text-dim);
    text-transform: uppercase;
    margin-bottom: 12px;
    padding-left: 12px;
  }

  .toc__link {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-muted);
    text-decoration: none;
    padding: 6px 12px;
    border-left: 2px solid transparent;
    border-radius: 0 4px 4px 0;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .toc__link:hover {
    color: var(--text-primary);
    background: rgba(0, 212, 255, 0.04);
  }

  .toc__link.active {
    color: #00d4ff;
    border-left-color: #00d4ff;
    background: rgba(0, 212, 255, 0.06);
  }

When TOC is present, the .report-wrap max-width should be 1100px
(it gets this from the grid column, not its own max-width).
Remove the margin: 0 auto from .report-wrap when using the grid.

  .report-layout .report-wrap {
    max-width: none;
    margin: 0;
    padding-top: 48px;
    padding-bottom: 48px;
    padding-left: 0;
    padding-right: 0;
  }

===================================================================
CSS — MOBILE LAYOUT
===================================================================

On narrow screens, the sidebar transforms to a horizontal
scrollable bar at the top of the page.

  @media (max-width: 1000px) {
    .report-layout {
      grid-template-columns: 1fr;
      gap: 0;
      padding: 0;
    }

    .toc {
      position: sticky;
      top: 0;
      z-index: 50;
      max-height: none;
      padding: 0;
      background: var(--bg-body);
      border-bottom: 1px solid var(--border);
      overflow-y: visible;
    }

    .toc__inner {
      flex-direction: row;
      gap: 0;
      overflow-x: auto;
      padding: 0 16px;
      -webkit-overflow-scrolling: touch;
    }

    .toc__title { display: none; }

    .toc__link {
      border-left: none;
      border-bottom: 2px solid transparent;
      border-radius: 0;
      padding: 12px 14px;
      font-size: 10px;
      flex-shrink: 0;
    }

    .toc__link.active {
      border-bottom-color: #00d4ff;
      border-left-color: transparent;
    }

    .report-layout .report-wrap {
      padding: 24px 16px;
    }
  }

===================================================================
JAVASCRIPT — SCROLL SPY
===================================================================

Place this at the end of the <script> block, after the phase engine
and Mermaid init (if present).

  // ── TOC SCROLL SPY ──────────────────────────────────────────
  (function() {
    const tocLinks = document.querySelectorAll('.toc__link');
    if (!tocLinks.length) return;

    const sections = [];
    tocLinks.forEach(link => {
      const id = link.getAttribute('href')?.replace('#', '');
      const section = id && document.getElementById(id);
      if (section) sections.push({ id, el: section, link });
    });

    if (!sections.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          tocLinks.forEach(l => l.classList.remove('active'));
          const match = sections.find(s => s.el === entry.target);
          if (match) {
            match.link.classList.add('active');
            // Auto-scroll the active link into view on mobile
            if (window.innerWidth <= 1000) {
              match.link.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
              });
            }
          }
        }
      });
    }, {
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    });

    sections.forEach(s => observer.observe(s.el));

    // Smooth scroll on TOC link click
    tocLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const id = link.getAttribute('href')?.replace('#', '');
        const target = id && document.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  })();

===================================================================
INTEGRATION NOTES
===================================================================

  The scroll spy uses IntersectionObserver, which does not
  conflict with the phase engine's setInterval. They operate
  on completely different DOM elements.

  The TOC links use href="#sectionId" which adds a hash to
  the URL. The smooth scroll handler prevents default to
  avoid the jump-then-scroll behavior.

  When generating the report, ensure each .af-section has
  a unique id that matches the corresponding .toc__link href.
