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
