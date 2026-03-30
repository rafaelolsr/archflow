# Slide Patterns

Scroll-snap slide deck system for architecture presentations.
Each slide is exactly 100dvh tall. No scrolling within slides.

===================================================================
SLIDE ENGINE — BASE HTML
===================================================================

  <body>
    <button class="theme-toggle" onclick="...">◐</button>
    <div class="deck">
      <section class="slide slide--title"> ... </section>
      <section class="slide slide--content"> ... </section>
      <!-- more slides -->
    </div>
  </body>

===================================================================
SLIDE ENGINE — BASE CSS
===================================================================

  .deck {
    height: 100dvh;
    overflow-y: auto;
    scroll-snap-type: y mandatory;
    scroll-behavior: smooth;
  }

  .slide {
    height: 100dvh;
    scroll-snap-align: start;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: clamp(32px, 5vh, 80px) clamp(24px, 5vw, 120px);
    position: relative;
  }

===================================================================
TYPOGRAPHY SCALE — SLIDES
===================================================================

Slide text is 2-3x larger than report text for distance viewing.

  Element           Size                 Weight
  Display (titles)  clamp(48px,10vw,96px) 700
  Section numbers   clamp(100px,20vw,200px) 200 (decorative)
  Headings          clamp(28px,5vw,48px)  700
  Body / bullets    clamp(16px,2.2vw,24px) 400
  Code blocks       clamp(14px,1.8vw,18px) 400 (mono)
  Labels / captions 11px                  600 (mono, uppercase)

===================================================================
NAVIGATION CHROME
===================================================================

Fixed-position UI elements above all slides at z-index 100.

  Progress bar (top):

    .slide-progress {
      position: fixed; top: 0; left: 0; z-index: 100;
      height: 3px; background: #00d4ff;
      transition: width 0.3s ease;
    }

  Nav dots (right):

    .slide-nav {
      position: fixed; right: 16px; top: 50%;
      transform: translateY(-50%); z-index: 100;
      display: flex; flex-direction: column; gap: 8px;
    }
    .slide-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--border); cursor: pointer;
      transition: background 0.2s, transform 0.2s;
      border: none; padding: 0;
    }
    .slide-dot.active {
      background: #00d4ff;
      transform: scale(1.5);
    }

  Slide counter (bottom-right):

    .slide-counter {
      position: fixed; bottom: 16px; right: 16px; z-index: 100;
      font-family: var(--font-mono); font-size: 12px;
      color: var(--text-dim);
    }

===================================================================
SLIDE ENGINE — JAVASCRIPT
===================================================================

  class SlideEngine {
    constructor() {
      this.deck = document.querySelector('.deck');
      this.slides = [...document.querySelectorAll('.slide')];
      this.current = 0;
      this.buildChrome();
      this.observe();
      this.bindKeys();
      this.bindTouch();
    }

    buildChrome() {
      // Progress bar
      const bar = document.createElement('div');
      bar.className = 'slide-progress';
      bar.id = 'slide-progress';
      document.body.appendChild(bar);

      // Nav dots
      const nav = document.createElement('div');
      nav.className = 'slide-nav';
      this.slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'slide-dot';
        dot.addEventListener('click', () => this.goTo(i));
        nav.appendChild(dot);
      });
      document.body.appendChild(nav);
      this.dots = [...nav.querySelectorAll('.slide-dot')];

      // Counter
      const counter = document.createElement('div');
      counter.className = 'slide-counter';
      counter.id = 'slide-counter';
      document.body.appendChild(counter);

      this.update(0);
    }

    observe() {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = this.slides.indexOf(entry.target);
            if (idx >= 0) this.update(idx);
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.5 });
      this.slides.forEach(s => observer.observe(s));
    }

    update(idx) {
      this.current = idx;
      const pct = ((idx + 1) / this.slides.length) * 100;
      document.getElementById('slide-progress').style.width = pct + '%';
      document.getElementById('slide-counter').textContent =
        `${idx + 1} / ${this.slides.length}`;
      this.dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }

    goTo(idx) {
      this.slides[idx]?.scrollIntoView({ behavior: 'smooth' });
    }

    bindKeys() {
      document.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
          e.preventDefault();
          this.goTo(Math.min(this.current + 1, this.slides.length - 1));
        }
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
          e.preventDefault();
          this.goTo(Math.max(this.current - 1, 0));
        }
        if (e.key === 'Home') { e.preventDefault(); this.goTo(0); }
        if (e.key === 'End') { e.preventDefault(); this.goTo(this.slides.length - 1); }
      });
    }

    bindTouch() {
      let startY = 0;
      this.deck.addEventListener('touchstart', e => { startY = e.touches[0].clientY; });
      this.deck.addEventListener('touchend', e => {
        const diff = startY - e.changedTouches[0].clientY;
        if (Math.abs(diff) > 50) {
          this.goTo(diff > 0
            ? Math.min(this.current + 1, this.slides.length - 1)
            : Math.max(this.current - 1, 0));
        }
      });
    }
  }

