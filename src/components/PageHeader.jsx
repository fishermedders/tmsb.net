import { Link } from "react-router-dom";
import "./PageHeader.css";

/**
 * PageHeader
 *
 * Renders a 3-column grid row:
 *   [back button]  |  [centred title]  |  [right slot (optional)]
 *
 * Props:
 *   title      – string | ReactNode  – the page heading (optional)
 *   backTo     – string              – route path for the back link
 *   backLabel  – string              – text for the back link  (default "← Back")
 *   right      – ReactNode           – optional content for the right slot
 */
export default function PageHeader({
  title,
  backTo,
  backLabel = "← Back",
  right,
}) {
  const hasTitle = Boolean(title);

  return (
    <div className={`page-header${hasTitle ? "" : " page-header--no-title"}`}>
      {backTo && (
        <Link to={backTo} className="page-header-back">
          {backLabel}
        </Link>
      )}

      {hasTitle && (
        <h1 className="page-header-title">{title}</h1>
      )}

      {right && (
        <div className="page-header-right">{right}</div>
      )}
    </div>
  );
}
