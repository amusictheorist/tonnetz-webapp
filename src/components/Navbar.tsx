import { useState } from "react";
import '../styles/Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <h2 className="logo">Neo-Riemannian Tonnetz Transformations</h2>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
      ☰
      </button>
    </nav>
  )
}

export default Navbar;