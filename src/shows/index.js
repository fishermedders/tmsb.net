// Eagerly import every .mdx file in this directory at build time.
// Vite resolves import.meta.glob statically, so all show modules end up
// in the bundle — no runtime fetching needed.
const modules = import.meta.glob("./*.mdx", { eager: true });

// Also import the raw source of each MDX file so we can detect whether
// there is any content below the frontmatter block.
const rawModules = import.meta.glob("./*.mdx", { query: "?raw", eager: true });

function normalizeSetlist(rawSetlist) {
  if (!rawSetlist) return [];
  const baseArray = Array.isArray(rawSetlist)
    ? rawSetlist
    : typeof rawSetlist === "string"
      ? rawSetlist.split(/\r?\n/)
      : [];
  return baseArray
    .map((item) => (item == null ? "" : String(item).trim()))
    .filter(Boolean);
}

/**
 * All shows, sorted chronologically.
 * Each entry contains every frontmatter field plus:
 *   - slug       : filename without extension (e.g. "260306_cloud_storm_cellar")
 *   - Content    : the MDX body as a React component
 *   - hasContent : true if there is any text/markup after the frontmatter
 */
export const shows = Object.entries(modules)
  .map(([path, mod]) => {
    const rawEntry = rawModules[path];
    const raw =
      typeof rawEntry === "string"
        ? rawEntry
        : typeof rawEntry?.default === "string"
          ? rawEntry.default
          : "";
    // Strip the opening frontmatter block (everything up to and including
    // the closing ---) then check whether anything non-whitespace remains.
    const rawWithoutFrontmatter = raw.replace(/^---[\s\S]*?---/, "");
    const afterFrontmatter = rawWithoutFrontmatter.trim();
    const setlist = normalizeSetlist(mod.frontmatter?.setlist);
    const hidden = Boolean(mod.frontmatter?.hidden);

    return {
      ...mod.frontmatter,
      hidden,
      slug: path.replace("./", "").replace(".mdx", ""),
      Content: mod.default,
      hasContent: afterFrontmatter.length > 0,
      setlist,
      hasSetlist: setlist.length > 0,
    };
  })
  // Filenames start with YYMMDD so alphabetical === chronological.
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

export function showPastCutoffFromSlug(slug) {
  const showDate = dateFromSlug(slug);
  const cutoff = new Date(showDate);
  cutoff.setDate(cutoff.getDate() + 1);
  cutoff.setHours(5, 0, 0, 0);
  return cutoff;
}

export function isPastShow(slug, now = new Date()) {
  return now >= showPastCutoffFromSlug(slug);
}
