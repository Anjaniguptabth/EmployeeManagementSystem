import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../api"; // Adjust this import to your API module
import "./EditEmployee.css";

const EditEmployee = () => {
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  // Load employee data on page load
  useEffect(() => {
    const fetchEmployee = async () => {
      setLoadingData(true);
      try {
        const { data } = await API.get(`/employees/${id}`);
        console.log(data); // Log data to check its structure
        setFormData({
          f_Name: data.f_Name || "",
          f_Email: data.f_Email || "",
          f_Mobile: data.f_Mobile || "",
          f_Designation: data.f_Designation || "",
          f_Gender: data.f_Gender || "",
          f_Course: data.f_Course || [],
          f_Image: data.f_Image || null,
        });
      } catch (error) {
        console.error("Error fetching employee data:", error);
        setError("Failed to load employee data.");
      } finally {
        setLoadingData(false);
      }
    };

    if (id) {
      fetchEmployee();
    }
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate required fields
    if (!formData.f_Name || !formData.f_Email || !formData.f_Mobile || !formData.f_Gender) {
      setError("All fields are required.");
      return;
    }

    // Prepare form data
    const data = new FormData();
    for (let key in formData) {
      if (key === "f_Course") {
        formData[key].forEach((item) => data.append("f_Course[]", item));
      } else {
        data.append(key, formData[key]);
      }
    }

    setLoading(true);
    try {
      await API.put(`/employees/${id}`, data);
      setSuccess("Employee updated successfully!");
      setTimeout(() => navigate("/employees"), 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error("Error updating employee:", error);
      setError("Failed to update employee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !["image/jpeg", "image/png"].includes(file.type)) {
      setFileError("Only JPG and PNG files are allowed.");
    } else {
      setFileError("");
      setFormData({ ...formData, f_Image: file });
    }
  };

  // Handle course selection
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

  if (loadingData) {
    return <div>Loading employee data...</div>;
  }

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
          <button className="logout-btn" onClick={() => navigate("/login")}>Logout</button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-item active">Edit Employee</div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="edit-form">
        <div className="form-row">
          <label>Name:</label>
          <input
            type="text"
            name="f_Name"
            value={formData.f_Name}
            onChange={handleChange}
            placeholder="Enter Name"
            required
          />
          </div>
         <div className="form-row">
          <label>Email (Non-editable):</label>
          <input
            type="email"
            name="f_Email"
            value={formData.f_Email}
            readOnly
            className="readonly"
          />
        </div>

        <div className="form-row">
          <label>Mobile:</label>
          <input
            type="text"
            name="f_Mobile"
            value={formData.f_Mobile}
            onChange={handleChange}
            placeholder="Enter Mobile Number"
            required
            pattern="[0-9]{10}"
            title="Enter a valid 10-digit mobile number"
          />
          </div>
           <div className="form-row">
          <label>Designation:</label>
          <select
            name="f_Designation"
            value={formData.f_Designation}
            onChange={handleChange}
          >
            <option value="">Select Designation</option>
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>
        </div>

        <div className="form-row">
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
        </div>

        <div className="form-row">
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
        </div>

        <div className="form-row">
          <label>Upload New Image:</label>
          <input type="file" name="f_Image" onChange={handleFileChange} accept="image/*" />
          {fileError && <p className="error-message">{fileError}</p>}
        </div>

        {formData.f_Image && (
          <div className="existing-image">
            <img
              src={typeof formData.f_Image === "string" ? formData.f_Image : URL.createObjectURL(formData.f_Image)}
              alt="Employee"
              className="employee-image"
            />
          </div>
        )}

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Employee"}
        </button>
      </form>
    </div>
  );
};

export default EditEmployee;
