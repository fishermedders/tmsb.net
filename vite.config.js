import {
  readFileSync,
  readdirSync,
  writeFileSync,
  mkdirSync,
  existsSync,
} from "fs";
import { resolve, join } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const SITE_URL = "https://tmsb.net";

const STATIC_ROUTES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/tour", priority: "0.9", changefreq: "weekly" },
  { path: "/songs", priority: "0.8", changefreq: "monthly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/contact", priority: "0.7", changefreq: "monthly" },
  { path: "/gallery", priority: "0.7", changefreq: "weekly" },
  { path: "/merch", priority: "0.6", changefreq: "monthly" },
  { path: "/stats", priority: "0.6", changefreq: "weekly" },
];

/**
 * Vite plugin: auto-generates dist/sitemap.xml at the end of every build.
 *
 * - Scans src/shows/*.mdx and src/songs/*.mdx for slugs.
 * - Filters out shows whose frontmatter contains `hidden: true`.
 * - Writes a standards-compliant XML sitemap to the output directory.
 */
function sitemapPlugin() {
  return {
    name: "generate-sitemap",
    // closeBundle runs after all files have been written to disk.
    closeBundle() {
      const showsDir = resolve(__dirname, "src/shows");
      const songsDir = resolve(__dirname, "src/songs");
      const outDir = resolve(__dirname, "dist");

      // ── show slugs ──────────────────────────────────────────────────────
      const showSlugs = readdirSync(showsDir)
        .filter((f) => f.endsWith(".mdx"))
        .filter((f) => {
          // Read frontmatter and skip shows marked hidden: true
          try {
            const content = readFileSync(join(showsDir, f), "utf8");
            // Match only within the opening --- ... --- frontmatter block
            const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
            if (!fmMatch) return true;
            return !/^\s*hidden\s*:\s*true\s*$/m.test(fmMatch[1]);
          } catch {
            return true;
          }
        })
        .map((f) => f.replace(".mdx", ""));

      // ── song slugs ──────────────────────────────────────────────────────
      const songSlugs = readdirSync(songsDir)
        .filter((f) => f.endsWith(".mdx"))
        .map((f) => f.replace(".mdx", ""));

      const today = new Date().toISOString().split("T")[0];

      // ── build <url> entries ─────────────────────────────────────────────
      const makeUrl = (loc, changefreq, priority) =>
        `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;

      const urlEntries = [
        ...STATIC_ROUTES.map(({ path, priority, changefreq }) =>
          makeUrl(`${SITE_URL}${path}`, changefreq, priority),
        ),
        ...showSlugs.map((slug) =>
          makeUrl(`${SITE_URL}/tour/${slug}`, "yearly", "0.5"),
        ),
        ...songSlugs.map((slug) =>
          makeUrl(`${SITE_URL}/songs/${slug}`, "monthly", "0.5"),
        ),
      ];

      const sitemap =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        urlEntries.join("\n") +
        `\n</urlset>\n`;

      if (!existsSync(outDir)) {
        mkdirSync(outDir, { recursive: true });
      }

      writeFileSync(join(outDir, "sitemap.xml"), sitemap);

      const total = STATIC_ROUTES.length + showSlugs.length + songSlugs.length;
      console.log(
        `\x1b[32m✓\x1b[0m sitemap.xml generated — ${total} URLs ` +
          `(${STATIC_ROUTES.length} static, ${showSlugs.length} shows, ${songSlugs.length} songs)`,
      );
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    (() => {
      const plugin = mdx({
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      });
      return {
        enforce: "pre",
        ...plugin,
        // Don't intercept ?raw requests — let Vite's built-in raw loader
        // handle them so import.meta.glob with { query: "?raw" } returns
        // the raw file text rather than the compiled React component.
        transform(code, id) {
          if (id.includes("?raw")) return;
          return plugin.transform?.call(this, code, id);
        },
      };
    })(),
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
    sitemapPlugin(),
  ],
});
