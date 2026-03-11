export default function SongLyrics({ children }) {
  return (
    <div className="song-lyrics">
      <div className="song-lyrics-inner">{children}</div>
    </div>
  );
}

export function SongLyricsEmpty({ message = "Lyrics coming soon." }) {
  return <p className="song-lyrics-empty">{message}</p>;
}

export function SongLyricsSection({ title = "Lyrics", children }) {
  return (
    <section className="song-lyrics-section">
      <h2 className="song-lyrics-heading">{title}</h2>
      {children}
    </section>
  );
}

/**
 * Used as the <Lyrics> component in MDX files.
 * Renders a self-contained card with a "Lyrics" heading and the
 * inner styled lyrics box — matching the visual hierarchy of the
 * legacy wrapped format.
 */
export function LyricsBlock({ children }) {
  return (
    <section className="song-lyrics-block">
      <h2 className="song-lyrics-heading">Lyrics</h2>
      <div className="song-lyrics">
        <div className="song-lyrics-inner">{children}</div>
      </div>
    </section>
  );
}

/**
 * Used as the <About> component in MDX files.
 * Renders a self-contained card with an "About" heading and
 * styled prose body text.
 */
export function AboutBlock({ children }) {
  return (
    <section className="song-about-block">
      <h2 className="song-lyrics-heading">About</h2>
      <div className="song-about-body">{children}</div>
    </section>
  );
}
