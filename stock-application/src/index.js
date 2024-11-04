import React from 'react'; // Import React library
import ReactDOM from 'react-dom'; // Import ReactDOM for rendering the app
import './index.css'; // Import global CSS styles
import App from './App'; // Import the main App component
import { ToastContainer } from 'react-toastify'; // Import ToastContainer for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import Toast styles

// Render the React application to the root element
ReactDOM.render(
    <React.StrictMode> {/* Enables strict mode to highlight potential issues */}
        <App /> {/* Main App component */}
        {/* ToastContainer for showing notifications */}
        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
    </React.StrictMode>,
    document.getElementById('root') // Target element for rendering the app
);
