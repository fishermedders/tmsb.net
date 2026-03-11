import { useEffect, useRef } from "react";
import { Link, useLocation, useNavigationType } from "react-router-dom";
import SEO from "../components/SEO.jsx";
import { shows, isPastShow } from "../shows/index.js";
import PageHeader from "../components/PageHeader.jsx";
import "./Tour.css";

function IconCamera() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function IconNotes() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

function IconSetlist() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="3" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="3" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="3" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const visibleShows = shows.filter((s) => !s.hidden);
const upcomingShows = visibleShows.filter((s) => !isPastShow(s.slug));
const pastShows = visibleShows.filter((s) => isPastShow(s.slug)).reverse(); // newest first

function ShowCard({ show, isPast }) {
  const hasTicketContent =
    show.soldOut || show.ticketsComingSoon || !!show.ticketUrl;

  const posterSrc = show.poster
    ? `/assets/posters/${show.poster}`
    : "/assets/poster_default.jpg";

  const posterAspectRatio = show.posterAspectRatio || "4 / 5";

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

  return (
    <li className={`show-card${show.soldOut ? " show-card--sold-out" : ""}`}>
      <Link
        to={`/tour/${show.slug}`}
        className="show-card-link"
        aria-label={`Details for ${show.venue}, ${show.month} ${show.day}`}
      />

      <div
        className="show-poster-thumb"
        style={{ aspectRatio: posterAspectRatio }}
      >
        <img src={posterSrc} alt={`${show.venue} poster`} />
      </div>

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
              acc.push(<span key={`${show.slug}-meta-${index}`}>{item}</span>);
              return acc;
            }, [])}
          </div>
        )}
        {isPast && (show.hasContent || show.galleryId || show.hasSetlist) && (
          <div className="show-indicators">
            {show.hasSetlist && (
              <span
                className="show-indicator show-indicator--setlist"
                title="Setlist"
                aria-label="Has setlist"
              >
                <IconSetlist />
                Setlist
              </span>
            )}
            {show.hasContent && (
              <span
                className="show-indicator show-indicator--notes"
                title="Show notes"
                aria-label="Has show notes"
              >
                <IconNotes />
                Notes
              </span>
            )}
            {show.galleryId && (
              <span
                className="show-indicator show-indicator--gallery"
                title="Photo gallery"
                aria-label="Has photo gallery"
              >
                <IconCamera />
                Photos
              </span>
            )}
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
              aria-label={`Buy tickets for ${show.venue} on ${show.month} ${show.day}`}
              onClick={(e) => e.stopPropagation()}
            >
              Buy Tickets
            </a>
          ) : null}
        </div>
      )}
    </li>
  );
}

export default function Tour() {
  const location = useLocation();
  const navType = useNavigationType();
  const scrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollYRef.current = window.scrollY || 0;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      sessionStorage.setItem("tourScrollY", String(scrollYRef.current));
    };
  }, []);

  useEffect(() => {
    if (navType !== "POP") return;

    const saved = sessionStorage.getItem("tourScrollY");
    if (!saved) return;

    const y = Number(saved);
    if (Number.isNaN(y)) return;

    requestAnimationFrame(() => window.scrollTo(0, y));
  }, [navType, location.key]);

  return (
    <div className="tour-page">
      <SEO
        title="Tour Dates"
        description="Upcoming and past tour dates for The Maple Street Band. Find tickets, show details, and setlists from shows across the Southeast."
      />
      <PageHeader title="Tour Dates" backTo="/" backLabel="← Home" />

      <ul className="show-list">
        {upcomingShows.length > 0 ? (
          upcomingShows.map((show) => (
            <ShowCard key={show.slug} show={show} isPast={false} />
          ))
        ) : (
          <li className="no-shows">No upcoming shows — check back soon!</li>
        )}
      </ul>

      {pastShows.length > 0 && (
        <>
          <h2 className="past-shows-heading">Past Shows</h2>
          <ul className="show-list show-list--past">
            {pastShows.map((show) => (
              <ShowCard key={show.slug} show={show} isPast={true} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
