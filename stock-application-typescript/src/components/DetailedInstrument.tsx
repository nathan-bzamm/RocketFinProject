import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

// Define types for data
interface InstrumentData {
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
    operation: 'buy' | 'sell';
    shares: number;
    price: number;
}

function DetailedInstrument() {
    const { symbol } = useParams<{ symbol: string }>(); // Extract symbol from URL params
    const [instrumentData, setInstrumentData] = useState<InstrumentData | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const fetchInstrumentData = async () => {
            try {
                const response = await axios.get<InstrumentData[]>(`http://localhost:8000/portfolio?instrument=${symbol}`);
                if (response.data.length > 0) {
                    setInstrumentData(response.data[0]);
                } else {
                    toast.error("Instrument data not found!");
                }
            } catch (error) {
                console.error("Error fetching instrument data:", error);
                toast.error("Failed to fetch instrument data.");
            }
        };

        const fetchTransactions = async () => {
            try {
                const response = await axios.get<Transaction[]>(`http://localhost:8000/transactions?instrument=${symbol}`);
                setTransactions(response.data);
            } catch (error) {
                console.error("Error fetching transactions:", error);
                toast.error("Failed to fetch transactions.");
            }
        };

        fetchInstrumentData();
        fetchTransactions();
    }, [symbol]);

    const renderGraph = () => {
        if (transactions.length === 0) {
            return <p className="text-gray-600">No transaction data available for this instrument.</p>;
        }

        const chartData = {
            labels: transactions.map((t) => t.date),
            datasets: [
                {
                    label: `Price Trend for ${symbol}`,
                    data: transactions.map((t) => t.price),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                    tension: 0.1,
                },
            ],
        };

        return (
            <div>
                <h3 className="text-2xl font-bold mb-4">Price Trend</h3>
                <Line data={chartData} />
            </div>
        );
    };

    return (
        <div>
            {instrumentData ? (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-3xl font-bold mb-4">{instrumentData.instrument} Details</h2>
                    <p><strong>Shares Owned:</strong> {instrumentData.shares}</p>
                    <p><strong>Cost Basis:</strong> ${instrumentData.cost_basis}</p>
                    <p><strong>Market Value:</strong> ${instrumentData.market_value}</p>
                    <p><strong>Unrealized Return Rate:</strong> {instrumentData.unrealized_return_rate}%</p>
                    <p><strong>Unrealized Profit/Loss:</strong> ${instrumentData.unrealized_profit_loss}</p>
                    {renderGraph()}
                </div>
            ) : (
                <p className="text-gray-600">Loading instrument data...</p>
            )}
        </div>
    );
}

export default DetailedInstrument;
