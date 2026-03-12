import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import { songs } from "../../songs/index.js";
import {
  shows,
  isPastShow,
  isSetlistHeader,
  splitSetlistEntry,
} from "../../shows/index.js";
import "./Search.css";

// ─── helpers ─────────────────────────────────────────────────────────────────

function normalize(str) {
  return String(str ?? "")
    .toLowerCase()
    .trim();
}

function includes(haystack, needle) {
  return normalize(haystack).includes(needle);
}

function highlight(text, query) {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(${escaped})`, "gi");
  const parts = String(text).split(re);
  return parts.map((part, i) =>
    re.test(part) ? (
      <mark key={i} className="search-highlight">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

/**
 * Pull the first line that contains the query from a raw body string,
 * with a small amount of surrounding context.
 */
function lyricsSnippet(rawBody, query) {
  if (!rawBody || !query) return null;
  const lines = rawBody.split(/\r?\n/);
  const q = normalize(query);
  const matchIndex = lines.findIndex((l) => normalize(l).includes(q));
  if (matchIndex === -1) return null;
  const start = Math.max(0, matchIndex - 1);
  const end = Math.min(lines.length - 1, matchIndex + 1);
  return lines
    .slice(start, end + 1)
    .join(" / ")
    .trim();
}

function formatShowDate(show) {
  return `${show.month} ${show.day}, ${show.year}`;
}

// ─── search engine ───────────────────────────────────────────────────────────

function runSearch(query) {
  const q = normalize(query);
  if (!q) return { songResults: [], showResults: [], lyricResults: [] };

  // ── Songs (title + artist) ──────────────────────────────────────────────
  const songResults = songs
    .filter(
      (s) =>
        includes(s.title, q) ||
        includes(s.artist, q) ||
        (s.aliases && s.aliases.some((a) => includes(a, q))),
    )
    .slice(0, 12);

  // ── Shows (venue, city, state, month, year, support) ───────────────────
  const showResults = shows
    .filter(
      (s) =>
        !s.hidden &&
        (includes(s.venue, q) ||
          includes(s.city, q) ||
          includes(s.state, q) ||
          includes(s.month, q) ||
          includes(s.year, q) ||
          includes(s.support, q) ||
          // also match individual setlist song titles
          (Array.isArray(s.setlist) &&
            s.setlist.some((entry) => {
              if (isSetlistHeader(entry)) return false;
              return splitSetlistEntry(entry).some((part) => includes(part, q));
            }))),
    )
    .sort((a, b) => b.slug.localeCompare(a.slug))
    .slice(0, 10);

  // ── Lyrics (full-text inside rawBody) ──────────────────────────────────
  const lyricResults = songs
    .filter(
      (s) =>
        s.rawBody &&
        !songResults.some((sr) => sr.slug === s.slug) && // don't double-show
        includes(s.rawBody, q),
    )
    .map((s) => ({ ...s, snippet: lyricsSnippet(s.rawBody, q) }))
    .filter((s) => s.snippet)
    .slice(0, 8);

  return { songResults, showResults, lyricResults };
}

// ─── sub-components ──────────────────────────────────────────────────────────

function SectionHeading({ children, count }) {
  return (
    <div className="search-section-heading">
      <h2 className="search-section-title">{children}</h2>
      <span className="search-section-count">{count}</span>
    </div>
  );
}

function SongResult({ song, query }) {
  return (
    <Link to={`/songs/${song.slug}`} className="search-result-link">
      <div className="search-result-main">
        <span className="search-result-title">
          {highlight(song.title, query)}
        </span>
        {song.original && <span className="search-result-badge">Original</span>}
      </div>
      {song.artist && (
        <span className="search-result-sub">
          {highlight(song.artist, query)}
        </span>
      )}
    </Link>
  );
}

function ShowResult({ show, query }) {
  const past = isPastShow(show.slug);
  return (
    <Link to={`/tour/${show.slug}`} className="search-result-link">
      <div className="search-result-main">
        <span className="search-result-title">
          {highlight(show.venue, query)}
        </span>
        {!past && (
          <span className="search-result-badge search-result-badge--upcoming">
            Upcoming
          </span>
        )}
      </div>
      <span className="search-result-sub">
        {highlight(`${show.city}, ${show.state}`, query)}
        <span className="search-result-dot" aria-hidden="true">
          ·
        </span>
        {highlight(formatShowDate(show), query)}
      </span>
    </Link>
  );
}

function LyricResult({ song, query }) {
  return (
    <Link
      to={`/songs/${song.slug}`}
      className="search-result-link search-result-link--lyrics"
    >
      <div className="search-result-main">
        <span className="search-result-title">{song.title}</span>
        {song.original && <span className="search-result-badge">Original</span>}
      </div>
      {song.snippet && (
        <span className="search-result-snippet">
          "{highlight(song.snippet, query)}"
        </span>
      )}
    </Link>
  );
}

function EmptyState({ query }) {
  return (
    <div className="search-empty">
      <p className="search-empty-text">
        No results for <strong>"{query}"</strong>
      </p>
      <p className="search-empty-hint">
        Try searching a song title, venue, city, or artist name.
      </p>
    </div>
  );
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function Search() {
  const [query, setQuery] = useState("");

  const { songResults, showResults, lyricResults } = useMemo(
    () => runSearch(query),
    [query],
  );

  const hasResults =
    songResults.length > 0 || showResults.length > 0 || lyricResults.length > 0;
  const hasQuery = query.trim().length > 0;

  return (
    <div className="search-page">
      <SEO
        title="Search"
        description="Search The Maple Street Band's songs, shows, setlists, and lyrics all in one place."
      />
      <PageHeader title="Search" backTo="/" backLabel="← Home" />

      {/* ── Search input ────────────────────────────────────────────────── */}
      <div className="search-input-wrap">
        <span className="search-input-icon" aria-hidden="true">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          className="search-input"
          type="search"
          placeholder="Songs, shows, venues, lyrics…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          autoComplete="off"
          spellCheck={false}
          aria-label="Search"
        />
        {query && (
          <button
            className="search-clear-btn"
            onClick={() => setQuery("")}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {/* ── Results ─────────────────────────────────────────────────────── */}
      {hasQuery && !hasResults && <EmptyState query={query.trim()} />}

      {hasQuery && hasResults && (
        <div className="search-results">
          {/* Songs */}
          {songResults.length > 0 && (
            <section className="search-section">
              <SectionHeading count={songResults.length}>Songs</SectionHeading>
              <ul className="search-result-list">
                {songResults.map((song) => (
                  <li key={song.slug} className="search-result-item">
                    <SongResult song={song} query={query.trim()} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Shows */}
          {showResults.length > 0 && (
            <section className="search-section">
              <SectionHeading count={showResults.length}>Shows</SectionHeading>
              <ul className="search-result-list">
                {showResults.map((show) => (
                  <li key={show.slug} className="search-result-item">
                    <ShowResult show={show} query={query.trim()} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Lyrics */}
          {lyricResults.length > 0 && (
            <section className="search-section">
              <SectionHeading count={lyricResults.length}>
                Lyrics
              </SectionHeading>
              <ul className="search-result-list">
                {lyricResults.map((song) => (
                  <li key={song.slug} className="search-result-item">
                    <LyricResult song={song} query={query.trim()} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      {/* ── Idle state ──────────────────────────────────────────────────── */}
      {!hasQuery && (
        <div className="search-idle">
          <p className="search-idle-text">
            Search songs, shows, venues, cities, and lyrics.
          </p>
          <div className="search-idle-pills">
            {["Rafters", "Walks", "Athens", "original", "hey buddy"].map(
              (suggestion) => (
                <button
                  key={suggestion}
                  className="search-idle-pill"
                  onClick={() => setQuery(suggestion)}
                >
                  {suggestion}
                </button>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
