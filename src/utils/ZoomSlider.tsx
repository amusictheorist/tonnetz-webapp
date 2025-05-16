// import { ZoomSliderProps } from "../types/types";
// import { maxZoom, minZoom } from "./constants";
// import '../styles/ZoomSlider.css';

// const ZoomSlider: React.FC<ZoomSliderProps> = ({ zoom, setZoom }) => {
//   const handleZoom = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setZoom(parseFloat(e.target.value));
//   };

//   return (
//     <div className="slider" >
//       <label>
//         Zoom: {((zoom - minZoom) / (maxZoom - minZoom) * 100).toFixed(0)}%
//       </label>
//       <input
//         className="input"
//         type="range"
//         min={minZoom}
//         max={maxZoom}
//         step="0.01"
//         value={zoom}
//         onChange={handleZoom}
//       />
//     </div>
//   );
// };

// export default ZoomSlider;