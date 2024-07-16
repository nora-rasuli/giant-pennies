import React, { useState, useEffect } from "react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseChart from "../components/ExpenseChart";
import StockPicker from "../components/StockPicker";
import InvestmentSimulator from "../components/InvestmentSimulator";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { firestore, auth } from "../services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { fetchStockData } from "../utils/stockData";

function Dashboard() {
  const [user] = useAuthState(auth);
  const [expenses, setExpenses] = useState([]);
  const [stockData, setStockData] = useState(null);
  const [stockSymbol, setStockSymbol] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const userDocRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("User Data:", userData);
          if (userData.stockSymbol) {
            console.log(
              "Fetching stock data for symbol:",
              userData.stockSymbol
            );
            const data = await fetchStockData(userData.stockSymbol);
            if (data) {
              setStockData(data);
              setStockSymbol(userData.stockSymbol);
              console.log("Fetched Stock Data:", data);
            } else {
              console.error("Failed to fetch stock data.");
            }
          }
        }
      };

      const fetchExpenses = async () => {
        const q = query(
          collection(firestore, "expenses"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const expensesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setExpenses(expensesList);
        console.log("Fetched Expenses:", expensesList);
      };

      const fetchData = async () => {
        await fetchUserData();
        await fetchExpenses();
        setLoading(false);
      };

      fetchData();
    }
  }, [user]);

  const handleAddExpense = (expense) => {
    setExpenses([...expenses, expense]);
  };

  const handleSelectStock = (symbol, data) => {
    setStockData(data);
    setStockSymbol(symbol);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Dashboard</h2>
      <ExpenseForm onSubmit={handleAddExpense} />
      <div className="mt-6">
        <h3 className="text-xl mb-2">Expenses</h3>
        {expenses.length > 0 ? (
          <>
            <ExpenseChart expenses={expenses} />
            <ul>
              {expenses.map((expense) => (
                <li key={expense.id} className="border-b py-2">
                  {expense.date} - {expense.category}: ${expense.amount}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>No expenses reported.</p>
        )}
      </div>
      <div className="mt-6">
        <StockPicker onSelectStock={handleSelectStock} />
      </div>
      <div className="mt-6">
        {expenses.length > 0 && stockData ? (
          <InvestmentSimulator
            expenses={expenses}
            stockData={stockData}
            stockSymbol={stockSymbol}
          />
        ) : (
          <p>No investment data available.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
