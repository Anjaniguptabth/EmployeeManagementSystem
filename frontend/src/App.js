import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import EmployeeList from "./components/EmployeeList";
import CreateEmployee from "./components/CreateEmployee";
import EditEmployee from "./components/EditEmployee";

// Protected route component to handle authentication
const ProtectedRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if token exists in localStorage and validate it
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return isAuthenticated ? element : <Navigate to="/" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Protecting dashboard and employee-related routes */}
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/employees" element={<ProtectedRoute element={<EmployeeList />} />} />
        <Route path="/create" element={<ProtectedRoute element={<CreateEmployee />} />} />
        <Route path="/edit/:id" element={<ProtectedRoute element={<EditEmployee />} />} />
      </Routes>
    </Router>
  );
};

export default App;
