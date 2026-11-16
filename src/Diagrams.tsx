import React from "react";

// Diagrams, one per topic, in the spirit of Material Shell's spatialisation.gif: rows of
// tiles, the screen a frame the grid slides under. Each animated diagram is
// a list of steps (a state, a caption, the keys pressed); React renders the state and CSS
// transitions do the motion. Units are cqw of the stage (100 wide, 50 high), so everything
// scales with the column. They play only while on screen, can be paused, and stand still on
// one meaningful step for people who prefer reduced motion.

const Sym: React.FC<{ n: string; className?: string }> = ({ n, className }) => (
  <span className={`icon${className ? ` ${className}` : ""}`} aria-hidden="true">
    {n}
  </span>
);

const APPS = {
  browser: { name: "Browser", icon: "public", color: "#e8710a" },
  editor: { name: "Editor", icon: "code", color: "#3d7be0" },
  terminal: { name: "Terminal", icon: "terminal", color: "#5c6b75" },
  chat: { name: "Chat", icon: "forum", color: "#1f9d6b" },
  mail: { name: "Mail", icon: "mail", color: "#d0473f" },
  music: { name: "Music", icon: "music_note", color: "#8b5cf6" },
  photos: { name: "Photos", icon: "image", color: "#d6337f" },
  video: { name: "Video", icon: "smart_display", color: "#c2410c" },
  game: { name: "Game", icon: "sports_esports", color: "#b8860b" },
  files: { name: "Files", icon: "folder", color: "#0891b2" },
  calculator: { name: "Calculator", icon: "calculate", color: "#4d7c0f" },
} as const;
type AppId = keyof typeof APPS;

const pos = (x: number, y: number, w?: number, h?: number): React.CSSProperties => ({
  transform: `translate(${x}cqw, ${y}cqw)`,
  ...(w !== undefined && { width: `${w}cqw` }),
  ...(h !== undefined && { height: `${h}cqw` }),
});

const AppFace: React.FC<{ app: AppId; label?: string }> = ({ app, label }) => (
  <span className="dg-face">
    <span className="dg-badge" style={{ background: APPS[app].color }}>
      <Sym n={APPS[app].icon} />
    </span>
    <span className="dg-name">{label ?? APPS[app].name}</span>
  </span>
);

// ── Timeline ─────────────────────────────────────────────────────────────

type Timed = { ms: number; caption: string; keys?: string[] };

// `loopTo`: when the last step leaves things as step `loopTo - 1` did, carry on from `loopTo`
// with no fade, so the loop is seamless. Without it, the diagram fades out and starts over.
const useTimeline = (steps: Timed[], still: number, loopTo?: number) => {
  const ref = React.useRef<HTMLElement>(null);
  const [i, setI] = React.useState(0);
  const [loop, setLoop] = React.useState(0);
  const [fading, setFading] = React.useState(false);
  const [playing, setPlaying] = React.useState(true);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlaying(false);
      setI(still);
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0.3,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [still]);
  React.useEffect(() => {
    if (!playing || !visible) return;
    // At the end, carry on seamlessly, or fade out, start again from the first step, fade in.
    const t = fading
      ? setTimeout(() => {
          setI(0);
          setLoop((l) => l + 1);
          setFading(false);
        }, 450)
      : setTimeout(() => (i + 1 < steps.length ? setI(i + 1) : loopTo !== undefined ? setI(loopTo) : setFading(true)), steps[i].ms);
    return () => clearTimeout(t);
  }, [i, fading, playing, visible, steps, loopTo]);
  const toggle = () => {
    if (!playing && fading) setFading(false);
    setPlaying((p) => !p);
  };
  return { ref, i, loop, fading, playing, toggle };
};

const Figure: React.FC<{
  label: string;
  steps: Timed[];
  still: number;
  aspect?: string;
  loopTo?: number;
  render: (i: number) => React.ReactNode;
}> = ({ label, steps, still, aspect, loopTo, render }) => {
  const tl = useTimeline(steps, still, loopTo);
  const step = steps[tl.i];
  return (
    <figure className="dg" ref={tl.ref as React.RefObject<HTMLElement>}>
      <div className={`dg-stage${tl.fading ? " fading" : ""}`} style={aspect ? { aspectRatio: aspect } : undefined} role="img" aria-label={label}>
        <div key={tl.loop} className="dg-scene">
          {render(tl.i)}
        </div>
      </div>
      <figcaption>
        <button type="button" className="dg-play" onClick={tl.toggle} aria-label={tl.playing ? "Pause the animation" : "Play the animation"}>
          <Sym n={tl.playing ? "pause" : "play_arrow"} />
        </button>
        <span key={tl.i} className="dg-caption" aria-hidden="true">
          {step.caption}
          {step.keys && (
            <span className="dg-keys">
              {step.keys.map((k, j) => (
                <React.Fragment key={j}>
                  {j > 0 && <span className="plus">+</span>}
                  <kbd>{k}</kbd>
                </React.Fragment>
              ))}
            </span>
          )}
        </span>
      </figcaption>
    </figure>
  );
};

