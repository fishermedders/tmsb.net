import { Link, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader.jsx";
import { shows } from "../../shows/index.js";
import { getSongBySlug } from "../../songs/index.js";
import SongLyrics, {
  SongLyricsEmpty,
  SongLyricsSection,
} from "../../components/SongLyrics/SongLyrics.jsx";
import "../../components/SongLyrics/SongLyrics.css";
import "./SongDetail.css";

function normalizeSongTitle(title) {
  return title.trim().toLowerCase();
}

export default function SongDetail() {
  const { slug } = useParams();
  const song = getSongBySlug(slug);

  if (!song) {
    return (
      <div className="song-detail-page">
        <PageHeader title="Song" backTo="/songs" backLabel="← Songs" />
        <p className="song-detail-empty">Song not found.</p>
      </div>
    );
  }

  const { Content, hasLyrics } = song;
  const artist = song.artist || song.writer || "Unknown Artist";
  const songKey = normalizeSongTitle(song.title);
  const showsPlayed = shows
    .filter(
      (show) =>
        Array.isArray(show.setlist) &&
        show.setlist.some((title) => normalizeSongTitle(title) === songKey),
    )
    .sort((a, b) => b.slug.localeCompare(a.slug));

  return (
    <div className="song-detail-page">
      <PageHeader title={song.title} backTo="/songs" backLabel="← Songs" />

      <p className="song-detail-artist">By {artist}</p>

      <section className="song-detail-card">
        <SongLyricsSection title="Lyrics">
          <SongLyrics>
            {hasLyrics ? (
              <Content />
            ) : (
              <SongLyricsEmpty message="Lyrics coming soon. If you want to add them, drop them into the song notes." />
            )}
          </SongLyrics>
        </SongLyricsSection>
      </section>

      <section className="song-detail-card">
        <h2 className="song-detail-heading">Shows Played</h2>
        {showsPlayed.length === 0 ? (
          <p className="song-detail-placeholder">No shows found yet.</p>
        ) : (
          <ul className="song-detail-show-list">
            {showsPlayed.map((show) => (
              <li key={show.slug} className="song-detail-show-item">
                <Link
                  to={`/tour/${show.slug}`}
                  className="song-detail-show-link"
                >
                  <span className="song-detail-show-venue">{show.venue}</span>
                  <span className="song-detail-show-date">
                    {show.month} {show.day}, {show.year}
                  </span>
                  <span className="song-detail-show-location">
                    {show.city}, {show.state}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
