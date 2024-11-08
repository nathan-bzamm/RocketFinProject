import React from 'react'; // Import React to create React components
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Import routing components
import Home from './components/Home'; // Import the Home component
import Portfolio from './components/Portfolio'; // Import the Portfolio component
import Transactions from './components/Transactions'; // Import the Transactions component
import DetailedInstrument from './components/DetailedInstrument'; // Import the DetailedInstrument component
import './index.css'; // Import global CSS for styling

function App() {
  return (
      <Router>
        <div className="min-h-screen flex flex-col">
          {/* Navigation bar at the top */}
          <nav className="bg-gradient-to-r from-green-400 to-blue-500 p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
              <div className="text-black text-2xl font-bold">InvestoPro</div> {/* App logo/title */}
              <ul className="flex space-x-8">
                {/* Navigation links */}
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
              {/* Define routes for different pages */}
              <Route path="/" element={<Home />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/transactions" element={<Transactions />} />
              {/* Route for viewing a detailed instrument */}
              <Route path="/portfolio/:symbol" element={<DetailedInstrument />} />
            </Routes>
          </div>
        </div>
      </Router>
  );
}

export default App; // Export the App component as the default export
