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
 *   backTo     – string              – route path for the back link (uses <Link>)
 *   onBack     – function            – callback for state-based back (uses <button>)
 *   backLabel  – string              – text for the back control (default "← Back")
 *   right      – ReactNode           – optional content for the right slot
 *
 * Provide either backTo OR onBack, not both.
 */
export default function PageHeader({
  title,
  backTo,
  onBack,
  backLabel = "← Back",
  right,
}) {
  const hasTitle = Boolean(title);

  const backControl = backTo ? (
    <Link to={backTo} className="page-header-back">
      {backLabel}
    </Link>
  ) : onBack ? (
    <button type="button" onClick={onBack} className="page-header-back">
      {backLabel}
    </button>
  ) : null;

  return (
    <div className={`page-header${hasTitle ? "" : " page-header--no-title"}`}>
      {backControl}

      {hasTitle && <h1 className="page-header-title">{title}</h1>}

      {right && <div className="page-header-right">{right}</div>}
    </div>
  );
}
