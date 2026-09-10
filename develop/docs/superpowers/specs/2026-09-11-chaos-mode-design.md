# Chaos mode - design

Date: 2026-09-11
Status: approved (design reviewed in conversation; this is the written record)

## What it is

A fourth toolbar mode, next to studio / story / world. Toggle it on and the
page you are looking at loses its structure: cards, buttons and images fall as
whole objects, headings and paragraphs shatter into words, everything piles up
under gravity inside the viewport. Nothing on the page is functional while it
is on. You can grab and throw pieces, stir them with the cursor, detonate
shockwaves on empty ground, and on a phone tilt the device to change which way
is down. Words squash and skew when they hit something. Toggle it off (or
Esc) and every piece flies back to exactly where it lived, words reassembling
into their sentences.

It has to stay beautiful. The pieces are the real site - real Inter, real
card images, real theme tokens - so it looks like the page falling apart, not
like confetti.

## Decisions already made

| Question | Decision |
|---|---|
| Entry | A toolbar toggle, same peer as studio / story / world. No secret trigger. |
| Granularity | Mixed: solid things fall whole; text shatters into words. |
| Interactions | All four: grab-and-throw, cursor force, phone tilt, click shockwave. |
| Exit | Everything flies home, no reload, scroll position kept. |
| Engine | `matter-js` driving the real DOM (cloned pieces), lazy-loaded. |

## Not in scope

- The 3D "project space" (separate design, built after this).
- Sound design beyond the existing guide-audio blips.
- Making the oneko pet a physics body. It keeps chasing the cursor as it does now.
- Chaos on the studio / story / world overlays. Chaos only acts on the page
  (Home, Projects, ProjectDetail, NotFound) and is mutually exclusive with the
  other modes.
- Persisting anything. Chaos is stateless; a reload is a normal page.

## Architecture

Follows the pattern the other three modes already use.

```
src/useChaosMode.js               store: open flag, toggle, html class, Lenis stop/start
src/components/ChaosButton.jsx    toolbar toggle (after WorldButton)
src/components/ChaosMode.jsx      overlay shell; lazy-loads the stage; Esc; stays mounted through the return
src/scenes/ChaosStage.jsx         orchestration only: lift -> run -> return -> unmount
src/lib/chaos/pieces.js           DOM -> pieces (solid clones + word ghosts), viewport-only, caps
src/lib/chaos/world.js            matter-js engine, walls, bodies, fixed-step loop, transform writes
src/lib/chaos/input.js            drag, cursor force, shockwave, tilt
src/lib/chaos/fx.js               impact squash/skew springs, flashes, blur, floor line
src/lib/chaos/home.js             the return: freeze, stagger, spring each piece to its home rect
src/styles/chaos.css              layer, ground, ring, floor, piece base styles
```

Each `lib/chaos/*` module has one job and a small surface. Pure maths lives in
functions that take numbers and return numbers so they can be tested without a
DOM: word-rect grouping and caps (`pieces`), the squash spring and impact
scaling (`fx`), the shockwave falloff and tilt-to-gravity mapping (`input`),
the stagger schedule (`home`).

### Store - `useChaosMode.js`

Mirror of `use3DMode.js`: module-level `open`, `useSyncExternalStore`,
`setChaosMode(next)`, `toggleChaosMode()`. Opening toggles a `mode-chaos`
class on `<html>` and calls `window.__lenis?.stop()`; closing restores both.
Opening while any of `mode-3d` / story / world is open is refused (no-op).
Those three modes' buttons become pieces while chaos is on, so they cannot be
opened over it; belt-and-braces, their `set*Mode(true)` is also a no-op while
`mode-chaos` is set - a one-line guard in each existing store.

### Overlay - `ChaosMode.jsx`

Same shape as `WorldMode.jsx`: `mounted` lags `open` so the stage can run its
return animation before unmounting (1000 ms, the return takes ~900). Esc calls
`setChaosMode(false)`. Renders `<div className="chaos-overlay" data-open>` with
the lazily imported `ChaosStage` inside a `Suspense` whose fallback is the
existing `.scene-loading` style ("loading chaos").

