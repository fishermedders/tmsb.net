import { useState } from "react";
import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";

function NavigationWrapper() {
  const location = useLocation();

  return (
    <>
      {/* This div only shows if the path is NOT "/" */}
      {location.pathname !== "/" && (
        <div className="back-button">
          <a href="/">← Back to Home</a>
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <>
      <div className="stage">
        <div className="hero-sky"></div>
        <div className="hero-clouds">
          <img src="/assets/hero-clouds.png"></img>
        </div>
        <div className="hero-logo">
          <img src="/assets/tour-logo.png" />
          <img src="/assets/tour-plane.png" />
        </div>
        <NavigationWrapper />
        <main>
          <h1>hello</h1>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
