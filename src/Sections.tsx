import React from "react";
import { COLLECTIVE, DISCORD, FREE_EXPLORERS, HOTKEYS, REPO, SECTIONS, VIDEOS } from "./data";
import { Install } from "./Install";
import { InlineVideo, usePlayer } from "./Player";

// The page's text, one block per section. Plain and factual: what it does and how.

const Icon: React.FC<{ name: string; className?: string }> = ({ name, className }) => (
  <span className={`icon${className ? ` ${className}` : ""}`} aria-hidden="true">
    {name}
  </span>
);

const Block: React.FC<{ id: string; children: React.ReactNode; video?: string }> = ({ id, children, video }) => {
  const section = SECTIONS.find((s) => s.id === id)!;
  const Heading = id === "veshell" ? "h1" : "h2";
  return (
    <section id={id} className="block" aria-labelledby={`${id}-title`}>
      <Heading id={`${id}-title`} className="block-title">
        <a href={`#${id}`}>{section.title}</a>
      </Heading>
      {video && <InlineVideo id={video} />}
      {children}
    </section>
  );
};

const Keys: React.FC<{ keys: string[] }> = ({ keys }) => (
  <span className="keys">
    {keys.map((k, i) => (
      <React.Fragment key={i}>
        {i > 0 && <span className="plus">+</span>}
        {k === "drag" ? <span className="key-action">drag</span> : <kbd>{k}</kbd>}
      </React.Fragment>
    ))}
  </span>
);

const WatchTeaser: React.FC = () => {
  const player = usePlayer();
  const teaser = VIDEOS.find((v) => v.id === "teaser")!;
  return (
    <button type="button" className="text-button" onClick={() => {
        player.show("teaser", true);
        const el = document.getElementById("player");
        if (el && el.getBoundingClientRect().bottom < 0) el.scrollIntoView({ behavior: "smooth" });
      }}>
      <Icon name="play_circle" /> Watch the teaser ({teaser.duration})
    </button>
  );
};

const HEADLINES: { id: string; icon: string; text: string }[] = [
  { id: "spatial-model", icon: "grid_view", text: "Apps on a grid: a row per workspace, a tile per app." },
  { id: "navigation", icon: "explore", text: "Move by direction, from the keyboard, the mouse or a touchscreen." },
  { id: "persistence", icon: "save", text: "Your layout is saved as you go and comes back after a reboot." },
  { id: "interface", icon: "dashboard", text: "Two small panels, and an Overview for search and the system." },
  { id: "tiles", icon: "select_window", text: "Fullscreen, game and floating modes; several monitors." },
];

