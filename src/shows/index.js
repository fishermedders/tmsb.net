// Eagerly import every .mdx file in this directory at build time.
// Vite resolves import.meta.glob statically, so all show modules end up
// in the bundle — no runtime fetching needed.
const modules = import.meta.glob("./*.mdx", { eager: true });

/**
 * All shows, sorted chronologically.
 * Each entry contains every frontmatter field plus:
 *   - slug   : filename without extension (e.g. "2025-03-14-roxy")
 *   - Content: the MDX body as a React component
 */
export const shows = Object.entries(modules)
  .map(([path, mod]) => ({
    ...mod.frontmatter,
    slug: path.replace("./", "").replace(".mdx", ""),
    Content: mod.default,
  }))
  // Filenames start with YYYY-MM-DD so alphabetical === chronological.
  .sort((a, b) => a.slug.localeCompare(b.slug));

/**
 * Parse a Date from the YYMMDD prefix of a show slug.
 * e.g. "260306_cloud_storm_cellar" → new Date("2026-03-06")
 */
export function dateFromSlug(slug) {
  const m = slug.match(/^(\d{2})(\d{2})(\d{2})/);
  if (!m) return new Date(0);
  const [, yy, mm, dd] = m;
  return new Date(`20${yy}-${mm}-${dd}`);
}

/**
 * Look up a single show by its slug.
 * Returns undefined if the slug doesn't match any file.
 */
export function getShowBySlug(slug) {
  return shows.find((s) => s.slug === slug);
}
