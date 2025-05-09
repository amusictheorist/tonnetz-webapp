import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Tonnetz from './components/Tonnetz';
import './App.css';
import { TriangleGrid } from './components/TriangleGrid';

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Navbar />
        <main className="h-screen w-screen overflow-hidden">
          <Routes>
            <Route path='/' element={<TriangleGrid />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App;
