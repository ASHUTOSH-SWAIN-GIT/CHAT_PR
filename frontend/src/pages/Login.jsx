import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/css/login.css";
import axios from "axios";

const Login = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setMessage("");
    
        // Validate fields
        if (!formData.username.trim() || !formData.password.trim()) {
            setErrors({ general: "Both fields are required" });
            return;
        }
    
        try {
            const response = await axios.post(
                "http://localhost:9000/api/user/login", 
                formData,  //  Send formData in request body
                { headers: { "Content-Type": "application/json" } }
            );
    
            //  Response data
            if (response.data.success) {
                localStorage.setItem("token", response.data.token); // Save JWT Token
                alert("Login Successful!");
                navigate("/dash"); // Redirect to Home Page
            } else {
                setErrors({ general: response.data.message || "Invalid credentials" });
            }
        } catch (error) {
            console.error("Login error:", error.response?.data || error.message);
            setErrors({ general: error.response?.data?.message || "Invalid credentials. Try again!" });
        }
    };
    
    

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                {message && <p className="success">{message}</p>}
                {errors.general && <p className="error">{errors.general}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                        {errors.username && <p className="error">{errors.username}</p>}
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        {errors.password && <p className="error">{errors.password}</p>}
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>
                <p className="signup-text">
                    Don't have an account? <a href="/signup">Sign up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
