const Instructor = require("../model/InstructorSchema");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

// register
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json(errors);
  }
  const { FirstName, LastName, email, password } = req.body;
  const oldUser = await Instructor.findOne({ email: email });
  if (oldUser) {
    return res.status(401).json("Email is invalid");
  }
  // password Hashing
  const passwordHashing = await bcrypt.hash(password, 10);
  // Save the user to the database
  const newUser = new Instructor({
    FirstName,
    LastName,
    email,
    password: passwordHashing,
    role: "Instructor",
    Courses_Created: null,
  });
  await newUser.save();
  res.json(newUser);
};

// Login
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json(errors);
  }
  const { email, password } = req.body;
  const user = await Instructor.findOne({ email: email });
  if (!user) {
    return res.status(401).json("Email or password is incorrect");
  }
  const matchedPassword = await bcrypt.compare(password, user.password);
  if (!matchedPassword) {
    return res.status(401).json("Email or password is incorrect");
  }
  res.status(201).json(user);
};

// Update Info Account
const updateInfoAccount = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json(errors);
  }
  const UpdateInfo = req.params.UserID;
  try {
    const user = await Instructor.findOne({ _id: UpdateInfo });
    if (!user) {
      return res.json("user is invalid");
    }
    await Instructor.updateOne({ _id: UpdateInfo }, { $set: { ...req.body } });
  } catch (error) {
    console.log(error);
    res.json("Try again");
  }
  res.json("done");
};

// DeleteAccount
const DeleteAccount = async (req, res) => {
  const UserID = req.params.UserID;
  try {
    const user = await Instructor.findOne({ _id: UserID });
    if (!user) {
      return res.json("user is invalid");
    }
    await Instructor.deleteOne({ _id: UserID });
  } catch (error) {
    console.log(error);
    res.json("Try again");
  }
  return res.json("done");
};

module.exports = {
  register,
  login,
  updateInfoAccount,
  DeleteAccount,
};
