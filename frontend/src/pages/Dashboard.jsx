import { useState, useEffect } from "react";
import { FaUser, FaCog, FaComments, FaPlus, FaSearch } from "react-icons/fa";
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
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar */}
      <div className="w-1/5 bg-gradient-to-b from-white to-blue-50 shadow-2xl p-8 flex flex-col gap-8 border-r border-blue-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
            Chatify
          </h2>
        </div>

        <nav className="flex flex-col gap-2">
          <Link 
            to="/chat" 
            className="flex items-center gap-4 p-3 text-lg font-medium text-gray-600 hover:bg-blue-50 rounded-xl transition-all group"
          >
            <FaComments className="text-blue-500 group-hover:text-blue-600 transition-colors text-xl" />
            <span className="group-hover:text-blue-600 transition-colors">Chat</span>
          </Link>
          <Link 
            to="/profile" 
            className="flex items-center gap-4 p-3 text-lg font-medium text-gray-600 hover:bg-blue-50 rounded-xl transition-all group"
          >
            <FaUser className="text-blue-500 group-hover:text-blue-600 transition-colors text-xl" />
            <span className="group-hover:text-blue-600 transition-colors">Profile</span>
          </Link>
          <Link 
            to="/settings" 
            className="flex items-center gap-4 p-3 text-lg font-medium text-gray-600 hover:bg-blue-50 rounded-xl transition-all group"
          >
            <FaCog className="text-blue-500 group-hover:text-blue-600 transition-colors text-xl" />
            <span className="group-hover:text-blue-600 transition-colors">Settings</span>
          </Link>
        </nav>

        <div className="mt-auto bg-blue-50 p-4 rounded-xl border border-blue-100">
          <h3 className="text-sm font-semibold text-blue-600 mb-2">New Conversation</h3>
          <button className="w-full flex items-center gap-2 px-4 py-2.5 bg-white text-blue-600 rounded-lg hover:bg-blue-100 transition-colors shadow-sm">
            <FaPlus className="text-sm" />
            <span className="font-medium">Start Chat</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="bg-white/80 backdrop-blur-sm p-6 flex justify-between items-center border-b border-blue-100">
          <div className="flex items-center gap-4">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search messages..." 
                className="pl-12 pr-4 py-2.5 w-64 bg-gray-50 rounded-lg border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-gray-700">{username}</span>
              <span className="text-xs text-gray-400">Online</span>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-full flex items-center justify-center text-white font-medium shadow-lg">
              {username.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-12 flex flex-col items-center justify-center">
          <div className="max-w-2xl text-center">
            <div className="mb-8 flex justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-white rounded-full flex items-center justify-center shadow-lg border border-blue-50">
                <FaComments className="text-blue-500 text-5xl opacity-80" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Welcome to <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Chatify</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Connect seamlessly with your team and colleagues through secure, real-time messaging.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-blue-600 to-indigo-500 text-white rounded-xl hover:shadow-lg transition-all transform hover:scale-[1.02]">
                <FaPlus className="text-sm" />
                <span className="font-medium">New Conversation</span>
              </button>
              <button className="px-6 py-3 bg-white text-blue-600 rounded-xl border border-blue-100 hover:bg-blue-50 transition-colors font-medium">
                Explore Features
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;