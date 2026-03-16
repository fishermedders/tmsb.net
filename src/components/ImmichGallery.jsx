const PROXY_URL = "https://ipp.tmsb.net";

function handleIframeLoad(e) {
  try {
    const iframe = e.target;
    const height = iframe.contentWindow.document.documentElement.scrollHeight;
    if (height > 0) iframe.style.height = height + "px";
  } catch {
    // cross-origin — leave min-height fallback in place
  }
}

export default function ImmichGallery({ shareKey, mode = "full" }) {
  if (!shareKey) return null;

  const src = `${PROXY_URL}/share/${shareKey}`;

  if (mode === "cover") {
    return (
      <img
        className="immich-cover-img"
        src={src}
        alt="Gallery cover"
        loading="lazy"
      />
    );
  }

  return (
    <iframe
      className="immich-gallery-iframe"
      src={src}
      title="Photo Gallery"
      allowFullScreen
      onLoad={handleIframeLoad}
    />
  );
}
