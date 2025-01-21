const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
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
    courses_enrolled:{
        type: Array
    },
    
})

module.exports = mongoose.model("Student",StudentSchema);