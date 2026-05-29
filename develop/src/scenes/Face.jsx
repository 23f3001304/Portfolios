/*
 * Custom face drawn over a face-less Open Peeps head, in the SAME 850x1200
 * viewBox so it lines up. This is what Open Peeps can't do on its own: pupils
 * that track the cursor, a mouth that lip-syncs, brows + glasses we control.
 */
const SCLERA = '#f4f5f7';
const PUPIL = '#16181d';

// Eye centres, nose, mouth + brow positions in the peep's coordinate space.
const LX = 452;
const RX = 543;
const EY = 300;
const RXX = 26; // sclera radii
const RYY = 30;
const NX = 497; // nose on the face centre line
const MX = 497; // mouth centre (under the eyes)
const MY = 392;
const BY = 252;

// Jaw smoothing, placed from a measurement of the real head silhouette (the
// peep's right edge runs ~639 down the cheek, bulges to 646 at y410, then kinks
// sharply in to the chin at y510). We anchor a smooth curve ON that outline at
// top and chin (rightEdge minus half the 17px stroke, so the outer edges and
// joins line up), bow it inside the bulge to kill the kink, then paint the scene
// bg to the right of it. Anchors must stay on the real edge or a seam appears.
const JAW_TOP_X = 632;
const JAW_TOP_Y = 320;
const JAW_CTRL_X = 642; // control x - lower = slimmer jaw
const JAW_CTRL_Y = 415;
const JAW_END_X = 548;
const JAW_END_Y = 510;
const JAW_W = 17; // match the head's own outline weight

export function Face({ stroke = '#f5f6f8', look = 0, lookY = 0, talking = false, talkFrame = false, mood = 'idle', blink = false, viewBox = '0 0 850 1200' }) {
  const px = Math.max(-1, Math.min(1, look)) * 9; // pupil offset toward cursor
  const py = Math.max(-1, Math.min(1, lookY)) * 6;
  const open = talking && talkFrame;
  const smileDepth = mood === 'happy' ? 30 : mood === 'talk' ? 14 : 24;

  // The face features sit on the head at the top of the peep's coordinate space,
  // so they line up for any viewBox height (e.g. a taller one that shows the legs).
  return (
    <svg className="guide-face" viewBox={viewBox} aria-hidden="true">
      {/* jaw smoothing: erase the bulging right jaw with the scene bg, then
          retrace a smooth jawline anchored on the real outline (see constants) */}
      <path
        d={`M${JAW_TOP_X} ${JAW_TOP_Y} Q ${JAW_CTRL_X} ${JAW_CTRL_Y} ${JAW_END_X} ${JAW_END_Y} L 850 ${JAW_END_Y} L 850 ${JAW_TOP_Y} Z`}
        fill="var(--bg)"
        stroke="none"
      />
      <path
        d={`M${JAW_TOP_X} ${JAW_TOP_Y} Q ${JAW_CTRL_X} ${JAW_CTRL_Y} ${JAW_END_X} ${JAW_END_Y}`}
        fill="none"
        stroke={stroke}
        strokeWidth={JAW_W}
        strokeLinecap="round"
      />

      {/* brows */}
      <g stroke={stroke} strokeWidth="6" strokeLinecap="round" fill="none">
        <path d={`M${LX - 28} ${BY} q 28 -11 54 -3`} />
        <path d={`M${RX - 26} ${BY - 2} q 28 -8 54 3`} />
      </g>

      {/* eyes - either open (sclera + tracking pupil) or a blink line */}
      {blink ? (
        <g stroke={stroke} strokeWidth="6" strokeLinecap="round" fill="none">
          <path d={`M${LX - 18} ${EY} q 18 11 36 0`} />
          <path d={`M${RX - 18} ${EY} q 18 11 36 0`} />
        </g>
      ) : (
        <g>
          <ellipse cx={LX} cy={EY} rx={RXX} ry={RYY} fill={SCLERA} stroke={stroke} strokeWidth="5" />
          <ellipse cx={RX} cy={EY} rx={RXX} ry={RYY} fill={SCLERA} stroke={stroke} strokeWidth="5" />
          <circle cx={LX + px} cy={EY + py} r="11" fill={PUPIL} />
          <circle cx={RX + px} cy={EY + py} r="11" fill={PUPIL} />
        </g>
      )}

      {/* round glasses, over the eyes (clear lenses) */}
      <g stroke={stroke} strokeWidth="7" fill="none" strokeLinecap="round">
        <circle cx={LX} cy={EY} r="40" />
        <circle cx={RX} cy={EY} r="40" />
        <path d={`M${LX + 40} ${EY - 4} q ${(RX - LX) / 2 - 40} -10 ${RX - LX - 80} 0`} />
        <path d={`M${LX - 40} ${EY - 2} l -32 -9`} />
        <path d={`M${RX + 40} ${EY - 2} l 32 -9`} />
      </g>

      {/* a small, soft nose on the centre line */}
      <path
        d={`M${NX - 2} ${EY + 40} q -9 28 12 32`}
        stroke={stroke}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* mouth - open oval while talking, friendly smile otherwise */}
      {open ? (
        <ellipse cx={MX} cy={MY} rx="24" ry="18" fill={stroke} />
      ) : (
        <path
          d={`M${MX - 36} ${MY - 7} q 36 ${smileDepth} 72 0`}
          stroke={stroke}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
