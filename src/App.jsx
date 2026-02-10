import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>tmsb.net</h1>
      <p>
        Welcome to the future home of The Maple Street Band from Saint Simons
        Island, Ga. If you somehow stumbled upon this, it's a work in progress,
        and the new site will be up shortly.
      </p>
    </>
  );
}

export default App;
