const Instructor = require("../model/InstructorSchema");
const Students = require("../model/StudentSchema");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const httpStatusText = require('../utils/httpStatusText')

// register
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: httpStatusText.FAIL, data: errors });
  }
  const { FirstName, LastName, email, password } = req.body;
  const oldUser =
    (await Students.findOne({ email: email })) ||
    (await Instructor.findOne({ email: email }));
  if (oldUser) {
    return res.status(400).json({ status: httpStatusText.FAIL, data: "Email is invalid" });
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
  res.status(201).json({ status: httpStatusText.SUCCESS, data: { NewAccount: newUser } });
};

// Login
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: httpStatusText.FAIL, data: errors });
  }
  const { email, password } = req.body;
  const user = await Instructor.findOne({ email: email });
  if (!user) {
    return res
      .status(400)
      .json({ status: httpStatusText.FAIL, data: "Email or password is incorrect" });
  }
  const matchedPassword = await bcrypt.compare(password, user.password);
  if (!matchedPassword) {
    return res
      .status(400)
      .json({ status: httpStatusText.FAIL, data: "Email or password is incorrect" });
  }
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { Login: `welcome ${user.FirstName} ${user.LastName}` },
  });
};

// Update Info Account
const updateInfoAccount = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: httpStatusText.FAIL, data: errors });
  }
  const UpdateInfo = req.params.UserID;
  try {
    const user = await Instructor.findById(UpdateInfo);
    if (!user) {
      return res.status(400).json({ status: httpStatusText.FAIL, data: "user is invalid" });
    }
    await Instructor.updateOne({ _id: UpdateInfo }, { $set: { ...req.body } });
  } catch (error) {
    res.status(401).json({ status: httpStatusText.ERROR, message: error.message });
  }
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { updateInfoAccount: await Instructor.findById(UpdateInfo) },
  });
};

// DeleteAccount
const DeleteAccount = async (req, res) => {
  const UserID = req.params.UserID;
  try {
    const user = await Instructor.findById(UserID);
    if (!user) {
      return res.status(400).json({ status: httpStatusText.FAIL, data: "user is invalid" });
    }
    await Instructor.deleteOne({ _id: UserID });
  } catch (error) {
    res.status(401).json({ status: httpStatusText.ERROR, message: error.message });
  }
  res.status(201).json({ status: httpStatusText.SUCCESS, data: null });
};

module.exports = {
  register,
  login,
  updateInfoAccount,
  DeleteAccount,
};
