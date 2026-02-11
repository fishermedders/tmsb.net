import "./Border.css";
export default function Border() {
  return (
    <div className="grainy-frame">
      <div className="frame-bar top"></div>
      <div className="frame-bar bottom"></div>
      <div className="frame-bar left"></div>
      <div className="frame-bar right"></div>
    </div>
  );
}
