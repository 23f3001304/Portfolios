# Hemang Choudhary · Portfolio · Progress & Plan

A self-contained brief for the next session. Read this top to bottom, then resume from "Next session start here."

---

## Status snapshot

**Done**
- [x] Vite + React + Tailwind scaffold
- [x] Dependencies installed: `framer-motion`, `gsap`, `lenis`, `react-router-dom`
- [x] Design system (tokens + fonts) wired in `tailwind.config.js` and `src/index.css`
- [x] Landing page composed from: Cursor, Nav (overlay), Hero, Marquee, Stats, WorkIndex, About, Contact
- [x] Project data model in `src/data/projects.js`. 8 projects, profile object
- [x] Project routes wired in `src/main.jsx` with `/work/:slug` and `*`
- [x] Project pages built with `ProjectPage.jsx` plus `EngineeredCase.jsx` and `DesignedCase.jsx`
- [x] Page transitions added between landing and project pages with a slower GSAP curtain reveal
- [x] Site-wide texture overlay added with grain + paper fiber treatment
- [x] Global custom scrollbar mounted for all pages
- [x] Custom 404 page added
- [x] Production build passes (`npm run build`)
- [x] Em / en dashes purged from copy across the codebase
- [x] Cluttered top bar replaced with corner mark + immersive overlay menu (Archetype 1 + 3)
- [x] Hero blinking-cursor replaced with a deliberate underline draw on the surname
- [x] WorkIndex gets a cursor-follow image preview tile and dim-non-hovered rows
- [x] Stats / numbers strip added between Marquee and WorkIndex
- [x] Magnetic hover on the contact email
- [x] Global cursor follower (auto-disables on touch devices and `prefers-reduced-motion`)
- [x] Volumetric cursor-reactive cloud aurora behind the Hero. WebGL1, no Three.js, ~5 KB gz inlined. `src/components/AuroraShader.jsx` runs a 3-layer fbm cloud stack (large/medium/fine scales drifting at different speeds) blended into the page palette, with an `exp(-distance)` glow that pulls toward the cursor. Mounted at z:1; all hero content lifted to `relative z-10` so it stacks above. Auto-pauses via IntersectionObserver when scrolled off; `prefers-reduced-motion` freezes time at 0. CSS sibling layer `cloud-bg` (in `index.css`) adds a static gradient + drifting radial pseudo-element so the hero is never blank before WebGL initialises.
- [x] Cyan/blue accent introduced (`#7BA4C7`) for the cloud field and the surname underline. This breaks the prior "rust is the single accent" rule - see palette note below.

**Not done**
- [ ] Figma frame extraction for the 5 design projects (needs Figma MCP)
- [ ] Real GitHub repo URLs (currently all point at `github.com/coehemang`)
- [ ] ANIMY website link is a placeholder (`animy.example`)
- [ ] Mobile QA pass (especially Hero stacking + nav-overlay link sizes)
- [ ] Real images for 5 of 8 projects (see "Asset status" below)
- [ ] GSAP ScrollTrigger reveals on the remaining landing sections and case pages
- [ ] Dev server verification pass for route changes, scroll reset, and transition timing

## Asset status

| Project | Visual source | Status |
|---|---|---|
| Quizzy | (engineering) | needs an architecture diagram or repo OG image. Currently typographic fallback. |
| ANIMY | YouTube thumbnail | live, pulled from `i.ytimg.com/vi/<id>/hqdefault.jpg` |
| Build My Own Git | (systems) | needs an ASCII / terminal capture. Currently typographic fallback. |
| STIC Website | Figma frame `150:2` | downloaded to `public/figma/stic-website.png` |
| Mentor Hub | Figma frame `10387:2` | downloaded to `public/figma/mentor-hub.png` (portrait/mobile crop) |
| Untitled | Figma `0:1` | **rate-limited** on Figma MCP Starter plan, retry next session |
| Spider-Man | Figma `0:1` | **rate-limited** on Figma MCP Starter plan, retry next session |
| Stdlib Girsh | Figma `0:1` | **rate-limited** on Figma MCP Starter plan, retry next session |

The two Figma screenshots already in `public/figma/` show in the WorkIndex hover preview. The other three Figma files need to be re-fetched once the MCP rate limit resets, then dropped into `public/figma/<slug>.png` and referenced via the `image` field in `src/data/projects.js`.

---

## Design system (locked across the site)

**Palette** (from `tailwind.config.js`)

| Token  | Hex      | Use |
|--------|----------|-----|
| `paper`| `#F1ECE2`| Page background |
| `bone` | `#E6DFD0`| Section break, About background |
| `ink`  | `#0E0E0C`| Primary text, Contact background, overlay nav |
| `ash`  | `#6B6A65`| Muted text |
| `rust` | `#C24A1F`| Italic emphasis, hover, dot ticker. (No longer "the single accent" - see below.) |
| `kelp` | `#2F3A2A`| Reserved tertiary, do not introduce on landing |
| (no token) | `#7BA4C7`| **Mist/cloud accent.** Aurora shader, `cloud-bg` CSS layer, surname underline. Currently inline-only - lift to a Tailwind token before any third surface uses it. |

