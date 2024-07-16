import React, { useState, useEffect } from "react";
import InvestmentChart from "./InvestmentChart";

function InvestmentSimulator({ expenses, stockData, stockSymbol }) {
  const [investmentData, setInvestmentData] = useState([]);

  useEffect(() => {
    if (stockData && expenses.length > 0) {
      // Sort expenses by date
      const sortedExpenses = [...expenses].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      // Get the oldest purchase date
      const oldestPurchaseDate = sortedExpenses[0].date;

      // Filter stock data to include only dates from the oldest purchase date onward
      const filteredStockData = Object.keys(stockData)
        .filter((date) => new Date(date) >= new Date(oldestPurchaseDate))
        .reduce((acc, date) => {
          acc[date] = stockData[date];
          return acc;
        }, {});

      const dates = Object.keys(filteredStockData).reverse();
      let cumulativeShares = 0;
      let cumulativeValue = 0;

      const investmentValues = dates.map((date) => {
        const stockPrice = parseFloat(filteredStockData[date]["4. close"]);

        // Add shares for each expense on or before the current date
        sortedExpenses.forEach((expense) => {
          if (new Date(expense.date) <= new Date(date)) {
            const shares =
              expense.amount / parseFloat(stockData[expense.date]["4. close"]);
            cumulativeShares += shares;
          }
        });

        cumulativeValue = cumulativeShares * stockPrice;

        return {
          date,
          value: cumulativeValue,
        };
      });

      setInvestmentData(investmentValues);
    } else {
      setInvestmentData([]);
    }
  }, [expenses, stockData]);

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h3 className="text-xl mb-4">Investment Simulator</h3>
      {investmentData.length > 0 ? (
        <InvestmentChart
          investmentData={investmentData}
          stockSymbol={stockSymbol}
        />
      ) : (
        <p>No investment data available.</p>
      )}
    </div>
  );
}

export default InvestmentSimulator;
