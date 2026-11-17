// What the site shows: the videos, the sections, the install commands and the hotkeys.

export const SITE = "https://veshell.com";
export const REPO = "https://github.com/free-explorers/veshell";
export const DISCORD = "https://discord.gg/vBb7D9a";
export const COLLECTIVE = "https://opencollective.com/free-explorers";
export const FREE_EXPLORERS = "https://free-explorers.com";

// The videos and their posters are in public/, served by veshell.com itself.
// The clips are the raw screen recordings (veshell_video/rushes), real speed, no cuts or
// overlays: only the OBS start and stop are trimmed off each end. The teaser is the edited film.
export const media = (file: string) => `/${file}`;

// Each video comes as AV1 at 1440p (WebM) and H.264 at 1080p (MP4) for browsers without AV1.
export const AV1 = 'video/webm; codecs="av01.0.12M.10"';
export const AV1_OPUS = 'video/webm; codecs="av01.0.12M.10, opus"';
export const H264 = "video/mp4";

export type Video = {
  id: string;
  tab: string; // its tab in the player
  icon: string; // Material Symbols name
  file: string; // without extension
  poster: string;
  label: string;
  // A silent screen recording that loops, or the teaser (with sound and controls).
  kind: "clip" | "film";
  duration: string;
};

export const VIDEOS: Video[] = [
  { id: "build", tab: "Build", icon: "grid_view", file: "Rush-Build", poster: "/Rush-Build.jpg", label: "Opening apps: each one takes the next tile, new rows appear below", kind: "clip", duration: "0:22" },
  { id: "navigate", tab: "Navigate", icon: "explore", file: "Rush-Navigate", poster: "/Rush-Navigate.jpg", label: "Moving between apps and rows by direction", kind: "clip", duration: "0:11" },
  { id: "persist", tab: "Persist", icon: "restore", file: "Rush-Persist", poster: "/Rush-Persist.jpg", label: "Closed apps keep their tile: Resume opens them again", kind: "clip", duration: "0:33" },
  { id: "overview", tab: "Overview", icon: "dashboard", file: "Rush-Overview", poster: "/Rush-Overview.jpg", label: "The Overview: search, quick apps and the Helm dashboard", kind: "clip", duration: "0:28" },
  { id: "teaser", tab: "Teaser", icon: "movie", file: "veshell-teaser", poster: "/veshell-teaser-poster.jpg", label: "The Veshell teaser", kind: "film", duration: "2:33" },
];
export const videoById = (id: string) => VIDEOS.find((v) => v.id === id) ?? VIDEOS[0];

// The sections, in page order. `video`: what the player shows while the section is read.
export type Section = { id: string; icon: string; title: string; video?: string };
export const SECTIONS: Section[] = [
  { id: "veshell", icon: "home", title: "Veshell", video: "build" },
  { id: "spatial-model", icon: "grid_view", title: "Spatial model", video: "build" },
  { id: "navigation", icon: "explore", title: "Navigation", video: "navigate" },
  { id: "persistence", icon: "save", title: "Persistence", video: "persist" },
  { id: "tiles", icon: "select_window", title: "Application tiles" },
  { id: "screens", icon: "monitor", title: "Monitors and screens" },
  { id: "interface", icon: "dashboard", title: "Interface", video: "overview" },
  { id: "hotkeys", icon: "keyboard", title: "Hotkeys" },
  { id: "involved", icon: "group", title: "Get involved" },
];