> Note: the palette hexes above are stale from the cream-and-rust era. The actual `tailwind.config.js` is now dark editorial (paper `#0A0D12`, ink `#EDE7DC`, rust `#A98B69`). Update this table next pass.

**Type system** (Google Fonts, loaded in `index.html`)

- Display: `Instrument Serif`. Italic is the primary expressive move. Used at extreme scale only.
- Body and UI: `Geist` 300 / 400 / 500 / 600
- Mono / metadata: `JetBrains Mono`. Uppercase, tracked-out (`0.18em` to `0.22em`), 10 to 12px

Rules:
- No third display face. Italics carry the variation
- Mono is the language of meta. Geist is the language of body. Display is reserved for headlines and project titles
- `<em>` reads as "italic display serif in rust." One or two words per paragraph, max

**Grid**
- 12-col, `gap-6` (24px), `gap-10` (40px) at md+
- Outer padding `px-6 md:px-10`
- Section vertical rhythm: `py-28 md:py-40` for major sections; `py-20 md:py-28` for the Stats strip
- Hairlines use `border-ink/15` (or `paper/15` on dark sections)

**Motion**
- Default ease: `[0.22, 1, 0.36, 1]`
- Default duration: 0.6 to 1.0s
- Lenis: `lerp 0.085, duration 1.1`
- Overlay menu uses `[0.86, 0, 0.07, 1]` (heavier curtain feel)
- The cursor follower auto-disables on touch and `prefers-reduced-motion`

**Anti-patterns (banned)**
- No glassmorphism, no purple→pink gradients, no emoji icon decoration
- No `rounded-2xl card` pattern. Hairlines, not cards
- No em dashes (`—`) or en dashes (`–`) anywhere. Use the hyphen with spaces (` - `), commas, or middle dot (`·`)
- ~~No second accent color~~ - the mist/cyan `#7BA4C7` is now a sanctioned second accent, scoped to atmospheric layers (aurora, surname underline). Rust still owns italic emphasis and interactive hover.
- No cluttered top bar with 3+ links beside a status pill (this was fixed; do not re-introduce)
- No blinking typewriter cursor (this was removed; do not re-introduce)

---

## File tree (current)

```
portfolio/
├── PROGRESS.md                ← this file
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
└── src/
    ├── main.jsx               ← BrowserRouter, landing, project routes, transitions
    ├── index.css              ← Tailwind + tokens + grain + marquee anim + texture overlays
    ├── data/
    │   └── projects.js        ← projects[], profile{}. Single source of truth
    ├── hooks/
    │   ├── useLenis.js
    │   └── useGsapReveal.js   ← GSAP page and scroll reveal helper
    ├── components/
    │   ├── Nav.jsx            ← corner mark + immersive overlay menu
    │   ├── Hero.jsx           ← asymmetric editorial, surname underline draw, parallax meta
    │   ├── Marquee.jsx        ← hover-pause, slow-scrolling skill ribbon
    │   ├── Stats.jsx          ← four big numbers, GSAP ScrollTrigger counters
    │   ├── WorkIndex.jsx      ← list with cursor-follow preview, dim-others on hover
    │   ├── About.jsx
    │   ├── Contact.jsx        ← magnetic email + footer
    │   ├── Cursor.jsx         ← global follower (ring + dot, mix-blend-difference)
    │   ├── Scrollbar.jsx      ← global custom scrollbar
    │   ├── AuroraShader.jsx   ← WebGL1 cursor-reactive cloud field, mounted in Hero
    │   └── PageTransition.jsx ← GSAP curtain reveal between routes
    └── pages/
        ├── Landing.jsx
        ├── ProjectPage.jsx
        └── NotFound.jsx
```

---

## Project subpage plan

Routes in `src/main.jsx`:

```jsx
<Route path="/work/:slug" element={<ProjectPage />} />
<Route path="*" element={<NotFound />} />
```

`ProjectPage` reads the slug, looks up the project in `projects.js`, and renders one of two layouts based on `project.kind`.

### Layout A · "Engineered" (kinds: Engineering, Systems)
For: `quizzy`, `animy`, `build-my-own-git`

Sections, in order:
1. Project header. Index, kind, title, year, role, stack chips
2. Long blurb. 2 to 3 paragraphs, expanded from the resume bullets. The body should explain the *system*, not the deliverables.
3. Visual marker block (per-project notes below)
4. Stack and decisions. Small table of what was used and the explicit trade-off behind each choice
5. Code highlights (optional). 1 to 2 key snippets in styled `<pre>`, mono, `bg-ink text-paper`
6. Next / prev nav at footer

### Layout B · "Designed" (kind: Design)
For: `stic-website`, `mentor-hub`, `untitled-explorations`, `spider-man`, `stdlib-girsh`

Sections, in order:
1. Project header (same as A)
2. Brief. 1 to 2 paragraphs of context
3. Section index. Every page / frame name from the Figma file (use Figma MCP)
4. Frame gallery. For each section: section name, 1 to 3 image exports, short caption
5. Process notes. Typography, palette, components if visible
6. Live link. Figma file CTA
7. Next / prev

