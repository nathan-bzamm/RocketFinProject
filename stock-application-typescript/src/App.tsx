import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Portfolio from './components/Portfolio';
import Transactions from './components/Transactions';
import DetailedInstrument from './components/DetailedInstrument';

function App() {
  return (
      <Router>
        <div className="min-h-screen flex flex-col">
          <nav className="bg-gradient-to-r from-green-400 to-blue-500 p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
              <div className="text-black text-2xl font-bold">InvestoPro</div>
              <ul className="flex space-x-8">
                <li><a href="/" className="text-gray-800 hover:text-white transition duration-200">Home</a></li>
                <li><a href="/portfolio" className="text-gray-800 hover:text-white transition duration-200">Portfolio</a></li>
                <li><a href="/transactions" className="text-gray-800 hover:text-white transition duration-200">Transactions</a></li>
              </ul>
            </div>
          </nav>

          <div className="container mx-auto my-8 p-6 bg-white custom-shadow rounded-lg">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/portfolio/:symbol" element={<DetailedInstrument />} />
            </Routes>
          </div>
        </div>
      </Router>
  );
}

export default App;
