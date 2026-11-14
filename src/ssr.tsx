// Built for Node by `vite build --ssr` (see scripts/prerender.mjs): the whole page as HTML, so
// search engines, link previews and readers without JavaScript get the content. The app
// hydrates it in the browser.
import React from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App";

export { SITE, REPO, COLLECTIVE, DISCORD, MEDIA_BASE, VIDEOS } from "./data";

export const render = () =>
  renderToString(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
