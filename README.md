# veshell.com

The Veshell website: a factual, documentation-style page about what Veshell does and how to
install it. It's laid out like Veshell itself, as material-shell.com was laid out like Material
Shell: a screen panel on the left whose icons are the sections, a top bar, the text, and beside
it a player drawn as a workspace whose tabs are the videos. The player follows the section being
read. W/S move between sections, A/D between videos.

The story and the teaser for a broader audience stay on [free-explorers.com](https://free-explorers.com).

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in dist/, deployed to GitHub Pages by .github/workflows/deploy.yaml
```

- `src/data.ts`: the videos, the sections, the install commands (from the Veshell README) and
  the hotkeys (from `extra/settings/default/settings.json` in the Veshell repo). Keep them in step.
- `src/Sections.tsx`: the text.
- The videos are served by the Free Explorers CDN (`MEDIA_BASE`), which pulls them from
  free-explorers.com; only their posters are in `public/`.
- `npm run build` prerenders the page (`src/ssr.tsx`, `scripts/prerender.mjs`) into
  `dist/index.html` with its link previews and structured data, plus `404.html`, `sitemap.xml`
  and `robots.txt`. The app hydrates it.
- `public/CNAME` sets the custom domain, veshell.com.
