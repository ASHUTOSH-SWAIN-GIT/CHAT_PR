import React from "react";
import "../pages/css/home.css"; // Import the CSS file

const Home = () => {
  return (
    <div className="home-container">
      <div className="overlay"></div>
      <div className="content">
        <h1>Welcome to ChatApp</h1>
        <p>Connect, Chat, and Stay in Touch – Anytime, Anywhere.</p>
        <button className="cta-button">Get Started</button>
      </div>
    </div>
  );
};

export default Home;
