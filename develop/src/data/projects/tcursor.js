export const tcursor = {
  id: 'PRJ-013',
  slug: 'tcursor',
  name: 'TCursor',
  tagline: 'A screen recorder that records everything raw and lets you decide the edit later, zooms included.',
  when: 'Jun → Sep 2026',
  status: 'IN PROGRESS',
  stack: ['Rust', 'Tauri v2', 'wgpu', 'Windows Graphics Capture', 'FFmpeg', 'React', 'TypeScript', 'Ollama'],
  metrics: [
    { value: '3',    unit: '',    label: 'clocks kept in sync' },
    { value: '1.1k', unit: '',    label: 'tests, Rust and TypeScript' },
    { value: '60',   unit: 'fps', label: 'live preview' },
    { value: '200',  unit: '',    label: 'lines max per source file' },
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
    'TCursor records your screen and then edits it for you. It captures the picture raw, with no zooms baked in, and separately logs every click, keystroke and cursor position with timestamps. The edit is a document you can keep changing: zooms that follow your cursor, a spotlight that dims everything except what you point at, a webcam bubble that shrinks when the camera pushes in. None of it is burned into the video, so all of it can be redone.',
    'A recorder that bakes its effects in has made a decision you cannot take back. Keeping the raw pixels and the event log side by side lets you change your mind later about where the focus should be. The cost is that everything after the recording has to agree on when things happened, and that is where most of my engineering time went.',
  ],
  sections: [
    {
      title: 'Three clocks, and one file that ties them together',
      figure: { id: 'FIG 13.1', caption: 'A zoom region selected: scale, start and end, and the in and out ramps that decide how the zoom feels.', src: '/projects/tcursor/zoom.png', alt: 'TCursor zoom inspector showing a 2.5x scale slider, start and end times, zoom-in and zoom-out durations, a feel selector and transition curve choices' },
      body: [
        'Capture is variable-rate. Windows Graphics Capture gives you a frame when something changes, not at a fixed interval. So the video has no reliable frame-to-time mapping of its own.',
        'There are three clocks in play: the raw capture wall clock, the event stream\'s own zero, and the output timeline the editor shows. A sidecar file, `sync.json`, ties them together. It stores the timestamp of every frame actually written, plus the offsets where the event log, the microphone and the system audio each started.',
      ],
      blocks: [
        { kind: 'code', lang: 'js', caption: 'the three time bases, named so they cannot be mixed up', code: [
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
      title: 'The pause bug',
      body: [
        'Pausing looked fine but was quietly wrong. The audio, the input streams and `sync.json` all dropped the paused span, but the MP4\'s own presentation timestamps kept running through it. So after resuming, the sound and the zooms ran ahead of the picture by exactly the length of the pause, and the end of the video got cut off.',
        'The fix was to take the encoder timestamp and the sync timestamp from a single read of one pause-aware ledger. Now they are the same number by construction, instead of two numbers that are supposed to match.',
        'The legacy encoder path has no timestamp channel at all. There, the recording is split into segments and joined back with per-file duration directives. I measured zero drift with this, against about 50 ms with a naive join.',
      ],
      blocks: [
        { kind: 'code', lang: 'js', caption: 'one ledger read, two consumers',
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
      title: 'The preview has to match the export',
      figure: { id: 'FIG 13.2', caption: 'The editor: the AI director on the left, the composited stage in the middle, and every edit as a draggable pill on its own lane.', src: '/projects/tcursor/editor.png', alt: 'TCursor editor showing the AI Director panel, a composited screen recording on a gradient background with a circular webcam bubble, and a timeline with zoom, FX, layout and camera lanes' },
      body: [
        'The editor previews at 60 fps in a canvas, and the export renders through a wgpu compositor with a CPU fallback. Two renderers, one picture. Every time I let them compute the same thing separately, they eventually disagreed.',
        'So the rule is: core logic lives once, in Rust, and the TypeScript side only displays what Rust resolved. Layout positions, camera curves, zoom anchors and spotlight state are all resolved by one function that both the preview and the export call. Where a TypeScript copy is unavoidable for latency, it is written against the Rust source and pinned by tests that compare the two.',
      ],
      blocks: [
        { kind: 'code', lang: 'js', caption: 'one resolver, two callers', code: [
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
      title: 'An AI editor that runs on your machine',
      body: [
        'The AI editor reads a transcript of what you did (clicks at these moments, typing here, a long idle there) and replies with edit operations: zoom on that click, push the camera in, trim the dead air. It runs on a local Ollama model, so the recording never leaves your computer.',
        'It produces a normal edit document, not a rendered video. Everything it writes shows up as a pill on the timeline that you can drag, retime or delete, and the whole pass is one undo step.',
        'It was also the cause of the app\'s worst freeze. The calls were synchronous Tauri commands doing blocking HTTP on the main thread, so the first model load locked the window for minutes. They are async now, and you can cancel the planning step while it runs.',
      ],
    },
    {
      title: 'Layouts you arrange by hand',
      figure: { id: 'FIG 13.3', caption: 'A custom arrangement on the layout lane. The trimmed start is striped out, and each pill shows a small sketch of its layout.', src: '/projects/tcursor/layout.png', alt: 'TCursor timeline showing custom layout segments, a spotlight region, zoom pills and a trimmed region drawn with diagonal stripes' },
      body: [
        'Layout used to be a preset name in a dropdown, which is a strange way to answer "where should the webcam be for these eight seconds?". Now a layout segment stores explicit panel positions and you arrange it directly on the stage. Drag a panel to move it or a corner to resize it, with snapping to centre, thirds and safe margins, and a modifier key to ignore the guides. Presets are now one-click starting points.',
        'The positions reuse the normalised centre-and-size format the camera keyframes already used, so keyframes refine an arrangement instead of fighting it. Old projects still load untouched. The new field is optional, and a project saved before this feature re-saves byte for byte the same.',
      ],
      blocks: [
        { kind: 'code', lang: 'js', caption: 'an optional field, so old documents stay unchanged', code: [
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
      title: 'Two bugs worth remembering',
      body: [
        'Neither bug looked like its real cause.',
        '**The giant cursor.** The stage background once rendered as a huge mouse cursor stretched across the frame. The cause was a race on a fixed temporary filename. Every image decode wrote its bytes to the same path, so a cursor sprite could overwrite the wallpaper in the milliseconds before FFmpeg read it, and the same race could bake that cursor into an exported video. I found it by decoding the actual bad image and comparing it byte for byte with what the background endpoint returned.',
        '**The recording that stopped itself.** Recording a browser window would stop and save whenever you switched tabs. The encoder had been sized from a Win32 window rectangle that includes invisible resize margins, and any later size mismatch was treated as a fatal display change. The fix, borrowed from OBS, keeps one fixed canvas and fits every frame into it.',
      ],
      blocks: [
        { kind: 'code', lang: 'js', caption: 'the resize fix, borrowed from OBS: fit the frame, never stop', code: [
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
      title: 'Rules that shaped the code',
      body: [
        'No source file may go over 200 lines. That turns "I will split this later" into a decision I have to make now, and it has often pushed me to a better split, where the pure, testable half of a problem separates from the half that needs a live GPU.',
        'Function docs live in a parallel docs tree instead of in comments, and they are checked in the same commit as the code, so they cannot quietly drift away from what the function does. Animation has a similar rule: springs from one motion library and no hand-written keyframes, so the whole app moves the same way.',
      ],
    },
  ],
  conclusion: [
    'TCursor taught me that a screen recorder is mostly a timekeeping problem that looks like a graphics problem. The compositor was the fun part, and the easy part. The hard part was that a pause, a tab switch, a monitor change or a dropped frame could each put two clocks out of step, and every one of those bugs showed up as something else: audio drift, a frozen picture, a recording that stopped on its own.',
    'Most of my fixes ended up with the same shape. If two things have to agree, make them come from one source, so they cannot disagree anymore.',
  ],
  figma: null,
  links: [],
};
