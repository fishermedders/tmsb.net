import { useParams, Link } from "react-router-dom";
import { getShowBySlug } from "../shows/index.js";
import PageHeader from "../components/PageHeader.jsx";
import PicflowGallery from "../components/PicflowGallery.jsx";
import "./ShowDetail.css";

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

  return (
    <div className="show-detail-page">
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
            <div className="show-meta">
              <span>Doors {show.doors}</span>
              <span className="meta-dot" aria-hidden="true">
                ·
              </span>
              <span>Show {show.show}</span>
              <span className="meta-dot" aria-hidden="true">
                ·
              </span>
              <span>{show.ages}</span>
            </div>
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
          <p className="show-detail-empty">No details found about this gig.</p>
        )}
      </div>

      {/* Picflow photo gallery — only rendered when galleryId is set */}
      {galleryId && (
        <div className="show-detail-gallery">
          <PicflowGallery id={galleryId} />
        </div>
      )}
    </div>
  );
}
