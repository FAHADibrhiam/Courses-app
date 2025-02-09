const Students = require("../model/StudentSchema");
const Instructor = require("../model/InstructorSchema");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json(errors);
  }
  const { FirstName, LastName, email, password } = req.body;
  const oldUser =
    (await Students.findOne({ email: email })) ||
    (await Instructor.findOne({ email: email }));
  if (oldUser) {
    return res.status(401).json("Email is invalid");
  }
  // password Hashing
  const passwordHashing = await bcrypt.hash(password, 10);
  // Save the user to the database
  const newUser = new Students({
    FirstName,
    LastName,
    email,
    password: passwordHashing,
    role: "Students",
    Courses_Enrolled: null,
  });
  await newUser.save();
  res.json(newUser);
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json(errors);
  }
  const { email, password } = req.body;
  const user = await Students.findOne({ email: email });
  if (!user) {
    return res.status(401).json("Email or password is incorrect");
  }
  const matchedPassword = await bcrypt.compare(password, user.password);
  if (!matchedPassword) {
    return res.status(401).json("Email or password is incorrect");
  }
  res.status(201).json(user);
};

const updateInfoAccount = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json(errors);
  }
  const UpdateInfo = req.params.UserID;
  try {
    const user = await Students.findOne({ _id: UpdateInfo });
    if (!user) {
      return res.json("user is invalid");
    }
    await Students.updateOne({ _id: UpdateInfo }, { $set: { ...req.body } });
  } catch (error) {
    console.log(error);
    res.json("Try again");
  }
  res.json("done");
};

const DeleteAccount = async (req, res) => {
  const UserID = req.params.UserID;
  try {
    const user = await Students.findOne({ _id: UserID });
    if (!user) {
      return res.json("user is invalid");
    }
    await Students.deleteOne({ _id: UserID });
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
