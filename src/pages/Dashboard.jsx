import React, { useState, useEffect } from "react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseChart from "../components/ExpenseChart";
import InvestmentSimulator from "../components/InvestmentSimulator";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore, auth } from "../services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function Dashboard() {
  const [user] = useAuthState(auth);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    if (user) {
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
      };

      fetchExpenses();
    }
  }, [user]);

  const handleAddExpense = (expense) => {
    setExpenses([...expenses, expense]);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Dashboard</h2>
      <ExpenseForm onSubmit={handleAddExpense} />
      <div className="mt-6">
        <h3 className="text-xl mb-2">Expenses</h3>
        <ExpenseChart expenses={expenses} />
        <ul>
          {expenses.map((expense) => (
            <li key={expense.id} className="border-b py-2">
              {expense.date} - {expense.itemName}: ${expense.amount}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <InvestmentSimulator expenses={expenses} />
      </div>
    </div>
  );
}

export default Dashboard;
