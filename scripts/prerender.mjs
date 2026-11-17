// After `vite build`: puts the prerendered page into dist/index.html with its title,
// description, canonical, link previews and structured data; then 404.html, sitemap.xml and
// robots.txt. Needs the SSR build of src/ssr.tsx in dist-ssr/.
import { readFile, rm, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const ssr = path.join(root, "dist-ssr");
const { render, SITE, REPO, COLLECTIVE, DISCORD, VIDEOS } = await import(pathToFileURL(path.join(ssr, "ssr.js")).href);

const TITLE = "Veshell · A predictable environment for Linux";
const DESCRIPTION =
  "In Veshell, your apps sit in a grid you move between by direction, and your layout comes back after a reboot. Free software, GPL-3.0.";
const IMAGE = `${SITE}/og.jpg`;
const IMAGE_ALT = "Veshell with two tiles side by side: Firefox on the Veshell GitHub page, and the app launcher of a new tile; the vertical panel on the left and the horizontal panel on top";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const teaser = VIDEOS.find((v) => v.id === "teaser");

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: `${SITE}/`,
      name: "Veshell",
      publisher: { "@type": "Organization", name: "Free Explorers", url: "https://free-explorers.com/", sameAs: [COLLECTIVE, "https://github.com/free-explorers", DISCORD] },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE}/#software`,
      name: "Veshell",
      url: `${SITE}/`,
      description: DESCRIPTION,
      applicationCategory: "DesktopEnhancementApplication",
      operatingSystem: "Linux",
      license: "https://www.gnu.org/licenses/gpl-3.0.html",
      image: IMAGE,
      sameAs: [REPO, `${COLLECTIVE}/projects/veshell`],
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "VideoObject",
      name: "Veshell teaser",
      description: "Veshell, the not-desktop environment for Linux, in a short teaser.",
      thumbnailUrl: SITE + teaser.poster,
      contentUrl: `${SITE}/${teaser.file}.mp4`,
      uploadDate: "2026-11-11",
    },
  ],
};

const head = (canonical) =>
  [
    canonical ? `<link rel="canonical" href="${SITE}/" />` : `<meta name="robots" content="noindex" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Veshell" />`,
    `<meta property="og:url" content="${SITE}/" />`,
    `<meta property="og:title" content="${esc(TITLE)}" />`,
    `<meta property="og:description" content="${esc(DESCRIPTION)}" />`,
    `<meta property="og:image" content="${IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(IMAGE_ALT)}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(TITLE)}" />`,
    `<meta name="twitter:description" content="${esc(DESCRIPTION)}" />`,
    `<meta name="twitter:image" content="${IMAGE}" />`,
    `<meta name="twitter:image:alt" content="${esc(IMAGE_ALT)}" />`,
    canonical ? `<script type="application/ld+json">${JSON.stringify(structuredData).replace(/</g, "\\u003c")}</script>` : "",
  ]
    .filter(Boolean)
    .join("\n    ");

const template = await readFile(path.join(dist, "index.html"), "utf8");
const page = ({ title = TITLE, canonical = true } = {}) => {
  const out = template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(DESCRIPTION)}" />`)
    .replace("<!--seo-->", head(canonical))
    .replace("<!--app-->", render());
  for (const marker of ["<!--seo-->", "<!--app-->"]) if (out.includes(marker)) throw new Error(`prerender: ${marker} left`);
  return out;
};

await writeFile(path.join(dist, "index.html"), page());
// Unknown addresses get the page itself, not indexed.
await writeFile(path.join(dist, "404.html"), page({ title: "Page not found · Veshell", canonical: false }));
await writeFile(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE}/</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>
</urlset>
`,
);
await writeFile(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
await rm(ssr, { recursive: true, force: true });
console.log("prerendered index.html, 404.html, sitemap.xml, robots.txt");
