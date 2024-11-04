import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Type definition for portfolio items
interface PortfolioItem {
    id: string;
    instrument: string;
    shares: number;
    cost_basis: number;
    market_value: number;
    unrealized_return_rate: number;
    unrealized_profit_loss: number;
}

// Type definition for transaction items
interface Transaction {
    id: string;
    date: string;
    instrument: string;
    operation: 'buy' | 'sell';
    shares: number;
    price: number;
}

function Home(): JSX.Element {
    // State for storing portfolio data
    const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
    // State for storing recent transactions
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        // Fetch portfolio data
        axios.get<PortfolioItem[]>('http://localhost:8000/portfolio')
            .then(response => {
                setPortfolio(response.data);
            })
            .catch(error => {
                console.error("Error fetching portfolio data:", error);
                toast.error("Failed to fetch portfolio data.");
            });

        // Fetch transactions data and get the 5 most recent ones
        axios.get<Transaction[]>('http://localhost:8000/transactions')
            .then(response => {
                const sortedTransactions = response.data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setRecentTransactions(sortedTransactions.slice(0, 5));
            })
            .catch(error => {
                console.error("Error fetching transactions:", error);
                toast.error("Failed to fetch transactions.");
            });
    }, []);

    // Calculate total market value and total profit/loss for the portfolio status
    const totalMarketValue = portfolio.reduce((total, item) => total + item.market_value, 0);
    const totalProfitLoss = portfolio.reduce((total, item) => total + item.unrealized_profit_loss, 0);

    return (
        <div>
            <h2 className="text-3xl font-bold mb-4">Portfolio Status</h2>
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <p><strong>Total Market Value:</strong> ${totalMarketValue.toFixed(2)}</p>
                <p><strong>Total Unrealized Profit/Loss:</strong> ${totalProfitLoss.toFixed(2)}</p>
                <p><strong>Number of Positions:</strong> {portfolio.length}</p>
            </div>

            <h2 className="text-3xl font-bold mb-4">Recent Transactions</h2>
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
                            <tr key={transaction.id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
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
                                            {transaction.operation.charAt(0).toUpperCase() + transaction.operation.slice(1)}
                                        </span>
                                </td>
                                <td className="p-3">{transaction.shares}</td>
                                <td className="p-3">${transaction.price.toFixed(2)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-600 mt-4">No recent transactions available.</p>
                )}
            </div>
        </div>
    );
}

export default Home;
