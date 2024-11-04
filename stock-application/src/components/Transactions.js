import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Transactions() {
    const [symbol, setSymbol] = useState("");
    const [selectedSymbol, setSelectedSymbol] = useState(""); // Track the selected symbol
    const [suggestions, setSuggestions] = useState([]);
    const [stockData, setStockData] = useState(null);
    const [shares, setShares] = useState(0);
    const [action, setAction] = useState("buy");

    // Debounced function to fetch suggestions
    const fetchSuggestions = debounce(() => {
        if (symbol.length > 1 && symbol !== selectedSymbol) {
            axios.get(`http://localhost:8000/portfolio`)
                .then(response => {
                    const matches = response.data.filter(stock => stock.instrument.toLowerCase().includes(symbol.toLowerCase()));
                    setSuggestions(matches);
                })
                .catch(error => {
                    console.error("Error fetching suggestions:", error);
                    toast.error("Failed to fetch suggestions.");
                });
        } else {
            setSuggestions([]);
        }
    }, 300); // 300ms debounce

    useEffect(() => {
        if (symbol !== selectedSymbol) {
            fetchSuggestions();
        }
    }, [symbol]);

    const handleSelectSuggestion = (selectedSymbol) => {
        setSymbol(selectedSymbol);
        setSelectedSymbol(selectedSymbol); // Set the selected symbol
        setSuggestions([]); // Clear suggestions after selection
        fetchStockData(selectedSymbol);
    };

    const fetchStockData = (inputSymbol = symbol) => {
        setSuggestions([]); // Clear suggestions when fetching stock data
        const uppercaseSymbol = inputSymbol.toUpperCase();
        return axios.get(`http://localhost:8000/portfolio?instrument=${uppercaseSymbol}`)
            .then(response => {
                if (response.data.length > 0) {
                    setStockData(response.data[0]);
                    toast.success("Stock data fetched successfully!");
                    return response.data[0];
                } else {
                    toast.error("Stock data not found!");
                    throw new Error("Stock data not found");
                }
            })
            .catch(error => {
                console.error("Error fetching stock data:", error);
                toast.error("Failed to fetch stock data.");
                throw error;
            });
    };

    const handleTrade = async () => {
        if (!symbol) {
            toast.error("Please enter a valid ticker symbol.");
            return;
        }

        let currentStockData = stockData;

        // Fetch stock data if not already fetched
        if (!stockData || stockData.instrument !== symbol.toUpperCase()) {
            try {
                currentStockData = await fetchStockData();
            } catch {
                return; // Stop the function if fetching fails
            }
        }

        if (action === 'sell' && shares > currentStockData.shares) {
            toast.error("You cannot sell more shares than you own.");
            return;
        }

        const newShares = action === 'buy' ? currentStockData.shares + shares : currentStockData.shares - shares;

        // Find the next incremental ID for the transaction
        axios.get('http://localhost:8000/transactions')
            .then(response => {
                const maxId = response.data.length > 0 ? Math.max(...response.data.map(t => parseInt(t.id, 10))) : 0;
                const newId = (maxId + 1).toString();

                // Post the new transaction
                axios.post('http://localhost:8000/transactions', {
                    id: newId,
                    date: new Date().toISOString().split('T')[0],
                    instrument: symbol,
                    operation: action,
                    shares: shares,
                    price: currentStockData.market_value
                })
                    .then(() => {
                        axios.patch(`http://localhost:8000/portfolio/${currentStockData.id}`, { shares: newShares })
                            .then(() => {
                                toast.success(`${action === 'buy' ? 'Bought' : 'Sold'} ${shares} shares successfully!`);
                                setSymbol('');
                                setSelectedSymbol(''); // Reset selected symbol
                                setShares(0);
                                setStockData(null);
                            })
                            .catch(error => {
                                console.error("Error updating portfolio:", error);
                                toast.error("Failed to update portfolio.");
                            });
                    })
                    .catch(error => {
                        console.error(`Error ${action === 'buy' ? 'buying' : 'selling'} shares:`, error);
                        toast.error(`Failed to ${action === 'buy' ? 'buy' : 'sell'} shares.`);
                    });
            })
            .catch(error => {
                console.error("Error fetching transactions for ID generation:", error);
            });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-4">Trade Securities</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4 relative">
                    <label className="block text-gray-700 font-medium">Ticker Symbol</label>
                    <input
                        type="text"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded mt-1 focus:border-blue-500 focus:outline-none"
                        placeholder="e.g., AAPL"
                    />
                    {suggestions.length > 0 && (
                        <ul className="absolute bg-white border border-gray-300 rounded mt-1 w-full max-h-40 overflow-y-auto z-10">
                            {suggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleSelectSuggestion(suggestion.instrument)}
                                >
                                    {suggestion.instrument}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {stockData && (
                    <div className="mt-4 p-4 bg-gray-100 rounded">
                        <p><strong>Instrument:</strong> {stockData.instrument}</p>
                        <p><strong>Current Market Value:</strong> ${stockData.market_value}</p>
                    </div>
                )}
                <div className="mb-4 mt-4">
                    <label className="block text-gray-700 font-medium">Quantity</label>
                    <input
                        type="number"
                        value={shares}
                        onChange={(e) => setShares(Number(e.target.value))}
                        className="w-full p-3 border border-gray-300 rounded mt-1 focus:border-blue-500 focus:outline-none"
                        placeholder="Enter number of shares"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Action</label>
                    <select
                        value={action}
                        onChange={(e) => setAction(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded mt-1 focus:border-blue-500 focus:outline-none"
                    >
                        <option value="buy">Buy</option>
                        <option value="sell">Sell</option>
                    </select>
                </div>
                <button
                    onClick={handleTrade}
                    className="w-full bg-blue-500 text-white p-3 rounded-lg mt-4 hover:bg-blue-600 transition duration-200"
                >
                    {action === 'buy' ? 'Buy Shares' : 'Sell Shares'}
                </button>
            </div>
        </div>
    );
}

export default Transactions;
