import React, { useState, useEffect } from 'react'; // Import React and hooks for state and side effects
import axios from 'axios'; // Import axios for HTTP requests
import { toast } from 'react-toastify'; // Import toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

function Home() {
    // State variables for portfolio data and recent transactions
    const [portfolio, setPortfolio] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);

    // Fetch data when the component mounts
    useEffect(() => {
        // Fetch portfolio data from the backend
        axios.get('http://localhost:8000/portfolio')
            .then(response => {
                setPortfolio(response.data); // Set portfolio data
            })
            .catch(error => {
                console.error("Error fetching portfolio data:", error);
                toast.error("Failed to fetch portfolio data."); // Show error notification
            });

        // Fetch transaction data and display the 5 most recent transactions
        axios.get('http://localhost:8000/transactions')
            .then(response => {
                const sortedTransactions = response.data.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort transactions by date
                setRecentTransactions(sortedTransactions.slice(0, 5)); // Set the 5 most recent transactions
            })
            .catch(error => {
                console.error("Error fetching transactions:", error);
                toast.error("Failed to fetch transactions."); // Show error notification
            });
    }, []); // Empty dependency array means this runs once when the component mounts

    // Calculate the total market value and total profit/loss for the portfolio
    const totalMarketValue = portfolio.reduce((total, item) => total + item.market_value, 0);
    const totalProfitLoss = portfolio.reduce((total, item) => total + item.unrealized_profit_loss, 0);

    return (
        <div>
            <h2 className="text-3xl font-bold mb-4">Portfolio Status</h2>
            {/* Display portfolio summary */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <p><strong>Total Market Value:</strong> ${totalMarketValue.toFixed(2)}</p>
                <p><strong>Total Unrealized Profit/Loss:</strong> ${totalProfitLoss.toFixed(2)}</p>
                <p><strong>Number of Positions:</strong> {portfolio.length}</p>
            </div>

            <h2 className="text-3xl font-bold mb-4">Recent Transactions</h2>
            {/* Display recent transactions */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                {recentTransactions.length > 0 ? (
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                        <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="p-3 text-left text-gray-700 font-medium">Date</th>
                            <th className="p-3 text-left text-gray-700 font-medium">Instrument</th>
                            <th className="p-3 text-left text-gray-700 font-medium">Operation</th>
                            <th className="p-3 text-left text-gray-700 font-medium">Shares</th>
                            <th className="p-3 text-left text-gray-700 font-medium">Price ($)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {recentTransactions.map((transaction, index) => (
                            <tr
                                key={transaction.id}
                                className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`} // Alternate row colors
                            >
                                <td className="p-3">{transaction.date}</td>
                                <td className="p-3">{transaction.instrument}</td>
                                <td className="p-3">
                                        <span
                                            className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                                                transaction.operation === 'buy'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {transaction.operation.charAt(0).toUpperCase() + transaction.operation.slice(1)} {/* Capitalize operation */}
                                        </span>
                                </td>
                                <td className="p-3">{transaction.shares}</td>
                                <td className="p-3">${transaction.price.toFixed(2)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-600 mt-4">No recent transactions available.</p> // Message if no transactions are available
                )}
            </div>
        </div>
    );
}

export default Home; // Export the Home component