// A step is a paragraph (`text`, with an optional `link` after it) or a block of commands to copy (`code`).
export type Distro = { id: string; name: string; steps: { text?: string; link?: { href: string; label: string }; code?: string }[] };
// From the README of free-explorers/veshell; keep them in step.
export const DISTROS: Distro[] = [
  {
    id: "arch",
    name: "Arch · Manjaro",
    steps: [
      { text: "Three AUR packages: veshell-bin (prebuilt), veshell (built from source) and veshell-git (development). With an AUR helper:" },
      { code: "yay -S veshell-bin" },
    ],
  },
  {
    id: "fedora",
    name: "Fedora",
    steps: [{ text: "From COPR:" }, { code: "sudo dnf copr enable @free-explorers/veshell\nsudo dnf install veshell-bin" }],
  },
  {
    id: "opensuse",
    name: "openSUSE",
    steps: [
      { text: "From OBS, on Tumbleweed:" },
      {
        code: "sudo zypper addrepo -f \\\n  https://download.opensuse.org/repositories/home:/PapyElGringo/openSUSE_Tumbleweed/ veshell\nsudo zypper --gpg-auto-import-keys refresh\nsudo zypper install veshell-bin",
      },
      { text: "On Slowroll or Leap 16.0, replace openSUSE_Tumbleweed with openSUSE_Slowroll or 16.0." },
    ],
  },
  {
    id: "debian",
    name: "Debian · Ubuntu",
    steps: [
      { text: "From OBS, on Ubuntu 26.04:" },
      {
        code: 'sudo install -d -m 0755 /etc/apt/keyrings\ncurl -fsSL https://download.opensuse.org/repositories/home:/PapyElGringo/xUbuntu_26.04/Release.key \\\n  | sudo gpg --batch --no-tty --yes --dearmor -o /etc/apt/keyrings/veshell.gpg\necho "deb [signed-by=/etc/apt/keyrings/veshell.gpg] https://download.opensuse.org/repositories/home:/PapyElGringo/xUbuntu_26.04/ ./" \\\n  | sudo tee /etc/apt/sources.list.d/veshell.list\nsudo apt update && sudo apt install veshell-bin',
      },
      { text: "On Debian 13, replace xUbuntu_26.04 with Debian_13 (twice)." },
    ],
  },
  {
    id: "nixos",
    name: "NixOS",
    steps: [
      {
        text: "Veshell is a Nix flake, for x86_64-linux. First enable flakes and the Veshell binary cache system-wide, in configuration.nix, then rebuild. Without the cache, Nix compiles the Flutter engine from source:",
      },
      {
        code: 'nix.settings = {\n  experimental-features = [ "nix-command" "flakes" ];\n  extra-substituters = [ "https://veshell.cachix.org" ];\n  extra-trusted-public-keys = [\n    "veshell.cachix.org-1:C8J71PCJ1Fx4+4shICPNsSOnGgijVEHZCTrWhbYyjOI="\n  ];\n};',
      },
      { code: "sudo nixos-rebuild switch" },
      { text: "Try it:" },
      { code: "nix run github:free-explorers/veshell" },
      { text: "To install it, add the NixOS module to your system flake, rebuild, then choose Veshell in your display manager:" },
      {
        code: 'inputs.veshell.url = "github:free-explorers/veshell";\n\n# in your nixosSystem modules:\nimports = [ inputs.veshell.nixosModules.default ];\nprograms.veshell.enable = true;',
      },
      { text: "Troubleshooting and details:", link: { href: "https://github.com/free-explorers/veshell/blob/main/docs/nixos.md", label: "the NixOS guide" } },
    ],
  },
];

// The shipped defaults (extra/settings/default/settings.json in the Veshell repo).
export const HOTKEYS: { group: string; rows: [string[], string][] }[] = [
  {
    group: "Moving around",
    rows: [
      [["Super", "W"], "Row above"],
      [["Super", "S"], "Row below"],
      [["Super", "A"], "Tile on the left"],
      [["Super", "D"], "Tile on the right"],
      [["Super"], "Open or close the Overview (tap it alone)"],
    ],
  },
  {
    group: "Moving apps",
    rows: [
      [["Super", "Shift", "A"], "Move the app one tile left"],
      [["Super", "Shift", "D"], "Move the app one tile right"],
      [["Super", "Shift", "W"], "Send the app to the row above, and follow it"],
      [["Super", "Shift", "S"], "Send the app to the row below, and follow it"],
      [["Super", "drag"], "Drop a tile on another tile, row or monitor"],
      [["Super", "Q"], "Close the app"],
    ],
  },
  {
    group: "In the Overview",
    rows: [
      [["Super", "W"], "Previous result"],
      [["Super", "S"], "Next result"],
      [["Super", "A"], "Focus the search pane"],
      [["Super", "D"], "Focus the content pane (the Helm, a window, a preview)"],
      [["Enter"], "Open the selected result (the first one if none is selected)"],
      [["Super", "Tab"], "Switch search: apps, files, settings"],
      [["Esc"], "Close the Overview"],
    ],
  },
  {
    group: "System",
    rows: [
      [["Super", "L"], "Lock the session"],
      [["Super", "Space"], "Next keyboard layout"],
      [["Ctrl", "Esc"], "Release a game that holds the keyboard and mouse"],
    ],
  },
  {
    // Built into the compositor (src/embedder/keyboard/mod.rs), not in settings.json.
    group: "Screenshots and recordings",
    rows: [
      [["PrtSc"], "Screenshot: drag an area; it's copied and saved to Pictures"],
      [["Shift", "PrtSc"], "Record: drag an area, press PrtSc again to stop; saved to Videos"],
    ],
  },
];
