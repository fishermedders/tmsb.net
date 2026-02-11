import "./Home.css";

export default function Home() {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <a href="/tour">Tour/Tix</a>
        </li>
        <li>
          <a href="/merch">Merch</a>
        </li>
        <li>
          <a href="/contact">Contact</a>
        </li>
        <li>
          <a href="/gallery">Gallery</a>
        </li>
      </ul>
    </nav>
  );
}