### Toggle - `ChaosButton.jsx`

Same markup as `WorldButton.jsx` (`.btn`, `aria-pressed`, icon + `<span>`
label "chaos"). On iOS the click handler also requests
`DeviceOrientationEvent.requestPermission()` before toggling, because that API
only resolves inside a user gesture. The button lives in
`.floating-toolbar--center` after `WorldButton`. While chaos is on, the
floating toolbars are hidden underneath the overlay except this one button,
which the stage re-parents into the overlay's top layer so it stays clickable
(`position: fixed`, same coordinates, `z-index` above the layer).

## Pieces - `pieces.js`

`liftPage(root, viewport, caps) -> { pieces, hide, restore }`

The original DOM is never mutated. Pieces are new elements appended to the
chaos layer at the exact `getBoundingClientRect()` of what they represent.
Once every piece exists, `hide()` sets `visibility: hidden` on `.app-root`
(and the floating toolbars); `restore()` reverses it.

**Solid pieces** - elements matching, in this order of precedence:
`.project-card`, `.nav-pill`, `.brand`, `.btn`, `.pchip`, `.theme-switch`,
`.ambient-toggle`, `kbd`, `img`, `figure`, `.tag`, `.kv`. Each is
`cloneNode(true)`; the clone gets `class="chaos-piece"` added, all `id`s
stripped, `tabindex="-1"`, `aria-hidden`, and `pointer-events: none` (nothing
is functional). An element inside an already-lifted solid is skipped.

**Word pieces** - for every text-bearing element not inside a solid
(`h1 h2 h3 p li` plus the text-only rows `.education-row span`, `.cert span`,
`.row .org`, `.row .sub`, `.row-head .meta`, `.contacts a`, `.hero .role`,
`.skill-row .label`, footer spans): walk its text nodes, split on whitespace,
and for each word build a `Range` and take its client rect (a word that wraps
gives two rects - keep the larger, it is rare). The ghost is a `<span
class="chaos-piece chaos-word">` with the word's text and a copy of the
source's computed `font`, `letter-spacing`, `color`, `text-transform`,
`font-feature-settings`, `text-decoration`. Underlined links keep their
underline.

**Viewport only** - a piece is created only if its rect intersects the
viewport expanded by 120 px on each side. Everything else is simply hidden
with the page. Scroll is locked, so nothing else can come into view.

**Caps** - `caps = { words: 320 desktop / 160 mobile }` (mobile =
`pointer: coarse` or width < 768). Text elements are processed in DOM order;
once the word budget is spent, the remaining text elements fall as **line
pieces** instead: one ghost per rendered line (group the element's word rects
by `top`), styled the same way. Solids are never capped - there are at most a
few dozen on any page.

Every piece records `home = { x, y, w, h }` (its origin rect in viewport
coordinates) and `kind = 'solid' | 'word' | 'line'`.

Pure, tested: `groupRectsIntoLines(rects)`, `budgetWords(elements, cap)`
(returns which elements go word-wise and which go line-wise).

## Physics - `world.js`

`createWorld(layer, pieces, opts) -> { start, stop, engine, bodies, setGravity, dispose }`

- One `Matter.Engine`, `gravity.scale` default, `gravity.y = 1`
  (`0.5` under `prefers-reduced-motion`). `enableSleeping: true`.
- Four static walls just outside the viewport edges, 200 px thick, rebuilt
  on `resize` (debounced). The bottom wall is the floor.
- One `Bodies.rectangle` per piece at its home centre, `chamfer: { radius: 3 }`.
  Words: `restitution 0.35, friction 0.4, frictionAir 0.012`. Solids and
  lines: `restitution 0.2, friction 0.5, frictionAir 0.02`. Density is left to
  Matter (area-proportional), so a card is heavier than a word without
  special-casing.
- **Release** is a cascade, not a drop: every body starts `isStatic: true`;
  `start()` schedules each body's release by `home.y` (top of the viewport
  first) across 600 ms, and on release gives it `angularVelocity` in
  `[-0.04, 0.04]` and `velocity.x` in `[-0.6, 0.6]`.
