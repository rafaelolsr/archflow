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
SLIDE TYPES — 7 SLIDE STRUCTURE
===================================================================

Architecture slide decks follow this sequence:

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

  Slide Type     Max Content
  Title          1 heading + 1 subtitle
  Diagram        1 diagram (use full viewport)
  Components     6 KPI cards + 8 component cards
  Data Flow      6 steps max
  Services       6 service cards
  Insights       6 insight cards (2-column grid)
  Summary        1 heading + 1 paragraph

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
