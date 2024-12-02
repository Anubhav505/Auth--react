import React from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="h-screen w-full bg-purple-100 flex flex-col justify-center items-center space-y-4">
      <h1 className="text-4xl font-bold text-purple-800">
        Welcome to Your Dashboard
      </h1>
      <p className="text-lg text-purple-600">
        Explore your personalized space for managing your account and accessing
        exclusive features.
      </p>
      <Link
        to={"/"}
        className="p-2 rounded-md bg-purple-500 text-white font-bold"
      >
        {" "}
        Go to home{" "}
      </Link>
    </div>
  );
}

export default Dashboard;
