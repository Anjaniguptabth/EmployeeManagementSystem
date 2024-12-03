// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  f_sno: { type: Number, required: true, unique: true }, // Serial number (Primary Key)
  f_userName: { type: String, required: true, unique: true }, // Username (Unique)
  f_Pwd: { type: String, required: true } // Password
});

module.exports = mongoose.model('User', UserSchema);