Instantiate after DOM ready:

  new SlideEngine();

===================================================================
PLANNING PROCESS — BEFORE WRITING HTML
===================================================================

Before producing any slide HTML, follow this sequence:

  1. Inventory all content from the architecture analysis
     - List every component, service, data flow, insight, etc.
     - Note which items are dense (need diagrams/grids) vs sparse (quotes, transitions)

  2. Map each content item to a slide type
     - Choose from the catalog below (title, content, split, quote, etc.)
     - A 7-section architecture typically produces 10-15 slides, not exactly 7
     - Dense topics may need 2 slides; transitions need breathing room

  3. Plan compositional variety
     - Sketch the layout sequence: centered, split-left, full-bleed, centered...
     - Verify no two adjacent slides use the same layout
     - Insert quote or section-divider slides between heavy content blocks

  4. Verify completeness
     - Every content item from step 1 must appear in at least one slide
     - No slide should feel overstuffed — split if needed

===================================================================
SLIDE TYPES — CORE CATALOG
===================================================================

The 7-slide structure below is a SUGGESTED starting point for minimal
decks. Real presentations should mix in split, quote, full-bleed, and
section-divider slides to create visual rhythm. Use as many slides as
the content requires.

  Type              Class                   When to Use
  Title             slide--title            Opening, closing
  Content           slide--content          Component grids, data flow, services, insights
  Diagram           slide--diagram          Animated architecture hero
  Split             slide--split            Text+diagram, before/after, comparison
  Quote             slide--quote            Key takeaway between dense slides
  Full-bleed        slide--bleed            Dramatic moments, visual emphasis
  Section divider   slide--divider          Transitions between major topics
  Summary           slide--title            Closing with key takeaway

Suggested starting sequence (adapt freely):

  Slide   Type              Content
  1       Title             Project name, one-line description, date
  2       Architecture      Animated diagram (HERO — phase engine runs here)
  3       Components        KPI cards + component grid
  4       Data Flow         Phase descriptions as step-by-step list
  5       Services          External service cards
  6       Insights          Key findings grid
  7       Summary           Closing with key takeaway

===================================================================
SLIDE 1 — TITLE
===================================================================

  <section class="slide slide--title">
    <div style="text-align:center;max-width:800px;">
      <div style="font-family:var(--font-mono);font-size:11px;
           letter-spacing:3px;color:var(--text-dim);text-transform:uppercase;
           margin-bottom:16px;">ARCHITECTURE OVERVIEW</div>
      <h1 style="font-size:clamp(48px,10vw,96px);font-weight:700;
          color:var(--text-primary);letter-spacing:-2px;line-height:1.05;
          margin-bottom:16px;">[System Name]</h1>
      <p style="font-size:clamp(16px,2.2vw,22px);color:var(--text-muted);
         line-height:1.5;max-width:600px;margin:0 auto 24px;">
        [One-line system description]
      </p>
      <div style="font-family:var(--font-mono);font-size:11px;color:var(--text-dim);">
        Generated [DATE]
      </div>
    </div>
  </section>

===================================================================
SLIDE 2 — ANIMATED ARCHITECTURE (HERO)
===================================================================

This slide contains the full animated diagram from archflow.
The phase engine runs here — setInterval, litComponent, litArrow, etc.

  <section class="slide slide--diagram">
    <div class="diagram-section" style="width:100%;max-width:1100px;">
      <div class="phase-banner" id="phase-banner">▶ Waiting...</div>
      <!-- Full diagram HTML from the matching layout template -->
      <!-- (horizontal-pipeline, multi-agent-hub, or medallion) -->
    </div>
  </section>

The diagram section uses font-family: var(--font-mono) internally.
Scale may need adjustment for slide viewport — if components are
too small, reduce max-width or increase component padding.

