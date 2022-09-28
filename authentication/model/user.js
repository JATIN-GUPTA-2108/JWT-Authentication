const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String, default: null },
  middle_name:{ type: String, default: null },
  last_name: { type: String, default: null },
  country: { type: String, default: null },
  role: { type: String, default: null },
  phone:{type: Number, default:null},
  email: { type: String, unique: true },
  password: { type: String },
  token: { type: String },
});

module.exports = mongoose.model("user", userSchema);