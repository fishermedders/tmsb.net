import SEO from "../components/SEO.jsx";
import { Link } from "react-router-dom";
import { shows, dateFromSlug } from "../shows/index.js";
import PageHeader from "../components/PageHeader.jsx";
import PicflowGallery from "../components/PicflowGallery.jsx";
import "./Gallery.css";

const today = new Date();
today.setHours(0, 0, 0, 0);

const galleryShows = shows
  .filter((s) => !s.hidden && s.galleryId)
  .sort((a, b) => b.slug.localeCompare(a.slug)); // newest first

export default function Gallery() {
  return (
    <div className="gallery-page">
      <SEO
        title="Gallery"
        description="Photos and galleries from The Maple Street Band's shows across the Southeast."
      />
      <PageHeader title="Gallery" backTo="/" backLabel="← Home" />

      {galleryShows.length === 0 ? (
        <div className="gallery-empty">
          <p className="gallery-empty-text">
            No galleries yet — check back after the next show!
          </p>
        </div>
      ) : (
        <div className="gallery-grid">
          {galleryShows.map((show) => {
            const isPast = dateFromSlug(show.slug) < today;
            return (
              <div key={show.slug} className="gallery-card">
                {/* Picflow thumbnail */}
                <div className="gallery-card-thumb">
                  <PicflowGallery id={show.galleryId} />
                </div>

                {/* Show info footer */}
                <div className="gallery-card-footer">
                  <div className="gallery-card-info">
                    <p className="gallery-card-venue">{show.venue}</p>
                    <p className="gallery-card-date">
                      {show.month} {show.day}, {show.year}
                      {!isPast && (
                        <span className="gallery-card-upcoming">Upcoming</span>
                      )}
                    </p>
                    <p className="gallery-card-location">
                      {show.city}, {show.state}
                    </p>
                  </div>
                  <Link
                    to={`/tour/${show.slug}`}
                    className="gallery-card-link"
                    aria-label={`View show details for ${show.venue}`}
                  >
                    View Show →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
