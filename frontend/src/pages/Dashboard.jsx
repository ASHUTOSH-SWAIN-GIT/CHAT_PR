import React from "react";
import "../pages/css/dash.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">Chatify</h2>
        <nav>
          <ul>
            <li onClick={() => navigate("/chats")}>🔍 Chats
            </li>
            <li onClick={() => navigate("/groups")}>👥 Groups</li>
            <li onClick={() => navigate("/settings")}>⚙️ Settings</li>
          </ul>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="main-content">
        <header className="dashboard-header">
          <h1>Welcome Back!</h1>
          <button className="logout-button" onClick={() => navigate("/logout")}>
            Logout
          </button>
        </header>
        
        <section className="chat-preview">
          <h2>Recent Chats</h2>
          <div className="chat-list">
            <div className="chat-item">John Doe</div>
            <div className="chat-item">Jane Smith</div>
            <div className="chat-item">Group: Devs Chat</div>
          </div>
        </section>
      </main>
    </div>
  );
}