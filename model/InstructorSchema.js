const mongoose = require('mongoose');

const InstructorSchema = new mongoose.Schema({
    first_name:{
        type: String,
        require: true
    },
    last_name:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    },
    role:{
        type: String,
        require: true
    },
    Courses_Created:{
        type: Array
    },
}) ; 


module.exports = mongoose.model('Instructor', InstructorSchema);