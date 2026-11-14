import React from "react";
import { DISTROS } from "./data";

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
