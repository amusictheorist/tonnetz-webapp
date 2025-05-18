import { useEffect, useState } from 'react';
import '../styles/Modal.css';

function Modal() {
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    setShowModal(true);
  }, []);

  return (
    <>
      {showModal && (
        <div className="container">
          <div className='content'>
            <h2>Welcome to amusictheorist's Transformational <em>Tonnetz!</em></h2>
            <p>
              Click triads to select them and check "Show Transformations" box to view Neo-Riemannian transformations <strong>P</strong>, <strong>L</strong>, and <strong>R</strong> on the Tonnetz.
            </p>
            <p>
              Draw path mode: check box to toggle mode, then select other triads to draw a transformational path on the Tonnetz.
            </p>
            <p>
              Shortest path mode: check box to toggle mode, then input starting triad and target triad to find the shortest <strong>PLR</strong> path between them on the Tonnetz. If multiple paths are equally short, all are shown.
            </p>
            <p>
              Diagonals moving from Southwest to Northeast represent Hexatonic Cycles, or <strong>PL</strong> chains. These can be highlighted by checking "major thirds" in the axis dropdown.
            </p>
            <p>
              Diagonals moving from Northwest to Southeast represent Octatonic Cycles, or <strong>PR</strong> chains. These can be highlighted by checking "minor thirds" in the axis dropdown.
            </p>
            <p>
              Horizontal movement represents movement by ascending or falling fifths through diatonic mediants, or <strong>RL</strong> chains. These can be highlighted by checking "fifths" in the axis dropdown.
            </p>
            <button className='modal-button' onClick={() => setShowModal(false)} >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
  
export default Modal;