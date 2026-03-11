import "./Stats.css";
import SEO from "../../components/SEO.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import {
  shows,
  isPastShow,
  isSetlistHeader,
  splitSetlistEntry,
} from "../../shows/index.js";

// ─── helpers ────────────────────────────────────────────────────────────────

function normalizeKey(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function titleCase(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function increment(map, key, label) {
  if (!map.has(key)) map.set(key, { label, count: 0 });
  map.get(key).count += 1;
}

function ranked(map, { top = 10 } = {}) {
  return Array.from(map.values())
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, top);
}

// ─── data ───────────────────────────────────────────────────────────────────

function buildStats() {
  const pastShows = shows.filter((s) => !s.hidden && isPastShow(s.slug));

  const cityMap = new Map();
  const venueMap = new Map();
  const stateMap = new Map();
  const songMap = new Map();
  const yearMap = new Map();

  let totalSongsPlayed = 0;

  pastShows.forEach((show) => {
    const cityLabel = `${show.city}, ${show.state}`;
    const stateLabel = titleCase(show.state ?? "");
    const yearLabel = `20${show.slug.slice(0, 2)}`;

    increment(cityMap, normalizeKey(cityLabel), cityLabel);
    increment(venueMap, normalizeKey(show.venue), show.venue);
    increment(stateMap, normalizeKey(show.state), stateLabel);
    increment(yearMap, yearLabel, yearLabel);

    (show.setlist ?? []).forEach((entry) => {
      if (!entry || isSetlistHeader(entry)) return;
      splitSetlistEntry(entry).forEach((song) => {
        const key = normalizeKey(song);
        if (!key) return;
        increment(songMap, key, song);
        totalSongsPlayed += 1;
      });
    });
  });

  const yearRows = Array.from(yearMap.values()).sort((a, b) =>
    a.label.localeCompare(b.label),
  );

  return {
    totalShows: pastShows.length,
    totalCities: cityMap.size,
    totalStates: stateMap.size,
    totalVenues: venueMap.size,
    totalSongsPlayed,
    cities: ranked(cityMap),
    venues: ranked(venueMap),
    states: ranked(stateMap, { top: 20 }),
    songs: ranked(songMap, { top: 15 }),
    years: yearRows,
  };
}

// ─── sub-components ─────────────────────────────────────────────────────────

function StatTile({ number, label, note }) {
  return (
    <div className="stats-tile">
      <span className="stats-tile-number">{number.toLocaleString()}</span>
      <span className="stats-tile-label">{label}</span>
      {note && <span className="stats-tile-note">{note}</span>}
    </div>
  );
}

function BarList({ rows, colorClass = "" }) {
  if (!rows.length) return null;
  const max = rows[0].count;

  return (
    <ol className="stats-bar-list">
      {rows.map((row, i) => {
        const pct = Math.round((row.count / max) * 100);
        return (
          <li key={row.label} className="stats-bar-item">
            <span className="stats-bar-rank">{i + 1}</span>
            <div className="stats-bar-info">
              <div className="stats-bar-track">
                <div
                  className={`stats-bar-fill ${colorClass}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="stats-bar-meta">
                <span className="stats-bar-label">{row.label}</span>
                <span className="stats-bar-count">
                  {row.count}&thinsp;
                  <span className="stats-bar-count-unit">
                    {row.count === 1 ? "show" : "shows"}
                  </span>
                </span>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function SongBarList({ rows }) {
  if (!rows.length) return null;
  const max = rows[0].count;

  return (
    <ol className="stats-bar-list">
      {rows.map((row, i) => {
        const pct = Math.round((row.count / max) * 100);
        return (
          <li key={row.label} className="stats-bar-item">
            <span className="stats-bar-rank">{i + 1}</span>
            <div className="stats-bar-info">
              <div className="stats-bar-track">
                <div
                  className="stats-bar-fill stats-bar-fill--songs"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="stats-bar-meta">
                <span className="stats-bar-label">{row.label}</span>
                <span className="stats-bar-count">
                  {row.count}&thinsp;
                  <span className="stats-bar-count-unit">
                    {row.count === 1 ? "time" : "times"}
                  </span>
                </span>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function YearChart({ rows }) {
  if (!rows.length) return null;
  const max = Math.max(...rows.map((r) => r.count));

  return (
    <div className="stats-year-chart">
      {rows.map((row) => {
        const pct = Math.round((row.count / max) * 100);
        return (
          <div key={row.label} className="stats-year-col">
            <span className="stats-year-count">{row.count}</span>
            <div className="stats-year-bar-track">
              <div
                className="stats-year-bar-fill"
                style={{ height: `${pct}%` }}
              />
            </div>
            <span className="stats-year-label">{row.label.slice(2)}</span>
          </div>
        );
      })}
    </div>
  );
}

function StatsCard({ heading, children, accent }) {
  return (
    <section className={`stats-card${accent ? ` stats-card--${accent}` : ""}`}>
      <h2 className="stats-card-heading">{heading}</h2>
      {children}
    </section>
  );
}

// ─── page ───────────────────────────────────────────────────────────────────

export default function Stats() {
  const {
    totalShows,
    totalCities,
    totalStates,
    totalVenues,
    totalSongsPlayed,
    cities,
    venues,
    states,
    songs,
    years,
  } = buildStats();

  return (
    <div className="stats-page">
      <SEO
        title="Stats"
        description="By the numbers — shows played, cities visited, top venues, most-played songs, and more from The Maple Street Band's history."
      />
      <PageHeader title="Stats" backTo="/" backLabel="← Home" />

      {/* ── headline numbers ───────────────────────────────────────────── */}
      <div className="stats-tiles">
        <StatTile number={totalShows} label="Shows Played" />
        <StatTile number={totalCities} label="Cities" />
        <StatTile number={totalStates} label="States" />
        <StatTile number={totalVenues} label="Unique Venues" />
        <StatTile
          number={totalSongsPlayed}
          label="Songs Played"
          note="based on recorded setlists"
        />
      </div>

      {/* ── shows by year ─────────────────────────────────────────────── */}
      {years.length > 0 && (
        <StatsCard heading="Shows by Year" accent="year">
          <YearChart rows={years} />
        </StatsCard>
      )}

      {/* ── top venues ────────────────────────────────────────────────── */}
      <StatsCard heading="Top Venues" accent="venues">
        {venues.length > 0 ? (
          <BarList rows={venues} colorClass="stats-bar-fill--venues" />
        ) : (
          <p className="stats-empty">No venue data yet.</p>
        )}
      </StatsCard>

      {/* ── top cities ────────────────────────────────────────────────── */}
      <StatsCard heading="Top Cities" accent="cities">
        {cities.length > 0 ? (
          <BarList rows={cities} colorClass="stats-bar-fill--cities" />
        ) : (
          <p className="stats-empty">No city data yet.</p>
        )}
      </StatsCard>

      {/* ── most played songs ─────────────────────────────────────────── */}
      {songs.length > 0 && (
        <StatsCard heading="Most Played Songs" accent="songs">
          <SongBarList rows={songs} />
          <p className="stats-disclaimer">
            Based on the setlists we still have on record — numbers may be
            slightly off.
          </p>
        </StatsCard>
      )}

      {/* ── states ────────────────────────────────────────────────────── */}
      <StatsCard heading="States" accent="states">
        {states.length > 0 ? (
          <ul className="stats-states-list">
            {states.map((row) => (
              <li key={row.label} className="stats-states-item">
                <span className="stats-states-label">{row.label}</span>
                <span className="stats-states-count">{row.count}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="stats-empty">No state data yet.</p>
        )}
      </StatsCard>
    </div>
  );
}
