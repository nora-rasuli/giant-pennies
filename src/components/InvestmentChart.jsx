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
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { format } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
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
        fill: false,
        pointRadius: 0, // Remove point markers
      },
      {
        label: "Savings Value",
        data: savingsValues,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: false,
        pointRadius: 0, // Remove point markers
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          tooltipFormat: "MMM dd, yyyy",
        },
        ticks: {
          callback: function (value) {
            return format(new Date(value), "MMM dd, yyyy");
          },
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Investing in VOO vs Saving in Cash",
      },
    },
  };

  return <Line data={data} options={options} />;
}

export default InvestmentChart;
