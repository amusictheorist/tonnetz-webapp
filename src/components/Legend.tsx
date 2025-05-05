import { useState } from "react";

function Legend() {
  const [showLegend, setShowLegend] = useState(false);

  return (
    <div style={{ position: "relative", padding: 16 }}>
      <button
        onClick={() => setShowLegend(prev => !prev)}
        style={{
          position: "fixed",
          bottom: 20,
          left: 20,
          padding: "6px 10px",
          fontSize: 14,
          borderRadius: 4,
          border: "1px solid #ccc",
          background: "#fff",
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          zIndex: 1000
        }}
        title={showLegend ? "Close Legend" : "Open Legend"}
        >
        ℹ️
      </button>
      
      {showLegend && (
        <div style={{
          position: "fixed",
          bottom: 60,
          left: 20,
          width: 350,
          background: "#f9f9f9",
          padding: "16px",
          border: "1px solid #ccc",
          borderRadius: 8,
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          zIndex: 1000
        }}>
          <h3>Legend</h3>
          <p>
            The <strong>P</strong> transformation exchanges a triad for its <strong>P</strong>arallel. In a major tirad, move the third down a semitone, in a minor triad, move the third up a semitone.
          </p>
          <p>
            The <strong>L</strong> transformation (<em>Leittonwechsel</em>) is known as the <strong>L</strong>eading-Tone Exchange. In a major triad, move the root down a semitone, in a minor triad, move the fifth up a semitone.
          </p>
          <p>
            The <strong>R</strong> transformation exchanges a triad for its <strong>R</strong>elative. In a major tirad, move the fifth up a whole tone, in a minor triad, move the root down a  whole tone.
          </p>
          <p>
            The <strong>N</strong> transformation (<em>Nebenverwandt</em>) exchanges a major triad for its minor subdominant and a minor triad for its major dominant. This trandformation can be obtained by applying <strong>R</strong>, <strong>L</strong>, and <strong>P</strong> successively.
          </p>
          <p>
            The <strong>S</strong> transformation (<em>Slide</em>) exchanges two triads that share a third. This trandformation can be obtained by applying <strong>L</strong>, <strong>P</strong>, and <strong>R</strong> successively.
          </p>
        </div>
      )}
      </div>
  );
}

export default Legend;