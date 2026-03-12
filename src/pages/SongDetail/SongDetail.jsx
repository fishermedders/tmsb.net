import { Link, useParams } from "react-router-dom";
import SEO, { JsonLd } from "../../components/SEO.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import {
  shows,
  isSetlistHeader,
  splitSetlistEntry,
} from "../../shows/index.js";
import { getSongBySlug } from "../../songs/index.js";
import SongLyrics, {
  SongLyricsEmpty,
  SongLyricsSection,
  LyricsBlock,
  AboutBlock,
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

  const { Content, hasLyrics, hasLyricsTag, hasAboutTag } = song;
  const usesNewFormat = hasLyricsTag || hasAboutTag;
  const artist = song.artist || "Unknown Artist";
  const author = song.author || null;

  // Build a set of every normalized name this song may appear under in setlists
  // (canonical title + any declared aliases).
  const songKeys = new Set([
    normalizeSongTitle(song.title),
    ...(Array.isArray(song.aliases)
      ? song.aliases.map(normalizeSongTitle)
      : []),
  ]);

  // ── SEO helpers ────────────────────────────────────────────────────────
  const seoDescription = song.original
    ? `${song.title} — an original song by The Maple Street Band.`
    : `${song.title} by ${artist}, as performed by The Maple Street Band.`;

  const musicRecordingJsonLd = song.original
    ? {
        "@context": "https://schema.org",
        "@type": "MusicRecording",
        name: song.title,
        byArtist: {
          "@type": "MusicGroup",
          name: "The Maple Street Band",
          url: "https://tmsb.net",
        },
        ...(author ? { author: { "@type": "Person", name: author } } : {}),
        url: `https://tmsb.net/songs/${song.slug}`,
      }
    : null;
  const showsPlayed = shows
    .filter((show) => {
      if (!Array.isArray(show.setlist)) return false;
      return show.setlist.some((entry) => {
        if (isSetlistHeader(entry)) return false;
        // Split medleys so "Run Away > Tiki Torch" matches either song
        return splitSetlistEntry(entry).some((part) =>
          songKeys.has(normalizeSongTitle(part)),
        );
      });
    })
    .sort((a, b) => b.slug.localeCompare(a.slug));

  return (
    <div className="song-detail-page">
      <SEO title={song.title} description={seoDescription} />
      {musicRecordingJsonLd && <JsonLd data={musicRecordingJsonLd} />}
      <PageHeader backTo="/songs" backLabel="← Songs" />

      <div className="song-detail-meta">
        <div className="song-detail-meta-top">
          <h1 className="song-detail-title">{song.title}</h1>
          {song.original && <span className="song-detail-badge">Original</span>}
        </div>
        <p className="song-detail-artist">By {artist}</p>
        {author && <p className="song-detail-author">Written by {author}</p>}
      </div>

      {!hasLyrics ? (
        <section className="song-detail-card">
          <SongLyricsSection title="Lyrics">
            <SongLyrics>
              <SongLyricsEmpty message="Lyrics coming soon." />
            </SongLyrics>
          </SongLyricsSection>
        </section>
      ) : usesNewFormat ? (
        <Content components={{ Lyrics: LyricsBlock, About: AboutBlock }} />
      ) : (
        <section className="song-detail-card">
          <SongLyricsSection title="Lyrics">
            <SongLyrics>
              <Content />
            </SongLyrics>
          </SongLyricsSection>
        </section>
      )}

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
