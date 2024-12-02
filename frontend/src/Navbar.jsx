import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get(`${backendUrl}/user`, { withCredentials: true });
        if (response.data) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, [location.pathname]);

const Logout = async () => {
  try {
    await axios.post(`${backendUrl}/logout`, {}, { withCredentials: true });
    setIsLoggedIn(false);
    navigate("/");
  } catch (error) {
    console.error("Logout error:", error);
  }
};


  return (
    <div className="flex justify-between items-center py-3 px-16 bg-purple-500 text-white">
      <Link to="/">ECHO</Link>
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <button
            onClick={Logout}
            className="p-2 rounded-md bg-white text-black font-bold"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/signup"
              className="p-2 rounded-md bg-green-500 text-white font-bold"
            >
              Signup
            </Link>
            <Link
              to="/login"
              className="p-2 rounded-md bg-red-500 text-white font-bold"
            >
              Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
