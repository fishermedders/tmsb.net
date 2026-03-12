import { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import {
  shows,
  isSetlistHeader,
  splitSetlistEntry,
} from "../../shows/index.js";
import { songs as songLibrary } from "../../songs/index.js";
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

  // Seed with every cataloged (MDX-backed) song
  songLibrary.forEach((song) => {
    const title = song.title?.trim() || displayTitleFromSlug(song.slug);
    const key = normalizeSongTitle(title);
    if (!key) return;

    const artist =
      typeof song.artist === "string" && song.artist.trim().length > 0
        ? song.artist.trim()
        : typeof song.author === "string" && song.author.trim().length > 0
          ? song.author.trim()
          : "Unknown Artist";

    map.set(key, {
      title,
      slug: song.slug,
      artist,
      original: Boolean(song.original),
      cataloged: true,
      count: 0,
    });
  });

  // Walk every show's setlist, splitting medleys and skipping headers
  shows.forEach((show) => {
    if (!Array.isArray(show.setlist)) return;

    show.setlist.forEach((entry) => {
      if (isSetlistHeader(entry)) return;

      splitSetlistEntry(entry).forEach((title) => {
        const trimmed = title.trim();
        if (!trimmed) return;

        const key = normalizeSongTitle(trimmed);
        const existing = map.get(key);

        if (existing) {
          existing.count += 1;
        } else {
          map.set(key, {
            title: trimmed,
            slug: null,
            artist: null,
            original: false,
            cataloged: false,
            count: 1,
          });
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
  const [showAll, setShowAll] = useState(true);

  const visibleSongs = showAll ? songs : songs.filter((s) => s.cataloged);

  return (
    <div className="songs-page">
      <SEO
        title="Songs"
        description="Explore the songs The Maple Street Band plays live — originals and covers — with full setlist history and play counts."
      />
      <PageHeader title="Songs" backTo="/" backLabel="← Home" />

      <div className="songs-filter-toggle">
        <button
          className={`songs-filter-btn${showAll ? " active" : ""}`}
          onClick={() => setShowAll(true)}
        >
          All Songs
        </button>
        <button
          className={`songs-filter-btn${!showAll ? " active" : ""}`}
          onClick={() => setShowAll(false)}
        >
          Cataloged
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
                <span className="songs-count">{song.count}</span>
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
