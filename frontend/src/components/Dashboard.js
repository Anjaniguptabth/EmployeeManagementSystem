import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css"; // Import a CSS file for styling

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the token from local storage
    localStorage.removeItem("token");
    // Navigate to the login page
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* Top navigation bar */}
      <div className="navbar">
        <div className="logo">Logo</div>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">Home</Link>
          <Link to="/employees" className="nav-link">Employee List</Link>
        </div>
        <div className="user-info">
          <span className="username">Hukum Gupta</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-item active">Dashboard</div>
      </div>

      {/* Main content area */}
      <div className="main-content">
        <h2>Welcome Admin Panel</h2>
      </div>
    </div>
  );
};

export default Dashboard;
