import React from "react";

function Summary({ expenses }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const yearlySums = {};
  const monthlySums = {};

  // Initialize sums
  years.forEach((year) => {
    yearlySums[year] = 0;
    if (year === currentYear) {
      monthlySums[year] = Array(12).fill(0);
    }
  });

  // Calculate sums
  expenses.forEach((expense) => {
    const date = new Date(expense.date);
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-11

    if (year in yearlySums) {
      yearlySums[year] += parseFloat(expense.amount);
      if (year === currentYear) {
        monthlySums[year][month] += parseFloat(expense.amount);
      }
    }
  });

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h3 className="text-xl mb-4">Summary</h3>
      {years.map(
        (year) =>
          yearlySums[year] > 0 && (
            <div key={year} className="mb-4">
              <h4 className="text-lg">
                {year} Total: ${yearlySums[year].toFixed(2)}
              </h4>
              {year === currentYear && (
                <ul>
                  {monthlySums[year].map(
                    (sum, index) =>
                      sum > 0 && (
                        <li key={index} className="ml-4">
                          {new Date(0, index).toLocaleString("default", {
                            month: "long",
                          })}
                          : ${sum.toFixed(2)}
                        </li>
                      )
                  )}
                </ul>
              )}
            </div>
          )
      )}
    </div>
  );
}

export default Summary;
