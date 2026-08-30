"use client";

import type { ProjectPalette, ProjectVisualVariant } from "@/data/projects";

/**
 * -----------------------------------------------------------------------------
 * PLACEHOLDER PROJECT VISUALS
 * -----------------------------------------------------------------------------
 * Generated geometry rather than photography — no stock imagery, nothing
 * licensed. Each variant is a quiet technical diagram in the site's own
 * palette, so the showcase reads as designed rather than as five empty boxes.
 *
 * Replace by swapping <ProjectVisual /> for <Image /> once real captures exist;
 * the surrounding layout does not care which is inside.
 * -----------------------------------------------------------------------------
 */

const INK = "#111111";

/*
 * Read from a custom property rather than hardcoded, so every accented mark in
 * every diagram below re-tints from one value on the wrapper. Threading a prop
 * through ~20 individual shapes would be the same result with far more noise.
 * The fallback is the site accent, for any caller that does not set one.
 */
const ACCENT = "var(--pv-accent, #9a6840)";
/*
 * A project that supplies a full palette gets four more tones to draw with;
 * everything falls back to the previous single-accent behaviour, so the four
 * projects without a palette are pixel-identical to before.
 */
const MUTED = "var(--pv-muted, rgba(17,17,17,0.24))";
const WARM = "var(--pv-warm, var(--pv-accent, #9a6840))";
const CREAM = "var(--pv-cream, #ffffff)";
const TINT_A = "var(--pv-surface, #faf9f7)";
const TINT_B = "var(--pv-surface, #f1efeb)";

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 800 560"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="pv-surface" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={TINT_A} stopOpacity="0.55" />
          <stop offset="55%" stopColor={TINT_B} />
          <stop offset="100%" stopColor={TINT_B} />
        </linearGradient>
        <linearGradient id="pv-warm" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor={ACCENT} stopOpacity="0.14" />
          <stop offset="70%" stopColor={ACCENT} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="800" height="560" fill="url(#pv-surface)" />
      <rect width="800" height="560" fill="url(#pv-warm)" />
      {children}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * A system, drawn as type and lines.
 *
 * Explicitly NOT a browser window, dashboard or interface mockup. Inventing a
 * screen for a project whose real screens are not cleared for publication
 * shows the reader something that does not exist — so this names the parts of
 * the system instead and leaves the actual interface to real screenshots when
 * they are approved.
 */
function SystemVisual() {
  const MONO = "ui-monospace, SFMono-Regular, monospace";
  const SANS = "ui-sans-serif, system-ui, sans-serif";

  /*
   * Each layer carries what it actually is underneath its name. The
   * technologies are already published in the case study, so naming them here
   * costs nothing and gives the diagram something to say — an outline with
   * three words in it reads as a placeholder no matter how it is coloured.
   *
   * Three tones doing three jobs: the project accent for the request path, its
   * warm tone for the layer being called out, its muted tone for what sits
   * beside the path rather than in it.
   */
  const layers = [
    { n: "01", y: 104, title: "PUBLIC SITE", sub: "Next.js routes · React" },
    { n: "02", y: 232, title: "CMS", sub: "Payload · admin surface", accent: true },
    { n: "03", y: 360, title: "DATABASE", sub: "PostgreSQL · Railway" },
  ];

  const X = 110;
  const W = 380;
  const H = 92;
  const MID = X + W / 2;

  return (
    <Frame>
      {/* Header */}
      <text x="56" y="52" fontFamily={MONO} fontSize="12" letterSpacing="2" fill={ACCENT} fillOpacity="0.65">
        SYSTEM ARCHITECTURE
      </text>
      <text x="744" y="52" textAnchor="end" fontFamily={MONO} fontSize="12" letterSpacing="2" fill={MUTED}>
        WLE
      </text>
      <line x1="56" y1="70" x2="744" y2="70" stroke={MUTED} strokeOpacity="0.7" />

      {/* Request path */}
      {layers.map((l) => (
        <g key={l.n}>
          <text x="56" y={l.y + H / 2 + 4} fontFamily={MONO} fontSize="12" letterSpacing="1.4" fill={MUTED}>
            {l.n}
          </text>
          <rect
            x={X}
            y={l.y}
            width={W}
            height={H}
            rx="10"
            fill={l.accent ? WARM : CREAM}
            fillOpacity={l.accent ? 0.16 : 0.96}
            stroke={l.accent ? WARM : ACCENT}
            strokeOpacity={l.accent ? 0.9 : 0.5}
            strokeWidth={l.accent ? 1.5 : 1.15}
          />
          <text x={X + 28} y={l.y + 40} fontFamily={SANS} fontSize="18" letterSpacing="2.4" fill={l.accent ? WARM : ACCENT}>
            {l.title}
          </text>
          <text x={X + 28} y={l.y + 66} fontFamily={MONO} fontSize="12" letterSpacing="0.6" fill={ACCENT} fillOpacity="0.55">
            {l.sub}
          </text>
        </g>
      ))}

      {/* Connectors, labelled with what passes between the layers */}
      {[
        { y1: 196, y2: 232, label: "serves" },
        { y1: 324, y2: 360, label: "reads" },
      ].map((c, i) => (
        <g key={c.label}>
          <line x1={MID} y1={c.y1} x2={MID} y2={c.y2} stroke={ACCENT} strokeOpacity="0.8" strokeWidth="1.5" />
          <circle cx={MID} cy={(c.y1 + c.y2) / 2} r="4" fill={i === 0 ? WARM : ACCENT} />
          <text x={MID + 16} y={(c.y1 + c.y2) / 2 + 4} fontFamily={MONO} fontSize="11" letterSpacing="1.2" fill={ACCENT} fillOpacity="0.5">
            {c.label}
          </text>
        </g>
      ))}

      {/* Alongside the path, not in it */}
      <line x1={X + W} y1="278" x2="540" y2="278" stroke={MUTED} strokeWidth="1.5" strokeDasharray="4 5" />
      <rect x="540" y="232" width="196" height={H} rx="10" fill={MUTED} fillOpacity="0.16" stroke={MUTED} strokeWidth="1.5" strokeDasharray="5 5" />
      <text x="564" y="272" fontFamily={SANS} fontSize="15" letterSpacing="2.2" fill={ACCENT} fillOpacity="0.8">
        OBJECT STORAGE
      </text>
      <text x="564" y="294" fontFamily={MONO} fontSize="11" letterSpacing="0.6" fill={ACCENT} fillOpacity="0.5">
        private · media
      </text>

      {/* Footer */}
      <line x1="56" y1="486" x2="744" y2="486" stroke={MUTED} strokeOpacity="0.7" />
      <text x="56" y="514" fontFamily={MONO} fontSize="12" letterSpacing="1.8" fill={ACCENT} fillOpacity="0.7">
        SERVICE TOPOLOGY
      </text>
      <text x="744" y="514" textAnchor="end" fontFamily={MONO} fontSize="12" letterSpacing="1.8" fill={MUTED}>
        PRIVATE REPOSITORY
      </text>
    </Frame>
  );
}

