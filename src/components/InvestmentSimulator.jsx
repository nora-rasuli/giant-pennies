import React, { useState, useEffect } from "react";
import InvestmentChart from "./InvestmentChart";
import { fetchVOOStockData } from "../utils/stockData";
import {
  endOfWeek,
  endOfMonth,
  format,
  parseISO,
  differenceInYears,
  addMonths,
  startOfMonth,
} from "date-fns";

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
      const currentDate = format(new Date(), "yyyy-MM-dd");
      const yearsDifference = differenceInYears(
        parseISO(currentDate),
        parseISO(firstExpenseDate)
      );

      const filteredDates = dates.filter((date) => date >= firstExpenseDate);
      const investmentMap = {};
      const savingsMap = {};

      // Initialize maps with zero values
      filteredDates.forEach((date) => {
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
        filteredDates.forEach((date) => {
          if (date >= expenseDate) {
            const stockPrice = parseFloat(stockData[date]["4. close"]);
            investmentMap[date] += shares * stockPrice;
            savingsMap[date] += parseFloat(expense.amount);
          }
        });
      });

      let aggregationFunction;
      if (yearsDifference > 10) {
        aggregationFunction = (date) => {
          const parsedDate = parseISO(date);
          const month = Math.floor(parsedDate.getMonth() / 2) * 2;
          const startOfBimonthlyPeriod = startOfMonth(
            addMonths(parsedDate, month - parsedDate.getMonth())
          );
          return format(startOfBimonthlyPeriod, "yyyy-MM-dd");
        };
      } else if (yearsDifference > 5) {
        aggregationFunction = endOfMonth;
      } else {
        aggregationFunction = endOfWeek;
      }

      const investmentAggregated = {};
      const savingsAggregated = {};

      filteredDates.forEach((date) => {
        const aggregatedDate = aggregationFunction(date);
        if (!investmentAggregated[aggregatedDate]) {
          investmentAggregated[aggregatedDate] = 0;
          savingsAggregated[aggregatedDate] = 0;
        }
        investmentAggregated[aggregatedDate] = investmentMap[date];
        savingsAggregated[aggregatedDate] = savingsMap[date];
      });

      const investmentValues = Object.keys(investmentAggregated).map(
        (date) => ({
          date,
          value: investmentAggregated[date],
        })
      );

      const savingsValues = Object.keys(savingsAggregated).map((date) => ({
        date,
        value: savingsAggregated[date],
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
