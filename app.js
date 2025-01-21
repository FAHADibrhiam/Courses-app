const express = require('express');
const app = express();
const myusers = require('../Courses-app/model/StudentSchema')
const myuers = require('../Courses-app/model/InstructorSchema')
const myuser = require('../Courses-app/model/CoursesSchema')

require("dotenv").config();

app.use(express.json());

const mongoose = require('mongoose');
const url = process.env.ULR_DATABASE;
mongoose.connect(url).then(()=>{
    console.log("Connected!");
});



app.listen(3000,()=>{
    console.log("Connected Server !");
})


