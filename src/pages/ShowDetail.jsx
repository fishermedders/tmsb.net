import { useParams, Link } from "react-router-dom";
import {
  getShowBySlug,
  isPastShow,
  isSetlistHeader,
  getSetlistHeaderText,
  splitSetlistEntry,
  dateFromSlug,
} from "../shows/index.js";
import { isKnownSongTitle } from "../songs/index.js";
import SEO, { JsonLd } from "../components/SEO.jsx";
import PageHeader from "../components/PageHeader.jsx";
import PicflowGallery from "../components/PicflowGallery.jsx";
import "./ShowDetail.css";

function IconBrokenLink() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}

function slugifySong(title) {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function ShowDetail() {
  // picflow.com
  //
  const { slug } = useParams();
  const show = getShowBySlug(slug);

  if (!show) {
    return (
      <div className="show-not-found">
        <p>Show not found.</p>
        <Link to="/tour" className="show-not-found-link">
          ← Tour Dates
        </Link>
      </div>
    );
  }

  const { Content, hasContent, galleryId } = show;
  const posterSrc = show.poster
    ? `/assets/posters/${show.poster}`
    : "/assets/poster_default.jpg";
  const posterAspectRatio = show.posterAspectRatio || "4 / 5";
  const hasTicketContent =
    show.soldOut || show.ticketsComingSoon || !!show.ticketUrl;

  const isPast = isPastShow(show.slug);

  const metaItems = [];
  if (show.doors) {
    metaItems.push(`Doors ${show.doors}`);
  }
  if (show.show) {
    metaItems.push(`Show ${show.show}`);
  }
  if (show.ages) {
    metaItems.push(show.ages);
  }

  // ── SEO helpers ──────────────────────────────────────────────────────────
  const showDate = dateFromSlug(show.slug);
  const isoDate = showDate.toISOString().split("T")[0];
  const seoTitle = `${show.venue} — ${show.month} ${show.day}, ${show.year}`;
  const seoDescription = `The Maple Street Band live at ${show.venue} in ${show.city}, ${show.state} — ${show.month} ${show.day}, ${show.year}.${show.support ? ` Supporting ${show.support}.` : ""}`;

  const musicEventJsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: `The Maple Street Band at ${show.venue}`,
    startDate: isoDate,
    location: {
      "@type": "MusicVenue",
      name: show.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: show.city,
        addressRegion: show.state,
        addressCountry: "US",
      },
    },
    performer: {
      "@type": "MusicGroup",
      name: "The Maple Street Band",
      url: "https://tmsb.net",
    },
    url: `https://tmsb.net/tour/${show.slug}`,
    ...(show.ticketUrl && !show.soldOut
      ? {
          offers: {
            "@type": "Offer",
            url: show.ticketUrl,
            availability: "https://schema.org/InStock",
          },
        }
      : show.soldOut
        ? {
            offers: {
              "@type": "Offer",
              availability: "https://schema.org/SoldOut",
            },
          }
        : {}),
  };

  return (
    <div className="show-detail-page">
      <SEO title={seoTitle} description={seoDescription} />
      <JsonLd data={musicEventJsonLd} />
      <PageHeader title={show.venue} backTo="/tour" backLabel="← Tour Dates" />

      {/* Poster + show info card side by side */}
      <div className="show-detail-header-row">
        <img
          src={posterSrc}
          alt={`${show.venue} poster`}
          className="show-detail-poster"
          style={{ aspectRatio: posterAspectRatio }}
        />

        {/* Header reuses the same grid + class names as the tour list card */}
        <div
          className={[
            "show-card",
            "show-detail-header",
            show.soldOut ? "show-card--sold-out" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="show-date">
            <span className="show-month">{show.month}</span>
            <span className="show-day">{show.day}</span>
            <span className="show-year">{show.year}</span>
          </div>

          <div className="show-divider" aria-hidden="true" />

          <div className="show-info">
            <p className="show-venue">{show.venue}</p>
            <p className="show-location">
              {show.city}, {show.state}
            </p>
            {show.support && <p className="show-support">{show.support}</p>}
            {metaItems.length > 0 && (
              <div className="show-meta">
                {metaItems.reduce((acc, item, index) => {
                  if (index > 0) {
                    acc.push(
                      <span
                        key={`${show.slug}-meta-dot-${index}`}
                        className="meta-dot"
                        aria-hidden="true"
                      >
                        ·
                      </span>,
                    );
                  }
                  acc.push(
                    <span key={`${show.slug}-meta-${index}`}>{item}</span>,
                  );
                  return acc;
                }, [])}
              </div>
            )}
          </div>

          {hasTicketContent && (
            <div className="show-ticket-area">
              {show.soldOut ? (
                <span className="ticket-sold-out" aria-label="Sold out">
                  Sold Out
                </span>
              ) : show.ticketsComingSoon ? (
                <span
                  className="ticket-coming-soon"
                  aria-label="Tickets coming soon"
                >
                  Tickets Coming Soon
                </span>
              ) : show.ticketUrl ? (
                <a
                  href={show.ticketUrl}
                  className="ticket-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Buy tickets for ${show.venue}`}
                >
                  Buy Tickets
                </a>
              ) : null}
            </div>
          )}
        </div>
      </div>
      {/* end show-detail-header-row */}

      {/* MDX body */}
      <div className="show-detail-content">
        {hasContent ? (
          <Content />
        ) : (
          <p className="show-detail-empty">
            {isPast
              ? "No details found about this gig."
              : "Details will be posted after the show."}
          </p>
        )}
      </div>

      <section className="show-setlist">
        <h2 className="show-setlist-heading">Setlist</h2>
        {show.setlist && show.setlist.length > 0 ? (
          <ul className="show-setlist-list">
            {show.setlist.map((entry, i) => {
              // ── Section header (e.g. "h|Set 1") ──────────────────────────
              if (isSetlistHeader(entry)) {
                return (
                  <li key={i} className="show-setlist-header-item">
                    {getSetlistHeaderText(entry)}
                  </li>
                );
              }

              // ── Medley or regular song ────────────────────────────────────
              const parts = splitSetlistEntry(entry);
              return (
                <li
                  key={i}
                  className={`show-setlist-item${parts.length > 1 ? " show-setlist-item--medley" : ""}`}
                >
                  {parts.map((part, j) => (
                    <span key={j} className="show-setlist-part">
                      {j > 0 && (
                        <span
                          className="show-setlist-medley-sep"
                          aria-hidden="true"
                        >
                          ›
                        </span>
                      )}
                      {isKnownSongTitle(part) ? (
                        <Link
                          to={`/songs/${slugifySong(part)}`}
                          className="show-setlist-link"
                        >
                          {part}
                        </Link>
                      ) : (
                        <span
                          className="show-setlist-no-page"
                          title="No song page yet"
                        >
                          {part}
                          <span
                            className="show-setlist-broken-icon"
                            aria-label="No song page"
                          >
                            <IconBrokenLink />
                          </span>
                        </span>
                      )}
                    </span>
                  ))}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="show-setlist-empty">Setlist coming soon.</p>
        )}
      </section>

      {/* Picflow photo gallery — only rendered when galleryId is set */}
      {galleryId && (
        <div className="show-detail-gallery">
          <PicflowGallery id={galleryId} />
        </div>
      )}
    </div>
  );
}
