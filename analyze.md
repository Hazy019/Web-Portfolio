# HAZY Portfolio — Technical Architecture & Codebase Analysis (`analyze.md`)

This document provides a comprehensive technical blueprint of the **HAZY Web Portfolio** codebase. It is designed to allow any AI agent or developer to understand the application's architecture, design system, component hierarchy, motion mechanics, data flow, and key engineering constraints without reading the entire raw codebase.

---

## 1. Project Overview & Tech Stack

* **Project Name**: HAZY Portfolio (`hazy-portfolio@2.0.0`)
* **Developer / Personae**: Kyrell Santillan (HAZY) — CS Graduate & Systems Architect from the Philippines (UTC+8).
* **Primary Stack**:
  * **Framework**: Next.js 15 (App Router, React 19)
  * **Styling**: Vanilla Tailwind CSS + Custom CSS (`globals.css`, `design-elevation.css`)
  * **Typography**: Google Fonts — `Syne` (Display/Headlines), `Manrope` (Body/Sans), `JetBrains Mono` (Code/Data/Labels)
  * **Motion & Animation**: GSAP 3 (ScrollTrigger) + Framer Motion + Lenis Smooth Scroll
  * **Icons**: `lucide-react`
  * **Data Layer**: Static Project Definitions (`projectsData.ts`) + Dynamic Next.js Route Handler (`/api/github`)

---

## 2. Page & Component Architecture

The single-page application is assembled in `src/app/page.tsx` wrapped with an `ErrorBoundary` and `LenisProvider`. The vertical DOM order is:

```
src/app/layout.tsx (LenisProvider, Fonts, Metadata, JSON-LD)
 └── src/app/page.tsx (State: activeSection, activeModalId, theme)
      ├── <Loader />                 (Initial preloader sequence)
      ├── <CustomCursor />           (Custom trailing glass cursor)
      ├── <CoordinateGrid />         (Background grid & crosshair lines)
      ├── <Navbar />                 (Floating glass capsule navbar with layoutId sliding pill)
      │
      ├── <Hero />                   (#intro — Clipped kinetic entrance, terminal cursor, live GitHub stats)
      ├── <Marquee />                (Dual-tier infinite text ticker, 80-120px margin bottom)
      ├── <Work />                   (#projects — Desktop pinned horizontal carousel track / Mobile vertical stack)
      ├── <About />                  (#about — Philosophy grid & technical background)
      ├── <PhilosophyQuote />        (#philosophy — Pinned GSAP ScrollTrigger line-reveal quote timeline)
      ├── <LogoStrip />              (#logos — Translucent dark glass stamp marquee with real project logos)
      ├── <Contact />                (#testimonial & #contact — Asymmetric Testimonial card & 2-column form)
      │
      └── <DocModal />               (6-Project case study modal with 3-column screenshot lightbox gallery)
```

---

## 3. Motion System & Scroll Architecture

### Lenis & GSAP ScrollTrigger Integration (`LenisProvider.tsx`)
* **Virtual Smooth Scroll**: `Lenis` drives smooth inertial scrolling (`lerp: 0.08`, `duration: 1.2`).
* **Frame Sync**: GSAP's ticker drives Lenis's `raf(time)` loop (`gsap.ticker.add`).
* **ScrollTrigger Sync**: `lenis.on("scroll", () => ScrollTrigger.update())` bridges Lenis virtual scroll frames directly to GSAP's calculation engine.
* **Scrollbar Progress**: Lenis scroll progress drives a custom right-edge scroll progress indicator (`lenis-progress-bar`).

### Pinned Horizontal Carousel (`Work.tsx`)
* **Desktop vs Mobile Switch**: Desktop (`innerWidth >= 768px`) renders `WorkHorizontalTrack`; mobile/tablet fallback renders `WorkFallback` (vertical card stack).
* **Horizontal Pinning**: `WorkHorizontalTrack` pins `sectionRef` (`pin: true`, `scrub: 0.8`) and calculates total horizontal scroll distance:
  `x: () => -(track.scrollWidth - window.innerWidth)`
* **Focus Pulling**: Cards scale down (`scale: 0.92`, `blur-[1px]`, `opacity: 0.4`) when inactive, snapping into full focus (`scale: 1.0`, `opacity: 1.0`, `shadow-2xl`) when active.

