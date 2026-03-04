import PageHeader from "../components/PageHeader.jsx";
import "./Contact.css";

function IconMail() {
  return (
    <svg
      width="18"
      height="18"
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

function IconInstagram() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export default function Contact() {
  return (
    <div className="contact-page">
      <PageHeader title="Contact" backTo="/" backLabel="← Home" />

      <div className="contact-cards">
        {/* ── Booking card ── */}
        <div className="contact-card">
          <p className="contact-card-label">Booking &amp; Management</p>

          <div className="contact-booking-body">
            <div className="contact-booking-text">
              <p className="contact-name">Landon Strehle</p>
              <p className="contact-company">Obelisk LLC</p>
            </div>

            <a
              href="mailto:landon@obelisk.llc"
              className="contact-email-btn"
              aria-label="Email Landon Strehle"
            >
              <IconMail />
              landon@obelisk.llc
            </a>
          </div>
        </div>

        {/* ── Find us online card ── */}
        <div className="contact-card">
          <p className="contact-card-label">Find Us Online</p>

          <ul className="contact-links">
            <li>
              <a
                href="https://www.instagram.com/themaplestreetband"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link-row"
              >
                <span className="contact-link-icon contact-link-icon--instagram">
                  <IconInstagram />
                </span>
                <span className="contact-link-info">
                  <span className="contact-link-platform">Instagram</span>
                  <span className="contact-link-handle">
                    @themaplestreetband
                  </span>
                </span>
                <span className="contact-link-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>

            <li>
              <a
                href="https://www.facebook.com/p/The-Maple-Street-Band-61560848357279/"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link-row"
              >
                <span className="contact-link-icon contact-link-icon--facebook">
                  <IconFacebook />
                </span>
                <span className="contact-link-info">
                  <span className="contact-link-platform">Facebook</span>
                  <span className="contact-link-handle">
                    The Maple Street Band
                  </span>
                </span>
                <span className="contact-link-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>

            <li>
              <a
                href="https://tmsb.net"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link-row"
              >
                <span className="contact-link-icon contact-link-icon--web">
                  <IconGlobe />
                </span>
                <span className="contact-link-info">
                  <span className="contact-link-platform">Website</span>
                  <span className="contact-link-handle">tmsb.net</span>
                </span>
                <span className="contact-link-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
