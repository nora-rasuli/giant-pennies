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
    <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
      <div>
        <h1 className="text-2xl">Smart Saver</h1>
        <nav>
          <Link to="/" className="mr-4">
            Dashboard
          </Link>
          <Link to="/login" className="mr-4">
            Login
          </Link>
          <Link to="/signup" className="mr-4">
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
              className="bg-red-500 text-white p-2 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
