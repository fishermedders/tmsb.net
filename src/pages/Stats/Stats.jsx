import PageHeader from "../../components/PageHeader.jsx";
import { shows, isPastShow } from "../../shows/index.js";

function normalizeKey(value) {
  return value.trim().toLowerCase();
}

function titleCase(value) {
  return value
    .toLowerCase()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function summarizeCounts(rows, { top = 10 } = {}) {
  return rows
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, top);
}

function buildStats() {
  const cityMap = new Map();
  const venueMap = new Map();
  const stateMap = new Map();

  shows
    .filter((show) => !show.hidden && isPastShow(show.slug))
    .forEach((show) => {
      const cityLabel = `${show.city}, ${show.state}`;
      const cityKey = normalizeKey(cityLabel);
      const venueKey = normalizeKey(show.venue);
      const stateKey = normalizeKey(show.state);

      if (!cityMap.has(cityKey)) {
        cityMap.set(cityKey, { label: cityLabel, count: 0 });
      }
      if (!venueMap.has(venueKey)) {
        venueMap.set(venueKey, { label: show.venue, count: 0 });
      }
      if (!stateMap.has(stateKey)) {
        stateMap.set(stateKey, {
          label: titleCase(show.state),
          count: 0,
        });
      }

      cityMap.get(cityKey).count += 1;
      venueMap.get(venueKey).count += 1;
      stateMap.get(stateKey).count += 1;
    });

  return {
    cities: summarizeCounts(Array.from(cityMap.values())),
    venues: summarizeCounts(Array.from(venueMap.values())),
    states: summarizeCounts(Array.from(stateMap.values())),
  };
}

export default function Stats() {
  const { cities, venues, states } = buildStats();

  return (
    <div className="stats-page">
      <PageHeader title="Stats" backTo="/" backLabel="← Home" />

      <section className="stats-card">
        <h2 className="stats-heading">Top Cities</h2>
        {cities.length === 0 ? (
          <p className="stats-empty">No stats yet — play a few shows first.</p>
        ) : (
          <ul className="stats-list">
            {cities.map((row) => (
              <li key={row.label} className="stats-item">
                <span className="stats-label">{row.label}</span>
                <span className="stats-count">{row.count}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="stats-card">
        <h2 className="stats-heading">Top Venues</h2>
        {venues.length === 0 ? (
          <p className="stats-empty">No stats yet — play a few shows first.</p>
        ) : (
          <ul className="stats-list">
            {venues.map((row) => (
              <li key={row.label} className="stats-item">
                <span className="stats-label">{row.label}</span>
                <span className="stats-count">{row.count}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="stats-card">
        <h2 className="stats-heading">States</h2>
        {states.length === 0 ? (
          <p className="stats-empty">No stats yet — play a few shows first.</p>
        ) : (
          <ul className="stats-list">
            {states.map((row) => (
              <li key={row.label} className="stats-item">
                <span className="stats-label">{row.label}</span>
                <span className="stats-count">{row.count}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
