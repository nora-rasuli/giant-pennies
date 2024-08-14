import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ExpenseChart({ expenses }) {
  const expenseData = {};

  // Group expenses by date
  expenses.forEach(expense => {
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
        data: labels.map(label => (label === date ? expense.amount : 0)),
        backgroundColor: `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 0.2)`,
        borderColor: `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 1)`,
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
    barThickness: 20, // Set a specific bar thickness
    maxBarThickness: 30, // Set the maximum bar thickness
  };

  return <Bar data={data} options={options} />;
}

export default ExpenseChart;