===================================================================
SLIDE 3 — COMPONENTS
===================================================================

  <section class="slide slide--content">
    <div style="width:100%;max-width:900px;">
      <div style="font-family:var(--font-mono);font-size:11px;
           letter-spacing:2px;color:#a78bfa;text-transform:uppercase;
           margin-bottom:24px;">COMPONENTS</div>

      <!-- KPI row at slide scale -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));
           gap:16px;margin-bottom:32px;">
        <div class="af-kpi">
          <div class="af-kpi__value">[N]</div>
          <div class="af-kpi__label">Components</div>
        </div>
        <!-- more KPIs -->
      </div>

      <!-- Component list (bullet style, not full table) -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="af-card">
          <div style="font-weight:600;font-size:16px;color:var(--text-primary);
               margin-bottom:4px;">[Component Name]</div>
          <div style="font-size:14px;color:var(--text-muted);">[Role]</div>
        </div>
        <!-- more components -->
      </div>
    </div>
  </section>

===================================================================
SLIDE 4 — DATA FLOW
===================================================================

Show the phase descriptions as a numbered step list.
Do NOT use Mermaid in slides — use styled step cards instead.

  <section class="slide slide--content">
    <div style="width:100%;max-width:900px;">
      <div style="font-family:var(--font-mono);font-size:11px;
           letter-spacing:2px;color:#00d4ff;text-transform:uppercase;
           margin-bottom:24px;">DATA FLOW</div>
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div style="display:flex;align-items:flex-start;gap:16px;">
          <div style="font-family:var(--font-mono);font-size:28px;
               font-weight:200;color:#00d4ff;min-width:40px;">01</div>
          <div>
            <div style="font-weight:600;font-size:18px;color:var(--text-primary);
                 margin-bottom:4px;">[Phase Title]</div>
            <div style="font-size:14px;color:var(--text-muted);line-height:1.5;">
              [Phase description with real code references]
            </div>
          </div>
        </div>
        <!-- more steps -->
      </div>
    </div>
  </section>

===================================================================
SLIDE 5 — EXTERNAL SERVICES
===================================================================

  <section class="slide slide--content">
    <div style="width:100%;max-width:900px;">
      <div style="font-family:var(--font-mono);font-size:11px;
           letter-spacing:2px;color:#e8b84b;text-transform:uppercase;
           margin-bottom:24px;">EXTERNAL SERVICES</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;">
        <div class="af-card af-card--accent-yellow">
          <div style="font-weight:600;font-size:16px;color:var(--text-primary);
               margin-bottom:4px;">[Service Name]</div>
          <span class="af-tag af-tag--yellow">[Type]</span>
          <p style="font-size:14px;color:var(--text-muted);margin-top:8px;">
            [Purpose]
          </p>
        </div>
        <!-- more services -->
      </div>
    </div>
  </section>

===================================================================
SLIDE 6 — INSIGHTS
===================================================================

  <section class="slide slide--content">
    <div style="width:100%;max-width:900px;">
      <div style="font-family:var(--font-mono);font-size:11px;
           letter-spacing:2px;color:#3fb950;text-transform:uppercase;
           margin-bottom:24px;">INSIGHTS</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div class="af-card af-card--elevated">
          <div style="font-weight:600;font-size:16px;color:var(--text-primary);
               margin-bottom:6px;">[Insight Title]</div>
          <p style="font-size:14px;color:var(--text-muted);line-height:1.5;">
            [Non-obvious observation]
          </p>
        </div>
        <!-- more insights -->
      </div>
    </div>
  </section>

