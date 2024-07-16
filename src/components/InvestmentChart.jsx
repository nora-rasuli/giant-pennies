import React, { useEffect, useRef } from "react";
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
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function InvestmentChart({ investmentData, stockSymbol }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const dates = investmentData.map((data) => data.date);
  const values = investmentData.map((data) => data.value);

  const data = {
    labels: dates,
    datasets: [
      {
        label: "Investment Value",
        data: values,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    chartInstanceRef.current = new ChartJS(ctx, {
      type: "line",
      data,
      options,
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [investmentData]);

  return (
    <div>
      {investmentData.length > 0 ? (
        <>
          <h4 className="text-lg mb-2">{stockSymbol}</h4>
          <canvas ref={chartRef} />
        </>
      ) : (
        <p>No investment data to display.</p>
      )}
    </div>
  );
}

export default InvestmentChart;
