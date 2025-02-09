const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());

// الاتصال بقاعدة البيانات
const mongoose = require("mongoose");
const url = process.env.URL_DATABASE;
mongoose
  .connect(url)
  .then(() => console.log("Connected DataBase!"))
  .catch((error) => console.log("error: ", error));

const RouterInstructor = require("./router/Instructor.Router");
const RouterStudents = require("./router/Students.Router");
app.use("/api/Instructor", RouterInstructor);
app.use("/api/Students", RouterStudents);

app.all("*", (req, res) => {
  res.json("The page is not available");
});
app.listen(process.env.PORT, () => {
  console.log("Connected Server!");
});
