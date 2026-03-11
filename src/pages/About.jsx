import SEO, { JsonLd } from "../components/SEO.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { shows, isPastShow } from "../shows/index.js";
import "./About.css";

const _today = new Date();
_today.setHours(0, 0, 0, 0);
const playedCount = shows.filter(
  (s) => !s.hidden && isPastShow(s.slug, _today),
).length;

const MEMBERS = [
  {
    name: "Scott Akins",
    role: "Vocals",
    photo: "/assets/about/scott.jpg",
    blob: 1,
  },
  {
    name: "Will Theiler",
    role: "Bass",
    photo: "/assets/about/will.jpg",
    blob: 2,
  },
  {
    name: "Fisher Medders",
    role: "Guitar & Vocals",
    photo: "/assets/about/fisher.jpg",
    blob: 3,
  },
  {
    name: "Jake Segars",
    role: "Drums",
    photo: "/assets/about/jake.jpg",
    blob: 4,
  },
];

const STATS = [
  { value: "2024", label: "Founded" },
  { value: "Saint Simons Island", label: "Hometown" },
  { value: playedCount, label: "Shows Played" },
  { value: "GA", label: "Home State" },
];

const MUSIC_GROUP_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  name: "The Maple Street Band",
  url: "https://tmsb.net",
  genre: ["Rock", "Jam", "Funk", "Southern Rock"],
  foundingDate: "2024",
  foundingLocation: {
    "@type": "Place",
    name: "Saint Simons Island, GA",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Saint Simons Island",
      addressRegion: "GA",
      addressCountry: "US",
    },
  },
  member: [
    {
      "@type": "OrganizationRole",
      member: { "@type": "Person", name: "Scott Akins" },
      roleName: "Vocals",
    },
    {
      "@type": "OrganizationRole",
      member: { "@type": "Person", name: "Will Theiler" },
      roleName: "Bass",
    },
    {
      "@type": "OrganizationRole",
      member: { "@type": "Person", name: "Fisher Medders" },
      roleName: "Guitar & Vocals",
    },
    {
      "@type": "OrganizationRole",
      member: { "@type": "Person", name: "Jake Segars" },
      roleName: "Drums",
    },
  ],
  sameAs: [
    "https://open.spotify.com/artist/7LJmIl49POVePlCqtd96bR",
    "https://music.apple.com/us/artist/the-maple-street-band/1830087689",
    "https://www.instagram.com/themaplestreetband",
    "https://www.facebook.com/p/The-Maple-Street-Band-61560848357279/",
    "https://www.youtube.com/@MapleStreetBand",
  ],
};

export default function About() {
  return (
    <div className="about-page">
      <SEO
        title="About"
        description="Learn about The Maple Street Band — Scott Akins, Will Theiler, Fisher Medders, and Jake Segars — a four-piece rock, jam, and funk group from Saint Simons Island, GA, formed in 2024."
      />
      <JsonLd data={MUSIC_GROUP_JSON_LD} />
      <PageHeader title="About" backTo="/" backLabel="← Home" />

      {/* ── Bio + Stats ── */}
      <div className="about-section">
        <div className="about-card about-bio-card">
          <div className="about-bio-photo">
            <div className="blob-photo blob--1">
              <img src="/assets/about/band.jpg" alt="The Maple Street Band" />
            </div>
          </div>

          <div className="about-bio-body">
            <p className="about-card-label">Who We Are</p>
            <h2 className="about-section-heading">The Maple Street Band</h2>
            <p className="about-body-text">
              A four-piece rockin' jammin' funkin' genre bending group from
              Saint Simons Island, GA.
            </p>
            <p className="about-body-text">
              Formed in 2024, the band has spent the last while honing their
              craft on the stages of the Southeast, from your favorite dive bars
              to the big stages that you know and love.
            </p>
          </div>
        </div>

        <div className="about-card about-stats-card">
          {STATS.map(({ value, label }) => (
            <div key={label} className="about-stat">
              <span className="about-stat-value">{value}</span>
              <span className="about-stat-label">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <h2 className="about-divider-heading">
        <span>The Band</span>
      </h2>

      <div className="about-section">
        <div className="about-card about-members-card">
          <div className="about-members-grid">
            {MEMBERS.map(({ name, role, photo, blob }) => (
              <div key={name} className="about-member">
                <div className={`blob-photo blob--${blob}`}>
                  <img src={photo} alt={name} />
                </div>
                <p className="about-member-name">{name}</p>
                <p className="about-member-role">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h2 className="about-divider-heading">
        <span>Story</span>
      </h2>

      <div className="about-section">
        <div className="about-card about-story-card">
          <blockquote className="about-pull-quote">
            <p className="about-pull-quote-text">this band fucking blows</p>
            <p className="about-pull-quote-text">oh wait hold on</p>
            <cite className="about-pull-quote-cite">— typical bargoer</cite>
          </blockquote>

          <p className="about-body-text">
            The band has a great range of influences, and it shows in all of the
            music they play, especially originals. From classic and southern
            rock, to british invasion, jam bands, and more, their music is a fun
            fusion.
          </p>
          <p className="about-body-text">
            They have released a single, "Curtains," which can be found on all
            major streaming platforms, with more on the way. They also just
            bought a van (Jean-Claude Band Van, a.k.a., the yak.) Look out,
            southeast.
          </p>
        </div>
      </div>
    </div>
  );
}
