// Eagerly import every .mdx file in this directory at build time.
// Vite resolves import.meta.glob statically, so all song modules end up
// in the bundle — no runtime fetching needed.
const modules = import.meta.glob("./*.mdx", { eager: true });

// Also import the raw source of each MDX file so we can detect whether
// there is any content below the frontmatter block (lyrics, notes, etc.).
const rawModules = import.meta.glob("./*.mdx", { query: "?raw", eager: true });

function normalizeTitle(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function titleFromSlug(slug) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

/**
 * All songs, sorted with originals ahead of covers.
 * Each entry contains every frontmatter field plus:
 *   - slug       : filename without extension (e.g. "have-a-cigar")
 *   - title      : display title with fallback derived from the slug
 *   - artist     : performer/artist label (falls back to writer or "Unknown Artist")
 *   - original   : true when marked as original material
 *   - Content    : the MDX body as a React component
 *   - hasLyrics  : true if there is any text/markup after the frontmatter
 */
export const songs = Object.entries(modules)
  .map(([path, mod]) => {
    const rawEntry = rawModules[path];
    const raw =
      typeof rawEntry === "string"
        ? rawEntry
        : typeof rawEntry?.default === "string"
          ? rawEntry.default
          : "";

    const rawWithoutFrontmatter = raw.replace(/^---[\s\S]*?---/, "");
    const afterFrontmatter = rawWithoutFrontmatter.trim();

    const slug = path.replace("./", "").replace(".mdx", "");
    const frontmatterTitle = normalizeTitle(mod.frontmatter?.title);
    const title = frontmatterTitle
      ? mod.frontmatter.title.trim()
      : titleFromSlug(slug);

    const artistFromFrontmatter = mod.frontmatter?.artist;
    const writerFromFrontmatter = mod.frontmatter?.writer;
    const artist =
      typeof artistFromFrontmatter === "string" &&
      artistFromFrontmatter.trim().length > 0
        ? artistFromFrontmatter.trim()
        : typeof writerFromFrontmatter === "string" &&
            writerFromFrontmatter.trim().length > 0
          ? writerFromFrontmatter.trim()
          : "Unknown Artist";

    const original = Boolean(mod.frontmatter?.original);

    return {
      ...mod.frontmatter,
      title,
      artist,
      original,
      slug,
      Content: mod.default,
      hasLyrics: afterFrontmatter.length > 0,
    };
  })
  .sort((a, b) => {
    if (a.original !== b.original) {
      return a.original ? -1 : 1;
    }
    return a.title.localeCompare(b.title);
  });

const knownSongTitleKeys = new Set(
  songs.map((song) => normalizeTitle(song.title)),
);
const originalSongTitleKeys = new Set(
  songs
    .filter((song) => song.original)
    .map((song) => normalizeTitle(song.title)),
);
const songArtistsByTitle = new Map(
  songs.map((song) => [
    normalizeTitle(song.title),
    song.artist || "Unknown Artist",
  ]),
);

/**
 * Look up a single song by its slug.
 * Returns undefined if the slug doesn't match any file.
 */
export function getSongBySlug(slug) {
  return songs.find((s) => s.slug === slug);
}

/**
 * Predicate helper used by the Songs page to ensure only songs with
 * backing MDX files appear in the list.
 */
export function isKnownSongTitle(title) {
  return knownSongTitleKeys.has(normalizeTitle(title));
}

/**
 * Returns true when the provided title corresponds to an original song.
 */
export function isOriginalSongTitle(title) {
  return originalSongTitleKeys.has(normalizeTitle(title));
}

export function getArtistByTitle(title) {
  return songArtistsByTitle.get(normalizeTitle(title)) || "Unknown Artist";
}
