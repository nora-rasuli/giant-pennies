import React, { useState, useEffect } from "react";
import InvestmentChart from "./InvestmentChart";
import { fetchVOOStockData } from "../utils/stockData";

function InvestmentSimulator({ expenses }) {
  const [stockData, setStockData] = useState(null);
  const [investmentData, setInvestmentData] = useState([]);
  const [savingsData, setSavingsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchVOOStockData();
      setStockData(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (stockData && expenses.length > 0) {
      const dates = Object.keys(stockData).sort();
      const firstExpenseDate = expenses.reduce((earliest, expense) => {
        return earliest < expense.date ? earliest : expense.date;
      }, expenses[0].date);

      const investmentMap = {};
      const savingsMap = {};

      // Initialize maps with zero values
      dates.forEach((date) => {
        investmentMap[date] = 0;
        savingsMap[date] = 0;
      });

      // Update maps with expenses
      expenses.forEach((expense) => {
        const expenseDate = expense.date;
        const stockPriceOnDate = stockData[expenseDate]
          ? parseFloat(stockData[expenseDate]["4. close"])
          : 0;
        const shares = expense.amount / stockPriceOnDate;
        dates.forEach((date) => {
          if (date >= expenseDate) {
            const stockPrice = parseFloat(stockData[date]["4. close"]);
            investmentMap[date] += shares * stockPrice;
            savingsMap[date] += expense.amount;
          }
        });
      });

      const investmentValues = dates
        .filter((date) => date >= firstExpenseDate)
        .map((date) => ({
          date,
          value: investmentMap[date],
        }));

      const savingsValues = dates
        .filter((date) => date >= firstExpenseDate)
        .map((date) => ({
          date,
          value: savingsMap[date],
        }));

      setInvestmentData(investmentValues);
      setSavingsData(savingsValues);
    }
  }, [expenses, stockData]);

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h3 className="text-xl mb-4">Investment Simulator</h3>
      <InvestmentChart
        investmentData={investmentData}
        savingsData={savingsData}
      />
    </div>
  );
}

export default InvestmentSimulator;
