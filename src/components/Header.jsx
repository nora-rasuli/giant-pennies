import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebase";

function Header() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header className="relative bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-8 flex justify-between items-center overflow-hidden">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent relative">
          Giant Pennies
        </h1>
        <nav className="mt-4">
          <Link to="/" className="mr-4 hover:underline">
            Dashboard
          </Link>
          <Link to="/login" className="mr-4 hover:underline">
            Login
          </Link>
          <Link to="/signup" className="mr-4 hover:underline">
            Signup
          </Link>
        </nav>
      </div>
      <div className="flex items-center">
        {user && (
          <>
            <span className="mr-4">Welcome, {user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white p-2 rounded hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </>
        )}
      </div>
      {/* Coins for the raining effect */}
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="coin absolute w-6 h-6 bg-no-repeat bg-center"
          style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s` }}
        ></div>
      ))}
    </header>
  );
}

export default Header;