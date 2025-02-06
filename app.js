const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());

// الاتصال بقاعدة البيانات
const mongoose = require("mongoose");
const url = process.env.URL_DATABASE;
  .connect(url)
  .then(() => console.log("Connected DataBase!"))
  .catch((error) => console.log("error: ", error));

const RouterInstructor = require("./router/Instructor.Router");
app.use("/api/Instructor", RouterInstructor);

app.listen(process.env.PORT, () => {
  console.log("Connected Server!");
});
