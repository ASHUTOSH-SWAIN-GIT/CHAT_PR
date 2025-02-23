import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie"; // Import Cookies

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
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

    const validationErrors = {};
    if (!formData.username.trim()) validationErrors.username = "Username is required";
    if (!formData.email.includes("@")) validationErrors.email = "Invalid email address";
    if (formData.password.length < 6) validationErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) validationErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:9000/api/user/register",
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      const { token, user } = response.data;

      // Store in Cookies instead of localStorage
      Cookies.set("token", token, { expires: 7, secure: true, sameSite: "Strict" });
      Cookies.set("user", JSON.stringify(user), { expires: 7, secure: true, sameSite: "Strict" });

      setMessage("Signup successful!");

      setFormData({ username: "", email: "", password: "", confirmPassword: "" });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setErrors({ general: error.response?.data?.message || "Signup failed. Try again!" });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 w-96">
        <h2 className="text-3xl font-extrabold text-center text-blue-400 drop-shadow-md">
          Create an Account
        </h2>

        {message && <p className="text-green-400 text-center mt-2">{message}</p>}
        {errors.general && <p className="text-red-500 text-center mt-2">{errors.general}</p>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg shadow-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your username"
            />
            {errors.username && <p className="text-red-400 text-sm">{errors.username}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg shadow-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg shadow-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Create a password"
            />
            {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg shadow-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-2 text-lg font-semibold bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all focus:ring-2 focus:ring-blue-400"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