/**
 * A relational domain, drawn as nodes and edges.
 *
 * Like SystemVisual, explicitly not an interface: a ride-hailing project
 * invites a fake map or a fake booking screen, and neither would be a real
 * screen from this project. What is actually interesting about it is the shape
 * of the data, so that is what gets drawn.
 *
 * Edges are trimmed to the box boundary rather than run centre to centre. Drawn
 * centre to centre they pass underneath the nodes, which is invisible while
 * every node is opaque and becomes a line straight through the label the moment
 * one is tinted. Trimming also leaves a small, even gap at every junction,
 * which is what makes a diagram read as drawn rather than assembled.
 */
function RelationsVisual() {
  const W = 146;
  const H = 50;
  /** Gap left between a node's edge and the line that meets it. */
  const GAP = 7;

  const nodes = [
    { id: "rider", label: "RIDER", x: 178, y: 126 },
    { id: "driver", label: "DRIVER", x: 622, y: 126 },
    { id: "ride", label: "RIDE", x: 400, y: 266, key: true },
    { id: "wallet", label: "WALLET", x: 178, y: 406 },
    { id: "payment", label: "PAYMENT", x: 400, y: 406 },
    { id: "payout", label: "PAYOUT", x: 622, y: 406 },
  ];
  const at = (id: string) => nodes.find((n) => n.id === id)!;

  /*
   * Columns and rows are aligned on purpose: rider/wallet share a column,
   * driver/payout share another, so the driver-to-payout edge is a clean
   * vertical instead of a long diagonal cutting across the whole figure. The
   * columns are also spaced well wider than a box, so the horizontal edges have
   * room to read as connections rather than as hyphens between two labels.
   */
  const edges: [string, string][] = [
    ["rider", "ride"],
    ["driver", "ride"],
    ["ride", "payment"],
    ["wallet", "payment"],
    ["payment", "payout"],
    ["driver", "payout"],
  ];

  /** Where the segment from `from` to `to` leaves `from`'s box, plus a gap. */
  const exit = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const scale = Math.min(
      dx === 0 ? Infinity : (W / 2 + GAP) / Math.abs(dx),
      dy === 0 ? Infinity : (H / 2 + GAP) / Math.abs(dy),
    );
    return { x: from.x + dx * scale, y: from.y + dy * scale };
  };

  return (
    <Frame>
      <g>
        {edges.map(([a, b]) => {
          const p = exit(at(a), at(b));
          const q = exit(at(b), at(a));
          return (
            <line
              key={`${a}-${b}`}
              x1={p.x}
              y1={p.y}
              x2={q.x}
              y2={q.y}
              stroke={MUTED}
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          );
        })}
      </g>

      {nodes.map((n) => (
        <g key={n.id}>
          {/* Opaque base under every node, so nothing can read through it. */}
          <rect
            x={n.x - W / 2}
            y={n.y - H / 2}
            width={W}
            height={H}
            rx="9"
            fill={CREAM}
          />
          {n.key && (
            <rect
              x={n.x - W / 2}
              y={n.y - H / 2}
              width={W}
              height={H}
              rx="9"
              fill={WARM}
              fillOpacity="0.14"
            />
          )}
          <rect
            x={n.x - W / 2}
            y={n.y - H / 2}
            width={W}
            height={H}
            rx="9"
            fill="none"
            stroke={n.key ? WARM : ACCENT}
            strokeOpacity={n.key ? 0.85 : 0.45}
            strokeWidth={n.key ? 1.5 : 1.1}
          />
          <text
            x={n.x}
            y={n.y + 4}
            textAnchor="middle"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
            fontSize="12.5"
            fontWeight="500"
            letterSpacing="2.4"
            fill={n.key ? WARM : ACCENT}
          >
            {n.label}
          </text>
        </g>
      ))}

      <line x1="105" y1="476" x2="695" y2="476" stroke={MUTED} strokeOpacity="0.7" />
      <text
        x="105"
        y="502"
        fontFamily="ui-monospace, SFMono-Regular, monospace"
        fontSize="11.5"
        letterSpacing="2"
        fill={ACCENT}
        fillOpacity="0.62"
      >
        DOMAIN MODEL
      </text>
      <text
        x="695"
        y="502"
        textAnchor="end"
        fontFamily="ui-monospace, SFMono-Regular, monospace"
        fontSize="11.5"
        letterSpacing="2"
        fill={ACCENT}
        fillOpacity="0.45"
      >
        {String(nodes.length).padStart(2, "0")} ENTITIES
      </text>
    </Frame>
  );
}