- **Loop** - own `requestAnimationFrame`; `Engine.update(engine, 1000/60)`
  twice per frame (two substeps at half-step) for stable stacking; the frame
  delta is clamped so a background tab does not explode on return.
  `document.visibilitychange` pauses and resumes the loop.
- **Writes** - per frame, for every non-sleeping body, one
  `style.transform = translate3d(x - home.x - w/2, y - home.y - h/2, 0) rotate(a) <squash>`
  on its piece (the squash part comes from `fx`). Pieces are absolutely
  positioned at their home rect, so an identity transform is "at home".
  Sleeping bodies are skipped; Matter's `sleepStart/sleepEnd` events keep a
  dirty set.

## Interactions - `input.js`

`attachInput(world, layer, opts) -> detach`

- **Grab & throw** - `Matter.MouseConstraint` on the layer, `stiffness 0.2`,
  `angularStiffness 0.05`; release velocity comes from Matter. Cursor changes
  to `grab` / `grabbing` over pieces.
- **Cursor force** - each frame, for every awake body within 160 px of the
  pointer, apply a force away from the pointer: `F = k * (1 - d/160)^2` along
  the body-minus-pointer direction, `k` tuned so a word skitters and a card
  barely shifts. Off under reduced motion. Off while dragging a piece.
- **Hold to pull** - `pointerdown` on empty ground starts a timer; past
  150 ms the cursor force flips sign (attract) until `pointerup`.
- **Shockwave** - `pointerup` on empty ground within 150 ms of the down:
  every body within `R = 260 px` gets an impulse `J = j0 * (1 - d/R)^2` away
  from the point, plus a small random spin. A `<div class="chaos-ring">` is
  placed at the point and animates from 0 to 2R diameter, 1 px accent stroke
  fading out over 480 ms, then is removed.
- **Tilt** - `deviceorientation` (`beta` front-back, `gamma` left-right,
  degrees). Gravity becomes `x = clamp(gamma/45, -1, 1)`, `y = clamp(beta/45,
  -1, 1)`, low-pass filtered (`a = 0.15`). Only attached on
  `pointer: coarse` devices and only after permission resolves on iOS.

Pure, tested: `shockwaveImpulse(d, R, j0)`, `tiltToGravity(beta, gamma)`,
`cursorForce(d, radius, k)`.

## Impact effects - `fx.js`

`createFx(world, opts) -> { transformSuffix(body), dispose }`

- Listens to `collisionStart`. For each pair, impact speed `v = |relative
  velocity . normal|`. Below `v0 = 1.5` nothing happens.
- **Squash** - the softer body (word before line before solid; on a tie the
  faster one) gets a squash target `k = min(kmax, (v - v0) / 8)` with `kmax`
  0.35 for words, 0.2 for lines, 0.12 for solids: scale `1 - k` along the
  contact normal, `1 + k` across it. Plus a skew across the normal from the
  tangential velocity, capped at 12 deg for words, 4 deg for solids.
- Each piece holds a spring state `{ k, skew, vk, vskew }` stepped per frame
  as a critically damped spring back to zero (`omega = 24`, ~260 ms to
  settle). `transformSuffix(body)` returns the `rotate(normalAngle)
  scale(..) skew(..) rotate(-normalAngle)` string the world appends to the
  translate/rotate. No CSS transitions anywhere - everything is per frame.
- **Flash** - impacts with `v > 6`: the piece's `color` (words) or
  `border-color` (solids) is set to the accent for 120 ms, then restored.
- **Blip** - impacts with `v > 6` call the shared `createGuideAudio().blip()`
  with gain scaled by `v`, at most one blip per 60 ms. The stage creates the
  audio object like the other scenes do (`ensure()` on first gesture,
  `close()` on unmount); it obeys the site's ambient toggle state exactly as
  the studio does.
- **Blur** - desktop only (`pointer: fine`), not under reduced motion: bodies
  with speed > 14 px/frame get `filter: blur(min(2px, (speed - 14) / 10))`,
  cleared when they slow. At most 40 bodies blurred per frame (fastest first).
- **Floor line** - a 1 px accent line along the bottom wall at 25 % opacity;
  any floor impact with `v > 3` pops it to 100 % and it eases back over
  400 ms.
