const Employee = require('../models/employee');
const fs = require('fs');
const path = require('path');

// Middleware to serve uploaded files
const uploadPath = path.join(__dirname, '../uploads');

// Get all employees
const getAllEmployees = async (req, res) => {
  try {
    const employee = await Employee.find();

    const employeeWithImage = employee.map((employee) => ({
      ...employee.toObject(),
      f_Image: employee.f_Image
        ? `${req.protocol}://${req.get('host')}${employee.f_Image}`
        : null,
    }));

    res.status(200).json(employeeWithImage);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ message: 'Error fetching employees' });
  }
};

// Create a new employee
const createEmployee = async (req, res) => {
  try {
    const { f_Name, f_Email, f_Mobile, f_Designation, f_Gender, f_Course } = req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newEmployee = new Employee({
      f_Name,
      f_Email,
      f_Mobile,
      f_Designation,
      f_Gender,
      f_Course: Array.isArray(f_Course) ? f_Course : [f_Course],
      f_Image: imageUrl,
    });

    await newEmployee.save();
    res.status(201).json({ message: 'Employee created successfully', employee: newEmployee });
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(400).json({ message: 'Failed to create employee. Please try again.' });
  }
};

// Get employee by ID
const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const employeeWithImage = {
      ...employee.toObject(),
      f_Image: employee.f_Image
        ? `${req.protocol}://${req.get('host')}${employee.f_Image}`
        : null,
    };

    res.status(200).json(employeeWithImage);
  } catch (err) {
    console.error("Error fetching employee:", err);
    res.status(500).json({ message: 'Error fetching employee' });
  }
};

// Update employee
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { f_Name, f_Email, f_Mobile, f_Designation, f_Gender, f_Course } = req.body;

    const existingEmployee = await Employee.findById(id);
    if (!existingEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    let imageUrl = existingEmployee.f_Image;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      if (existingEmployee.f_Image) {
        const oldImagePath = path.join(uploadPath, path.basename(existingEmployee.f_Image));
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
    }

    existingEmployee.f_Name = f_Name;
    existingEmployee.f_Email = f_Email;
    existingEmployee.f_Mobile = f_Mobile;
    existingEmployee.f_Designation = f_Designation;
    existingEmployee.f_Gender = f_Gender;
    existingEmployee.f_Course = Array.isArray(f_Course) ? f_Course : [f_Course];
    existingEmployee.f_Image = imageUrl;

    const updatedEmployee = await existingEmployee.save();
    res.status(200).json(updatedEmployee);
  } catch (err) {
    console.error("Error updating employee:", err);
    res.status(500).json({ message: 'Error updating employee' });
  }
};

// Delete employee
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (employee.f_Image) {
      const imagePath = path.join(uploadPath, path.basename(employee.f_Image));
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await employee.deleteOne();
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error("Error deleting employee:", err);
    res.status(500).json({ message: 'Error deleting employee' });
  }
};

module.exports = {
  getAllEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
