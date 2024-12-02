import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Login() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(""); // For displaying errors

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const sendLoginData = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}/login`, loginData, {
        withCredentials: true,
      });
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="h-screen w-full bg-sky-500 flex flex-col justify-center items-center space-y-4">
      <h2 className="text-2xl font-bold text-white">Login</h2>
      {error && <p className="text-red-500">{error}</p>}{" "}
      {/* Display error message */}
      <form onSubmit={sendLoginData} className="flex flex-col space-y-4">
        <input
          name="username"
          onChange={handleChange}
          type="text"
          placeholder="Username"
          className="p-2 rounded-md border-2 border-white bg-white text-gray-800"
        />
        <input
          name="password"
          onChange={handleChange}
          type="password"
          placeholder="Password"
          className="p-2 rounded-md border-2 border-white bg-white text-gray-800"
        />
        <button
          type="submit"
          className="p-2 rounded-md bg-blue-500 text-white font-bold"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Login;
