import { writeFileSync, mkdirSync } from "node:fs";
import { readFileSync } from "node:fs";

// On lit les slugs dans le fichier source
const source = readFileSync("src/trainings.js", "utf8");
const slugs = [...source.matchAll(/slug:\s*["'`]([^"'`]+)["'`]/g)].map((m) => m[1]);

const SITE = "https://dollylashesstudio.fr";
const today = new Date().toISOString().slice(0, 10);

/* priority : importance relative au sein du site, pas dans l'absolu.
   changefreq : indication, les moteurs s'en servent peu — on reste sobre. */
const PAGES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.7", changefreq: "yearly" },
  { path: "/contact", priority: "0.8", changefreq: "yearly" },
  { path: "/mentions-legales", priority: "0.2", changefreq: "yearly" },
  { path: "/politique-de-confidentialite", priority: "0.2", changefreq: "yearly" },
  { path: "/conditions-generales-de-vente", priority: "0.2", changefreq: "yearly" },
    ...slugs.map((slug) => ({
    path: `/formations/${slug}`,
    priority: "0.9",
    changefreq: "monthly",
  })),
];

const urls = PAGES.map(
  ({ path, priority, changefreq }) => `  <url>
    <loc>${SITE}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
).join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

mkdirSync("public", { recursive: true });
writeFileSync("public/sitemap.xml", xml);
console.log(`sitemap.xml : ${PAGES.length} pages`);
