import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-6 relative">
      {/* Navbar with Login & Signup */}
      <nav className="absolute top-6 right-8 flex space-x-4">
        <Link
          to="/login"
          className="px-5 py-2 bg-gray-700 hover:bg-gray-600 transition-all rounded-lg text-md font-semibold shadow-md"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="px-5 py-2 bg-blue-500 hover:bg-blue-600 transition-all rounded-lg text-md font-semibold shadow-md"
        >
          Signup
        </Link>
      </nav>

      <div className="text-center max-w-2xl">
        {/* Logo & Heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-lg">
          Welcome to ChatX
        </h1>
        <p className="mt-4 text-lg text-gray-300">
          Connect, chat, and share moments with friends in real-time.
        </p>

        {/* Call to Action Buttons */}
        <div className="mt-8 flex justify-center space-x-6">
          <Link
            to="/signup"
            className="relative px-8 py-3 bg-blue-500 hover:bg-blue-600 transition-all rounded-lg text-lg font-semibold shadow-lg group overflow-hidden"
          >
            <span className="absolute inset-0 bg-blue-600 scale-0 group-hover:scale-100 transition-transform"></span>
            <span className="relative z-10">Start Chatting</span>
          </Link>

          <Link
            to="https://github.com/ASHUTOSH-SWAIN-GIT/CHAT_PR.git"
            className="relative px-8 py-3 bg-gray-700 hover:bg-gray-600 transition-all rounded-lg text-lg font-semibold shadow-lg group overflow-hidden"
          >
            <span className="absolute inset-0 bg-gray-600 scale-0 group-hover:scale-100 transition-transform"></span>
            <span className="relative z-10">Learn More</span>
          </Link>
        </div>

        {/* Glassmorphism Feature Card */}
        <div className="mt-12 p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 hover:border-blue-400 transition-all">
          <h2 className="text-xl font-semibold text-blue-400">🚀 Real-time Messaging</h2>
          <p className="text-gray-300 mt-2">
            Powered by Socket.io for instant communication.
          </p>
        </div>

        {/* Animated Floating Effect */}
        <div className="mt-10 flex justify-center">
          <div className="w-48 h-48 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
