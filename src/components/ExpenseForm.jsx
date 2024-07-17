import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { firestore, auth } from "../services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function ExpenseForm({ onSubmit }) {
  const [amount, setAmount] = useState("");
  const [itemName, setItemName] = useState("");
  const [date, setDate] = useState("");
  const [user] = useAuthState(auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (amount && itemName && date) {
      const expense = { amount, itemName, date, userId: user.uid };
      const docRef = await addDoc(collection(firestore, "expenses"), expense);
      onSubmit({ id: docRef.id, ...expense });
      setAmount("");
      setItemName("");
      setDate("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
      <div className="mb-4">
        <label className="block text-gray-700">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 p-2 border rounded w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Item Name</label>
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="mt-1 p-2 border rounded w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 p-2 border rounded w-full"
          required
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Add Expense
      </button>
    </form>
  );
}

export default ExpenseForm;