- **Ground** - the overlay shows the page background token with the posters'
  grain overlay (`feTurbulence`, 4 %) and a faint radial vignette.

Pure, tested: `impactSquash(v, kind)`, `stepSpring(state, dt)`.

## Return - `home.js`

`returnHome(world, pieces, opts) -> Promise<void>`

1. Detach input, stop `fx` listeners, set every body `isStatic: true` where
   it lies.
2. For each piece, in original DOM order, schedule a spring from its current
   `{ x, y, angle, squash }` to `{ home centre, 0, 0 }`, start times staggered
   over 500 ms (`delay = i / n * 500`), each spring critically damped
   (`omega = 14`, settles in ~400 ms), so the whole page is back in ~900 ms.
   Words fly back into their sentences because each word's home is its own
   Range rect.
3. The loop keeps writing transforms from the spring state, not the engine.
4. When the last spring settles, resolve. The stage then calls `restore()`
   (page visible again), disposes the world, and the overlay unmounts.
   `useChaosMode` restarts Lenis. Scroll position was never touched.

Under reduced motion the return is the same but with `omega = 20` and no
stagger.

Pure, tested: `staggerSchedule(n, total)`.

## Stage - `ChaosStage.jsx`

Orchestration only, no maths:

```
mount:   pieces = liftPage(...); world = createWorld(...); fx = createFx(...);
         input = attachInput(...); pieces.hide(); world.start()
open -> false:  returnHome(...).then(() => { pieces.restore(); dispose all })
unmount: dispose everything defensively (route change, hot reload)
```

The page underneath cannot be navigated during chaos (pointer events are
captured by the layer; scroll is locked; the toolbar is hidden except the
chaos toggle). If the route changes anyway (browser back), the stage disposes
and `setChaosMode(false)` runs.

## Styles - `chaos.css`

- `.chaos-overlay` - fixed, inset 0, `z-index` above the page and below the
  oneko bubble; `data-open` fades the ground in over 220 ms.
- `.chaos-ground` - `var(--bg)` + grain + vignette.
- `.chaos-layer` - the piece container; `contain: strict`, `overflow: hidden`.
- `.chaos-piece` - `position: absolute; left/top/width/height` from home,
  `transform-origin: 50% 50%`, `will-change: transform`, `user-select: none`,
  `pointer-events: none` for the content (the layer handles pointer input;
  hit-testing for drag is Matter's, by body).
- `.chaos-word` - `white-space: nowrap; line-height: 1; display: block`.
- `.chaos-ring`, `.chaos-floor` - as described in fx.
- `html.mode-chaos .floating-toolbar` hidden; the re-parented chaos button
  is exempt.
- Imported from `styles/index.css` after `world.css`.

Nothing here introduces a new colour or font: everything is a token.

## Guardrails

- `prefers-reduced-motion: reduce` - still opt-in via the toggle (the person
  asked for it), but gravity 0.5, no cursor force, no blur, no flashes,
  un-staggered return.
- Mobile - word cap 160, no blur, tilt on, everything else the same.
- Tab hidden - loop paused; frame delta clamped on resume.
- Other modes - mutually exclusive, both directions.
- Bundle - `matter-js` (~28 KB gz) and everything under `lib/chaos` are in
  the stage's lazy chunk. First paint is unchanged.
- Failure - if `liftPage` produces zero pieces (empty page) the stage closes
  itself immediately. If `matter-js` fails to import, the Suspense error
  bubbles to the overlay, which closes and logs.

## Testing

The repo has no test runner. The pure functions listed under each module get
`node --test` files next to them (`*.test.js`, zero new dependencies), run by
a new `"test": "node --test src/lib/chaos"` script. Everything DOM-bound is
verified in the browser: open chaos on Home, Projects and a project page;
throw, stir, shockwave; return and confirm the page is pixel-identical and
scroll position unchanged; check reduced-motion and a 375 px viewport; confirm
no console errors and that the `matter-js` chunk only loads on first toggle.

## Dependencies

- `matter-js` (runtime). Add to `dependencies` in `package.json`.
