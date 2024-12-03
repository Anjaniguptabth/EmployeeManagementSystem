import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import "./EmployeeList.css";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch employees from API
  const fetchEmployees = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await API.get("/employees");
      setEmployees(data);
    } catch (err) {
      console.error("Error fetching employees", err);
      setError("Failed to fetch employees. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filter employees by search term
  const filteredEmployees = employees.filter((employee) =>
    searchTerm
      ? employee.f_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.f_Email.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login"); // Redirect to login page after logout
  };

  // Delete employee
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await API.delete(`/employees/${id}`);
        setEmployees(employees.filter((employee) => employee._id !== id)); // Remove employee from state
      } catch (err) {
        console.error("Error deleting employee", err);
        alert("Failed to delete employee. Please try again later.");
      }
    }
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
        <div className="sidebar-item active">Employee List</div>
      </div>

      {/* Content Area */}
      <div className="content">
        {/* Top Section */}
        <div className="top-section">
          <div className="total-count">
            <strong>Total Count:</strong> {employees.length}
          </div>
          <div className="create-employee">
            <button className="create-btn" onClick={() => navigate("/create")}>
              Create Employee
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <span>Search</span>
          <input
            type="text"
            placeholder="Enter Search Keyword"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Error Message */}
        {error && <p className="error-message">{error}</p>}

        {/* Employee Table */}
        {loading ? (
          <p>Loading...</p>
        ) : filteredEmployees.length > 0 ? (
          <table className="employee-table">
            <thead>
              <tr>
                <th>Unique ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile No</th>
                <th>Designation</th>
                <th>Gender</th>
                <th>Course</th>
                <th>Create Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee._id}>
                  <td>{employee.f_Id}</td>
                  <td>
                    {employee.f_Image ? (
                      <img
                        src={employee.f_Image}
                        alt={employee.f_Name}
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td>{employee.f_Name}</td>
                  <td>{employee.f_Email}</td>
                  <td>{employee.f_Mobile}</td>
                  <td>{employee.f_Designation}</td>
                  <td>{employee.f_Gender}</td>
                  <td>{employee.f_Course.join(", ")}</td>
                  <td>{new Date(employee.f_Createdate).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/edit/${employee._id}`} className="btn edit-btn">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(employee._id)}
                      className="btn delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No employees found.</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
