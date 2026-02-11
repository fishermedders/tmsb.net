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
    </>
  );
}

export default App;
