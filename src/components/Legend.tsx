import { useState } from "react";
import '../styles/Legend.css';

function Legend() {
  const [showLegend, setShowLegend] = useState(false);

  return (
    <div className="wrapper">
      <button
        className="button"
        onClick={() => setShowLegend(prev => !prev)}
        title={showLegend ? "Close Legend" : "Open Legend"}
        >
        ℹ️
      </button>
      
      {showLegend && (
        <div className="content">
          <h3>Legend</h3>
          <p>
            The <strong>P</strong> transformation exchanges a triad for its <strong>P</strong>arallel. In a major tirad, move the third down a semitone, in a minor triad, move the third up a semitone.
          </p>
          <p>
            The <strong>L</strong> transformation (<em>Leittonwechsel</em>) is known as the <strong>L</strong>eading-Tone Exchange. In a major triad, move the root down a semitone, in a minor triad, move the fifth up a semitone.
          </p>
          <p>
            The <strong>R</strong> transformation exchanges a triad for its <strong>R</strong>elative. In a major triad, move the fifth up a whole tone, in a minor triad, move the root down a  whole tone.
          </p>
          {/* <p>
            The <strong>N</strong> transformation (<em>Nebenverwandt</em>) exchanges a major triad for its minor subdominant and a minor triad for its major dominant. This trandformation can be obtained by applying <strong>R</strong>, <strong>L</strong>, and <strong>P</strong> successively.
          </p>
          <p>
            The <strong>S</strong> transformation (<em>Slide</em>) exchanges two triads that share a third. This trandformation can be obtained by applying <strong>L</strong>, <strong>P</strong>, and <strong>R</strong> successively.
          </p> */}
        </div>
      )}
      </div>
  );
}

export default Legend;