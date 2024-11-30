import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router,Routes,Route,Navigate,} from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import Home from "./Home.jsx";
import Dashboard from "./Dashboard.jsx";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    axios
      .get(`${backendUrl}/user`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 200) {
          setIsAuthenticated(true);
        }
      })
      .catch(() => setIsAuthenticated(false));
}, []);

  if (isAuthenticated === null) {
    return null;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  </StrictMode>
);