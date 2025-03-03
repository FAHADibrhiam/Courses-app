const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    require: true,
  },
  LastName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    require: true,
  },
  CoursesEnrolled: {
    type: Array,
  },
  token:{
    type: String
  }
});

module.exports = mongoose.model("Student", StudentSchema);
