import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Register the components with Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

function DetailedInstrument({ match }) {
    const [instrumentData, setInstrumentData] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const { symbol } = match.params;

    useEffect(() => {
        // Fetch instrument data
        axios.get(`http://localhost:8000/portfolio?instrument=${symbol}`)
            .then(response => {
                if (response.data.length > 0) {
                    setInstrumentData(response.data[0]);
                } else {
                    toast.error("Instrument data not found!");
                }
            })
            .catch(error => {
                console.error("Error fetching instrument data:", error);
                toast.error("Failed to fetch instrument data.");
            });

        // Fetch transactions for the selected instrument
        axios.get(`http://localhost:8000/transactions?instrument=${symbol}`)
            .then(response => {
                setTransactions(response.data);
            })
            .catch(error => {
                console.error("Error fetching transactions:", error);
                toast.error("Failed to fetch transactions.");
            });
    }, [symbol]);

    const renderGraph = () => {
        if (transactions.length === 0) {
            return <p className="text-gray-600">No transaction data available for this instrument.</p>;
        }

        const chartData = {
            labels: transactions.map(t => t.date),
            datasets: [
                {
                    label: `Price Trend for ${symbol}`,
                    data: transactions.map(t => t.price),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                    tension: 0.1 // Adds some smoothness to the line
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
                    {transactions.length > 0 && renderGraph()}
                </div>
            ) : (
                <p className="text-gray-600">Loading instrument data...</p>
            )}
        </div>
    );
}

export default DetailedInstrument;
