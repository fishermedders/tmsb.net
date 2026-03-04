import PageHeader from "../components/PageHeader.jsx";
import "./Merch.css";

export default function Merch() {
  return (
    <div className="merch-page">
      <PageHeader title="Merch" backTo="/" backLabel="← Home" />

      <div className="merch-placeholder">
        <div className="merch-placeholder-card">
          <p className="merch-placeholder-main">
            aw dude you gotta come to a show to buy some merch!
          </p>
          <p className="merch-placeholder-sub">for now... to be continued</p>
        </div>
      </div>
    </div>
  );
}
