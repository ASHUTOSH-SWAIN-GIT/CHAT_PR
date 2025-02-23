import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    // Validation
    const validationErrors = {};
    if (!formData.username.trim()) validationErrors.username = "Username is required";
    if (formData.password.length < 6) validationErrors.password = "Password must be at least 6 characters";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post(
        "https://chat-pr.onrender.com/api/user/login",
        {
          username: formData.username,
          password: formData.password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const { token, user } = response.data;
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("userId", user._id);
      sessionStorage.setItem("username", user.username);
      sessionStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      setMessage("Login successful!");

      setTimeout(() => {
        navigate("/dash");
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || "Login failed. Please try again.";
      setErrors({ general: errorMessage });
      if (error.response?.status === 401) {
        setFormData({ username: "", password: "" });
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Floating Blur Effect */}
      <div className="absolute w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-30 top-10 left-20"></div>
      <div className="absolute w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-30 bottom-10 right-20"></div>

      {/* Glassmorphism Login Card */}
      <div className="relative bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-xl w-96 transform transition-all hover:scale-105">
        <h2 className="text-3xl font-extrabold text-center text-white mb-6">Welcome Back! 👋</h2>
        
        {message && <p className="text-green-400 text-center mb-4">{message}</p>}
        {errors.general && <p className="text-red-400 text-center mb-4">{errors.general}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg bg-gray-900/80 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 ${
                errors.username ? "border-red-500" : "border-gray-600"
              }`}
              placeholder="Enter your username"
            />
            {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg bg-gray-900/80 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 ${
                errors.password ? "border-red-500" : "border-gray-600"
              }`}
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md transform hover:scale-105"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:text-blue-500 transition-all font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
