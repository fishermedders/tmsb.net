import { Link, useLocation } from "react-router-dom";
import "./Footer.css";

const NAV_LINKS = [
  { to: "/tour", label: "Tour" },
  { to: "/songs", label: "Songs" },
  { to: "/about", label: "About" },
  { to: "/gallery", label: "Gallery" },
  { to: "/stats", label: "Stats" },
  { to: "/merch", label: "Merch" },
  { to: "/contact", label: "Contact" },
  { to: "/search", label: "Search" },
];

const SOCIAL_LINKS = [
  {
    href: "https://open.spotify.com/artist/7LJmIl49POVePlCqtd96bR",
    label: "Spotify",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.622.622 0 01-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.623.623 0 01-.277-1.215c3.809-.87 7.077-.496 9.712 1.115.294.18.386.563.207.857zm1.224-2.72a.78.78 0 01-1.072.257c-2.687-1.652-6.785-2.131-9.965-1.166a.78.78 0 01-.973-.519.781.781 0 01.52-.972c3.632-1.102 8.147-.568 11.233 1.328a.78.78 0 01.257 1.072zm.105-2.83c-3.223-1.914-8.54-2.09-11.618-1.156a.935.935 0 11-.543-1.79c3.532-1.073 9.404-.866 13.115 1.337a.935.935 0 01-.954 1.609z" />
      </svg>
    ),
  },
  {
    href: "https://music.apple.com/us/artist/the-maple-street-band/1830087689",
    label: "Apple Music",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <circle cx="6.5" cy="18.5" r="2.5" />
        <circle cx="16" cy="16.5" r="2.5" />
        <rect x="8.8" y="5" width="1.5" height="13.5" />
        <rect x="18.3" y="3" width="1.5" height="13.5" />
        <path d="M8.8 5 L19.8 3 L19.8 5.5 L8.8 7.5Z" />
      </svg>
    ),
  },
  {
    href: "https://www.instagram.com/themaplestreetband",
    label: "Instagram",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: "https://www.youtube.com/@MapleStreetBand",
    label: "YouTube",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: "https://www.tiktok.com/@themaplestreetband",
    label: "TikTok",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
      </svg>
    ),
  },
  {
    href: "https://www.facebook.com/p/The-Maple-Street-Band-61560848357279/",
    label: "Facebook",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const { pathname } = useLocation();

  // Don't render on the home page
  if (pathname === "/") return null;

  return (
    <footer className="site-footer">
      <nav className="footer-nav" aria-label="Site navigation">
        <div className="footer-nav-pills">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`footer-nav-pill${pathname.startsWith(to) ? " footer-nav-pill--active" : ""}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="footer-social">
        {SOCIAL_LINKS.map(({ href, label, icon }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-link"
            aria-label={label}
            title={label}
          >
            {icon}
          </a>
        ))}
      </div>

      <p className="footer-copy">
        © {new Date().getFullYear()} The Maple Street Band
      </p>
    </footer>
  );
}
