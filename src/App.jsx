import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Tour from "./pages/Tour.jsx";
import ShowDetail from "./pages/ShowDetail.jsx";
import Gallery from "./pages/Gallery.jsx";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About.jsx";
import Merch from "./pages/Merch.jsx";

function App() {
  return (
    <div className="stage">
      <section className="hero">
        <div className="hero-sky-area">
          <div className="hero-clouds">
            <img src="/assets/hero-clouds.png" alt="" />
          </div>
          <img
            className="hero-logo"
            src="/assets/tour-logo.png"
            alt="Tour logo"
          />
          <img
            className="hero-plane"
            src="/assets/tour-plane.png"
            alt="Tour plane"
          />
        </div>
      </section>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tour" element={<Tour />} />
          <Route path="/tour/:slug" element={<ShowDetail />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/merch" element={<Merch />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
