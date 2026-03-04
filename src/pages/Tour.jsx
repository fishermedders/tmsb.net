import { Link } from "react-router-dom";
import { shows, dateFromSlug } from "../shows/index.js";
import PageHeader from "../components/PageHeader.jsx";
import "./Tour.css";

const today = new Date();
today.setHours(0, 0, 0, 0);

const publicShows = shows.filter((s) => !s.privateEvent);
const upcomingShows = publicShows.filter((s) => dateFromSlug(s.slug) >= today);
const pastShows = publicShows
  .filter((s) => dateFromSlug(s.slug) < today)
  .reverse(); // newest first

function ShowCard({ show }) {
  const hasTicketContent =
    show.soldOut || show.ticketsComingSoon || !!show.ticketUrl;

  return (
    <li className={`show-card${show.soldOut ? " show-card--sold-out" : ""}`}>
      <Link
        to={`/tour/${show.slug}`}
        className="show-card-link"
        aria-label={`Details for ${show.venue}, ${show.month} ${show.day}`}
      />

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
  return (
    <div className="tour-page">
      <PageHeader title="Tour Dates" backTo="/" backLabel="← Home" />

      <ul className="show-list">
        {upcomingShows.length > 0 ? (
          upcomingShows.map((show) => <ShowCard key={show.slug} show={show} />)
        ) : (
          <li className="no-shows">No upcoming shows — check back soon!</li>
        )}
      </ul>

      {pastShows.length > 0 && (
        <>
          <h2 className="past-shows-heading">Past Shows</h2>
          <ul className="show-list show-list--past">
            {pastShows.map((show) => (
              <ShowCard key={show.slug} show={show} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
