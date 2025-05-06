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
              Click triads to select them and check "Show Transformations" box to view Neo-Riemannian transformations <strong>P</strong>, <strong>L</strong>, <strong>R</strong>, <strong>N</strong>, and <strong>S</strong> on the Tonnetz.
            </p>
            <p>
              Hold <strong>Ctrl</strong> and scroll to zoom, or use zoom slider on the right.
            </p>
            <p>
              Draw path mode: check box to toggle mode, then select other triads to draw a transformational path on the Tonnetz.
            </p>
            <p>
              Diagonals moving from Southwest to Northeast represent Hexatonic Cycles, or <strong>PL</strong> chains.
            </p>
            <p>
              Diagonals moving from Northwest to Southeast represent Octatonic Cycles, or <strong>PR</strong> chains.
            </p>
            <p>
              Horizontal movement represents movement by ascending or falling fifths through diatonic mediants, or <strong>RL</strong> chains.
            </p>
            <button className='button' onClick={() => setShowModal(false)} >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
  
export default Modal;