---

## Per-project notes & assets

### 01 · Quizzy (Engineering)
- GitHub: `https://github.com/coehemang` (resume just lists "GitHub" - confirm the actual repo URL with Hemang)
- Visual: monochrome architecture diagram. Hand-drawn-feel SVG of the agent-tool pipeline (4 layers, 50+ tools)
- Pull-quote: "92 / 100 on adversarial evals. 22 of 24 scenarios passed."

### 02 · ANIMY (Engineering)
Use ALL three videos in this order as the project's primary visual:
1. `https://www.youtube.com/watch?v=zYsFwM4dH2A` (intro)
2. `https://www.youtube.com/watch?v=eylqHhzs-7Q` (generation 1, prompt in description)
3. `https://www.youtube.com/watch?v=3WA5Cck6mv4` (generation 2, prompt in description)

Embed pattern: 16:9 iframes, `lazy`. Pull each video's prompt from its YouTube description and display it next to the embed in monospace.

Website link in resume - confirm URL with Hemang (placeholder `animy.example` in data file).
Pull-quote: "10 videos / hour. 4 parallel threads. WebSockets cut after architectural cost analysis."

### 03 · Build My Own Git (Systems)
- Visual: ASCII / mono diagram of `.git` layout, three object types. This project is intrinsically textual. Lean into typography. Show command outputs, the SHA-1 of `blob 14\0Hello, World!\n`, etc.
- Pull-quote: "Recreated `.git`. SHA-1, three object types, six plumbing commands."

### 04 · STIC Website (Design)
- Figma: `https://www.figma.com/design/pZahn4aJCTORKyNVwbLMk3/STIC_WEBSITE?node-id=150-2`
- Action for next session: use Figma MCP (`mcp__44005e39-..._get_metadata`, `_get_screenshot`, `_get_design_context`) to:
  - Pull the page list and node hierarchy
  - Export images for each top-level section (hero, features, etc.) into `public/figma/stic-website/`
  - Extract type and color tokens via `_get_variable_defs`
- Render every section as its own block on the case study page

### 05 · Mentor Hub (Design)
- Figma: `https://www.figma.com/design/H0HkxwayiDiKUKMn6mvmEt/Mentor-Hub?node-id=10387-2`
- Same MCP extraction recipe
- Likely has flows (auth, dashboard, profile, booking). Treat each flow as a section

### 06 · Untitled Explorations (Design)
- Figma: `https://www.figma.com/design/YmDeUgb2hCZzv4tqTinOTg/Untitled?node-id=0-1`
- Title is a placeholder. Once the file is read via MCP, rename. Update both `slug` and `title` in `src/data/projects.js`

### 07 · Spider-Man (Design)
- Figma: `https://www.figma.com/design/Ya9h0EYaw4uVjQngBwD6dM/Spider-man?node-id=0-1`
- Likely a thematic concept piece. Could justify breaking the rust accent for one panel. Discuss with Hemang first

### 08 · Stdlib Girsh (Design)
- Figma: `https://www.figma.com/design/XVuH6QypsEZIk4p4KemgU1/Stdlib_Girsh?node-id=0-1`

---

## Page transitions (current)

Use a GSAP curtain reveal when navigating index → project:
1. Click on a row in `WorkIndex` triggers a full-bleed gradient panel sliding up from the bottom
2. Once it covers the viewport, navigate to the route
3. New page paints under, then panel slides off the top
4. Curtain background carries grain + film-like flicker while active
5. Project header and key sections reveal after the curtain completes

The current implementation uses a `clipPath` wipe in `PageTransition.jsx`, a shared `routeTransitionStart` / `routeTransitionEnd` event, a GSAP timeline for the grain motion, and a texture overlay that matches the site background.

---

## Open questions for Hemang

1. GitHub repo URLs. Resume shows "GitHub" as a link but the URL isn't extractable. Per-project repo URL?
2. ANIMY website URL. Same issue, "Website" link in resume
3. Untitled Figma file. What is it actually called?
4. YouTube prompts. Should we mirror them on the case study page? (Default plan: yes)
5. Photo / portrait. The landing page is currently text-only. Want to add a portrait somewhere? Recommended: small grayscale photo in About, never in Hero

---

## Next session, start here

1. Pull Figma data for the 5 design projects (Figma MCP). For each project, save:
   - Page / frame list
   - Image exports (PNG, 2x) into `public/figma/<slug>/`
   - Variable defs (colors, type) into a `process.json`
2. Keep refining GSAP scroll reveals across landing and project sections
3. Polish project page content, visuals, and project-specific assets
4. Wire ANIMY video embeds with prompts pulled from YouTube descriptions
5. Mobile QA pass

Suggested order so visual progress is fast: Quizzy → STIC → ANIMY → remaining 5.

---

## Run commands

```bash
npm run dev      # http://localhost:5173
npm run build
npm run preview  # serves the dist/ build
```
