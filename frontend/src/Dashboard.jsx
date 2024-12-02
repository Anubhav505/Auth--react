import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/user`, {
        withCredentials: true,
      })
      .then((response) => {
        setIsAuthenticated(true);
      })
      .catch((err) => {
        setIsAuthenticated(false);
      });
  }, []);

  if (isAuthenticated === null) {
    return <p>Loading...</p>;
  }

  if (isAuthenticated === false) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard</p>
    </div>
  );
};

export default Dashboard;
