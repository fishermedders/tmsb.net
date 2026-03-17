import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import "./AlbumGallery.css";

const API_BASE = "https://tmsb-media-worker.fishermedders.workers.dev";
const MEDIA_BASE = "https://media.tmsb.net";

// Formats browsers can't reliably display natively
const NEEDS_CONVERSION = /\.(heic|heif|tiff?)$/i;

/**
 * Rebuild a media.tmsb.net URL through Cloudflare Image Resizing with
 * format=auto so unsupported formats (e.g. HEIC) are converted to WebP/JPEG.
 */
function cfImage(rawUrl, extraParams = "") {
  try {
    const { pathname } = new URL(rawUrl);
    const params = ["format=auto", extraParams].filter(Boolean).join(",");
    return `${MEDIA_BASE}/cdn-cgi/image/${params}${pathname}`;
  } catch {
    return rawUrl;
  }
}

function getThumbnailUrl(item) {
  if (NEEDS_CONVERSION.test(item.key)) {
    return cfImage(item.url, "width=400,quality=80");
  }
  return item.thumbUrl;
}

function getLightboxUrl(item) {
  if (NEEDS_CONVERSION.test(item.key)) {
    return cfImage(item.url, "quality=90");
  }
  return item.url;
}

/**
 * Renders a video thumbnail that reliably shows the first frame on mobile.
 * Uses both the #t=0.001 URL fragment and a JS seek after metadata loads,
 * since mobile browsers (especially iOS Safari) often ignore preload="metadata".
 */
function VideoThumb({ url }) {
  const videoRef = useRef(null);

  const forceFirstFrame = useCallback(() => {
    const v = videoRef.current;
    if (v && v.readyState >= 1) {
      v.currentTime = 0.001;
    }
  }, []);

  return (
    <div className="album-gallery-video-thumb">
      <video
        ref={videoRef}
        className="album-gallery-video-preview"
        src={`${url}#t=0.001`}
        preload="metadata"
        muted
        playsInline
        onLoadedMetadata={forceFirstFrame}
        onLoadedData={forceFirstFrame}
      />
      <div className="album-gallery-play-btn" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>
  );
}

export default function AlbumGallery({ albumId }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    if (!albumId) return;
    setLoading(true);
    setMedia([]);
    setError(null);

    fetch(`${API_BASE}/albums/${encodeURIComponent(albumId)}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setMedia(data.filter((item) => !item.key.endsWith("/")));
        setLoading(false);
      })
      .catch(() => {
        setError("Couldn't load photos — please try again later.");
        setLoading(false);
      });
  }, [albumId]);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const prevItem = useCallback(
    (e) => {
      e?.stopPropagation();
      setLightboxIndex((i) => (i - 1 + media.length) % media.length);
    },
    [media.length],
  );

  const nextItem = useCallback(
    (e) => {
      e?.stopPropagation();
      setLightboxIndex((i) => (i + 1) % media.length);
    },
    [media.length],
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevItem();
      if (e.key === "ArrowRight") nextItem();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightboxIndex, closeLightbox, prevItem, nextItem]);

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIndex]);

  if (loading) {
    return (
      <div className="album-gallery-loading">
        <span className="album-gallery-dot" />
        <span className="album-gallery-dot" />
        <span className="album-gallery-dot" />
      </div>
    );
  }

  if (error) return <p className="album-gallery-error">{error}</p>;
  if (media.length === 0) return null;

  const lightboxItem = lightboxIndex !== null ? media[lightboxIndex] : null;

  return (
    <>
      {/* ── Unified masonry grid ─────────────────────────────────── */}
      <div className="album-gallery-grid">
        {media.map((item, index) => (
          <div
            key={item.key}
            className="album-gallery-cell"
            onClick={() => setLightboxIndex(index)}
            role="button"
            tabIndex={0}
            aria-label={`Open ${item.isVideo ? "video" : "photo"} ${index + 1} of ${media.length}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setLightboxIndex(index);
              }
            }}
          >
            {item.isVideo ? (
              <VideoThumb url={item.url} />
            ) : (
              <img
                className="album-gallery-img"
                src={getThumbnailUrl(item)}
                alt=""
                loading="lazy"
              />
            )}
          </div>
        ))}
      </div>

      {/* ── Lightbox (portalled to body) ─────────────────────────── */}
      {lightboxItem &&
        createPortal(
          <div
            className="album-gallery-lightbox"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label="Media lightbox"
          >
            {/* Close */}
            <button
              className="album-gallery-lb-close"
              onClick={closeLightbox}
              aria-label="Close"
            >
              ✕
            </button>

            {/* Counter */}
            {media.length > 1 && (
              <span className="album-gallery-lb-counter">
                {lightboxIndex + 1} / {media.length}
              </span>
            )}

            {/* Prev */}
            {media.length > 1 && (
              <button
                className="album-gallery-lb-prev"
                onClick={prevItem}
                aria-label="Previous"
              >
                ‹
              </button>
            )}

            {/* Media */}
            {lightboxItem.isVideo ? (
              <video
                key={lightboxItem.url}
                className="album-gallery-lb-video"
                src={lightboxItem.url}
                controls
                autoPlay
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <img
                className="album-gallery-lb-img"
                src={getLightboxUrl(lightboxItem)}
                alt=""
                onClick={(e) => e.stopPropagation()}
              />
            )}

            {/* Next */}
            {media.length > 1 && (
              <button
                className="album-gallery-lb-next"
                onClick={nextItem}
                aria-label="Next"
              >
                ›
              </button>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
