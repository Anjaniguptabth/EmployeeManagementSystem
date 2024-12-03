const mongoose = require('mongoose');

// Employee Schema
const employeeSchema = new mongoose.Schema({
  f_Id: { type: Number, unique: true },
  f_Name: { type: String, required: true },
  f_Email: { type: String, required: true, unique: true },
  f_Mobile: { type: String, required: true, unique: true },
  f_Designation: { type: String },
  f_Gender: { type: String, required: true, enum: ['Male', 'Female'] },
  f_Course: { type: [String] },
  f_Image: { type: String }, 
  f_Createdate: { type: Date, default: Date.now },
});


employeeSchema.pre('save', async function (next) {
  if (this.isNew) {
    const lastEmployee = await this.constructor.findOne().sort({ f_Id: -1 });
    this.f_Id = lastEmployee ? lastEmployee.f_Id + 1 : 1;  // Start from 1
  }
  next();
});

// Model
const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
