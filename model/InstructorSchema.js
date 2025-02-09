const mongoose = require("mongoose");

const InstructorSchema = new mongoose.Schema({
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
  CoursesCreated: {
    type: Array,
  },
});

module.exports = mongoose.model("Instructor", InstructorSchema);
