import React, { useState, useEffect, ChangeEvent, useCallback } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Interface for StockData type
interface StockData {
    id: string;
    instrument: string;
    shares: number;
    market_value: number;
}

// Interface for Transaction type
interface Transaction {
    id: string;
    date: string;
    instrument: string;
    operation: 'buy' | 'sell';
    shares: number;
    price: number;
}

function Transactions() {
    const [symbol, setSymbol] = useState<string>('');
    const [selectedSymbol, setSelectedSymbol] = useState<string>('');
    const [suggestions, setSuggestions] = useState<StockData[]>([]);
    const [stockData, setStockData] = useState<StockData | null>(null);
    const [shares, setShares] = useState<number>(0);
    const [action, setAction] = useState<'buy' | 'sell'>('buy');

    // Debounced function to fetch suggestions
    const fetchSuggestions = useCallback(
        debounce(async () => {
            if (symbol.length > 1 && symbol !== selectedSymbol) {
                try {
                    const response = await axios.get<StockData[]>('http://localhost:8000/portfolio');
                    const matches = response.data.filter(stock =>
                        stock.instrument.toLowerCase().includes(symbol.toLowerCase())
                    );
                    setSuggestions(matches);
                } catch (error) {
                    console.error('Error fetching suggestions:', error);
                    toast.error('Failed to fetch suggestions.');
                }
            } else {
                setSuggestions([]);
            }
        }, 300),
        [symbol, selectedSymbol]
    );

    useEffect(() => {
        fetchSuggestions();
    }, [symbol, fetchSuggestions]);

    const handleSelectSuggestion = (selectedSymbol: string) => {
        setSymbol(selectedSymbol);
        setSelectedSymbol(selectedSymbol);
        setSuggestions([]);
        fetchStockData(selectedSymbol);
    };

    const fetchStockData = async (inputSymbol: string = symbol): Promise<StockData | void> => {
        try {
            const uppercaseSymbol = inputSymbol.toUpperCase();
            const response = await axios.get<StockData[]>(`http://localhost:8000/portfolio?instrument=${uppercaseSymbol}`);
            if (response.data.length > 0) {
                const data = response.data[0];
                setStockData(data);
                toast.success('Stock data fetched successfully!');
                return data;
            } else {
                toast.error('Stock data not found!');
                throw new Error('Stock data not found');
            }
        } catch (error) {
            console.error('Error fetching stock data:', error);
            toast.error('Failed to fetch stock data.');
            throw error;
        }
    };

    const handleTrade = async () => {
        if (!symbol) {
            toast.error('Please enter a valid ticker symbol.');
            return;
        }

        let currentStockData: StockData | null = stockData;

        if (!stockData || stockData.instrument !== symbol.toUpperCase()) {
            try {
                const fetchedData = await fetchStockData();
                if (fetchedData) {
                    currentStockData = fetchedData;
                } else {
                    return;
                }
            } catch {
                return;
            }
        }

        if (!currentStockData) {
            return;
        }

        if (action === 'sell' && shares > currentStockData.shares) {
            toast.error('You cannot sell more shares than you own.');
            return;
        }

        const newShares = action === 'buy' ? currentStockData.shares + shares : currentStockData.shares - shares;

        try {
            const transactionsResponse = await axios.get<Transaction[]>('http://localhost:8000/transactions');
            const maxId = transactionsResponse.data.length > 0
                ? Math.max(...transactionsResponse.data.map(t => parseInt(t.id, 10)))
                : 0;
            const newId = (maxId + 1).toString();

            await axios.post('http://localhost:8000/transactions', {
                id: newId,
                date: new Date().toISOString().split('T')[0],
                instrument: symbol,
                operation: action,
                shares: shares,
                price: currentStockData.market_value
            });

            await axios.patch(`http://localhost:8000/portfolio/${currentStockData.id}`, { shares: newShares });
            toast.success(`${action === 'buy' ? 'Bought' : 'Sold'} ${shares} shares successfully!`);
            setSymbol('');
            setSelectedSymbol('');
            setShares(0);
            setStockData(null);
        } catch (error) {
            console.error(`Error ${action === 'buy' ? 'buying' : 'selling'} shares:`, error);
            toast.error(`Failed to ${action === 'buy' ? 'buy' : 'sell'} shares.`);
        }
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
                        onChange={(e) => setAction(e.target.value as 'buy' | 'sell')}
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
