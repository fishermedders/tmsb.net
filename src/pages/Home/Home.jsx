import { Link } from "react-router-dom";
import SEO, { JsonLd } from "../../components/SEO.jsx";
import "./Home.css";

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

function IconSpotify() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.622.622 0 01-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.623.623 0 01-.277-1.215c3.809-.87 7.077-.496 9.712 1.115.294.18.386.563.207.857zm1.224-2.72a.78.78 0 01-1.072.257c-2.687-1.652-6.785-2.131-9.965-1.166a.78.78 0 01-.973-.519.781.781 0 01.52-.972c3.632-1.102 8.147-.568 11.233 1.328a.78.78 0 01.257 1.072zm.105-2.83c-3.223-1.914-8.54-2.09-11.618-1.156a.935.935 0 11-.543-1.79c3.532-1.073 9.404-.866 13.115 1.337a.935.935 0 01-.954 1.609z" />
    </svg>
  );
}

function IconAppleMusic() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      {/* Left note head */}
      <circle cx="6.5" cy="18.5" r="2.5" />
      {/* Right note head */}
      <circle cx="16" cy="16.5" r="2.5" />
      {/* Left stem */}
      <rect x="8.8" y="5" width="1.5" height="13.5" />
      {/* Right stem */}
      <rect x="18.3" y="3" width="1.5" height="13.5" />
      {/* Beam connecting the two stems */}
      <path d="M8.8 5 L19.8 3 L19.8 5.5 L8.8 7.5Z" />
    </svg>
  );
}

function IconTour() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconMerch() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function IconContact() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <polyline points="2,4 12,13 22,4" />
    </svg>
  );
}

function IconGallery() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21,15 16,10 5,21" />
    </svg>
  );
}

function IconSongs() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

function IconAbout() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function IconStats() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="13" width="4" height="8" rx="1" />
      <rect x="9" y="8" width="4" height="13" rx="1" />
      <rect x="16" y="3" width="4" height="18" rx="1" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

const SINGLE_ITEMS = [
  { to: "/contact", label: "Contact", Icon: IconContact, iconMod: "contact" },
  { to: "/search", label: "Search", Icon: IconSearch, iconMod: "search" },
];

const PAIR_ROWS = [
  [
    { to: "/tour", label: "Tour / Tix", Icon: IconTour, iconMod: "tour" },
    { to: "/merch", label: "Merch", Icon: IconMerch, iconMod: "merch" },
  ],
  [
    { to: "/about", label: "About", Icon: IconAbout, iconMod: "about" },
    { to: "/gallery", label: "Gallery", Icon: IconGallery, iconMod: "gallery" },
  ],
  [
    { to: "/songs", label: "Songs", Icon: IconSongs, iconMod: "songs" },
    { to: "/stats", label: "Stats", Icon: IconStats, iconMod: "stats" },
  ],
];

export default function Home() {
  return (
    <>
      <SEO description="The Maple Street Band is a four-piece rock, jam, and funk group from Saint Simons Island, GA. Tour dates, songs, merch, and more." />
      <JsonLd data={MUSIC_GROUP_JSON_LD} />
      <nav className="home-nav">
        <ul className="home-nav-list">
          <li className="home-nav-item home-nav-item--streaming">
            <a
              href="https://open.spotify.com/artist/7LJmIl49POVePlCqtd96bR"
              target="_blank"
              rel="noopener noreferrer"
              className="home-nav-streaming-link"
            >
              <span className="home-nav-icon home-nav-icon--spotify">
                <IconSpotify />
              </span>
              <span className="home-nav-streaming-label">Spotify</span>
            </a>
            <a
              href="https://music.apple.com/us/artist/the-maple-street-band/1830087689"
              target="_blank"
              rel="noopener noreferrer"
              className="home-nav-streaming-link"
            >
              <span className="home-nav-icon home-nav-icon--apple-music">
                <IconAppleMusic />
              </span>
              <span className="home-nav-streaming-label">Apple Music</span>
            </a>
          </li>
          {PAIR_ROWS.map((pair) => (
            <li key={pair[0].to} className="home-nav-item home-nav-item--pair">
              {pair.map(({ to, label, Icon, iconMod }) => (
                <Link key={to} to={to} className="home-nav-link">
                  <span className={`home-nav-icon home-nav-icon--${iconMod}`}>
                    <Icon />
                  </span>
                  <span className="home-nav-label">{label}</span>
                  <span className="home-nav-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              ))}
            </li>
          ))}
          {SINGLE_ITEMS.map(({ to, label, Icon, iconMod }) => (
            <li key={to} className="home-nav-item">
              <Link to={to} className="home-nav-link">
                <span className={`home-nav-icon home-nav-icon--${iconMod}`}>
                  <Icon />
                </span>
                <span className="home-nav-label">{label}</span>
                <span className="home-nav-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
