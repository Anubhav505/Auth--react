import { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backendUrl}/login`,
        { email, password },
        { withCredentials: true }
      );
      if (response.data.success) {
        setIsAuthenticated(true); // Update state to trigger navigation
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      setIsAuthenticated(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />; // Redirect to dashboard if logged in
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
