import React, { useState, useEffect } from 'react'; // Import React and hooks
import axios from 'axios'; // Import axios for HTTP requests
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'; // Import Chart.js components
import { Line } from 'react-chartjs-2'; // Import Line chart from react-chartjs-2
import { toast } from 'react-toastify'; // Import toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

// Register the necessary Chart.js components
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
    // State variables for instrument and transaction data
    const [instrumentData, setInstrumentData] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const { symbol } = match.params; // Get the instrument symbol from the route parameters

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
    }, [symbol]); // Re-run the effect when the symbol changes

    // Function to render the price trend chart
    const renderGraph = () => {
        if (transactions.length === 0) {
            return <p className="text-gray-600">No transaction data available for this instrument.</p>;
        }

        // Prepare chart data using transactions
        const chartData = {
            labels: transactions.map(t => t.date), // Dates for x-axis
            datasets: [
                {
                    label: `Price Trend for ${symbol}`,
                    data: transactions.map(t => t.price), // Prices for y-axis
                    borderColor: 'rgba(75, 192, 192, 1)', // Line color
                    backgroundColor: 'rgba(75, 192, 192, 0.2)', // Background fill color
                    fill: true,
                    tension: 0.1 // Smooth line curve
                }
            ]
        };

        return (
            <div>
                <h3 className="text-2xl font-bold mb-4">Price Trend</h3>
                <Line data={chartData} /> {/* Render the Line chart */}
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
                    {transactions.length > 0 && renderGraph()} {/* Show graph if transactions exist */}
                </div>
            ) : (
                <p className="text-gray-600">Loading instrument data...</p> // Display while loading data
            )}
        </div>
    );
}

export default DetailedInstrument; // Export the DetailedInstrument component
