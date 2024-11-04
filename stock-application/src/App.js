import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Portfolio from './components/Portfolio';
import Transactions from './components/Transactions';
import DetailedInstrument from './components/DetailedInstrument'; // Import the new component
import './index.css';  // Import global CSS

function App() {
  return (
      <Router>
        <div className="min-h-screen flex flex-col">
          {/* Modern navigation bar */}
          <nav className="bg-gradient-to-r from-green-400 to-blue-500 p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
              <div className="text-black text-2xl font-bold">InvestoPro</div>
              <ul className="flex space-x-8">
                <li>
                  <Link to="/" className="text-gray-800 hover:text-white transition duration-200">Home</Link>
                </li>
                <li>
                  <Link to="/portfolio" className="text-gray-800 hover:text-white transition duration-200">Portfolio</Link>
                </li>
                <li>
                  <Link to="/transactions" className="text-gray-800 hover:text-white transition duration-200">Transactions</Link>
                </li>
              </ul>
            </div>
          </nav>

          {/* Main content container */}
          <div className="container mx-auto my-8 p-6 bg-white custom-shadow rounded-lg">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/portfolio/:symbol" element={<DetailedInstrument />} /> {/* New route */}
            </Routes>
          </div>
        </div>
      </Router>
  );
}

export default App;
