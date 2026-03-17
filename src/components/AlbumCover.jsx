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

/**
 * Pick a grid layout that completely fills the container with no dead columns.
 * Returns { cols, rows, max } — slice the items array to `max` before rendering.
 */
function getGrid(n) {
  if (n <= 1) return { cols: 1, rows: 1, max: 1 };
  if (n === 2) return { cols: 2, rows: 1, max: 2 };
  if (n <= 4) return { cols: 2, rows: 2, max: 4 };
  if (n <= 6) return { cols: 3, rows: 2, max: 6 };
  if (n <= 9) return { cols: 3, rows: 3, max: 9 };
  if (n <= 12) return { cols: 4, rows: 3, max: 12 };
  return { cols: 4, rows: 4, max: 16 };
}

export default function AlbumCover({ albumId }) {
  const [items, setItems] = useState(null);

  useEffect(() => {
    if (!albumId) return;
    fetch(`${API_BASE}/albums/${encodeURIComponent(albumId)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        const all = data.filter((item) => !item.key.endsWith("/"));
        setItems(all);
      })
      .catch(() => setItems([]));
  }, [albumId]);

  if (items === null || items.length === 0) {
    return <span className="album-cover-icon">🎸</span>;
  }

  const { cols, rows, max } = getGrid(items.length);
  const visible = items.slice(0, max);

  return (
    <div
      className="album-cover-mosaic"
      style={{
        "--mosaic-cols": cols,
        "--mosaic-rows": rows,
      }}
    >
      {visible.map((item) =>
        item.isVideo ? (
          <div key={item.key} className="album-cover-mosaic-video">
            <svg
              className="album-cover-mosaic-play"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        ) : (
          <img
            key={item.key}
            className="album-cover-mosaic-img"
            src={cfThumb(item)}
            alt=""
            loading="lazy"
          />
        ),
      )}
    </div>
  );
}