### Pinned Quote Timeline (`PhilosophyQuote.tsx`)
* **Pinning Spec**: Uses GSAP `ScrollTrigger` (`pin: true`, `scrub: 0.6`, `start: "top top"`, `end: "+=70%"`).
* **Masked Line Reveal**: Quote lines inside `<div className="overflow-hidden py-1">` translate up from `y: "100%"` to `y: "0%"` with a 100ms stagger and `cubic-bezier(0.16, 1, 0.3, 1)` easing scrubbed against scroll progress.

---

## 4. Design System & Glassmorphism Tokens

* **Color Palette**:
  * Core Background: `#07090E` (Obsidian Dark)
  * Primary Text: `#FFFFFF` / Slate 100
  * Accent Green: `#8CFF2E` (Neon Lime Green)
  * Muted Text: `#94A3B8`
  * Card Backgrounds: `#0d1017` / `#12151E` (Translucent dark glass)
* **Glassmorphism Spec**:
  * Navbar: `bg-[#07090E]/80`, `backdrop-filter: blur(16px)`, `border: 1px solid rgba(255,255,255,0.1)`
  * Logo Chips (`LogoStrip.tsx`): Exact spec `background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.12); backdrop-filter: blur(8px)`
* **Typography Hierarchy**:
  * Display / Headlines: `font-display` (`Syne`, bold/extrabold, tracking-tight)
  * Body Copy: `font-sans` (`Manrope`, 16px–18px, leading 1.6)
  * Labels / Tags / Stats: `font-mono` (`JetBrains Mono`, uppercase, tracking-wider, `#8cff2e`)

---

## 5. Data Flow & Media Contracts

### Project Data (`src/lib/projectsData.ts`)
Each project in `PROJECTS` (total of 6: `yt-shorts`, `dti-queue`, `polycon`, `idee-cli`, `sentinel-view`, `spell-gate`) contains:
* `id`, `num`, `title`, `type`, `ghostType`
* `status` (e.g. `Live`, `Live (Restricted Access)`, `Repo Only`)
* `role`, `timeline`, `nativeAccent`, `accentBorder`, `accentGlow`
* `imageSrc` (Primary mockup)
* `screenshots` (Array of 3 production view image paths for the screenshot gallery)
* `deviceFrame` (`phone` | `browser` | `split-terminal` | `laptop-phone`)
* `narrative`, `problem`, `solution`, `steps`, `specs`, `stack`, `devnotes`, `outcome`

### Dynamic GitHub Statistics API (`src/app/api/github/route.ts`)
* **Endpoint**: `/api/github` (GET)
* **Headers**: `Cache-Control: no-store, no-cache, must-revalidate` (`revalidate = 0`)
* **Data Payload**:
  * `public_repos`: Fetched from `https://api.github.com/users/Hazy019`
  * `created_year`: Extracted from GitHub profile `created_at`
  * `total_commits`: Calculated from `https://api.github.com/search/commits?q=author:Hazy019`
* **Client Integration**: `Hero.tsx` fetches `/api/github` with `{ cache: "no-cache" }` on mount, animating counter values dynamically.

---

## 6. Key Architectural Gotchas & Standing Rules

1. **Back-to-Back Pinned Sections**:
   * GSAP `pin: true` converts target elements into `position: fixed; top: 0;` viewport overlays.
   * When combining multiple pinned sections (`Work` horizontal carousel + `PhilosophyQuote` pinned timeline), `ScrollTrigger.refresh()` MUST be called after upstream pinned track heights calculate to prevent trigger coordinate desyncs and component overlay bleed.
2. **Lenis vs Native Viewport Triggers**:
   * Lenis uses CSS virtual scroll transforms on document content rather than native window scroll movement.
   * Standard Framer Motion `whileInView` without Lenis scroll root configuration can fail to fire because `IntersectionObserver` tracks native viewport bounds. Prefer GSAP `ScrollTrigger` with `scrollerProxy` or explicit Lenis scroll events for viewport animations.
3. **Responsive Breakpoints**:
   * Tailwind default breakpoints apply (`sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`). Do NOT use un-configured `xs:` prefixes.
   * `Work.tsx` switches to vertical stack on screens `< 768px` to prevent tablet vertical height overflow.
4. **Brand Logo Preservation**:
   * The DTI seal (`/DTI_Queue_logo.png`) is an official Philippine government mark and MUST remain full-color and unaltered inside its translucent glass chip container (`rgba(255,255,255,0.08)`).
5. **Strict Standing Rule**:
   * Implement only what is explicitly specified in task prompts. Do not alter existing unmentioned sections or introduce unrequested components.
