import { useEffect, useState } from 'react';

function Modal() {
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    setShowModal(true);
  }, []);

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
          <div className='bg-white p-8 rounded-xl max-w-lg w-full text-left shadow-md flex flex-col max-h-[80vh] overflow-y-auto'>
            <h2 className='text-xl font-semibold mb-4'>
              Welcome to amusictheorist's Transformational <em>Tonnetz!</em>
            </h2>
            <p className='mb-2'>
              Click triads to select them and check "Show Transformations" box to view Neo-Riemannian transformations <strong>P</strong>, <strong>L</strong>, and <strong>R</strong> on the Tonnetz.
            </p>
            <p className='mb-2'>
              Draw path mode: check box to toggle mode, then select other triads to draw a transformational path on the Tonnetz.
            </p>
            <p className='mb-2'>
              Shortest path mode: check box to toggle mode, then input starting triad and target triad to find the shortest <strong>PLR</strong> path between them on the Tonnetz. If multiple paths are equally short, all are shown.
            </p>
            <p className='mb-2'>
              Diagonals moving from Southwest to Northeast represent Hexatonic Cycles, or <strong>PL</strong> chains. These can be highlighted by checking "major thirds" in the axis dropdown.
            </p>
            <p>
              Diagonals moving from Northwest to Southeast represent Octatonic Cycles, or <strong>PR</strong> chains. These can be highlighted by checking "minor thirds" in the axis dropdown.
            </p>
            <p className='mb-2'>
              Horizontal movement represents movement by ascending or falling fifths through diatonic mediants, or <strong>RL</strong> chains. These can be highlighted by checking "fifths" in the axis dropdown.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className='mt-4 self-center px-4 py-2 rounded-md bg-neutral-700 text-white hover:bg-gray-800 cursor-pointer'
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
  
export default Modal;