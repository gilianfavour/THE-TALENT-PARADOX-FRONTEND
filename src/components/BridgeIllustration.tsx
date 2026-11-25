const ARC = "M70 250 C 200 70, 520 70, 650 250";

function Person({ x, y, tone, delay }: { x: number; y: number; tone: string; delay: string }) {
  return (
    <g className="anim-float" style={{ animationDelay: delay }}>
      <circle cx={x} cy={y} r="15" fill={tone} />
      <path d={`M${x - 24} ${y + 50} a24 24 0 0 1 48 0 z`} fill={tone} />
    </g>
  );
}

export default function BridgeIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 720 320" className={className} role="img" aria-label="Candidates crossing a bridge to employers">
      <defs>
        <linearGradient id="tb-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fef2f2" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
        <pattern id="tb-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="#e4e4e7" />
        </pattern>
      </defs>
      <rect width="720" height="320" rx="28" fill="url(#tb-sky)" />
      <rect width="720" height="320" rx="28" fill="url(#tb-grid)" opacity="0.7" />

      {/* Ground */}
      <path d="M0 262 H720" stroke="#0a0a0a" strokeWidth="3" />

      {/* Bridge */}
      <path d={ARC} fill="none" stroke="#0a0a0a" strokeWidth="10" strokeLinecap="round" className="anim-draw" />
      {[150, 230, 310, 410, 490, 570].map((x, i) => {
        const t = (x - 70) / 580;
        const y = Math.pow(1 - t, 3) * 250 + 3 * Math.pow(1 - t, 2) * t * 70 + 3 * (1 - t) * t * t * 70 + t * t * t * 250;
        return <path key={x} d={`M${x} ${y + 6} V262`} stroke="#0a0a0a" strokeWidth="3" opacity="0.85" className="anim-fade" style={{ animationDelay: `${0.6 + i * 0.08}s` }} />;
      })}

      {/* Candidates (left) */}
      <Person x={40} y={196} tone="#0a0a0a" delay="0s" />
      <Person x={98} y={206} tone="#c8102e" delay="0.6s" />

      {/* Employers (right) */}
      <g className="anim-fade" style={{ animationDelay: "0.9s" }}>
        <rect x="620" y="150" width="46" height="112" rx="4" fill="#0a0a0a" />
        <rect x="672" y="186" width="34" height="76" rx="4" fill="#c8102e" />
        {[0, 1, 2, 3].map((r) =>
          [0, 1].map((c) => <rect key={`${r}-${c}`} x={630 + c * 16} y={164 + r * 22} width="9" height="11" rx="1.5" fill="#ffffff" opacity="0.9" />),
        )}
      </g>

      {/* Skills travelling across */}
      {[
        { label: "Assessed", fill: "#c8102e", dur: "6s", begin: "0s" },
        { label: "Evidenced", fill: "#0a0a0a", dur: "6s", begin: "2s" },
        { label: "Validated", fill: "#8f0b1f", dur: "6s", begin: "4s" },
      ].map((s) => (
        <g key={s.label}>
          <g>
            <rect x="-44" y="-30" width="88" height="26" rx="13" fill={s.fill} />
            <text x="0" y="-12.5" textAnchor="middle" fontSize="12" fontWeight="700" fill="#ffffff" fontFamily="inherit">
              {s.label}
            </text>
            <animateMotion dur={s.dur} begin={s.begin} repeatCount="indefinite" path={ARC} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur={s.dur} begin={s.begin} repeatCount="indefinite" />
          </g>
        </g>
      ))}

      {/* Sparkle at top */}
      <g className="anim-pulse" style={{ transformOrigin: "360px 110px" }}>
        <path d="M360 96 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4z" fill="#c8102e" />
      </g>
    </svg>
  );
}
