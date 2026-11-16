import React from "react";
import { COLLECTIVE, DISCORD, FREE_EXPLORERS, HOTKEYS, REPO, SECTIONS } from "./data";
import { InstallSection } from "./Install";
import { MonitorsDiagram, NavigationDiagram, SpatialDiagram } from "./Diagrams";
import { InlineVideo } from "./Player";

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
        <a href={`#${id}`}>
          {id !== "veshell" && <Icon name={section.icon} className="title-icon" />}
          {section.title}
        </a>
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

const HEADLINES: { id: string; icon: string; text: string }[] = [
  { id: "spatial-model", icon: "grid_view", text: "Apps on a grid: rows of tiles, a tile per app." },
  { id: "navigation", icon: "explore", text: "Move by direction, from the keyboard, the mouse or a touchscreen." },
  { id: "persistence", icon: "save", text: "Your layout is saved as you go and comes back after a reboot." },
  { id: "tiles", icon: "select_window", text: "Maximized, fullscreen, game and floating display modes." },
  { id: "screens", icon: "monitor", text: "Each monitor has its own rows; an ultra-wide one can be split." },
  { id: "interface", icon: "dashboard", text: "Two small panels, and an Overview for search and the system." },
];

export const Sections: React.FC<{ wide: boolean }> = ({ wide }) => (
  <>
    <Block id="veshell">
      <p className="lead">
        Veshell is a Linux environment that aims to provide a workflow that <strong>reduces the need to manipulate windows</strong>, feels <strong>more natural to navigate</strong>, and is{" "}
        <strong>accessible to everyone</strong>.
      </p>
      <p>
        In order to achieve that goal, Veshell provides an environment that is <strong>predictable</strong> and <strong>persists across sessions</strong>. Every decision you make along the
        way is <strong>remembered</strong>, which lets you <strong>build your own layout</strong> simply by using Veshell.
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
    </Block>

    <Block id="spatial-model" video="build">
      <p>
        It's much easier to navigate in a <strong>known space</strong>, so we made it <strong>predictable</strong>: that's why Veshell arranges your apps on a{" "}
        <strong>two-dimensional grid</strong>.
      </p>
      <SpatialDiagram />
      <p>
        You organize your applications <strong>relative to each other</strong>, in a way that's <strong>meaningful to you</strong>. It takes shape <strong>naturally</strong>, simply by using
        your computer day to day.
      </p>
    </Block>

    <Block id="navigation" video="navigate">
      <p>
        Since the environment is <strong>predictable</strong>, you can <strong>navigate it by direction</strong>. Each move slides, so you{" "}
        <strong>feel where you're going</strong>.
      </p>
      <NavigationDiagram />
      <p>You can navigate with <strong>any kind of input</strong>:</p>
      <ul>
        <li>
          <strong>Mouse or touch</strong>, with the buttons on the interface's panels
        </li>
        <li>
          <strong>Touchpad gestures</strong>: swipe with three fingers in any direction
        </li>
        <li>
          <strong>Keyboard shortcuts</strong>, configurable: <Keys keys={["Super", "W A S D"]} /> or <Keys keys={["Super", "arrows"]} />
        </li>
        <li>
          <strong>Game controller</strong>: great on handheld devices like the Steam Deck
        </li>
      </ul>
    </Block>

    <Block id="persistence" video="persist">
      <p>
        <strong>You never save a layout</strong>. Veshell <strong>records each change</strong> as you make it (which app, in which tile, on which row and screen) and puts everything
        back when you log in.
      </p>
      <p>
        After a reboot, each app you had open <strong>waits in its tile</strong> as a placeholder. Click it, or press <kbd>Enter</kbd>, and the app starts right there. What
        comes back with it depends on the app:
      </p>
      <ul>
        <li>Browsers, editors and document viewers reopen their <strong>own tabs, projects and documents</strong>.</li>
        <li>Terminals reopen in the <strong>same folder, running the same program</strong>.</li>
        <li>Other apps <strong>start fresh</strong>, in the right place.</li>
      </ul>
      <p>
        Veshell <strong>doesn't freeze processes or snapshot memory</strong>. It puts each app back where it belongs and lets it restore what it knows how to.
      </p>
    </Block>

    <Block id="tiles">
      <p>A tile is an app's place in your layout. It plays two roles:</p>
      <ul>
        <li>
          <strong>A placeholder.</strong> When the app isn't running, its tile stays where it is. Click it and the app opens right there. You can{" "}
          <strong>edit the command</strong> the tile runs, and while the app starts, the tile shows its <strong>running process and output</strong>, so you see at
          once if something goes wrong.
        </li>
        <li>
          <strong>A boundary.</strong> The app is <strong>kept inside its tile</strong> and never spreads over your other apps. The windows it opens on its own
          behalf (dialogs, file pickers, an About box, a window from a helper process) <strong>open in its tile</strong> too, instead of taking a new one. And a
          splash screen hands over to the main window in the same tile.
        </li>
      </ul>
      <h3>Display modes</h3>
      <p>Each tile has a <strong>display mode</strong>, picked from the buttons on the tile:</p>
      <dl className="defs">
        <dt>Maximized</dt>
        <dd>The app fills its tile, and its dialogs open inside it. The default.</dd>
        <dt>Fullscreen</dt>
        <dd>
          The app is told it's fullscreen, so it hides its own toolbars and frame, but it <strong>stays in its tile</strong>.
        </dd>
        <dt>Game</dt>
        <dd>
          The game gets <strong>direct access to rendering and inputs</strong>: the compositor draws it at full size and sends input straight to it, to optimize{" "}
          <strong>latency and performance</strong>. Going to a game tile never
          grabs your mouse and keyboard: the game waits behind a frosted layer until you click it. <Keys keys={["Ctrl", "Esc"]} /> releases them again, and the
          game keeps its tile.
        </dd>
        <dt>Floating</dt>
        <dd>
          For apps that need free placement, like Zoom. The app's windows and dialogs each get their own title bar and{" "}
          <strong>move and resize freely, inside the tile</strong>: they never leave it. A new window opens on top, and clicking a window raises it.
        </dd>
      </dl>
      <h3>Moving tiles</h3>
      <p>
        Hold <kbd>Super</kbd> and <strong>drag a tile</strong>: drop it on another tile to reorder them, on a row in the vertical panel, or on another screen or
        monitor. While you hold it, <Keys keys={["Super", "W A S D"]} /> still moves around, so the layout slides under the tile to a place that wasn't on screen.
        From the keyboard, <Keys keys={["Super", "Shift", "W A S D"]} /> takes the current app with you.
      </p>
    </Block>

    <Block id="screens">
      <p>
        Monitors and screens sound alike, but in Veshell they are two things: the <strong>monitor</strong> is the device, and a <strong>screen</strong> is a layout
        of rows shown on it.
      </p>
      <ul>
        <li>
          By default, a monitor shows a <strong>single screen</strong>, but you can <strong>split a monitor into several screens</strong>: very handy on an
          ultra-wide monitor.
        </li>
        <li>
          With several monitors, each one holds <strong>its own screen configuration</strong>, which you can swap or change at any time.
        </li>
        <li>
          When a monitor is <strong>disconnected</strong>, its apps live on in its screens, which stay <strong>accessible from the Screen menu</strong>.
        </li>
      </ul>
      <MonitorsDiagram />
      <ul>
        <li>
          A monitor can also <strong>mirror</strong> another one.
        </li>
        <li>
          The display settings cover the resolution, <strong>fractional scaling</strong>, rotation and the arrangement of your monitors.
        </li>
      </ul>
    </Block>

    <Block id="interface" video="overview">
      <p>
        Veshell provides a <strong>complete interface</strong> to interact with your system.
      </p>

      <h3>The Shell</h3>
      <p>
        The panels give an <strong>at-a-glance view of where everything is</strong> and let you navigate with a{" "}
        <strong>mouse or on a touchscreen</strong>.
      </p>
      <ul>
        <li>
          <strong>The vertical panel</strong> lists the <strong>rows</strong>. Each icon shows either the apps in the row or the row's category, determined
          automatically. It also holds the <strong>Screen menu</strong>, to switch between screen configurations or <strong>split your monitor into several screens</strong>.
        </li>
        <li>
          <strong>The horizontal panel</strong>, at the top, shows the <strong>tiles of the current row as tabs</strong>, and the control for how
          many tiles share the screen.
        </li>
      </ul>
      <h3>The Overview</h3>
      <p>
        The Overview gives you <strong>quick access</strong> to the <strong>Helm</strong>, an <strong>Ephemeral Application Launcher</strong>, a <strong>file manager</strong> and a{" "}
        <strong>set of settings</strong> to customize your experience. Tap <kbd>Super</kbd> to open it.
      </p>
      <ul>
        <li>
          <strong>The Helm</strong>, your system dashboard. Its widgets show the <strong>state of your computer</strong> and let you act on it right there:
          <ul>
            <li>
              <strong>Sound</strong>: the volume, and the output and input devices to choose from
            </li>
            <li>
              <strong>Connections</strong>: Ethernet, Wi-Fi and Bluetooth, each with its switch and its devices
            </li>
            <li>
              <strong>Power</strong>: the batteries, wireless mice and headsets included
            </li>
            <li>
              <strong>Performance</strong>: CPU, memory, GPU and disks
            </li>
            <li>
              <strong>Media players</strong>: playback controls for every app that supports MPRIS
            </li>
            <li>
              <strong>Notification history</strong>: all your notifications <strong>in one place</strong>, read ones included, kept across sessions until you clear it
            </li>
            <li>
              <strong>Background apps</strong>: the apps running without a window, like chat clients, sync tools and game launchers, each with its menu
            </li>
            <li>
              <strong>Session</strong>: lock, log out, sleep, restart and power off
            </li>
          </ul>
        </li>
        <li>
          <strong>Ephemeral Application Launcher</strong>: your layout is for the apps you work in. A quick calculation, a setting to change or a password to look
          up shouldn't move it around, so the Overview opens apps <strong>outside your layout</strong>.
        </li>
        <li>
          <strong>The file manager</strong>: search your files, then <strong>browse and preview</strong> them in place.
        </li>
        <li>
          <strong>The settings</strong>, searchable like apps and files (<Keys keys={["Super", "Tab"]} /> switches the search).
        </li>
      </ul>
      <p>
        The interface follows <strong>Material Design</strong>, tinted with a <strong>colour you choose</strong>.
      </p>
    </Block>

    <Block id="hotkeys">
      <p>
        The defaults. The arrow keys work everywhere instead of <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd>, and <strong>every hotkey can be changed</strong> in the
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

    {!wide && <InstallSection />}

    <Block id="involved">
      <p>
        Veshell is <strong>developed in the open</strong> by the <a href={FREE_EXPLORERS}>Free Explorers</a>, a collective that funds open-source work through Open Collective,
        where <strong>every income and expense is public</strong>.
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
