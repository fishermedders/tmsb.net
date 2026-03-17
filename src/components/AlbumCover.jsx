import { useState, useEffect } from "react";
import "./AlbumCover.css";

const API_BASE = "https://tmsb-media-worker.fishermedders.workers.dev";
const NEEDS_CONVERSION = /\.(heic|heif|tiff?)$/i;
const MEDIA_BASE = "https://media.tmsb.net";

function cfThumb(item) {
  if (NEEDS_CONVERSION.test(item.key)) {
    try {
      const { pathname } = new URL(item.url);
      return `${MEDIA_BASE}/cdn-cgi/image/format=auto,width=400,quality=80${pathname}`;
    } catch {
      return item.thumbUrl;
    }
  }
  return item.thumbUrl;
}

export default function AlbumCover({ albumId }) {
  const [photos, setPhotos] = useState(null);

  useEffect(() => {
    if (!albumId) return;
    fetch(`${API_BASE}/albums/${encodeURIComponent(albumId)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        const images = data
          .filter((item) => !item.isVideo && !item.key.endsWith("/"))
          .slice(0, 15);
        setPhotos(images);
      })
      .catch(() => setPhotos([]));
  }, [albumId]);

  if (photos === null) {
    return <span className="album-cover-icon">🎸</span>;
  }

  if (photos.length === 0) {
    return <span className="album-cover-icon">🎸</span>;
  }

  return (
    <div className="album-cover-mosaic">
      {photos.map((photo) => (
        <img
          key={photo.key}
          className="album-cover-mosaic-img"
          src={cfThumb(photo)}
          alt=""
          loading="lazy"
        />
      ))}
    </div>
  );
}
