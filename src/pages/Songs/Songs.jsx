import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader.jsx";
import { shows } from "../../shows/index.js";
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
      count: 0,
    });
  });

  shows.forEach((show) => {
    if (!Array.isArray(show.setlist)) return;

    show.setlist.forEach((title) => {
      const trimmed = title.trim();
      if (!trimmed) return;

      const key = normalizeSongTitle(trimmed);
      const entry = map.get(key);
      if (!entry) return;

      entry.count += 1;
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

  return (
    <div className="songs-page">
      <PageHeader title="Songs" backTo="/" backLabel="← Home" />
      {songs.length === 0 ? (
        <p>No songs yet — check back after the next show.</p>
      ) : (
        <ul className="songs-list">
          {songs.map((song) => (
            <li key={song.slug} className="songs-item">
              <Link to={`/songs/${song.slug}`} className="songs-link">
                <div className="songs-info">
                  <div className="songs-title-row">
                    <span className="songs-title">{song.title}</span>
                    {song.original && (
                      <span className="songs-original-label">Original</span>
                    )}
                  </div>
                  <span className="songs-artist">{song.artist}</span>
                </div>
                <span className="songs-count">{song.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
