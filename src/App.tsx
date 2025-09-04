import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Tonnetz } from './components/Tonnetz';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <main>
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
