export default function ProgressRing({ value, max, color, size = 80, label, unit }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(1, value / (max || 1));
  const dash = circ * pct;

  return (
    <div className="ring-wrap">
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: "stroke-dasharray 0.8s cubic-bezier(.4,2,.6,1)" }} />
      </svg>
      <div style={{ marginTop: -size / 2 - 8, textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-d)", fontSize: "1rem", fontWeight: 900, color, filter: `drop-shadow(0 0 6px ${color})` }}>{value}</div>
        <div style={{ fontFamily: "var(--font-m)", fontSize: "0.55rem", color: "var(--text-dim)" }}>{unit}</div>
      </div>
      <div className="ring-label">{label}</div>
    </div>
  );
}
