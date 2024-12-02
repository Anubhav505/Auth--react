import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendData = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}/signup`, formData, {
        withCredentials: true,
      });
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-screen w-full bg-sky-500 flex flex-col justify-center items-center space-y-4">
      <h2 className="text-2xl font-bold text-white">Signup</h2>
      <form onSubmit={sendData} className="flex flex-col space-y-4">
        <input
          onChange={handleChange}
          type="text"
          name="username"
          placeholder="Username"
          className="p-2 rounded-md border-2 border-white bg-white text-gray-800"
        />
        <input
          onChange={handleChange}
          type="email"
          name="email"
          placeholder="Email"
          className="p-2 rounded-md border-2 border-white bg-white text-gray-800"
        />
        <input
          onChange={handleChange}
          type="password"
          name="password"
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

export default Signup;
