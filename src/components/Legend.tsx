import { useState } from "react";
import PImage from '../assets/PImage.png';
import LImage from '../assets/LImage.png';
import RImage from '../assets/RImage.png';

function Legend() {
  const [showLegend, setShowLegend] = useState(false);

  return (
    <div className="relative p-4">
      <button
        onClick={() => setShowLegend(prev => !prev)}
        title={showLegend ? "Close Legend" : "Open Legend"}
        className="fixed bottom-5 left-5 px-2 py-1 text-sm rounded border border-gray-300 bg-white shadow-sm z-[1000] hover:bg-gray-100 cursor-pointer"
        >
        ℹ️
      </button>
      
      {showLegend && (
        <div className="fixed bottom-16 left-5 w-[350px] bg-gray-50 p-4 border border-gray-300 rounded-lg shadow-md z-[1000]">
          <h3 className="text-lg font-semibold mb-2">Legend</h3>
          <p className="mb-2">
            The <strong>P</strong> transformation exchanges a triad for its <strong>P</strong>arallel. In a major tirad, move the third down a semitone, in a minor triad, move the third up a semitone.
          </p>
          <img
            src={PImage}
            alt="P transformation"
            className="block mx-auto my-2 max-w-[100px] border border-gray-300 rounded"
          />
          <p className="mb-2">
            The <strong>L</strong> transformation (<em>Leittonwechsel</em>) is known as the <strong>L</strong>eading-Tone Exchange. In a major triad, move the root down a semitone, in a minor triad, move the fifth up a semitone.
          </p>
          <img
            src={LImage}
            alt="L transformation"
            className="block mx-auto my-2 max-w-[150px] border border-gray-300 rounded"
          />
          <p className="mb-2">
            The <strong>R</strong> transformation exchanges a triad for its <strong>R</strong>elative. In a major triad, move the fifth up a whole tone, in a minor triad, move the root down a  whole tone.
          </p>
          <img
            src={RImage}
            alt="R transformation"
            className="block mx-auto my-2 max-w-[150px] border border-gray-300 rounded"
          />
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