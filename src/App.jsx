import { useState } from "react";
import "./App.css";

function App() {
  return (
    <>
      <div className="hero-sky"></div>
      <div className="hero-background"></div>
      <div className="hero-clouds">
        <img src="/assets/hero-clouds.png"></img>
      </div>
      <div className="hero-logo">
        <img src="/assets/tour-logo.png" />
        <img src="/assets/tour-plane.png" />
      </div>
      <nav className="navbar">
        <ul>
          <li>Home</li>
          <li>Tour/Tix</li>
          <li>Merch</li>
          <li>Booking</li>
          <li>Gallery</li>
        </ul>
      </nav>
    </>
  );
}

export default App;