===================================================================
SLIDE 7 — SUMMARY
===================================================================

  <section class="slide slide--title">
    <div style="text-align:center;max-width:700px;">
      <div style="font-family:var(--font-mono);font-size:11px;
           letter-spacing:3px;color:var(--text-dim);text-transform:uppercase;
           margin-bottom:16px;">SUMMARY</div>
      <h2 style="font-size:clamp(28px,5vw,48px);font-weight:700;
          color:var(--text-primary);letter-spacing:-1px;line-height:1.15;
          margin-bottom:24px;">[Key Takeaway]</h2>
      <p style="font-size:clamp(14px,2vw,18px);color:var(--text-muted);
         line-height:1.6;">
        [2-3 sentence architecture summary — what makes this system
        interesting, what's its core strength or pattern.]
      </p>
      <div style="margin-top:32px;font-family:var(--font-mono);
           font-size:11px;color:var(--text-dim);">
        Generated by archflow
      </div>
    </div>
  </section>

===================================================================
SLIDE — SPLIT (ASYMMETRIC TWO-PANEL)
===================================================================

60/40 or 70/30 split. Each panel can have its own background.
Use for text+diagram, before/after, comparison layouts.

  <section class="slide slide--split">
    <div class="split-panel split-panel--major"
         style="flex:7;background:linear-gradient(135deg,#1a1a2e,#16213e);
                padding:clamp(32px,5vw,80px);display:flex;flex-direction:column;
                justify-content:center;">
      <div style="font-family:var(--font-mono);font-size:11px;
           letter-spacing:2px;color:#00d4ff;text-transform:uppercase;
           margin-bottom:24px;">[LABEL]</div>
      <h2 style="font-size:clamp(28px,5vw,48px);font-weight:700;
          color:var(--text-primary);letter-spacing:-1px;line-height:1.15;
          margin-bottom:16px;">[Heading]</h2>
      <p style="font-size:clamp(14px,2vw,18px);color:var(--text-muted);
         line-height:1.6;">[Explanatory text]</p>
    </div>
    <div class="split-panel split-panel--minor"
         style="flex:3;background:linear-gradient(135deg,#0d1117,#161b22);
                display:flex;align-items:center;justify-content:center;
                padding:clamp(24px,3vw,48px);">
      <!-- Diagram, image, code block, or metric -->
    </div>
  </section>

CSS for split slides:

  .slide--split {
    flex-direction: row;
    padding: 0;
    align-items: stretch;
  }

  @media (max-width: 768px) {
    .slide--split { flex-direction: column; }
    .slide--split .split-panel--major { flex: 6; }
    .slide--split .split-panel--minor { flex: 4; }
  }

===================================================================
SLIDE — QUOTE (BREATHING ROOM)
===================================================================

Large serif italic text centered with generous whitespace.
Use between dense slides to let the audience absorb key points.

  <section class="slide slide--quote">
    <blockquote style="max-width:700px;text-align:center;">
      <p style="font-size:clamp(24px,4.5vw,44px);font-style:italic;
         font-weight:400;color:var(--text-primary);line-height:1.4;
         letter-spacing:-0.5px;">
        "[Key takeaway or architectural insight]"
      </p>
      <footer style="margin-top:24px;font-family:var(--font-mono);
              font-size:11px;letter-spacing:2px;color:var(--text-dim);
              text-transform:uppercase;">
        — [Attribution or context]
      </footer>
    </blockquote>
  </section>

CSS for quote slides:

  .slide--quote {
    background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary));
  }

  .slide--quote blockquote {
    border: none;
    margin: 0;
    padding: 0;
  }

===================================================================
SLIDE — FULL-BLEED (DRAMATIC)
===================================================================

Background gradient or image fills the entire viewport.
Text is overlaid with semi-transparent scrim for readability.
Use for dramatic moments, big reveals, or visual emphasis.

  <section class="slide slide--bleed"
           style="background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);
                  justify-content:flex-end;align-items:flex-start;
                  padding:clamp(48px,8vh,120px) clamp(48px,8vw,160px);">
    <div style="max-width:600px;">
      <h2 style="font-size:clamp(36px,7vw,72px);font-weight:700;
          color:#fff;letter-spacing:-2px;line-height:1.05;
          margin-bottom:16px;">[Bold Statement]</h2>
      <p style="font-size:clamp(16px,2.2vw,22px);color:rgba(255,255,255,0.7);
         line-height:1.5;">[Supporting detail]</p>
    </div>
  </section>

Full-bleed slides have no additional CSS beyond the base .slide rules.
All styling is inline to allow per-slide gradient customization.

===================================================================
SLIDE — SECTION DIVIDER
===================================================================

Oversized decorative number with heading. Use for transitions
between major topics (e.g., from Components to Data Flow).

  <section class="slide slide--divider">
    <div style="text-align:center;">
      <div style="font-size:clamp(100px,20vw,240px);font-weight:200;
           color:var(--text-dim);opacity:0.15;line-height:1;
           font-family:var(--font-sans);user-select:none;">
        03
      </div>
      <div style="font-family:var(--font-mono);font-size:11px;
           letter-spacing:3px;color:var(--text-dim);text-transform:uppercase;
           margin-top:-20px;margin-bottom:12px;">[SECTION LABEL]</div>
      <h2 style="font-size:clamp(28px,5vw,48px);font-weight:700;
          color:var(--text-primary);letter-spacing:-1px;">
        [Section Title]
      </h2>
    </div>
  </section>

