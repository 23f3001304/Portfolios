// Small SVG ornaments. Each is currentColor so it inherits from a parent text class.
// Use deliberately, not everywhere - editorial restraint over festive sprinkles.

export function Crosshair({ size = 14, className = '' }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      <line x1="0" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="1" />
      <line x1="8" y1="0" x2="8" y2="16" stroke="currentColor" strokeWidth="1" />
      <circle cx="8" cy="8" r="1.4" fill="currentColor" />
    </svg>
  )
}

export function Asterisk({ size = 24, className = '', spinning = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`${spinning ? 'animate-[spin_18s_linear_infinite]' : ''} ${className}`}
      aria-hidden
    >
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <line x1="12" y1="2" x2="12" y2="22" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
        <line x1="4.93" y1="19.07" x2="19.07" y2="4.93" />
      </g>
    </svg>
  )
}




export function DotGrid({ className = '', dotColor = 'currentColor', spacing = 24 }) {
  const id = `dotgrid-${spacing}`
  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden
    >
      <defs>
        <pattern id={id} x="0" y="0" width={spacing} height={spacing} patternUnits="userSpaceOnUse">
          <circle cx="1.2" cy="1.2" r="1.1" fill={dotColor} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

export function Bracket({ side = 'left', className = '' }) {
  // Editorial corner bracket
  const path = side === 'left' ? 'M 8 0 L 0 0 L 0 16' : 'M 0 0 L 8 0 L 8 16'
  return (
    <svg viewBox="0 0 8 16" width="8" height="16" className={className} aria-hidden>
      <path d={path} fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square" />
    </svg>
  )
}

export function ArrowDoodle({ className = '' }) {
  // Hand-drawn-feel curved arrow, not a chevron
  return (
    <svg
      viewBox="0 0 80 24"
      className={className}
      width="80"
      height="24"
      aria-hidden
    >
      <path
        d="M 2 14 C 18 4, 38 22, 60 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <polyline
        points="52,4 60,8 56,16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Drawn underline that animates on hover (inline SVG so we can use stroke-dasharray)
export function Underline({ className = '' }) {
  return (
    <svg
      viewBox="0 0 200 6"
      preserveAspectRatio="none"
      className={`absolute left-0 right-0 -bottom-1 w-full h-1.5 ${className}`}
      aria-hidden
    >
      <path
        d="M 2 4 C 50 1, 110 7, 198 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

// Plus / hatch marker
export function Plus({ size = 10, className = '' }) {
  return (
    <svg viewBox="0 0 12 12" width={size} height={size} className={className} aria-hidden>
      <line x1="0" y1="6" x2="12" y2="6" stroke="currentColor" strokeWidth="1" />
      <line x1="6" y1="0" x2="6" y2="12" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

// Tick / hash mark (the long-dash, short-dash flag rail)
export function TickRail({ className = '' }) {
  return (
    <svg viewBox="0 0 80 8" width="80" height="8" className={className} aria-hidden>
      {[0, 10, 20, 30, 40, 50, 60, 70].map((x, i) => (
        <line
          key={x}
          x1={x}
          y1="0"
          x2={x}
          y2={i % 2 === 0 ? 8 : 5}
          stroke="currentColor"
          strokeWidth="1"
        />
      ))}
    </svg>
  )
}

// Annotation - drawn arrow + label
export function Annotation({ children, className = '', side = 'left' }) {
  const flip = side === 'right'
  return (
    <div
      className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] ${className}`}
    >
      {!flip && (
        <svg viewBox="0 0 60 24" width="60" height="22" aria-hidden className="shrink-0">
          <path
            d="M 4 12 C 18 4, 30 22, 56 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <polyline
            points="48,2 56,6 50,14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      <span>{children}</span>
      {flip && (
        <svg viewBox="0 0 60 24" width="60" height="22" aria-hidden className="shrink-0 -scale-x-100">
          <path
            d="M 4 12 C 18 4, 30 22, 56 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <polyline
            points="48,2 56,6 50,14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  )
}

// Section divider: hairline with centered asterisk
export function Divider({ className = '' }) {
  return (
    <div className={`flex items-center gap-4 ${className}`} aria-hidden>
      <span className="block flex-1 h-px bg-current opacity-30" />
      <Asterisk size={16} className="text-current opacity-70" />
      <span className="block flex-1 h-px bg-current opacity-30" />
    </div>
  )
}

// Concentric circles - radar/orbit ornament
export function Orbit({ size = 200, className = '' }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} aria-hidden>
      <circle cx="100" cy="100" r="98" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.25" strokeDasharray="2 4" />
      <circle cx="100" cy="100" r="70"  fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <circle cx="100" cy="100" r="42"  fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" strokeDasharray="3 3" />
      <circle cx="100" cy="100" r="14"  fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <circle cx="100" cy="100" r="2"   fill="currentColor" />
      <line x1="0" y1="100" x2="200" y2="100" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
      <line x1="100" y1="0" x2="100" y2="200" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
    </svg>
  )
}

// Section number badge: vertical hairline + circle + text
export function SectionMarker({ num, label, className = '' }) {
  return (
    <div className={`flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] ${className}`}>
      <svg viewBox="0 0 8 24" width="8" height="24" aria-hidden>
        <line x1="4" y1="0" x2="4" y2="24" stroke="currentColor" strokeWidth="1" />
        <circle cx="4" cy="12" r="2.5" fill="currentColor" />
      </svg>
      <span className="opacity-60">{num}</span>
      <span>{label}</span>
    </div>
  )
}
