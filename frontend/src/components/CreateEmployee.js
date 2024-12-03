import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CreateEmployee.css";
import API from "../api"; // Adjust this import to your API module

const CreateEmployee = () => {
  const [formData, setFormData] = useState({
    f_Name: "",
    f_Email: "",
    f_Mobile: "",
    f_Designation: "",
    f_Gender: "",
    f_Course: [],
    f_Image: null,
  });

  const [fileError, setFileError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [error, setError] = useState(""); // Error state for failed requests
  const [success, setSuccess] = useState(""); // Success state
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.f_Gender) {
      setError("Gender is required!");
      return;
    }

    const data = new FormData();
    // Append form data
    for (let key in formData) {
      if (key === "f_Course") {
        formData[key].forEach((item) => data.append("f_Course[]", item));
      } else if (key === "f_Image" && formData[key]) {
        data.append("f_Image", formData[key]);  // Ensure f_Image is added correctly
      } else {
        data.append(key, formData[key]);
      }
    }

    setLoading(true);
    setError(""); // Reset previous errors
    setSuccess(""); // Reset success message

    try {
      await API.post("/employees", data);
      setSuccess("Employee created successfully!");
      setTimeout(() => navigate("/employees"), 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error("Error creating employee:", error);
      setError("Failed to create employee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file changes with validation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      if (!["image/jpeg", "image/png"].includes(fileType)) {
        setFileError("Only JPG and PNG files are allowed.");
      } else {
        setFileError("");
        setFormData({ ...formData, f_Image: file });
      }
    }
  };

  // Handle course selection (checkbox)
  const handleCourseChange = (e) => {
    const { value } = e.target;
    const selectedCourses = [...formData.f_Course];
    if (selectedCourses.includes(value)) {
      setFormData({
        ...formData,
        f_Course: selectedCourses.filter((course) => course !== value),
      });
    } else {
      selectedCourses.push(value);
      setFormData({ ...formData, f_Course: selectedCourses });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // Redirect to login page
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
        <div className="sidebar-item active">Create Employee</div>
      </div>

      <form className="create-employee-form" onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Name */}
        <label htmlFor="f_Name">Name:</label>
        <input
          id="f_Name"
          type="text"
          name="f_Name"
          placeholder="Enter Name"
          value={formData.f_Name}
          onChange={handleChange}
          required
        />

        {/* Email */}
        <label htmlFor="f_Email">Email:</label>
        <input
          id="f_Email"
          type="email"
          name="f_Email"
          placeholder="Enter Email"
          value={formData.f_Email}
          onChange={handleChange}
          required
        />

        {/* Mobile No */}
        <label htmlFor="f_Mobile">Mobile No:</label>
        <input
          id="f_Mobile"
          type="text"
          name="f_Mobile"
          placeholder="Enter Mobile Number"
          value={formData.f_Mobile}
          onChange={handleChange}
          required
          pattern="[0-9]{10}"
          title="Enter a valid 10-digit mobile number"
        />

        {/* Designation */}
        <label htmlFor="f_Designation">Designation:</label>
        <select
          id="f_Designation"
          name="f_Designation"
          value={formData.f_Designation}
          onChange={handleChange}
          required
        >
          <option value="">Select Designation</option>
          <option value="HR">HR</option>
          <option value="Manager">Manager</option>
          <option value="Sales">Sales</option>
        </select>

        {/* Gender */}
        <label>Gender:</label>
        <div className="radio-group">
          <input
            type="radio"
            name="f_Gender"
            value="Male"
            onChange={handleChange}
            checked={formData.f_Gender === "Male"}
            required
          /> Male
          <input
            type="radio"
            name="f_Gender"
            value="Female"
            onChange={handleChange}
            checked={formData.f_Gender === "Female"}
            required
          /> Female
        </div>

        {/* Courses */}
        <label>Courses:</label>
        <div className="checkbox-group">
          <input
            type="checkbox"
            value="React"
            onChange={handleCourseChange}
            checked={formData.f_Course.includes("React")}
          /> React
          <input
            type="checkbox"
            value="NodeJS"
            onChange={handleCourseChange}
            checked={formData.f_Course.includes("NodeJS")}
          /> NodeJS
          <input
            type="checkbox"
            value="JavaScript"
            onChange={handleCourseChange}
            checked={formData.f_Course.includes("JavaScript")}
          /> JavaScript
        </div>

        {/* File Upload */}
        <label htmlFor="f_Image">Upload Image:</label>
        <input
          type="file"
          name="f_Image"
          onChange={handleFileChange}
          accept="image/*"
        />
        {fileError && <p className="error-message">{fileError}</p>}

        {/* Display Image Preview */}
        {formData.f_Image && (
          <div className="uploaded-image">
            <img
              src={URL.createObjectURL(formData.f_Image)}  // Display the uploaded image
              alt="Uploaded"
            />
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Employee"}
        </button>

        {/* Error and Success Messages */}
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>
    </div>
  );
};

export default CreateEmployee;
