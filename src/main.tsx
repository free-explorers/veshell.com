import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";

// The built page holds the prerendered app (scripts/prerender.mjs): hydrate it. In development
// the root is empty: render.
const root = document.getElementById("root")!;
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
