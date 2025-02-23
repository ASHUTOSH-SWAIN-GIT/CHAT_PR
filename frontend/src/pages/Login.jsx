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
        "http://localhost:9000/api/user/login",
        {
          username: formData.username,
          password: formData.password
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );

      // Debugging: Log the full response
      console.log("Full response:", response);

      // Check if response contains valid data
      // if (!response.data || !response.data.token || !response.data.user) {
      //   throw new Error("Invalid response from server");
      // }

      const { token, user } = response.data;

      // Store session data
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("userId", user._id);  // Store user ID separately
      sessionStorage.setItem("username", user.username);
      sessionStorage.setItem("user", JSON.stringify(user));

      // Update context
      setUser(user);
      setMessage("Login successful!");

      // Redirect after delay
      setTimeout(() => {
        navigate("/dash");
      }, 2000);

    } catch (error) {
      // Improved error handling
      const errorMessage = error.response?.data?.error ||
        error.message ||
        "Login failed. Please try again.";

      setErrors({ general: errorMessage });

      // Clear form on authentication error
      if (error.response?.status === 401) {
        setFormData({ username: "", password: "" });
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Login to Your Account
        </h2>

        {/* Status Messages */}
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        {errors.general && <p className="text-red-500 text-center mb-4">{errors.general}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm ${errors.username ? "border-red-500" : "border-gray-300"
                }`}
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm ${errors.password ? "border-red-500" : "border-gray-300"
                }`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Login
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-500 hover:underline font-medium"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;