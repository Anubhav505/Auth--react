import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/user", { withCredentials: true })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch user data", error);
        setUser(null);
      });
  }, []);

  const handleLogout = async () => {
    try{
      await axios.get('http://localhost:8000/logout', {withCredentials: true})
      setUser(null)
    }catch(error){
      console.error(error)
    }
  }
  
  return (
    <div className="h-screen w-full bg-gray-100 flex flex-col justify-center items-center space-y-4">
      <h1 className="text-3xl font-bold text-gray-800">Welcome to Our App</h1>
      <div className="flex flex-row space-x-4">
        <Link to={"/dashboard"} className="p-2 rounded-md bg-blue-500 text-white font-bold">
          Dashboard
        </Link>
        
        {
          user ? (<Link to={"/"} onClick={handleLogout} className="p-2 rounded-md bg-gray-500 text-white font-bold"> Logout </Link>) 
          : 
          (<>
            <Link to={"/signup"} className="p-2 rounded-md bg-green-500 text-white font-bold"> Signup </Link>
            <Link to={"/login"} className="p-2 rounded-md bg-red-500 text-white font-bold"> Login </Link>
          </>) 
        }
        
      </div>
    </div>
  );
}

export default Home