CSS for section dividers:

  .slide--divider {
    background: var(--bg-primary);
  }

===================================================================
COMPOSITIONAL VARIETY
===================================================================

Rule: Never use the same slide layout twice in a row.

  Layout spectrum (alternate between these):

    Left-heavy     Text dominates the left, visual on right (split 70/30)
    Right-heavy    Visual on left, text on right (split 30/70)
    Centered       Title, quote, and summary slides
    Split          Asymmetric two-panel comparisons
    Full-bleed     Edge-to-edge dramatic backgrounds

  Breathing rhythm:

    Dense slide (grids, diagrams, tables)
      → followed by sparse slide (quote, divider, full-bleed)
      → followed by dense slide

  Example 12-slide sequence:

    Slide  Layout        Type
    1      Centered      Title
    2      Full-bleed    Architecture hero diagram
    3      Left-heavy    Split — overview text + key metrics
    4      Centered      Section divider ("Components")
    5      Centered      Component grid
    6      Right-heavy   Split — data flow text + step cards
    7      Centered      Quote — key architectural insight
    8      Left-heavy    Split — services + integration diagram
    9      Centered      Section divider ("Analysis")
    10     Centered      Insights grid
    11     Full-bleed    Bold closing statement
    12     Centered      Summary

===================================================================
STAGGERED REVEAL ANIMATIONS
===================================================================

Each child element with class .reveal gets a progressive delay,
creating a cinematic "build" effect as the slide enters view.

  CSS:

  .reveal {
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.4s ease, transform 0.4s ease;
  }

  .slide.visible .reveal { opacity: 1; transform: translateY(0); }

  .slide.visible .reveal:nth-child(1) { transition-delay: 0.1s; }
  .slide.visible .reveal:nth-child(2) { transition-delay: 0.2s; }
  .slide.visible .reveal:nth-child(3) { transition-delay: 0.3s; }
  .slide.visible .reveal:nth-child(4) { transition-delay: 0.4s; }
  .slide.visible .reveal:nth-child(5) { transition-delay: 0.5s; }
  .slide.visible .reveal:nth-child(6) { transition-delay: 0.6s; }
  .slide.visible .reveal:nth-child(7) { transition-delay: 0.7s; }
  .slide.visible .reveal:nth-child(8) { transition-delay: 0.8s; }

  Usage in HTML:

  <section class="slide slide--content">
    <div style="...">
      <div class="reveal">[KPI card 1]</div>
      <div class="reveal">[KPI card 2]</div>
      <div class="reveal">[KPI card 3]</div>
      <div class="reveal">[Component grid]</div>
    </div>
  </section>

  @media (prefers-reduced-motion: reduce) {
    .reveal { opacity: 1; transform: none; transition: none; }
  }

===================================================================
VISIBILITY TRANSITIONS
===================================================================

Slides fade in when they enter the viewport.

  .slide {
    opacity: 0;
    transform: translateY(30px) scale(0.98);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }

  .slide.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  @media (prefers-reduced-motion: reduce) {
    .slide { opacity: 1; transform: none; transition: none; }
  }

===================================================================
CONTENT DENSITY LIMITS
===================================================================

  Slide Type       Max Content
  Title            1 heading + 1 subtitle
  Diagram          1 diagram (use full viewport)
  Components       6 KPI cards + 8 component cards
  Data Flow        6 steps max
  Services         6 service cards
  Insights         6 insight cards (2-column grid)
  Split            1 heading + 1 paragraph per panel
  Quote            1 blockquote (2-3 sentences max)
  Full-bleed       1 heading + 1 short paragraph
  Section divider  1 number + 1 heading
  Summary          1 heading + 1 paragraph

If content exceeds limits, split into multiple slides of the
same type. For example, 10 components → 2 component slides.

===================================================================
SLIDE DECK RULES
===================================================================

  → Do NOT use Mermaid in slides (too small, zoom controls awkward)
  → Use CSS step cards for data flow instead
  → The animated diagram (slide 2) IS the hero — give it full viewport
  → All text must be readable at arm's length (min 14px body, 28px headings)
  → One focal point per slide
  → Keyboard navigation: arrows, Page Up/Down, Home, End, Space
  → Touch: swipe up/down
  → Nav dots on the right, progress bar on top
