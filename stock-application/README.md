# InvestoPro - Stock Portfolio Management Tool

InvestoPro is a web-based tool that allows individual investors to manage and track their investments. Users can view their portfolio, trade securities, and analyze their transaction history. The tool features a modern user interface with interactive charts and data visualizations.

## Features
- View and analyze your investment portfolio
- Trade securities by buying or selling shares
- Search for and view detailed information about specific stocks
- Interactive charts showcasing price trends for each stock
- Recent transactions overview on the homepage
- Modern and responsive design using React and Tailwind CSS


## Prerequisites
- [Node.js](https://nodejs.org/) (version 14 or above)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [json-server](https://github.com/typicode/json-server) for running the mock API

## Getting Started

### 1. Clone the Repository

git clone https://github.com/nathan-bzamm/RocketFinProject/InvestoPro.git cd InvestoPro

### 2. Install Dependencies
Ensure you are in the project root directory, then run:

npm install

### 3. Start the JSON Server
Run the JSON server to serve the data from `db.json`:

npx json-server --watch db.json --port 8000

This will start a mock server at `http://localhost:8000`.

### 4. Start the React Application
Open a new terminal window/tab, navigate to the project root, and run:

npm start

This command will start the React development server at `http://localhost:3000`.

### 5. Access the Application
Once the React server and JSON server are running, open your browser and go to: `http://localhost:3000`.


## Usage
- Navigate to the homepage to view your portfolio's current status and the most recent transactions.
- Visit the Portfolio page to see all positions you hold and click on any stock to view its detailed price trend and transaction history.
- Use the Transactions page to buy or sell shares of any stock. Enter a ticker symbol, specify the number of shares, and choose an action (buy/sell).

## Technologies Used
- **Frontend**: React, Tailwind CSS
- **Mock Backend**: JSON Server
- **Charting Library**: Chart.js (react-chartjs-2)
- **State Management**: React hooks and component state
- **Notification Library**: react-toastify

## Project Requirements Met
- Navigation bar with links to the homepage, portfolio page, and transaction page.
- The homepage displays the portfolio status and the 5 most recent transactions.
- The portfolio page shows all positions, cost basis, market value, unrealized return rate, and profit/loss.
- Transaction page with ticker search and the ability to buy/sell shares.
- Error handling and validations for user inputs.

## Troubleshooting
- **Port Issues**: Ensure no other services are running on ports `8000` or `3000`.
- **Data Not Updating**: If changes do not appear, clear your browser cache or restart the JSON server and React app.

## Future Enhancements
- Add user authentication for a more secure experience.
- Integrate with a live stock market API for real-time data.
- Improve the data visualization with more advanced charts and analytics.

## Contact
For questions or suggestions, please reach out to:
- Your Name: [YourEmail@example.com](mailto:YourEmail@example.com)



