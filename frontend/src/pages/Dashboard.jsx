import { useState } from "react";
import { FaUser, FaCog, FaComments, FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/5 bg-white shadow-lg p-4 flex flex-col gap-4">
        <h2 className="text-xl font-bold">MyApp</h2>
        <Link to="/chat" className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded">
          <FaComments /> Chat
        </Link>
        <Link to="/profile" className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded">
          <FaUser /> Profile
        </Link>
        <Link to="/settings" className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded">
          <FaCog /> Settings
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="bg-white shadow-md p-4 flex justify-between items-center">
          <h2 className="text-lg font-bold">Home</h2>
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 overflow-auto flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">Welcome to MyApp</h1>
          <p className="text-gray-700">Navigate to different sections using the sidebar.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;