function GridVisual() {
  const cols = 11;
  const rows = 8;
  const nodes: { x: number; y: number; key: string }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      nodes.push({ x: 120 + c * 56, y: 110 + r * 48, key: `${r}-${c}` });
    }
  }
  // A deterministic handful of "active" nodes — no Math.random(), so server
  // and client render identically and hydration stays clean.
  const active = new Set(["2-3", "3-5", "4-4", "5-7", "2-8"]);

  return (
    <Frame>
      <g>
        {nodes.map((n) => {
          const isActive = active.has(n.key);
          return (
            <circle
              key={n.key}
              cx={n.x}
              cy={n.y}
              r={isActive ? 4.5 : 1.6}
              fill={isActive ? ACCENT : INK}
              opacity={isActive ? 0.9 : 0.22}
            />
          );
        })}
      </g>
      <g stroke={INK} strokeOpacity="0.28" strokeWidth="1" fill="none">
        <path d="M288 254 L400 302 L512 206 L568 254" />
        <path d="M288 254 L344 350 L512 206" />
      </g>
      <rect
        x="264"
        y="182"
        width="328"
        height="192"
        fill="none"
        stroke={ACCENT}
        strokeOpacity="0.5"
        strokeWidth="1"
        strokeDasharray="4 5"
      />
    </Frame>
  );
}

function OrbitVisual() {
  return (
    <Frame>
      <g transform="translate(400 280)">
        {[70, 124, 178, 232].map((r, i) => (
          <circle
            key={r}
            r={r}
            fill="none"
            stroke={INK}
            strokeOpacity={0.3 - i * 0.05}
            strokeWidth="1"
          />
        ))}
        <circle r="232" fill="none" stroke={ACCENT} strokeOpacity="0.35" strokeWidth="1" strokeDasharray="2 8" />
        <circle r="16" fill={INK} />
        <circle r="30" fill="none" stroke={INK} strokeOpacity="0.35" strokeWidth="1" />

        {[
          { r: 70, a: -35 },
          { r: 124, a: 128 },
          { r: 124, a: 20 },
          { r: 178, a: 218 },
          { r: 232, a: 74 },
        ].map(({ r, a }, i) => {
          const rad = (a * Math.PI) / 180;
          return (
            <circle
              key={i}
              cx={Math.cos(rad) * r}
              cy={Math.sin(rad) * r}
              r={i === 2 ? 7 : 4.5}
              fill={i === 2 ? ACCENT : INK}
              opacity={i === 2 ? 1 : 0.55}
            />
          );
        })}
      </g>
      <line x1="80" y1="280" x2="150" y2="280" stroke={INK} strokeOpacity="0.2" strokeWidth="1" />
      <line x1="650" y1="280" x2="720" y2="280" stroke={INK} strokeOpacity="0.2" strokeWidth="1" />
    </Frame>
  );
}

function ScanVisual() {
  return (
    <Frame>
      <g stroke={INK} strokeOpacity="0.1" strokeWidth="1">
        {Array.from({ length: 14 }, (_, i) => (
          <line key={i} x1="90" y1={110 + i * 26} x2="710" y2={110 + i * 26} />
        ))}
      </g>

      {/* Detection box */}
      <rect x="286" y="146" width="230" height="286" fill="none" stroke={ACCENT} strokeWidth="1.5" />
      <rect x="286" y="146" width="230" height="286" fill={ACCENT} fillOpacity="0.05" />

      {/* Corner brackets */}
      {[
        [90, 96, 1, 1],
        [710, 96, -1, 1],
        [90, 464, 1, -1],
        [710, 464, -1, -1],
      ].map(([cx, cy, sx, sy], i) => (
        <path
          key={i}
          d={`M${cx} ${cy + sy * 34} L${cx} ${cy} L${cx + sx * 34} ${cy}`}
          fill="none"
          stroke={INK}
          strokeOpacity="0.55"
          strokeWidth="1.5"
        />
      ))}

      <line x1="90" y1="230" x2="710" y2="230" stroke={ACCENT} strokeOpacity="0.7" strokeWidth="1.5" />
      <circle cx="401" cy="230" r="5" fill={ACCENT} />
    </Frame>
  );
}

