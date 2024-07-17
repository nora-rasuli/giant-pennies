import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function InvestmentChart({ investmentData, savingsData }) {
  const dates = investmentData.map((data) => data.date);
  const investmentValues = investmentData.map((data) => data.value);
  const savingsValues = savingsData.map((data) => data.value);

  const data = {
    labels: dates,
    datasets: [
      {
        label: "Investment Value",
        data: investmentValues,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        pointRadius: 0, // Remove point markers
      },
      {
        label: "Savings Value",
        data: savingsValues,
        borderColor: "rgba(192, 75, 75, 1)",
        backgroundColor: "rgba(192, 75, 75, 0.2)",
        pointRadius: 0, // Remove point markers
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    elements: {
      point: {
        radius: 0, // Remove point markers globally
      },
    },
  };

  return <Line data={data} options={options} />;
}

export default InvestmentChart;
