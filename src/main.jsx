import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Border from "./components/Border.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Border />
      <App />
    </BrowserRouter>
  </StrictMode>,
);