function StrataVisual() {
  const bars = [
    { w: 470, o: 0.9, accent: false },
    { w: 352, o: 0.55, accent: false },
    { w: 546, o: 1, accent: true },
    { w: 268, o: 0.4, accent: false },
    { w: 412, o: 0.7, accent: false },
    { w: 196, o: 0.3, accent: false },
  ];
  return (
    <Frame>
      <g>
        {bars.map((b, i) => (
          <rect
            key={i}
            x="120"
            y={128 + i * 52}
            width={b.w}
            height="18"
            rx="9"
            fill={b.accent ? ACCENT : INK}
            opacity={b.accent ? 0.85 : b.o * 0.5}
          />
        ))}
      </g>
      <g stroke={INK} strokeOpacity="0.14" strokeWidth="1">
        {[120, 288, 456, 624].map((x) => (
          <line key={x} x1={x} y1="104" x2={x} y2="468" />
        ))}
      </g>
      <path
        d="M120 452 L232 418 L344 434 L456 372 L568 396 L680 340"
        fill="none"
        stroke={INK}
        strokeOpacity="0.6"
        strokeWidth="1.5"
      />
      <circle cx="680" cy="340" r="5" fill={INK} />
    </Frame>
  );
}

function FlowVisual() {
  const boxes = [
    { x: 96, y: 128, w: 150, h: 62, accent: false },
    { x: 96, y: 336, w: 150, h: 62, accent: false },
    { x: 325, y: 232, w: 150, h: 62, accent: true },
    { x: 554, y: 128, w: 150, h: 62, accent: false },
    { x: 554, y: 336, w: 150, h: 62, accent: false },
  ];
  return (
    <Frame>
      <g fill="none" stroke={INK} strokeOpacity="0.35" strokeWidth="1.25">
        <path d="M246 159 L286 159 L286 263 L325 263" />
        <path d="M246 367 L286 367 L286 263 L325 263" />
        <path d="M475 263 L514 263 L514 159 L554 159" />
        <path d="M475 263 L514 263 L514 367 L554 367" />
      </g>
      {boxes.map((b, i) => (
        <g key={i}>
          <rect
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            rx="10"
            fill={b.accent ? ACCENT : "#ffffff"}
            fillOpacity={b.accent ? 0.9 : 0.75}
            stroke={b.accent ? ACCENT : INK}
            strokeOpacity={b.accent ? 1 : 0.25}
            strokeWidth="1"
          />
          <rect
            x={b.x + 18}
            y={b.y + 20}
            width={b.w - 62}
            height="6"
            rx="3"
            fill={b.accent ? "#ffffff" : INK}
            opacity={b.accent ? 0.85 : 0.3}
          />
          <rect
            x={b.x + 18}
            y={b.y + 36}
            width={b.w - 96}
            height="6"
            rx="3"
            fill={b.accent ? "#ffffff" : INK}
            opacity={b.accent ? 0.5 : 0.16}
          />
        </g>
      ))}
      <circle cx="286" cy="263" r="4" fill={INK} opacity="0.5" />
      <circle cx="514" cy="263" r="4" fill={INK} opacity="0.5" />
    </Frame>
  );
}

/**
 * Gated access to separated domains.
 *
 * The third figure that is explicitly not an interface, and the one where that
 * matters most: this project's real screens hold HSEQ records, employee medical
 * information and job data, so an invented "internal dashboard" here would be a
 * fabricated confidential system. What is actually true about it — one
 * authority boundary in front of several independent domains, every write
 * transactional and audited — is structural, so the structure is what is drawn.
 */
