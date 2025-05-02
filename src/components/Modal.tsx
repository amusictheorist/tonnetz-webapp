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
            <h2>Welcome to amusictheorist's Transformational Tonnetz!</h2>
            <p>
              Click triads to select them and check "Show Transformations" box to view Neo-Riemannian transformations P, L, R, N, S, and H on the Tonnetz.
            </p>
            <p>
              Hold <strong>Ctrl</strong> and scroll to zoom, or use zoom slider on the right.
            </p>
            <p>
              Draw path mode: check box to toggle mode, then select other triads to draw a transformational path on the Tonnetz.
            </p>
            <p>
              Diagonals moving from Southwest to Northeast represent Hexatonic Cycles, or PL chains.
            </p>
            <p>
              Diagonals moving from Northwest to Southeast represent Octatonic Cycles, or PR chains.
            </p>
            <p>
              Horizontal movement represents movement by ascending or falling fifths through diatonic mediants, or RL chains.
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