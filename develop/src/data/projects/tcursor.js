export const tcursor = {
  id: 'PRJ-013',
  slug: 'tcursor',
  name: 'TCursor',
  tagline: 'A screen recorder that records everything raw and lets you decide the edit afterwards - including the zooms.',
  when: 'Jun → Sep 2026',
  status: 'IN PROGRESS',
  stack: ['Rust', 'Tauri v2', 'wgpu', 'Windows Graphics Capture', 'FFmpeg', 'React', 'TypeScript', 'Ollama'],
  metrics: [
    { value: '3',    unit: '',    label: 'clocks reconciled into one truth' },
    { value: '1.1k', unit: '',    label: 'tests, Rust and TypeScript' },
    { value: '60',   unit: 'fps', label: 'preview composite' },
    { value: '200',  unit: '',    label: 'line ceiling per source file' },
  ],
  sprite: '/oneko/oneko-vaporwave.gif',
  accent: '#ef4444',
  // The app is dark-themed, so its screenshots invert to read as a light UI
  // in light mode - the same treatment the hero already gets.
  invertShotsInLight: true,
  hero: {
    light: '/projects/tcursor/product-tilt-light.webp',
    dark: '/projects/tcursor/product-tilt-dark.webp',
  },
  overview: [
    'TCursor records your screen and then edits it for you. It captures the picture raw - no zooms baked in, nothing decided at record time - while separately logging every click, keystroke and cursor position with timestamps. The edit is a document you can change forever afterwards: the punch-ins that follow your cursor, the spotlight that dims everything but the thing you are pointing at, the webcam bubble that shrinks when the camera pushes in. None of it is in the file. All of it is replayable.',
    'That split is the whole design. A recorder that bakes its effects has made a decision you cannot revisit; one that keeps the raw pixels and the event log side by side lets you change your mind at 2am about where the emphasis should have been. The cost is that everything downstream has to agree on when things happened - which is where most of the engineering actually went.',
  ],
  sections: [
    {
      title: 'Three clocks, and the file that reconciles them',
      figure: { id: 'FIG 13.1', caption: 'A zoom region selected - scale, start and end, and the in/out ramps that decide how the punch-in feels.', src: '/projects/tcursor/zoom.png', alt: 'TCursor zoom inspector showing a 2.5x scale slider, start and end times, zoom-in and zoom-out durations, a feel selector and transition curve choices' },
      body: 'Capture is variable-rate: Windows Graphics Capture hands you a frame when something changed, not on a metronome. So the video has no reliable frame-to-time mapping of its own, and there are three different clocks in play - the raw capture wall clock, the event stream\'s own zero, and the output timeline the editor shows you. A sidecar, sync.json, is the single source of truth that ties them together: the timestamp of every frame actually written, plus the offsets at which the event log, the microphone and the system audio each began.',
      blocks: [
        { kind: 'code', lang: 'js', caption: 'the three time bases, named so they cannot be confused', code: [
          't      = raw capture wall clock (ms)',
          'ev_t   = t - events_ms      // mouse, keys, cursor track',
          'out_t  = t - video_start    // the editor timeline; 0 = first frame',
          '',
          '// Every region in the edit document is OUT time.',
          '// Every raw input stream is EVENT time.',
          '// The renderer computes both per frame and hands each',
          '// consumer the one it actually means.',
        ] },
      ],
    },
    {
      title: 'Pause was a lie the file told',
      body: 'Pausing looked fine and was quietly wrong. The audio and the input streams dropped the paused span, sync.json dropped it, but the MP4\'s own presentation timestamps kept running through it - so after a resume the sound and the zooms led the picture by exactly the length of the pause, and the tail got truncated. The fix was to make the encoder timestamp and the sync timestamp come from a single read of one pause-aware ledger, so they are the same number by construction rather than by agreement. On the legacy encoder path, which has no timestamp channel at all, the recording is split into segments and re-joined with per-file duration directives - measured at plus-or-minus zero against a naive join\'s fifty-millisecond drift.',
      blocks: [
        { kind: 'code', lang: 'js', caption: 'one ledger read, two consumers - they cannot disagree',
          code: [
            'let tick = pause_clock.tick(now, paused)?;   // None while paused',
            '',
            'frame.timestamp = tick.pts_100ns;  // what the MP4 says',
            'sync.push(tick.sync_ms);           // what the editor says',
            '',
            '// A timestamp is appended ONLY once the frame it describes is',
            '// really in the file, so sync.json can never claim a frame the',
            '// video lacks.',
          ] },
      ],
    },
    {
      title: 'The preview has to be the export',
      figure: { id: 'FIG 13.2', caption: 'The editor - the AI director on the left, the composited stage in the middle, and every edit as a draggable pill on its own lane.', src: '/projects/tcursor/editor.png', alt: 'TCursor editor showing the AI Director panel, a composited screen recording on a gradient background with a circular webcam bubble, and a timeline with zoom, FX, layout and camera lanes' },
      body: 'The editor previews at sixty frames a second in a canvas; the export renders through a wgpu compositor with a CPU fallback. Two renderers, one picture - and every place they were allowed to compute the same thing twice, they eventually disagreed. So the rule is that the core logic lives once, in Rust, and the TypeScript side only presents what Rust resolved. Layout positions, camera curves, zoom anchors, spotlight state: all resolved by one function that both the preview command and the export renderer call. Where a mirror is genuinely unavoidable for latency, it is written against the Rust source and pinned by tests that compare the two.',
      blocks: [
        { kind: 'code', lang: 'js', caption: 'one resolver, two callers - preview and export cannot drift', code: [
          '// Rust: the single definition.',
          'resolve_seg_scene(seg, presets, appearance) -> Scene',
          '',
          '//   export  -> LayoutTrack::from_segs(..)',
          '//   preview -> FrameRenderer::resolve_seg(..)  [IPC]',
          '',
          '// TypeScript receives resolved rectangles and interpolates',
          '// between them. It owns no geometry of its own.',
        ] },
      ],
    },
    {
      title: 'A director that never leaves the machine',
      body: 'The AI editor reads a transcript of what you actually did - clicks at these moments, typing here, a long idle there - and answers with edit operations: put a zoom on that click, punch the camera in, trim the dead air. It runs against a local Ollama model, so the recording never leaves your computer, and it produces a normal edit document rather than a rendered result. Everything it writes is a pill on the timeline you can drag, retime or delete, and the entire pass is one undo step. It was also the app\'s worst freeze: the calls were synchronous Tauri commands doing blocking HTTP on the main thread, so a first-run model load locked the window for minutes. They are async now, and the planning phase is cancellable while it thinks.',
    },
    {
      title: 'Arrangements, not a dropdown',
      figure: { id: 'FIG 13.3', caption: 'A custom arrangement on the layout lane, with the trimmed head striped out and the pills carrying their own schematic.', src: '/projects/tcursor/layout.png', alt: 'TCursor timeline showing custom layout segments, a spotlight region, zoom pills and a trimmed region drawn with diagonal stripes' },
      body: 'Layout used to be a preset name in a select box, which is a strange way to answer the question "where should the webcam be for these eight seconds". Now a layout segment carries explicit panel poses and you arrange it directly on the stage - drag a panel to move it, a corner to resize it, with snapping to centre, thirds and safe margins, and a modifier to ignore the guides. Presets became one-click starting points rather than the only vocabulary. The poses reuse the same normalised centre-and-size the camera keyframes already used, so keyframes refine an arrangement instead of fighting it, and old documents keep loading untouched: the field is additive, and a project saved before the feature existed re-saves byte-identically.',
      blocks: [
        { kind: 'code', lang: 'js', caption: 'additive by construction - an old document is unchanged', code: [
          '// Rust',
          'pub struct PanelPose { cx: f32, cy: f32, size: f32 }',
          '',
          '#[serde(default, skip_serializing_if = "Option::is_none")]',
          'pub arrangement: Option<Arrangement>,',
          '',
          '// Converting a preset to poses and resolving it back is',
          '// pixel-identical to the preset - 0.33px at 1920x1080,',
          '// pinned by a test at four output sizes.',
        ] },
      ],
    },
    {
      title: 'The bugs worth remembering',
      body: 'Two stand out because neither looked like what it was. The stage background started rendering as a giant mouse cursor stretched across the frame - which turned out to be a race on a fixed temporary filename: every image decode staged its bytes at the same path, so a cursor sprite could overwrite the wallpaper in the milliseconds before FFmpeg read it, and the same race could bake that cursor into an exported video. And recording a browser window would stop and save itself whenever you switched tabs, because the encoder had been sized from a Win32 window rectangle that includes invisible resize margins, and any later mismatch was treated as a fatal display change. Both were found by following the evidence rather than the symptom - decoding the actual bad image and comparing it byte-for-byte against what the background endpoint returned.',
      blocks: [
        { kind: 'code', lang: 'js', caption: 'the resize answer, borrowed from OBS: fit, never stop', code: [
          '// A window resize is normal. Keep ONE fixed canvas at the',
          '// encoder size and scale each differently-sized frame into',
          '// it, aspect preserved, letterboxed - the way OBS holds a',
          '// fixed output canvas.',
          '',
          'letterbox(src, dst) -> RECT   // pure, unit-tested',
          'VideoProcessorBlt(..)         // GPU, no readback',
          '',
          '// If the driver refuses, the frame is skipped and the take',
          '// continues. It never ends the recording.',
        ] },
      ],
    },
    {
      title: 'Constraints that did the work',
      body: 'Two rules shaped the codebase more than any framework choice. No source file may exceed two hundred lines, which turns "I will split this later" into a build-time decision and has repeatedly forced a genuinely better seam - the pure, testable half of a problem separating from the half that needs a live GPU. And function documentation lives in a parallel docs tree rather than in comments, validated in the same commit as the code, so the prose cannot quietly rot away from what the function does. The animation layer has a similar rule: springs from one motion library, never hand-rolled keyframes, so the whole app moves with one vocabulary.',
    },
  ],
  conclusion: [
    'TCursor is the project where I learned that a recorder is mostly a timekeeping problem wearing a graphics problem\'s clothes. The compositor was the fun part and the easy part. The hard part was that a pause, a tab switch, a monitor change or a dropped frame each quietly put two clocks out of step, and every one of those bugs presented as something else entirely - audio drift, a frozen picture, a recording that stopped on its own.',
    'What I would defend is the shape of the fixes rather than the features. Timestamps that are the same number by construction instead of by convention. One resolver that both the preview and the export are forced to call. A resize that fits the frame instead of ending the take. The parts of this that are worth anything are the ones where two things can no longer disagree.',
  ],
  figma: null,
  links: [],
};
