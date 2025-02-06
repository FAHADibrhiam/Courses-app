const mongoose = require("mongoose");

const CoursesSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  InstructorID: {
    type: String,
    require: true,
  },
  StudentsEnrolled: {
    type: Array,
    require: true,
  },
  Created_At: {
    type: String,
    require: true,
  },
  UrlCourse: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("course", CoursesSchema);