export const Sections: React.FC = () => (
  <>
    <Block id="veshell">
      <p className="lead">
        Veshell is a Wayland environment for Linux: a compositor and a complete shell, written in Rust and Flutter, free software under the GPL-3.0.
      </p>
      <p>
        Your apps live on a grid. Each row is a workspace, each app takes a tile in it, and you go from one to another by direction. Veshell saves that layout
        as you use it, so after a reboot every app is waiting where you left it.
      </p>
      <p>
        It follows <a href="https://github.com/material-shell/material-shell">Material Shell</a>, the GNOME Shell extension, rebuilt from the ground up as its
        own environment.
      </p>
      <p className="note">
        <Icon name="construction" />
        <span>
          Veshell is young (version 0.2). Its developers use it every day, but expect rough edges, and please{" "}
          <a href={`${REPO}/issues`}>report them</a>.
        </span>
      </p>
      <ul className="headlines">
        {HEADLINES.map((h) => (
          <li key={h.id}>
            <a href={`#${h.id}`}>
              <Icon name={h.icon} />
              <span>
                <strong>{SECTIONS.find((s) => s.id === h.id)!.title}</strong>
                <span>{h.text}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <div className="actions">
        <a className="button" href="#install">
          <Icon name="download" /> Install
        </a>
        <WatchTeaser />
      </div>
    </Block>

    <Block id="spatial-model" video="build">
      <p>Veshell arranges your apps on a two-dimensional grid.</p>
      <ul>
        <li>
          A <strong>screen</strong> holds a column of <strong>workspaces</strong>, one below the other.
        </li>
        <li>
          A workspace is a row of <strong>tiles</strong>. A tile holds one app.
        </li>
        <li>A new app takes the next tile at the end of the current workspace.</li>
        <li>
          There's always an empty workspace at the bottom. Open an app there and a new empty one appears below it. Workspaces you've emptied and left are
          removed.
        </li>
      </ul>
      <p>
        Nothing gets placed at random, so you always know where an app went. Group them however suits you: a workspace per project, per topic, or one for
        chat and one for music.
      </p>
      <h3>Tiles per screen</h3>
      <p>
        The <Keys keys={["−", "1", "+"]} /> control at the top right of a workspace sets how many tiles share the screen. With 2, two apps sit side by side;
        the rest of the row is one step to the left or right.
      </p>
    </Block>

    <Block id="navigation" video="navigate">
      <p>
        You go to an app by direction: <strong>left and right</strong> between the tiles of a workspace, <strong>up and down</strong> between workspaces.
        Each move slides, so you see where you're going.
      </p>
      <p>
        Since apps only move when you move them, you stop looking after a few days: the browser is left of the editor, the chat is one workspace up. It's the
        same memory you use to find the light switch in a dark room.
      </p>
      <ul>
        <li>
          <strong>Keyboard:</strong> <Keys keys={["Super", "W A S D"]} /> or <Keys keys={["Super", "arrows"]} />. Add <kbd>Shift</kbd> to take the current
          app with you.
        </li>
        <li>
          <strong>Mouse:</strong> the left panel lists the workspaces, the top panel the tiles of the current one. <Keys keys={["Super", "drag"]} /> moves a
          tile to another place, workspace or monitor.
        </li>
        <li>
          <strong>Touch:</strong> touchpad gestures and touchscreens. Game controller support is on its way.
        </li>
      </ul>
    </Block>

    <Block id="persistence" video="persist">
      <p>
        You never save a layout. Veshell records each change as you make it (which app, in which tile, on which workspace and screen) and puts everything
        back when you log in.
      </p>
      <p>
        After a reboot, each app you had open waits in its tile as a placeholder. Click it, or press <kbd>Enter</kbd>, and the app starts right there. What
        comes back with it depends on the app:
      </p>
      <ul>
        <li>Browsers, editors and document viewers reopen their own tabs, projects and documents.</li>
        <li>Terminals reopen in the same folder, running the same program.</li>
        <li>Other apps start fresh, in the right place.</li>
      </ul>
      <p>
        Veshell doesn't freeze processes or snapshot memory. It puts each app back where it belongs and lets it restore what it knows how to.
      </p>
    </Block>

    <Block id="interface" video="overview">
      <p>Two thin panels and an overlay. The rest of the screen is your apps.</p>
      <h3>The screen panel, on the left</h3>
      <p>The workspaces of the screen, one icon each. Click one to go there.</p>
      <h3>The workspace panel, at the top</h3>
      <p>The tiles of the current workspace as tabs, a + to add one, and the tiles-per-screen control.</p>
      <h3>The Overview</h3>
      <p>
        Tap <kbd>Super</kbd> to open it. Search apps, files or settings (<Keys keys={["Super", "Tab"]} /> switches). An app opened from the Overview stays
        there, outside your layout: handy for a quick calculation or a setting. Files can be browsed and previewed in place.
      </p>
      <h3>The Helm</h3>
      <p>
        The Overview's dashboard: volume and audio devices, network and Bluetooth, batteries, CPU, memory, GPU and disks, media players, notifications, and
        lock, log out, sleep, restart and power off.
      </p>
      <p>The interface follows Material Design, tinted with a colour you choose. The settings are searchable from the Overview, like apps and files.</p>
    </Block>

    <Block id="tiles">
      <p>Each tile has a display mode, picked from the buttons on the tile:</p>
      <dl className="defs">
        <dt>Maximized</dt>
        <dd>The app fills its tile. The default.</dd>
        <dt>Fullscreen</dt>
        <dd>The app fills the whole screen.</dd>
        <dt>Game</dt>
        <dd>
          The compositor draws the game directly at full size and sends input straight to it, for the lowest latency. <Keys keys={["Ctrl", "Esc"]} />{" "}
          releases the keyboard and mouse.
        </dd>
        <dt>Floating</dt>
        <dd>For apps that need free placement, like Zoom: their windows and dialogs move and resize freely inside the tile.</dd>
      </dl>
      <h3>Monitors and screens</h3>
      <p>Each monitor has its own column of workspaces. An ultra-wide monitor can be split into several screens, each with its own workspaces.</p>
    </Block>

    <Block id="compared">
      <h3>Isn't this Niri, or PaperWM?</h3>
      <p>
        The navigation is close: apps side by side in a row, workspaces stacked vertically, everything reached by direction. The differences are around it.
        Veshell is a complete environment (panels, launcher, file browser, notifications, settings, lock screen) set up from its own interface rather than a
        config file. And its layout lasts across sessions: after a reboot your apps are waiting in their tiles. Niri is a great compositor to build your own
        setup around; Veshell aims to work as it is, out of the box.
      </p>
      <h3>Is it a tiling window manager?</h3>
      <p>
        In the sense that apps never overlap and are placed for you, yes. But there's no tree of splits to manage and no layout to write: you choose how many
        tiles share the screen, and that's all.
      </p>
      <h3>Why “not-desktop”?</h3>
      <p>
        Desktop environments copy an office desk: windows piled up like sheets of paper, a trash can, folders. Veshell drops that metaphor for a place you move
        around in. That's all the term means.
      </p>
      <h3>Is it for power users?</h3>
      <p>
        No. The hotkeys are there for those who want them, but the panels, the mouse and touch work just as well. The goal is an environment anyone can find
        their way in.
      </p>
      <h3>Does it collect data?</h3>
      <p>
        No. No analytics, nothing phones home. <a href={`${REPO}/blob/main/docs/privacy.md`}>Details in the repository</a>.
      </p>
    </Block>

    <Block id="hotkeys">
      <p>
        The defaults. The arrow keys work everywhere instead of <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd>, and every hotkey can be changed in the
        keyboard settings.
      </p>
      {HOTKEYS.map((g) => (
        <div key={g.group} className="hotkeys">
          <h3>{g.group}</h3>
          <table>
            <tbody>
              {g.rows.map(([keys, action], i) => (
                <tr key={i}>
                  <td>
                    <Keys keys={keys} />
                  </td>
                  <td>{action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </Block>

    <Block id="install">
      <p>Veshell is packaged by the community for these distributions.</p>
      <Install />
      <p>
        Then log out, choose <strong>Veshell</strong> in your login screen's session list, and log in. To build it yourself, see{" "}
        <a href={`${REPO}#building-from-source`}>building from source</a>.
      </p>
    </Block>

    <Block id="involved">
      <p>
        Veshell is developed in the open by the <a href={FREE_EXPLORERS}>Free Explorers</a>, a collective that funds open-source work through Open Collective,
        where every income and expense is public.
      </p>
      <ul className="links">
        <li>
          <a href={REPO}>
            <Icon name="code" /> <span>Source code, issues and documentation on GitHub</span>
          </a>
        </li>
        <li>
          <a href={DISCORD}>
            <Icon name="forum" /> <span>Questions and feedback on Discord</span>
          </a>
        </li>
        <li>
          <a href={`${COLLECTIVE}/projects/veshell`}>
            <Icon name="volunteer_activism" /> <span>Fund its development on Open Collective</span>
          </a>
        </li>
      </ul>
    </Block>
  </>
);

export { Icon };