function ModulesVisual() {
  const MONO = "ui-monospace, SFMono-Regular, monospace";
  const SANS = "ui-sans-serif, system-ui, sans-serif";

  /* Five equal columns across the frame's inner width (56 → 744). */
  const MOD_W = 124;
  const MOD_GAP = 17;
  const MOD_Y = 188;
  const MOD_H = 80;
  const modules = ["HSEQ", "MEDICAL", "ORGANIZATION", "JOBS", "ADMIN"].map(
    (label, i) => ({
      label,
      n: `0${i + 1}`,
      x: 56 + i * (MOD_W + MOD_GAP),
      /* Organization is the backbone the other domains hang off, so it is the
         one column carrying the warm accent. */
      key: label === "ORGANIZATION",
    }),
  );
  const cx = (m: { x: number }) => m.x + MOD_W / 2;
  const first = cx(modules[0]);
  const last = cx(modules[modules.length - 1]);

  /** A full-width labelled band in the request path. */
  const band = (
    y: number,
    label: string,
    opts: { warm?: boolean } = {},
  ) => (
    <g>
      <rect
        x="56"
        y={y}
        width="688"
        height="46"
        rx="10"
        fill={opts.warm ? WARM : CREAM}
        fillOpacity={opts.warm ? 0.12 : 0.96}
      />
      <rect
        x="56"
        y={y}
        width="688"
        height="46"
        rx="10"
        fill="none"
        stroke={opts.warm ? WARM : ACCENT}
        strokeOpacity={opts.warm ? 0.8 : 0.45}
        strokeWidth={opts.warm ? 1.4 : 1.1}
      />
      <text
        x="400"
        y={y + 27}
        textAnchor="middle"
        fontFamily={SANS}
        fontSize="12.5"
        fontWeight="500"
        letterSpacing="2.6"
        fill={opts.warm ? WARM : ACCENT}
      >
        {label}
      </text>
    </g>
  );

  /** A vertical tick between two bands. */
  const tick = (x: number, y1: number, y2: number) => (
    <line x1={x} y1={y1} x2={x} y2={y2} stroke={MUTED} strokeWidth="1.2" />
  );

  return (
    <Frame>
      {/* Header */}
      <text x="56" y="52" fontFamily={MONO} fontSize="12" letterSpacing="2" fill={ACCENT} fillOpacity="0.65">
        ACCESS &amp; DOMAINS
      </text>
      <text x="744" y="52" textAnchor="end" fontFamily={MONO} fontSize="12" letterSpacing="2" fill={MUTED}>
        INTERNAL
      </text>
      <line x1="56" y1="70" x2="744" y2="70" stroke={MUTED} strokeOpacity="0.7" />

      {/* One authority boundary in front of everything */}
      {band(106, "ROLE-DERIVED AUTHORITY")}

      {/* Distribution bus: authority fans out to independent domains */}
      <g>
        {tick(400, 152, 170)}
        <line x1={first} y1="170" x2={last} y2="170" stroke={MUTED} strokeWidth="1.2" />
        {modules.map((m) => (
          <g key={`in-${m.label}`}>{tick(cx(m), 170, MOD_Y)}</g>
        ))}
      </g>

      {/* Domain modules — names of feature boundaries, never records */}
      {modules.map((m) => (
        <g key={m.label}>
          <rect
            x={m.x}
            y={MOD_Y}
            width={MOD_W}
            height={MOD_H}
            rx="10"
            fill={CREAM}
            fillOpacity="0.96"
          />
          {m.key && (
            <rect
              x={m.x}
              y={MOD_Y}
              width={MOD_W}
              height={MOD_H}
              rx="10"
              fill={WARM}
              fillOpacity="0.12"
            />
          )}
          <rect
            x={m.x}
            y={MOD_Y}
            width={MOD_W}
            height={MOD_H}
            rx="10"
            fill="none"
            stroke={m.key ? WARM : ACCENT}
            strokeOpacity={m.key ? 0.8 : 0.35}
            strokeWidth={m.key ? 1.4 : 1.1}
          />
          <text
            x={cx(m)}
            y={MOD_Y + 32}
            textAnchor="middle"
            fontFamily={MONO}
            fontSize="10"
            letterSpacing="1.4"
            fill={MUTED}
          >
            {m.n}
          </text>
          <text
            x={cx(m)}
            y={MOD_Y + 56}
            textAnchor="middle"
            fontFamily={SANS}
            fontSize="10.5"
            fontWeight="500"
            letterSpacing="1.2"
            fill={m.key ? WARM : ACCENT}
          >
            {m.label}
          </text>
        </g>
      ))}

      {/* Back into one path: every write is transactional and audited */}
      <g>
        {modules.map((m) => (
          <g key={`out-${m.label}`}>{tick(cx(m), MOD_Y + MOD_H, 286)}</g>
        ))}
        <line x1={first} y1="286" x2={last} y2="286" stroke={MUTED} strokeWidth="1.2" />
        {tick(400, 286, 304)}
      </g>

      {band(304, "TRANSACTIONAL ACTIONS", { warm: true })}
      {tick(400, 350, 386)}
      {band(386, "POSTGRESQL")}

      {/* Footer */}
      <line x1="56" y1="476" x2="744" y2="476" stroke={MUTED} strokeOpacity="0.7" />
      <text x="56" y="502" fontFamily={MONO} fontSize="11.5" letterSpacing="2" fill={ACCENT} fillOpacity="0.62">
        ROLE-GATED · AUDITED
      </text>
      <text x="744" y="502" textAnchor="end" fontFamily={MONO} fontSize="11.5" letterSpacing="2" fill={ACCENT} fillOpacity="0.45">
        PRIVATE SYSTEM
      </text>
    </Frame>
  );
}

/**
 * An analytics pipeline, drawn as a measured axis.
 *
 * Not a chart. A dashboard project invites exactly that — a sparkline, a bar
 * group, a forecast curve — and any of them would be invented output presented
 * as this application's own. The stages are real and published; their values
 * are not, so the stages are what get drawn.
 */