// Spatial model and navigation: the grid as alternating stripes, one per row.
const SPATIAL: [string, AppId[]][] = [
  ["Browser", ["browser"]],
  ["Messages", ["chat", "mail"]],
  ["Media", ["music", "photos", "video"]],
  ["Empty", []], // there is always an empty row at the bottom
];
const SP_TW = 17; // tile
const SP_TH = 10.5;
const SP_PAD = 1.4; // between tiles
const SP_BAND = SP_TH + 4; // a row's stripe; stripes alternate in shade
const SP_ROW_W = 3 * (SP_TW + SP_PAD) + 8; // three tiles and the next one's place
const SP_ASPECT = `100 / ${SPATIAL.length * SP_BAND}`; // the stage is cut to the stripes
const NAV_ASPECT = `100 / ${3 * SP_BAND}`; // three stripes high, the screen in the middle

// `labels`: the rows' names on the left (the tiles shift right to make room).
// `screen`: the row on screen and the tile each row is at. The screen frame stays in the middle
// of the stage: the grid slides up and down under it, and each row slides left and right on its
// own, keeping its place when the screen leaves it.
type OnScreen = { row: number; cols: number[] };
const Stripes: React.FC<{ labels?: boolean; screen?: OnScreen }> = ({ labels, screen }) => {
  const x0 = labels ? 23 : (100 - SP_ROW_W) / 2;
  const ty = (r: number) => r * SP_BAND + (SP_BAND - SP_TH) / 2;
  const mid = (3 * SP_BAND) / 2;
  const dx = (r: number) => (screen ? 50 - (x0 + (screen.cols[r] ?? 0) * (SP_TW + SP_PAD) + SP_TW / 2) : 0);
  const dy = screen ? mid - (ty(screen.row) + SP_TH / 2) : 0;
  return (
    <>
      <div className="dg-grid" style={pos(0, dy)}>
        {SPATIAL.map(([name, apps], r) => (
          <React.Fragment key={r}>
            <div className={`dg-ws-band${r % 2 ? " alt" : ""}`} style={pos(-100, r * SP_BAND, 300, SP_BAND)} />
            {labels && (
              <span className="dg-ws-label" style={pos(3, r * SP_BAND, x0 - 6, SP_BAND)}>
                {name}
              </span>
            )}
            <div className="dg-row" style={pos(dx(r), 0)}>
              {apps.map((a, c) => (
                <div key={a} className="dg-tile" style={pos(x0 + c * (SP_TW + SP_PAD), ty(r), SP_TW, SP_TH)}>
                  <AppFace app={a} />
                </div>
              ))}
              <div className="dg-tile add" style={pos(x0 + apps.length * (SP_TW + SP_PAD), ty(r), apps.length ? 8 : SP_TW, SP_TH)}>
                <Sym n="add" />
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
      {screen && (
        <div className="dg-frame" style={pos(50 - SP_TW / 2 - 0.7, mid - SP_TH / 2 - 0.7, SP_TW + 1.4, SP_TH + 1.4)}>
          <span className="dg-tag">Screen</span>
        </div>
      )}
    </>
  );
};

export const SpatialDiagram = () => (
  <figure className="dg">
    <div
      className="dg-stage"
      style={{ aspectRatio: SP_ASPECT }}
      role="img"
      aria-label="Diagram: rows stacked one below the other: Browser with a browser alone; Messages with chat and mail; Media with music, photos and video; and an empty row at the bottom. Each is a line of tiles, one app per tile, with room for the next app at the end of the row."
    >
      <div className="dg-scene">
        <Stripes labels />
      </div>
    </div>
    <figcaption>
      <span className="dg-caption">An example: how you group your apps into rows is up to you</span>
    </figcaption>
  </figure>
);

// Navigation: the screen, one tile wide, stays put; the grid slides under it.
const NAV: (Timed & { at: OnScreen })[] = [
  { at: { row: 1, cols: [0, 0, 0] }, caption: "The screen shows a tile", ms: 1500 },
  { at: { row: 0, cols: [0, 0, 0] }, caption: "Up: the row above", ms: 1200, keys: ["Super", "W"] },
  { at: { row: 1, cols: [0, 0, 0] }, caption: "Down: the row below", ms: 1200, keys: ["Super", "S"] },
  { at: { row: 2, cols: [0, 0, 0] }, caption: "Down again", ms: 1200, keys: ["Super", "S"] },
  { at: { row: 2, cols: [0, 0, 1] }, caption: "Right: only this row slides", ms: 1400, keys: ["Super", "D"] },
  { at: { row: 2, cols: [0, 0, 0] }, caption: "Left", ms: 1200, keys: ["Super", "A"] },
  { at: { row: 1, cols: [0, 0, 0] }, caption: "Up", ms: 1500, keys: ["Super", "W"] },
];
export const NavigationDiagram = () => (
  <Figure
    label="Diagram: the screen frame stays in the middle while the grid of rows slides under it: from the chat up to the browser, down to the chat, down again to the music, right to the photos (only that row slides, each row moves on its own), back left, then up to the chat."
    steps={NAV}
    still={3}
    aspect={NAV_ASPECT}
    loopTo={1}
    render={(i) => <Stripes screen={NAV[i].at} />}
  />
);

// Monitors and screens: two monitors, each showing its own screen, then one ultra-wide monitor
// split into the same two screens. The screens keep their rows; only their frame changes.
const SCREEN_ROWS: AppId[][][] = [
  [["browser"], ["chat", "mail"], ["music", "photos", "video"], []],
  [["editor", "terminal"], ["files"], ["game", "calculator"], []],
];
type Box = [x: number, y: number, w: number, h: number];
type MonState = { monitors: [Box, Box]; secondShown: boolean; stands: number[]; screens: [Box, Box]; split: boolean };
const MULTI: MonState = {
  monitors: [
    [3, 4, 45, 34],
    [52, 4, 45, 34],
  ],
  secondShown: true,
  stands: [21.5, 70.5],
  screens: [
    [4.2, 5.2, 42.6, 31.6],
    [53.2, 5.2, 42.6, 31.6],
  ],
  split: false,
};
const ULTRA: MonState = {
  monitors: [
    [3, 4, 94, 34],
    [3, 4, 94, 34],
  ],
  secondShown: false,
  stands: [46, 46],
  screens: [
    [4.2, 5.2, 45.4, 31.6],
    [50.4, 5.2, 45.4, 31.6],
  ],
  split: true,
};
const MON_STEPS: (Timed & { s: MonState })[] = [
  { s: MULTI, caption: "Two monitors, each showing its own screen", ms: 2600 },
  { s: ULTRA, caption: "One ultra-wide monitor, split into two screens", ms: 2600 },
];

const MINI_TW = 8.5;
const MINI_TH = 4.6;
const MINI_PAD = 1;
const ScreenView: React.FC<{ i: number; box: Box }> = ({ i, box: [x, y, w, h] }) => {
  const top = y + 4.6;
  const band = (y + h - top) / 4;
  return (
    <>
      <span className="dg-screen-title" style={pos(x + 1.5, y + 1)}>
        Screen {i + 1}
      </span>
      {SCREEN_ROWS[i].map((apps, r) => {
        const ty = top + r * band + (band - MINI_TH) / 2;
        return (
          <React.Fragment key={r}>
            <div key={`band-${i}-${r}`} className={`dg-ws-band${r % 2 ? " alt" : ""}`} style={pos(x, top + r * band, w, band)} />
            {apps.map((a, c) => (
              <div key={`${i}-${a}`} className="dg-tile mini" style={pos(x + 2.5 + c * (MINI_TW + MINI_PAD), ty, MINI_TW, MINI_TH)}>
                <span className="dg-badge" style={{ background: APPS[a].color }}>
                  <Sym n={APPS[a].icon} />
                </span>
              </div>
            ))}
            <div key={`add-${i}-${r}`} className="dg-tile add mini" style={pos(x + 2.5 + apps.length * (MINI_TW + MINI_PAD), ty, apps.length ? 4 : MINI_TW, MINI_TH)}>
              <Sym n="add" />
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};

const MonitorsView: React.FC<{ s: MonState }> = ({ s }) => (
  <>
    {s.stands.map((x, i) => (
      <div key={`stand-${i}`} className="dg-stand" style={pos(x, 38, 8, 4)} />
    ))}
    {s.monitors.map(([x, y, w, h], i) => (
      <div key={`monitor-${i}`} className="dg-monitor" style={{ ...pos(x, y, w, h), opacity: i && !s.secondShown ? 0 : 1 }} />
    ))}
    {s.screens.map((box, i) => (
      <ScreenView key={i} i={i} box={box} />
    ))}
    <div className="dg-split" style={{ ...pos(49.9, 5.2, 0.3, 31.6), opacity: s.split ? 1 : 0 }} />
  </>
);

export const MonitorsDiagram = () => (
  <Figure
    label="Diagram: two monitors side by side, each showing its own screen, Screen 1 and Screen 2, each with its own rows of apps; then one ultra-wide monitor split down the middle into the same two screens."
    steps={MON_STEPS}
    still={1}
    loopTo={0}
    aspect="100 / 44"
    render={(i) => <MonitorsView s={MON_STEPS[i].s} />}
  />
);
