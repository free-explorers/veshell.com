import React from "react";
import { COLLECTIVE, DISCORD, REPO, SECTIONS, VIDEOS } from "./data";
import { goToInstall, InstallSection } from "./Install";
import { Player, PlayerContext } from "./Player";
import { Icon, Sections } from "./Sections";

// The page is laid out like Veshell itself: a screen panel on the left whose icons are the
// sections (the "rows"), a top bar, the text, and beside it the player drawn as a
// row with its tabs, and the installation below it.

const useGithubStars = () => {
  const [stars, setStars] = React.useState<number | null>(null);
  React.useEffect(() => {
    fetch("https://api.github.com/repos/free-explorers/veshell")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && typeof d.stargazers_count === "number" && setStars(d.stargazers_count))
      .catch(() => {});
  }, []);
  return stars;
};

const formatStars = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n));

// The section being read: the last one whose top is above 40% of the window.
const useActiveSection = () => {
  const [active, setActive] = React.useState(SECTIONS[0].id);
  React.useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let id = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= line) id = s.id;
      }
      // At the bottom of the page, the last section, however short.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) id = SECTIONS[SECTIONS.length - 1].id;
      setActive(id);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return active;
};

const goTo = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
  history.replaceState(null, "", id === SECTIONS[0].id ? location.pathname : `#${id}`);
};

const useWide = () => {
  const [wide, setWide] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1100px)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return wide;
};

export const App: React.FC = () => {
  const stars = useGithubStars();
  const active = useActiveSection();
  const wide = useWide();
  const [current, setCurrent] = React.useState(SECTIONS[0].video ?? VIDEOS[0].id);
  const [request, setRequest] = React.useState(0);

  // The player follows the section being read; a tab picked by hand stays until the next section.
  React.useEffect(() => {
    const v = SECTIONS.find((s) => s.id === active)?.video;
    if (v) setCurrent(v);
  }, [active]);

  const player = React.useMemo(
    () => ({
      current,
      request,
      show: (id: string, play = false) => {
        setCurrent(id);
        if (play) setRequest((n) => n + 1);
      },
    }),
    [current, request],
  );

  const link = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    goTo(id);
  };

  return (
    <PlayerContext.Provider value={player}>
      <a className="skip" href="#veshell">
        Skip to the content
      </a>
      <header className="topbar">
        <a className="brand" href="#veshell" onClick={link("veshell")} aria-label="Veshell, back to the top">
          <span className="logo">
            <img src="/logo.svg" alt="" width={32} height={32} />
          </span>
          <span className="brand-name">Veshell</span>
        </a>
        <span className="spacer" />
        <a className="chip" href={REPO} aria-label={stars === null ? "Veshell on GitHub" : `Veshell on GitHub, ${stars} stars`}>
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path
              fill="currentColor"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
            />
          </svg>
          <span>GitHub</span>
          {stars !== null && (
            <span className="stars">
              <Icon name="star" />
              {formatStars(stars)}
            </span>
          )}
        </a>
        <a className="button small" href="#install" onClick={goToInstall}>
          <Icon name="download" /> <span className="install-label">Install</span>
        </a>
      </header>

      <nav className="rail" aria-label="Sections">
        <ul>
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} onClick={link(s.id)} aria-current={s.id === active ? "location" : undefined} data-label={s.title}>
                <Icon name={s.icon} />
                <span className="sr">{s.title}</span>
              </a>
            </li>
          ))}
        </ul>
        <ul className="tray">
          <li>
            <a href={DISCORD} data-label="Discord">
              <Icon name="forum" />
              <span className="sr">Discord</span>
            </a>
          </li>
          <li>
            <a href={`${COLLECTIVE}/projects/veshell`} data-label="Open Collective">
              <Icon name="volunteer_activism" />
              <span className="sr">Open Collective</span>
            </a>
          </li>
        </ul>
      </nav>

      <div className="layout">
        <main className="doc">
          <Sections wide={wide} />
          <footer className="footer">
            <p>
              Veshell is free software under the GPL-3.0, a <a href="https://free-explorers.com">Free Explorers</a> project. This site's source is on{" "}
              <a href="https://github.com/free-explorers/veshell.com">GitHub</a>.
            </p>
          </footer>
        </main>
        <aside className="side" aria-label="Videos">
          <Player autoplay={wide} />
          {wide && <InstallSection side />}
        </aside>
      </div>
    </PlayerContext.Provider>
  );
};