function PipelineVisual() {
  const MONO = "ui-monospace, SFMono-Regular, monospace";
  const SANS = "ui-sans-serif, system-ui, sans-serif";

  const stages = [
    "INGESTION",
    "TRANSFORMATION",
    "KPI ENGINE",
    "VISUALIZATION",
    "EXPORT",
    "FORECASTING",
  ];
  /* Six even slots across the frame's inner width (56 → 744). */
  const SLOT = 688 / stages.length;
  const cx = (i: number) => 56 + SLOT * (i + 0.5);
  const AXIS = 306;

  /*
   * The three concerns the six stages fall into. Drawn as brackets above the
   * axis so the figure says how the pipeline is grouped, not merely that it
   * has six steps.
   */
  const groups = [
    { label: "DATA", from: 0, to: 1 },
    { label: "REPORTING", from: 2, to: 4 },
    { label: "FORECAST PATH", from: 5, to: 5 },
  ];

  return (
    <Frame>
      {/* Header */}
      <text x="56" y="52" fontFamily={MONO} fontSize="12" letterSpacing="2" fill={ACCENT} fillOpacity="0.65">
        ANALYTICS PIPELINE
      </text>
      <text x="744" y="52" textAnchor="end" fontFamily={MONO} fontSize="12" letterSpacing="2" fill={MUTED}>
        PUBLIC
      </text>
      <line x1="56" y1="70" x2="744" y2="70" stroke={MUTED} strokeOpacity="0.7" />

      {/* Grouping brackets */}
      {groups.map((g) => {
        const a = cx(g.from);
        const b = cx(g.to);
        const mid = (a + b) / 2;
        return (
          <g key={g.label}>
            {g.from !== g.to && (
              <>
                <line x1={a} y1="196" x2={b} y2="196" stroke={MUTED} strokeWidth="1" strokeOpacity="0.8" />
                <line x1={a} y1="196" x2={a} y2="207" stroke={MUTED} strokeWidth="1" strokeOpacity="0.8" />
                <line x1={b} y1="196" x2={b} y2="207" stroke={MUTED} strokeWidth="1" strokeOpacity="0.8" />
              </>
            )}
            <text
              x={mid}
              y="183"
              textAnchor="middle"
              fontFamily={MONO}
              fontSize="10.5"
              letterSpacing="1.8"
              fill={ACCENT}
              fillOpacity="0.55"
            >
              {g.label}
            </text>
          </g>
        );
      })}

      {/* The axis the stages sit on */}
      <line x1={cx(0)} y1={AXIS} x2={cx(stages.length - 1)} y2={AXIS} stroke={MUTED} strokeWidth="1.3" />

      {stages.map((label, i) => {
        /* The KPI engine is the stage the whole pipeline exists to produce,
           so it is the one carrying the warm accent. */
        const key = label === "KPI ENGINE";
        const x = cx(i);
        return (
          <g key={label}>
            <text
              x={x}
              y={AXIS - 38}
              textAnchor="middle"
              fontFamily={MONO}
              fontSize="11"
              letterSpacing="1.4"
              fill={key ? WARM : MUTED}
            >
              {String(i + 1).padStart(2, "0")}
            </text>
            <line x1={x} y1={AXIS - 27} x2={x} y2={AXIS - 13} stroke={MUTED} strokeWidth="1" strokeOpacity="0.7" />
            <circle cx={x} cy={AXIS} r={key ? 8 : 6} fill={key ? WARM : CREAM} stroke={key ? WARM : ACCENT} strokeWidth={key ? 1.5 : 1.2} />
            <line x1={x} y1={AXIS + 13} x2={x} y2={AXIS + 27} stroke={MUTED} strokeWidth="1" strokeOpacity="0.7" />
            <text
              x={x}
              y={AXIS + 48}
              textAnchor="middle"
              fontFamily={SANS}
              fontSize="10"
              fontWeight="500"
              letterSpacing="1"
              fill={key ? WARM : ACCENT}
            >
              {label}
            </text>
          </g>
        );
      })}

      {/* Footer */}
      <line x1="56" y1="476" x2="744" y2="476" stroke={MUTED} strokeOpacity="0.7" />
      <text x="56" y="502" fontFamily={MONO} fontSize="11.5" letterSpacing="2" fill={ACCENT} fillOpacity="0.62">
        END-TO-END PIPELINE
      </text>
      <text x="744" y="502" textAnchor="end" fontFamily={MONO} fontSize="11.5" letterSpacing="2" fill={ACCENT} fillOpacity="0.45">
        {String(stages.length).padStart(2, "0")} STAGES
      </text>
    </Frame>
  );
}

/**
 * Distributed training, drawn as a topology.
 *
 * Not a robot, a maze, a dashboard or a learning curve. Every one of those
 * would be invented output for a project whose experiments have not been run,
 * and a plotted curve in particular would read as a result. What is true and
 * showable is the shape: several learners around one trainer.
 *
 * The physical node is drawn dashed and muted because hardware integration is
 * phase three and has not happened. The figure therefore states the project's
 * actual state rather than its intended one.
 */
