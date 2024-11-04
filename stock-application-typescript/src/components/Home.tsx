import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface PortfolioItem {
    id: string;
    instrument: string;
    shares: number;
    cost_basis: number;
    market_value: number;
    unrealized_return_rate: number;
    unrealized_profit_loss: number;
}

interface Transaction {
    id: string;
    date: string;
    instrument: string;
    operation: string;
    shares: number;
    price: number;
}

function Home() {
    const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

    // Fetch data from the server
    const fetchData = async (url: string) => {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
            throw error;
        }
    };

    useEffect(() => {
        const getPortfolioData = async () => {
            try {
                const data = await fetchData('http://localhost:8000/portfolio');
                setPortfolio(data as PortfolioItem[]); // Ensure type casting for TypeScript
            } catch {
                toast.error("Failed to fetch portfolio data.");
            }
        };

        const getRecentTransactions = async () => {
            try {
                const data = await fetchData('http://localhost:8000/transactions');
                const sortedTransactions = (data as Transaction[]).sort(
                    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                setRecentTransactions(sortedTransactions.slice(0, 5));
            } catch {
                toast.error("Failed to fetch transactions.");
            }
        };

        getPortfolioData();
        getRecentTransactions();
    }, []);

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
                            <tr
                                key={transaction.id}
                                className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
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
