const express = require("express");
const app = express();
require("dotenv").config();
const httpStatusText = require("./utils/httpStatusText");
const cors = require("cors");

// الاتصال بقاعدة البيانات
const mongoose = require("mongoose");
const UrlDatabase = process.env.URL_DATABASE;
mongoose
  .connect(UrlDatabase)
  .then(() => console.log("Connected DataBase!"))
  .catch((error) => console.log("error: ", error));

app.use(express.json());
app.use(cors());

const RouterInstructor = require("./router/Instructor.Router");
const RouterStudents = require("./router/Students.Router");
const RouterCourses = require("./router/Course.Router");
app.use("/api/Instructor", RouterInstructor);
app.use("/api/Students", RouterStudents);
app.use("/api/course", RouterCourses);

// global middleware for not found router
app.all("*", (req, res) => {
  res.json("The page is not available");
});

//  global error handler
app.use((error, req, res, next) => {
  res.status(error.StatusCode || 500).json({
    status: error.httpStatusText || httpStatusText.ERROR,
    message: error.message || null,
    code: error.StatusCode,
    data: error.data || null,
  });
});
//  تشغيل السيرفر
app.listen(process.env.PORT, () => {
  console.log("Connected Server!");
});
