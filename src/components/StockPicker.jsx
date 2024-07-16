import React, { useState } from "react";
import { fetchStockData } from "../utils/stockData";
import { firestore, auth } from "../services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, setDoc } from "firebase/firestore";

function StockPicker({ onSelectStock }) {
  const [symbol, setSymbol] = useState("");
  const [error, setError] = useState("");
  const [user] = useAuthState(auth);

  const handleFetchStockData = async () => {
    try {
      const data = await fetchStockData(symbol);
      setError("");
      onSelectStock(symbol, data);

      // Save the selected stock to Firestore
      if (user) {
        const userDocRef = doc(firestore, "users", user.uid);
        await setDoc(userDocRef, { stockSymbol: symbol }, { merge: true });
      }
    } catch (error) {
      setError("Failed to fetch stock data. Please try again.");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h3 className="text-xl mb-4">Pick a Default Stock</h3>
      <div className="mb-4">
        <label className="block text-gray-700">Stock Symbol</label>
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          className="mt-1 p-2 border rounded w-full"
        />
      </div>
      <button
        onClick={handleFetchStockData}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Fetch Stock Data
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

export default StockPicker;
