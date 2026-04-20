import { Link } from "react-router-dom";
import SEO from "../components/SEO.jsx";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="not-found-page">
      <SEO title="Page Not Found" description="The page you're looking for doesn't exist." />

      <div className="not-found-card">
        <span className="not-found-code">404</span>
        <h1 className="not-found-heading">Page Not Found</h1>
        <p className="not-found-text">
          Looks like this page took a wrong turn somewhere on the way to the gig.
        </p>
        <Link to="/" className="not-found-link">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
