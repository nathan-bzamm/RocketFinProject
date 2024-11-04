import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Portfolio() {
    const [portfolio, setPortfolio] = useState([]);
    const [selectedInstrument, setSelectedInstrument] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [viewType, setViewType] = useState('graph');
    const [sortOption, setSortOption] = useState('');
    const [operationFilter, setOperationFilter] = useState('all');
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8000/portfolio')
            .then(response => {
                setPortfolio(response.data);
            })
            .catch(error => {
                console.error("Error fetching portfolio data:", error);
                toast.error("Failed to fetch portfolio data.");
            });

        axios.get('http://localhost:8000/transactions')
            .then(response => {
                setTransactions(response.data);
            })
            .catch(error => {
                console.error("Error fetching transactions:", error);
                toast.error("Failed to fetch transactions.");
            });
    }, []);

    const handleInstrumentClick = (instrument) => {
        setSelectedInstrument(instrument);
        filterTransactions(instrument, sortOption, operationFilter, dateRange);
        setViewType('graph');
    };

    const handleDateRangeChange = (e) => {
        const { name, value } = e.target;
        setDateRange(prevRange => ({ ...prevRange, [name]: value }));
        filterTransactions(selectedInstrument, sortOption, operationFilter, { ...dateRange, [name]: value });
    };

    const filterTransactions = (instrument, sortOption, operationFilter, dateRange) => {
        let filtered = transactions.filter(t => t.instrument === instrument);

        // Apply operation filter
        if (operationFilter !== 'all') {
            filtered = filtered.filter(t => t.operation === operationFilter);
        }

        // Apply date range filter
        if (dateRange.startDate) {
            filtered = filtered.filter(t => new Date(t.date) >= new Date(dateRange.startDate));
        }
        if (dateRange.endDate) {
            filtered = filtered.filter(t => new Date(t.date) <= new Date(dateRange.endDate));
        }

        // Apply sorting
        if (sortOption === 'date-asc') {
            filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (sortOption === 'date-desc') {
            filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortOption === 'price-asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'price-desc') {
            filtered.sort((a, b) => b.price - a.price);
        }

        setFilteredTransactions(filtered);
    };

    const handleSortChange = (e) => {
        const option = e.target.value;
        setSortOption(option);
        filterTransactions(selectedInstrument, option, operationFilter, dateRange);
    };

    const handleOperationFilterChange = (e) => {
        const filter = e.target.value;
        setOperationFilter(filter);
        filterTransactions(selectedInstrument, sortOption, filter, dateRange);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredPortfolio = portfolio.filter(item =>
        item.instrument.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderGraph = () => {
        if (filteredTransactions.length === 0) {
            return <p className="text-gray-600">No transaction data available for this instrument.</p>;
        }

        const chartData = {
            labels: filteredTransactions.map(t => t.date),
            datasets: [
                {
                    label: `Price Trend for ${selectedInstrument}`,
                    data: filteredTransactions.map(t => t.price),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                    tension: 0.1
                }
            ]
        };

        return (
            <div>
                <h3 className="text-2xl font-bold mb-4">Price Trend</h3>
                <Line data={chartData} />
            </div>
        );
    };

    const renderTransactionHistory = () => (
        <div className="overflow-x-auto">
            <h3 className="text-2xl font-bold mb-4">Transaction History for {selectedInstrument}</h3>
            <label className="block text-gray-700 font-medium mb-2">Sort by:</label>
            <select
                value={sortOption}
                onChange={handleSortChange}
                className="mb-4 p-2 border border-gray-300 rounded"
            >
                <option value="">Select an option</option>
                <option value="date-asc">Date (Oldest to Newest)</option>
                <option value="date-desc">Date (Newest to Oldest)</option>
                <option value="price-asc">Price (Lowest to Highest)</option>
                <option value="price-desc">Price (Highest to Lowest)</option>
            </select>
            <label className="block text-gray-700 font-medium mb-2">Filter by Operation:</label>
            <select
                value={operationFilter}
                onChange={handleOperationFilterChange}
                className="mb-4 p-2 border border-gray-300 rounded"
            >
                <option value="all">All</option>
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
            </select>
            <label className="block text-gray-700 font-medium mb-2">Date Range:</label>
            <div className="flex gap-4 mb-4">
                <input
                    type="date"
                    name="startDate"
                    value={dateRange.startDate}
                    onChange={handleDateRangeChange}
                    className="p-2 border border-gray-300 rounded"
                />
                <input
                    type="date"
                    name="endDate"
                    value={dateRange.endDate}
                    onChange={handleDateRangeChange}
                    className="p-2 border border-gray-300 rounded"
                />
            </div>
            {filteredTransactions.length > 0 ? (
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
                    {filteredTransactions.map((transaction, index) => (
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
                <p className="text-gray-600 mt-4">No transactions found for {selectedInstrument}.</p>
            )}
        </div>
    );

    return (
        <div>
            <h2 className="text-3xl font-bold mb-4">Portfolio</h2>
            <label className="block text-gray-700 font-medium mb-2">Search Instrument:</label>
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by instrument"
                className="mb-4 p-2 border border-gray-300 rounded w-full"
            />
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {filteredPortfolio.map((item) => (
                    <div
                        key={item.instrument}
                        className="bg-white p-4 shadow rounded-lg cursor-pointer hover:bg-gray-100"
                        onClick={() => handleInstrumentClick(item.instrument)}
                    >
                        <h3 className="text-xl font-semibold">{item.instrument}</h3>
                        <p><strong>Shares Owned:</strong> {item.shares}</p>
                        <p><strong>Cost Basis:</strong> ${item.cost_basis}</p>
                        <p><strong>Market Value:</strong> ${item.market_value}</p>
                        <p><strong>Unrealized Return Rate:</strong> {item.unrealized_return_rate}%</p>
                        <p><strong>Unrealized Profit/Loss:</strong> ${item.unrealized_profit_loss}</p>
                    </div>
                ))}
            </div>

            {selectedInstrument && (
                <div className="mt-8">
                    <div className="flex justify-between mb-4">
                        <h3 className="text-2xl font-bold">Details for {selectedInstrument}</h3>
                        <button
                            onClick={() => setViewType(viewType === 'graph' ? 'history' : 'graph')}
                            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
                        >
                            Toggle to {viewType === 'graph' ? 'Transaction History' : 'Graph View'}
                        </button>
                    </div>
                    {viewType === 'graph' ? renderGraph() : renderTransactionHistory()}
                </div>
            )}
        </div>
    );
}

export default Portfolio;