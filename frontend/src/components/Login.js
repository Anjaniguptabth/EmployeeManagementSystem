import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Login.css"; // Import the CSS file

const Login = () => {
  const [f_userName, setUserName] = useState("");
  const [f_Pwd, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if the user is already logged in
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation for username and password
    if (!f_userName || !f_Pwd) {
      setError("Please enter both username and password.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await API.post("/auth/login", { f_userName, f_Pwd });
      localStorage.setItem("token", data.token); // Store token in localStorage
      navigate("/dashboard"); // Redirect after successful login
    } catch (error) {
      console.error("Login failed:", error.response ? error.response.data : error.message);
      setError(error.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="heading">Login</h1>
        <form onSubmit={handleLogin} className="form">
          {/* Username Field */}
          <div className="field-container">
            <input
              type="text"
              placeholder="Username"
              value={f_userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="input"
              disabled={loading} // Disable input while processing
            />
          </div>

          {/* Password Field */}
          <div className="field-container">
            <input
              type="password"
              placeholder="Password"
              value={f_Pwd}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input"
              disabled={loading} // Disable input while processing
            />
          </div>

          {/* Error Message */}
          {error && <p className="error">{error}</p>}

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="button">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
