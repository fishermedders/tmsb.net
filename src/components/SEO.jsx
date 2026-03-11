import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_NAME = "The Maple Street Band";
const SITE_URL = "https://tmsb.net";
const DEFAULT_DESCRIPTION =
  "The Maple Street Band is a four-piece rock, jam, and funk group from Saint Simons Island, GA. Catch them live across the Southeast.";
const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/about/band.jpg`;

/**
 * Injects a JSON-LD structured data <script> into <head>.
 * Uses useEffect so it cleans up properly on SPA navigation (unmount → remount).
 *
 * Usage:
 *   <JsonLd data={{ "@context": "https://schema.org", "@type": "MusicGroup", ... }} />
 */
export function JsonLd({ data }) {
  // Stringify once so the effect dependency is a stable primitive.
  const json = JSON.stringify(data);

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = json;
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, [json]);

  return null;
}

/**
 * SEO component — renders document metadata via React 19's native metadata
 * hoisting. React 19 automatically moves <title>, <meta>, and <link> tags
 * rendered anywhere in the tree up to <head>, and removes them on unmount.
 *
 * Props:
 *   title       — page-specific title; will be formatted as "Title | SITE_NAME".
 *                 Omit (or pass null) to use just the site name.
 *   description — page-specific meta description. Falls back to DEFAULT_DESCRIPTION.
 *   ogImage     — absolute URL for og:image / twitter:image. Falls back to band photo.
 *   ogType      — og:type value. Defaults to "website".
 *
 * Usage:
 *   <SEO title="Tour Dates" description="Upcoming shows across the Southeast." />
 */
export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
}) {
  const { pathname } = useLocation();

  const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const canonicalUrl = `${SITE_URL}${pathname}`;

  return (
    <>
      {/* ── Primary ── */}
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* ── Open Graph ── */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* ── Twitter Card ── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </>
  );
}
