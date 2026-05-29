/*
 * Line-art props for each story beat, in the same stroke style as the guide.
 * All use currentColor so they inherit the theme. Sub-parts carry `p-*` classes
 * that story.css animates when the prop's scene is active (lid opens, heart
 * beats, fans spin, notes bounce, tear drops, etc.). viewBox 0 0 220 200.
 */
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 6, strokeLinecap: 'round', strokeLinejoin: 'round' };

function Books() {
  return (
    <svg viewBox="0 0 220 200" aria-hidden="true">
      <rect className="p-book p-book1" x="58" y="120" width="104" height="22" rx="4" {...S} />
      <rect className="p-book p-book2" x="48" y="142" width="124" height="22" rx="4" {...S} />
      <rect className="p-book p-book3" x="64" y="98" width="92" height="22" rx="4" {...S} />
      <path d="M110 44 L150 60 L110 76 L70 60 Z" {...S} />
      <path d="M110 76 L110 88" {...S} />
      <g className="p-tassel">
        <path d="M150 60 L150 78" {...S} strokeWidth="4" />
        <circle cx="150" cy="82" r="5" fill="currentColor" />
      </g>
    </svg>
  );
}

function Laptop() {
  return (
    <svg viewBox="0 0 220 200" aria-hidden="true">
      <g className="p-lid">
        <path d="M68 142 V96 q0 -6 6 -6 h72 q6 0 6 6 v46" {...S} />
        <line x1="86" y1="112" x2="134" y2="112" {...S} />
      </g>
      <path d="M52 142 h116 q6 0 6 8 q0 6 -8 6 H54 q-8 0 -8 -6 q0 -8 6 -8 Z" {...S} />
      <g className="p-zzz">
        <path d="M150 60 h18 l-18 18 h18 M176 44 h12 l-12 12 h12" {...S} strokeWidth="5" />
      </g>
    </svg>
  );
}

function Bubbles() {
  return (
    <svg viewBox="0 0 220 200" aria-hidden="true">
      <g className="p-bub p-bub1">
        <path d="M48 60 h78 q10 0 10 10 v30 q0 10 -10 10 H86 l-16 16 v-16 H48 q-10 0 -10 -10 V70 q0 -10 10 -10 Z" {...S} />
        <circle cx="70" cy="85" r="3.5" fill="currentColor" />
        <circle cx="88" cy="85" r="3.5" fill="currentColor" />
        <circle cx="106" cy="85" r="3.5" fill="currentColor" />
      </g>
      <g className="p-bub p-bub2">
        <path d="M150 104 h36 q8 0 8 8 v20 q0 8 -8 8 h-10 l10 12 -22 -12 q-14 0 -14 -8 v-20 q0 -8 12 -8 Z" {...S} />
      </g>
    </svg>
  );
}

function Fuel() {
  return (
    <svg viewBox="0 0 220 200" aria-hidden="true">
      <g className="p-fizz">
        <circle cx="78" cy="54" r="3" fill="currentColor" />
        <circle cx="92" cy="46" r="2.5" fill="currentColor" />
        <circle cx="84" cy="40" r="2" fill="currentColor" />
      </g>
      <rect x="64" y="64" width="44" height="86" rx="8" {...S} />
      <path d="M70 96 h32" {...S} />
      <path d="M82 80 l8 0 M86 76 v8" {...S} strokeWidth="4" />
      <rect x="124" y="104" width="64" height="46" rx="5" {...S} />
      <line x1="146" y1="104" x2="146" y2="150" {...S} strokeWidth="4" />
      <line x1="166" y1="104" x2="166" y2="150" {...S} strokeWidth="4" />
      <line x1="124" y1="127" x2="188" y2="127" {...S} strokeWidth="4" />
    </svg>
  );
}

function Couch() {
  return (
    <svg viewBox="0 0 220 200" aria-hidden="true">
      <g className="p-cushion">
        <path d="M46 104 q0 -16 16 -16 h96 q16 0 16 16 v8 q-12 4 -12 18 v8 H58 v-8 q0 -14 -12 -18 Z" {...S} />
        <path d="M70 112 h80" {...S} strokeWidth="4" />
      </g>
      <path d="M58 138 v14 M162 138 v14" {...S} />
    </svg>
  );
}

function PC() {
  return (
    <svg viewBox="0 0 220 200" aria-hidden="true">
      <rect x="74" y="52" width="72" height="110" rx="8" {...S} />
      <line x1="92" y1="68" x2="128" y2="68" {...S} strokeWidth="4" />
      <circle className="p-fan" cx="110" cy="100" r="14" {...S} />
      <line className="p-fan" x1="110" y1="88" x2="110" y2="112" {...S} strokeWidth="3" />
      <path className="p-heart" d="M150 70 q8 -10 16 0 q8 -10 16 0 q0 12 -16 22 q-16 -10 -16 -22 Z" {...S} strokeWidth="5" />
    </svg>
  );
}

function Monitor() {
  return (
    <svg viewBox="0 0 220 200" aria-hidden="true">
      {/* Monitor centered in the viewBox (x=52..168, centred on 110) so the icon
          reads centred under the headline, with two music notes drifting up
          symmetrically above the screen as decoration. */}
      <rect x="52" y="58" width="116" height="78" rx="8" {...S} />
      <path d="M96 144 h28 M104 136 v8 M116 136 v8 M88 152 h44" {...S} />
      {/* race road in perspective inside the screen */}
      <path d="M86 128 L104 72" {...S} strokeWidth="5" />
      <path d="M134 128 L116 72" {...S} strokeWidth="5" />
      <path className="p-race" d="M110 128 L110 72" {...S} strokeWidth="5" strokeDasharray="9 12" />
      {/* a pair of music notes above, balanced around the monitor */}
      <g className="p-note">
        <line x1="78" y1="22" x2="78" y2="44" {...S} strokeWidth="3.5" />
        <path d="M78 22 q11 2 11 10" {...S} strokeWidth="3.5" />
        <ellipse cx="75" cy="46" rx="5" ry="3.6" fill="currentColor" stroke="none" />
        <line x1="142" y1="14" x2="142" y2="38" {...S} strokeWidth="3.5" />
        <path d="M142 14 q11 2 11 10" {...S} strokeWidth="3.5" />
        <ellipse cx="139" cy="40" rx="5" ry="3.6" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

function TV() {
  return (
    <svg viewBox="0 0 220 200" aria-hidden="true">
      <rect className="p-screen" x="50" y="54" width="120" height="80" rx="8" {...S} />
      <path d="M86 142 h48 M110 134 v8" {...S} />
      <path className="p-tear" d="M110 80 q-9 12 0 20 q9 -8 0 -20 Z" {...S} strokeWidth="5" />
    </svg>
  );
}

export const ASSETS = {
  books: Books,
  laptop: Laptop,
  bubbles: Bubbles,
  fuel: Fuel,
  couch: Couch,
  pc: PC,
  monitor: Monitor,
  tv: TV,
};
