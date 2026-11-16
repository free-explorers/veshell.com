import React from "react";
import { DISTROS, REPO } from "./data";

// One tab per distribution, its commands with a copy button. Without JavaScript (the
// prerendered page) every distribution is shown, one after the other.

const Copy: React.FC<{ text: string }> = ({ text }) => {
  const [done, setDone] = React.useState(false);
  return (
    <button
      type="button"
      className="copy"
      aria-label={done ? "Copied" : "Copy the commands"}
      onClick={() =>
        navigator.clipboard?.writeText(text).then(
          () => {
            setDone(true);
            setTimeout(() => setDone(false), 1500);
          },
          () => {},
        )
      }
    >
      <span className="icon" aria-hidden="true">
        {done ? "check" : "content_copy"}
      </span>
    </button>
  );
};

export const Install: React.FC = () => {
  const [current, setCurrent] = React.useState(DISTROS[0].id);
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);
  return (
    <div className="install">
      <div className="tabs" role="tablist" aria-label="Distribution">
        {DISTROS.map((d) => (
          <button
            key={d.id}
            type="button"
            role="tab"
            id={`tab-${d.id}`}
            aria-controls={`panel-${d.id}`}
            aria-selected={d.id === current}
            className="tab"
            onClick={() => setCurrent(d.id)}
          >
            <span className="tab-label">{d.name}</span>
          </button>
        ))}
      </div>
      {DISTROS.map((d) => (
        <div
          key={d.id}
          role="tabpanel"
          id={`panel-${d.id}`}
          aria-labelledby={`tab-${d.id}`}
          className="panel"
          hidden={hydrated && d.id !== current}
        >
          {!hydrated && <h3>{d.name}</h3>}
          {d.steps.map((s, i) =>
            s.code ? (
              <div key={i} className="code">
                <pre>
                  <code>{s.code}</code>
                </pre>
                <Copy text={s.code.replace(/\\\n\s*/g, "")} />
              </div>
            ) : (
              <p key={i}>{s.text}</p>
            ),
          )}
        </div>
      ))}
    </div>
  );
};

// The installation block. On wide screens it sits below the player, always in view; on
// narrower ones, where the player is above the text, it's a section near the end of the page.
export const InstallSection: React.FC<{ side?: boolean }> = ({ side }) => (
  <section id="install" className={side ? "side-card install-card" : "block"} aria-labelledby="install-title" tabIndex={-1}>
    <h2 id="install-title" className={side ? "side-title" : "block-title"}>
      <span className="icon title-icon" aria-hidden="true">
        download
      </span>
      Installation
    </h2>
    <p>Veshell is packaged by the community for these distributions.</p>
    <Install />
    <p>
      Then log out, choose <strong>Veshell</strong> in your login screen's session list, and log in. To build it yourself, see{" "}
      <a href={`${REPO}#building-from-source`}>building from source</a>.
    </p>
  </section>
);

// Install buttons: below the player the block is already on screen, so it's only brought to
// attention; in the text, the page scrolls to it.
export const goToInstall = (e?: React.MouseEvent) => {
  e?.preventDefault();
  const el = document.getElementById("install");
  if (!el) return;
  if (el.classList.contains("install-card")) {
    el.focus({ preventScroll: true });
    el.classList.remove("flash");
    void el.offsetWidth;
    el.classList.add("flash");
  } else {
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    el.focus({ preventScroll: true });
  }
};
