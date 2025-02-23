import { useState, useEffect } from "react";
import { FaUser, FaCog, FaComments } from "react-icons/fa";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Sidebar */}
      <div className="w-1/5 bg-white shadow-xl p-6 flex flex-col gap-6 rounded-r-3xl">
        <h2 className="text-2xl font-extrabold text-indigo-700">Chatify</h2>
        <nav className="flex flex-col gap-3">
          <Link to="/chat" className="flex items-center gap-3 p-3 text-lg font-medium text-gray-700 hover:bg-indigo-100 rounded-xl">
            <FaComments className="text-indigo-500" /> Chat
          </Link>
          <Link to="/profile" className="flex items-center gap-3 p-3 text-lg font-medium text-gray-700 hover:bg-indigo-100 rounded-xl">
            <FaUser className="text-indigo-500" /> Profile
          </Link>
          <Link to="/settings" className="flex items-center gap-3 p-3 text-lg font-medium text-gray-700 hover:bg-indigo-100 rounded-xl">
            <FaCog className="text-indigo-500" /> Settings
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="bg-white shadow-md p-4 flex justify-between items-center rounded-b-3xl">
          <h2 className="text-xl font-bold text-gray-800">Home</h2>
          <div className="flex items-center gap-3">
            <span className="text-gray-700 font-medium">{username}</span>
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold text-indigo-700">Welcome to Chatify</h1>
          <p className="text-gray-600 mt-2 text-lg">Navigate to different sections using the sidebar.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
