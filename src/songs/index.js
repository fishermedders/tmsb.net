// Eagerly import every .mdx file in this directory AND the covers/
// subdirectory at build time. Vite resolves import.meta.glob statically,
// so all song modules end up in the bundle — no runtime fetching needed.
const modules = import.meta.glob("./**/*.mdx", { eager: true });

// Also import the raw source of each MDX file so we can detect whether
// there is any content below the frontmatter block (lyrics, notes, etc.).
const rawModules = import.meta.glob("./**/*.mdx", {
  query: "?raw",
  eager: true,
});

function normalizeTitle(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function titleFromSlug(slug) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

/**
 * Strip markdown/MDX code fences, headings, and other markup from a raw body
 * string so it can be used for plain-text lyrics searching.
 */
function stripMarkdown(raw) {
  return raw
    .replace(/^---[\s\S]*?---/, "") // remove frontmatter
    .replace(/```[\s\S]*?```/g, (m) => m.replace(/```/g, "")) // keep code-fence text
    .replace(/^#+\s+/gm, "") // headings
    .replace(/[*_~`]/g, "") // emphasis / code
    .replace(/<[^>]+>/g, "") // HTML / JSX tags
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links → text
    .trim();
}

/**
 * All songs, sorted with originals ahead of covers.
 * Each entry contains every frontmatter field plus:
 *   - slug       : filename without extension (e.g. "have-a-cigar")
 *   - title      : display title with fallback derived from the slug
 *   - artist     : performer/artist label (falls back to writer or "Unknown Artist")
 *   - original   : true when marked as original material
 *   - aliases    : array of alternate titles this song may appear under in setlists
 *   - Content    : the MDX body as a React component
 *   - hasLyrics  : true if there is any text/markup after the frontmatter
 *   - rawBody    : plain-text content (frontmatter stripped) for full-text search
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

    const hasLyricsTag = afterFrontmatter.includes("<Lyrics");
    const hasAboutTag = afterFrontmatter.includes("<About");

    // Derive slug from the filename only (strip any subdirectory prefix like
    // "covers/") so that URLs remain clean: /songs/five-to-one rather than
    // /songs/covers/five-to-one. Filenames must therefore be unique across
    // all subdirectories.
    const slug = path.split("/").pop().replace(".mdx", "");
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

    // Normalize aliases from frontmatter — can be an array or a single string
    const rawAliases = mod.frontmatter?.aliases;
    const aliases = Array.isArray(rawAliases)
      ? rawAliases.map((a) => String(a).trim()).filter(Boolean)
      : typeof rawAliases === "string" && rawAliases.trim().length > 0
        ? [rawAliases.trim()]
        : [];

    return {
      ...mod.frontmatter,
      title,
      artist,
      original,
      aliases,
      slug,
      Content: mod.default,
      hasLyrics: afterFrontmatter.length > 0,
      hasLyricsTag,
      hasAboutTag,
      rawBody: stripMarkdown(raw),
    };
  })
  .sort((a, b) => {
    if (a.original !== b.original) {
      return a.original ? -1 : 1;
    }
    return a.title.localeCompare(b.title);
  });

// ─── Lookup maps ─────────────────────────────────────────────────────────────

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
 * Maps every normalized alias string → the canonical song object.
 * Also includes the canonical title itself so getSongByTitle works uniformly.
 */
export const aliasToSong = new Map();
songs.forEach((song) => {
  // canonical title → song
  aliasToSong.set(normalizeTitle(song.title), song);
  // each declared alias → song
  song.aliases.forEach((alias) => {
    const key = normalizeTitle(alias);
    if (!aliasToSong.has(key)) {
      aliasToSong.set(key, song);
    }
  });
});

// ─── Exported helpers ────────────────────────────────────────────────────────

/**
 * Look up a single song by its slug.
 * Returns undefined if the slug doesn't match any file.
 */
export function getSongBySlug(slug) {
  return songs.find((s) => s.slug === slug);
}

/**
 * Look up a song by its canonical title OR any of its declared aliases.
 * Returns undefined if nothing matches.
 */
export function getSongByTitle(title) {
  return aliasToSong.get(normalizeTitle(title));
}

/**
 * Predicate helper used by the Songs page to ensure only songs with
 * backing MDX files appear in the list.
 * Also returns true for alias matches.
 */
export function isKnownSongTitle(title) {
  const key = normalizeTitle(title);
  return knownSongTitleKeys.has(key) || aliasToSong.has(key);
}

/**
 * Returns true when the provided title (or alias) corresponds to an original song.
 */
export function isOriginalSongTitle(title) {
  const key = normalizeTitle(title);
  if (originalSongTitleKeys.has(key)) return true;
  const song = aliasToSong.get(key);
  return song ? song.original : false;
}

export function getArtistByTitle(title) {
  const key = normalizeTitle(title);
  if (songArtistsByTitle.has(key)) return songArtistsByTitle.get(key);
  const song = aliasToSong.get(key);
  return song ? song.artist || "Unknown Artist" : "Unknown Artist";
}

/**
 * Given a raw setlist title (which may be an alias), return the canonical
 * song slug for linking purposes — or null if no MDX page exists.
 */
export function getSlugForTitle(title) {
  const song = aliasToSong.get(normalizeTitle(title));
  return song ? song.slug : null;
}
