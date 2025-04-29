import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Tonnetz from './components/Tonnetz';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path='/' element={<Tonnetz />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App;
