import { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import {
  shows,
  isSetlistHeader,
  splitSetlistEntry,
  parseSetlistPart,
} from "../../shows/index.js";
import { songs as songLibrary, aliasToSong } from "../../songs/index.js";
import "./Songs.css";

function normalizeSongTitle(title) {
  return title.trim().toLowerCase();
}

function displayTitleFromSlug(slug) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function buildSongIndex() {
  const map = new Map();

  // Seed with every cataloged (MDX-backed) song, keyed by its canonical slug
  songLibrary.forEach((song) => {
    const title = song.title?.trim() || displayTitleFromSlug(song.slug);
    if (!title) return;

    const artist =
      typeof song.artist === "string" && song.artist.trim().length > 0
        ? song.artist.trim()
        : typeof song.author === "string" && song.author.trim().length > 0
          ? song.author.trim()
          : "Unknown Artist";

    map.set(song.slug, {
      title,
      slug: song.slug,
      artist,
      original: Boolean(song.original),
      cataloged: true,
      count: 0,
    });
  });

  // Walk every show's setlist, splitting medleys and skipping headers.
  // Resolve each raw title through the alias map so variants like "Run Away"
  // and "5 2 1" are counted toward their canonical song entry.
  shows.forEach((show) => {
    if (!Array.isArray(show.setlist)) return;

    show.setlist.forEach((entry) => {
      if (isSetlistHeader(entry)) return;

      splitSetlistEntry(entry).forEach((rawPart) => {
        const { title: trimmed, isText } = parseSetlistPart(rawPart);
        if (!trimmed || isText) return;

        const normalizedKey = normalizeSongTitle(trimmed);
        const canonicalSong = aliasToSong.get(normalizedKey);

        if (canonicalSong) {
          // We have a cataloged (MDX-backed) song — increment by slug
          const existing = map.get(canonicalSong.slug);
          if (existing) {
            existing.count += 1;
          } else {
            // Edge case: alias resolved but song wasn't seeded (shouldn't happen)
            map.set(canonicalSong.slug, {
              title: canonicalSong.title,
              slug: canonicalSong.slug,
              artist: canonicalSong.artist || null,
              original: Boolean(canonicalSong.original),
              cataloged: true,
              count: 1,
            });
          }
        } else {
          // Uncataloged song — use the normalized title as the map key
          const existing = map.get(normalizedKey);
          if (existing) {
            existing.count += 1;
          } else {
            map.set(normalizedKey, {
              title: trimmed,
              slug: null,
              artist: null,
              original: false,
              cataloged: false,
              count: 1,
            });
          }
        }
      });
    });
  });

  return Array.from(map.values()).sort((a, b) => {
    if (a.original !== b.original) {
      return a.original ? -1 : 1;
    }
    return a.title.localeCompare(b.title);
  });
}

export default function Songs() {
  const songs = buildSongIndex();
  const [filter, setFilter] = useState("all");

  const visibleSongs =
    filter === "all"
      ? songs
      : filter === "originals"
        ? songs.filter((s) => s.original)
        : songs.filter((s) => !s.original);

  return (
    <div className="songs-page">
      <SEO
        title="Songs"
        description="Explore the songs The Maple Street Band plays live — originals and covers — with full setlist history and play counts."
      />
      <PageHeader title="Songs" backTo="/" backLabel="← Home" />

      <div className="songs-filter-toggle">
        <button
          className={`songs-filter-btn${filter === "all" ? " active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All Songs
        </button>
        <button
          className={`songs-filter-btn${filter === "originals" ? " active" : ""}`}
          onClick={() => setFilter("originals")}
        >
          Originals
        </button>
        <button
          className={`songs-filter-btn${filter === "covers" ? " active" : ""}`}
          onClick={() => setFilter("covers")}
        >
          Covers
        </button>
      </div>

      {visibleSongs.length === 0 ? (
        <p>No songs yet — check back after the next show.</p>
      ) : (
        <ul className="songs-list">
          {visibleSongs.map((song) => {
            const inner = (
              <>
                <div className="songs-info">
                  <div className="songs-title-row">
                    <span className="songs-title">{song.title}</span>
                    {song.original && (
                      <span className="songs-original-label">Original</span>
                    )}
                  </div>
                  {song.artist && (
                    <span className="songs-artist">{song.artist}</span>
                  )}
                </div>
                <span className="songs-count">
                  <span className="songs-count-number">{song.count}</span>
                  <span className="songs-count-label">
                    {song.count === 1 ? "play" : "plays"}
                  </span>
                </span>
              </>
            );

            return (
              <li key={song.slug ?? song.title} className="songs-item">
                {song.slug ? (
                  <Link to={`/songs/${song.slug}`} className="songs-link">
                    {inner}
                  </Link>
                ) : (
                  <div className="songs-link songs-link--uncataloged">
                    {inner}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
