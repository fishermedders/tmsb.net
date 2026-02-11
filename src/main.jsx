import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Border from "./components/Border.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <>
      <Border />
      <App />
    </>
  </StrictMode>,
);