function EdgeVisual() {
  const MONO = "ui-monospace, SFMono-Regular, monospace";
  const SANS = "ui-sans-serif, system-ui, sans-serif";

  const CX = 400;
  const CY = 292;
  /*
   * An ellipse rather than a circle. The hub is three times wider than it is
   * tall, so on a circle the two side nodes collide with it and their links
   * collapse to nothing; the horizontal radius has to clear the hub's width.
   */
  const RX = 250;
  const RY = 165;
  const NODE_W = 108;
  const NODE_H = 42;
  const HUB_W = 176;
  const HUB_H = 58;
  const GAP = 7;

  const nodes = [
    { id: "sim-1", label: "SIM 01", planned: false },
    { id: "sim-2", label: "SIM 02", planned: false },
    { id: "sim-3", label: "SIM 03", planned: false },
    { id: "sim-4", label: "SIM 04", planned: false },
    { id: "esp32", label: "ESP32", planned: true },
  ].map((n, i) => {
    // Anticlockwise from the top, so the physical node lands on the left and
    // the four simulated ones read as a group.
    const angle = (-90 + i * (360 / 5)) * (Math.PI / 180);
    return { ...n, x: CX + RX * Math.cos(angle), y: CY + RY * Math.sin(angle) };
  });

  /** Where the segment toward `to` leaves a box of the given half-size. */
  const exit = (
    from: { x: number; y: number },
    to: { x: number; y: number },
    hw: number,
    hh: number,
  ) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const scale = Math.min(
      dx === 0 ? Infinity : (hw + GAP) / Math.abs(dx),
      dy === 0 ? Infinity : (hh + GAP) / Math.abs(dy),
    );
    return { x: from.x + dx * scale, y: from.y + dy * scale };
  };

  return (
    <Frame>
      {/* Header */}
      <text x="56" y="52" fontFamily={MONO} fontSize="12" letterSpacing="2" fill={ACCENT} fillOpacity="0.65">
        DISTRIBUTED LEARNING
      </text>
      <text x="744" y="52" textAnchor="end" fontFamily={MONO} fontSize="12" letterSpacing="2" fill={MUTED}>
        RESEARCH
      </text>
      <line x1="56" y1="70" x2="744" y2="70" stroke={MUTED} strokeOpacity="0.7" />

      {/* Links, trimmed at both ends so nothing crosses a label */}
      {nodes.map((n) => {
        const a = exit(n, { x: CX, y: CY }, NODE_W / 2, NODE_H / 2);
        const b = exit({ x: CX, y: CY }, n, HUB_W / 2, HUB_H / 2);
        return (
          <line
            key={`link-${n.id}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={MUTED}
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeDasharray={n.planned ? "4 5" : undefined}
            strokeOpacity={n.planned ? 0.65 : 1}
          />
        );
      })}

      {/* The trainer everything reports to */}
      <rect x={CX - HUB_W / 2} y={CY - HUB_H / 2} width={HUB_W} height={HUB_H} rx="10" fill={CREAM} />
      <rect x={CX - HUB_W / 2} y={CY - HUB_H / 2} width={HUB_W} height={HUB_H} rx="10" fill={WARM} fillOpacity="0.13" />
      <rect
        x={CX - HUB_W / 2}
        y={CY - HUB_H / 2}
        width={HUB_W}
        height={HUB_H}
        rx="10"
        fill="none"
        stroke={WARM}
        strokeOpacity="0.85"
        strokeWidth="1.5"
      />
      <text x={CX} y={CY + 5} textAnchor="middle" fontFamily={SANS} fontSize="12.5" fontWeight="500" letterSpacing="2.4" fill={WARM}>
        TRAINING
      </text>

      {/* Learners */}
      {nodes.map((n) => (
        <g key={n.id}>
          <rect
            x={n.x - NODE_W / 2}
            y={n.y - NODE_H / 2}
            width={NODE_W}
            height={NODE_H}
            rx="9"
            fill={CREAM}
            fillOpacity={n.planned ? 0.55 : 0.96}
          />
          <rect
            x={n.x - NODE_W / 2}
            y={n.y - NODE_H / 2}
            width={NODE_W}
            height={NODE_H}
            rx="9"
            fill="none"
            stroke={ACCENT}
            strokeOpacity={n.planned ? 0.4 : 0.5}
            strokeWidth="1.1"
            strokeDasharray={n.planned ? "4 5" : undefined}
          />
          <text
            x={n.x}
            y={n.y + 4}
            textAnchor="middle"
            fontFamily={SANS}
            fontSize="11"
            fontWeight="500"
            letterSpacing="1.8"
            fill={ACCENT}
            fillOpacity={n.planned ? 0.6 : 1}
          >
            {n.label}
          </text>
        </g>
      ))}

      {/* Footer */}
      <line x1="56" y1="476" x2="744" y2="476" stroke={MUTED} strokeOpacity="0.7" />
      <text x="56" y="502" fontFamily={MONO} fontSize="11.5" letterSpacing="2" fill={ACCENT} fillOpacity="0.62">
        PHASE 1 &amp; 2 COMPLETE
      </text>
      <text x="744" y="502" textAnchor="end" fontFamily={MONO} fontSize="11.5" letterSpacing="2" fill={ACCENT} fillOpacity="0.45">
        ESP32 · PHASE 3
      </text>
    </Frame>
  );
}

/**
 * Three processes, the channels between them, and a thread fan.
 *
 * Emphatically not a chart. This project handles financial records, which
 * invites a candlestick or a price line, and either would be both invented data
 * and a claim the project does not make — it is a systems exercise, not a
 * trading product. What is real about it is the process boundary, so the
 * boundaries are what get drawn.
 */
function TopologyVisual() {
  const MONO = "ui-monospace, SFMono-Regular, monospace";
  const SANS = "ui-sans-serif, system-ui, sans-serif";

  const P_W = 180;
  const P_H = 62;
  const P_Y = 202;
  const procs = [
    { label: "INGESTER", x: 56 },
    { label: "PROCESSOR", x: 310, key: true },
    { label: "REPORTER", x: 564 },
  ];
  const cx = (p: { x: number }) => p.x + P_W / 2;

  /* The channels sit in the gaps between processes, which is exactly where the
     boundary they represent actually is. */
  const channels = [
    { label: "FIFO", from: 0, to: 1 },
    { label: "SHM", from: 1, to: 2 },
  ];

  const THREADS = 4;
  const THREAD_Y = 396;

  return (
    <Frame>
      {/* Header */}
      <text x="56" y="52" fontFamily={MONO} fontSize="12" letterSpacing="2" fill={ACCENT} fillOpacity="0.65">
        PROCESS TOPOLOGY
      </text>
      <text x="744" y="52" textAnchor="end" fontFamily={MONO} fontSize="12" letterSpacing="2" fill={MUTED}>
        LINUX
      </text>
      <line x1="56" y1="70" x2="744" y2="70" stroke={MUTED} strokeOpacity="0.7" />

      {/* The dispatcher forks all three */}
      <rect x="56" y="104" width="688" height="44" rx="10" fill={CREAM} fillOpacity="0.96" />
      <rect x="56" y="104" width="688" height="44" rx="10" fill="none" stroke={ACCENT} strokeOpacity="0.45" strokeWidth="1.1" />
      <text x="400" y="131" textAnchor="middle" fontFamily={SANS} fontSize="12.5" fontWeight="500" letterSpacing="2.6" fill={ACCENT}>
        DISPATCHER
      </text>
      {/* Left of the first fork line, which the right edge ran straight through. */}
      <text x="56" y="172" fontFamily={MONO} fontSize="10" letterSpacing="1.4" fill={MUTED}>
        fork / exec
      </text>
      {procs.map((p) => (
        <line key={`fork-${p.label}`} x1={cx(p)} y1="148" x2={cx(p)} y2={P_Y} stroke={MUTED} strokeWidth="1.2" />
      ))}

      {/* The three processes */}
      {procs.map((p) => (
        <g key={p.label}>
          <rect x={p.x} y={P_Y} width={P_W} height={P_H} rx="10" fill={CREAM} fillOpacity="0.96" />
          {p.key && <rect x={p.x} y={P_Y} width={P_W} height={P_H} rx="10" fill={WARM} fillOpacity="0.12" />}
          <rect
            x={p.x}
            y={P_Y}
            width={P_W}
            height={P_H}
            rx="10"
            fill="none"
            stroke={p.key ? WARM : ACCENT}
            strokeOpacity={p.key ? 0.8 : 0.45}
            strokeWidth={p.key ? 1.4 : 1.1}
          />
          <text
            x={cx(p)}
            y={P_Y + 38}
            textAnchor="middle"
            fontFamily={SANS}
            fontSize="12"
            fontWeight="500"
            letterSpacing="2"
            fill={p.key ? WARM : ACCENT}
          >
            {p.label}
          </text>
        </g>
      ))}

      {/* IPC channels, named in the gap they cross */}
      {channels.map((c) => {
        const a = procs[c.from].x + P_W;
        const b = procs[c.to].x;
        const mid = (a + b) / 2;
        return (
          <g key={c.label}>
            <line x1={a + 6} y1={P_Y + P_H / 2} x2={b - 6} y2={P_Y + P_H / 2} stroke={MUTED} strokeWidth="1.2" strokeDasharray="3 4" />
            <text x={mid} y={P_Y - 12} textAnchor="middle" fontFamily={MONO} fontSize="10" letterSpacing="1.4" fill={ACCENT} fillOpacity="0.7">
              {c.label}
            </text>
          </g>
        );
      })}

      {/* Bounded queue and the worker threads behind the processor */}
      <line x1="400" y1={P_Y + P_H} x2="400" y2="300" stroke={MUTED} strokeWidth="1.2" />
      <rect x="300" y="300" width="200" height="40" rx="9" fill={CREAM} fillOpacity="0.96" />
      <rect x="300" y="300" width="200" height="40" rx="9" fill="none" stroke={ACCENT} strokeOpacity="0.45" strokeWidth="1.1" />
      <text x="400" y="325" textAnchor="middle" fontFamily={SANS} fontSize="10.5" fontWeight="500" letterSpacing="1.6" fill={ACCENT}>
        BOUNDED QUEUE
      </text>

      {Array.from({ length: THREADS }).map((_, i) => {
        const x = 340 + i * 40;
        return (
          <g key={`thread-${i}`}>
            <line x1="400" y1="340" x2={x} y2={THREAD_Y - 10} stroke={MUTED} strokeWidth="1" strokeOpacity="0.8" />
            <circle cx={x} cy={THREAD_Y} r="7" fill={CREAM} stroke={ACCENT} strokeOpacity="0.55" strokeWidth="1.2" />
          </g>
        );
      })}
      <text x="400" y={THREAD_Y + 32} textAnchor="middle" fontFamily={MONO} fontSize="10" letterSpacing="1.6" fill={ACCENT} fillOpacity="0.7">
        {THREADS}× WORKER THREADS
      </text>

      {/* Footer */}
      <line x1="56" y1="476" x2="744" y2="476" stroke={MUTED} strokeOpacity="0.7" />
      <text x="56" y="502" fontFamily={MONO} fontSize="11.5" letterSpacing="2" fill={ACCENT} fillOpacity="0.62">
        FORK · IPC · THREADS
      </text>
      <text x="744" y="502" textAnchor="end" fontFamily={MONO} fontSize="11.5" letterSpacing="2" fill={ACCENT} fillOpacity="0.45">
        C++17
      </text>
    </Frame>
  );
}

/* -------------------------------------------------------------------------- */

const VISUALS: Record<ProjectVisualVariant, () => React.JSX.Element> = {
  system: SystemVisual,
  modules: ModulesVisual,
  relations: RelationsVisual,
  pipeline: PipelineVisual,
  edge: EdgeVisual,
  topology: TopologyVisual,
  grid: GridVisual,
  orbit: OrbitVisual,
  scan: ScanVisual,
  strata: StrataVisual,
  flow: FlowVisual,
};

export function ProjectVisual({
  variant,
  accent,
  palette,
}: {
  variant: ProjectVisualVariant;
  accent?: string;
  palette?: ProjectPalette;
}) {
  const Visual = VISUALS[variant];

  // A palette supplies every tone; `accent` alone is the single-colour path
  // the palette-less projects still use.
  const style = palette
    ? ({
        "--pv-accent": palette.accent,
        "--pv-muted": palette.muted,
        "--pv-surface": palette.surface,
        "--pv-warm": palette.warm,
        "--pv-cream": palette.cream,
      } as React.CSSProperties)
    : accent
      ? ({ "--pv-accent": accent } as React.CSSProperties)
      : undefined;

  return (
    <div className="h-full w-full" style={style}>
      <Visual />
    </div>
  );
}
