import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function ExpenseChart({ expenses }) {
  const expenseData = {};

  // Group expenses by date
  expenses.forEach((expense) => {
    if (!expenseData[expense.date]) {
      expenseData[expense.date] = [];
    }
    expenseData[expense.date].push(expense);
  });

  const labels = Object.keys(expenseData).sort();
  const datasets = labels.flatMap((date, index) => {
    return expenseData[date].map((expense, expenseIndex) => {
      return {
        label: `${expense.itemName} on ${date}`,
        data: labels.map((label) => (label === date ? expense.amount : 0)),
        backgroundColor: getRandomColor(),
        borderColor: getRandomColor(),
        borderWidth: 1,
      };
    });
  });

  const data = {
    labels,
    datasets,
  };

  const options = {
    scales: {
      x: {
        stacked: true,
      },
      y: {
        beginAtZero: true,
        stacked: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
}

export default ExpenseChart;
