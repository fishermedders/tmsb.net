import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { shows } from "../shows/index.js";
import AlbumCover from "../components/AlbumCover.jsx";
import "./Gallery.css";

const API_BASE = "https://tmsb-media-worker.fishermedders.workers.dev";

function findShowForAlbum(albumId) {
  const prefix = albumId.slice(0, 6);
  return shows.find((s) => !s.hidden && s.slug.slice(0, 6) === prefix) ?? null;
}

export default function Gallery() {
  const [albums, setAlbums] = useState([]);
  const [loadingAlbums, setLoadingAlbums] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoadingAlbums(true);
    setError(null);
    fetch(`${API_BASE}/albums`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        const sorted = [...data].sort((a, b) => b.id.localeCompare(a.id));
        setAlbums(sorted);
        setLoadingAlbums(false);
      })
      .catch(() => {
        setError("Couldn't load albums — please try again later.");
        setLoadingAlbums(false);
      });
  }, []);

  // Only surface albums that have a matching show page
  const linkedAlbums = albums
    .map((album) => ({ album, show: findShowForAlbum(album.id) }))
    .filter(({ show }) => show !== null);

  return (
    <div className="gallery-page">
      <SEO
        title="Gallery"
        description="Photos and videos from The Maple Street Band's shows across the Southeast."
      />
      <PageHeader title="Gallery" backTo="/" backLabel="← Home" />

      {error && (
        <div className="gallery-empty">
          <p className="gallery-empty-text">{error}</p>
        </div>
      )}

      {loadingAlbums && (
        <div className="gallery-loading">
          <span className="gallery-loading-dot" />
          <span className="gallery-loading-dot" />
          <span className="gallery-loading-dot" />
        </div>
      )}

      {!loadingAlbums && !error && linkedAlbums.length === 0 && (
        <div className="gallery-empty">
          <p className="gallery-empty-text">
            No galleries yet — check back after the next show!
          </p>
        </div>
      )}

      {!loadingAlbums && linkedAlbums.length > 0 && (
        <div className="gallery-grid">
          {linkedAlbums.map(({ album, show }) => (
            <Link
              key={album.id}
              to={`/tour/${show.slug}`}
              className="gallery-card"
            >
              <div className="gallery-card-thumb">
                <AlbumCover albumId={album.id} />
              </div>

              <div className="gallery-card-footer">
                <div className="gallery-card-info">
                  <p className="gallery-card-venue">{show.venue}</p>
                  <p className="gallery-card-date">
                    {show.month} {show.day}, {show.year}
                  </p>
                  <p className="gallery-card-location">
                    {show.city}, {show.state}
                  </p>
                </div>
                <span className="gallery-card-link" aria-hidden="true">
                  View Show →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
