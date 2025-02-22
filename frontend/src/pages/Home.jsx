import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-6">
      <div className="text-center max-w-2xl">
        {/* Logo or Icon */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Welcome to ChatX
        </h1>
        <p className="mt-4 text-lg text-gray-300">
          Connect, chat, and share moments with friends in real-time.
        </p>

        {/* Call to Action */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            to="/signup"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 transition-all rounded-lg text-lg font-semibold shadow-lg"
          >
            Start Chatting
          </Link>
          <Link
            to="/about"
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 transition-all rounded-lg text-lg font-semibold shadow-lg"
          >
            Learn More
          </Link>
        </div>

        {/* Glassmorphism Card */}
        <div className="mt-12 p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/20">
          <h2 className="text-xl font-semibold">Real-time Messaging</h2>
          <p className="text-gray-300 mt-2">
            Powered by Socket.io for instant communication.
          </p>
        </div>
      </div>
    </div>
  );
}
