import React from "react";
import { useNavigate } from "react-router-dom";
import "../pages/css/home.css"; // Import your existing CSS file

export default function HomePage() {
  const navigate = useNavigate(); // ✅ Call useNavigate inside the component

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">Welcome to Chatify</h1>
        <p className="hero-subtitle">
          A fast, secure, and modern chat application to stay connected with friends and colleagues.
        </p>
        {/* ✅ Correct: use useNavigate inside an arrow function */}
        <button className="custom-button" onClick={() => navigate("/signup")}>
          Get Started
        </button>
      </div>

      {/* Features Section */}
      <div className="features-grid">
        <FeatureCard 
          icon={<span className="icon">💬</span>} 
          title="Real-time Messaging" 
          description="Instant chat with WebSockets and Socket.io." 
        />
        <FeatureCard 
          icon={<span className="icon">👥</span>} 
          title="Group Chats" 
          description="Create and join groups to stay connected with friends." 
        />
        <FeatureCard 
          icon={<span className="icon">🔒</span>} 
          title="End-to-End Encryption" 
          description="Secure messaging with top-level encryption." 
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  );
}
