const Instructor = require("../model/InstructorSchema");
const Students = require("../model/StudentSchema");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middlewares/asyncWrapper");
const AppError = require("../utils/AppError");
// register
const register = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = AppError.create(
      null,
      400,
      httpStatusText.FAIL,
      errors.array()
    );
    return next(error);
  }
  const { FirstName, LastName, email, password } = req.body;
  const oldUser =
    (await Students.findOne({ email: email })) ||
    (await Instructor.findOne({ email: email }));
  if (oldUser) {
    const error = AppError.create(
      null,
      400,
      httpStatusText.FAIL,
      "Email is invalid"
    );
    return next(error);
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
  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { NewAccount: newUser } });
});
// Login
const login = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = AppError.create(
      null,
      400,
      httpStatusText.FAIL,
      errors.array()
    );
    return next(error);
  }
  const { email, password } = req.body;
  const user = await Instructor.findOne({ email: email });
  if (!user) {
    const error = AppError.create(
      null,
      400,
      httpStatusText.FAIL,
      "Email or password is incorrect"
    );
    return next(error);
  }
  const matchedPassword = await bcrypt.compare(password, user.password);
  if (!matchedPassword) {
    const error = AppError.create(
      null,
      400,
      httpStatusText.FAIL,
      "Email or password is incorrect"
    );
    return next(error);
  }
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { Login: `welcome ${user.FirstName} ${user.LastName}` },
  });
});
// Update Info Account
const updateInfoAccount = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = AppError.create(
      null,
      400,
      httpStatusText.FAIL,
      errors.array()
    );
    return next(error);
  }
  const UpdateInfo = req.params.UserID;
  const user = await Instructor.findById(UpdateInfo);
  if (!user) {
    const error = AppError.create(
      null,
      400,
      httpStatusText.FAIL,
      "user is invalid"
    );
    return next(error);
  }

  const oldUser =
    (await Students.findOne({ email: req.body.email })) ||
    (await Instructor.findOne({ email: req.body.email }));
  if (oldUser) {
    const error = AppError.create(
      null,
      400,
      httpStatusText.FAIL,
      "Email is invalid"
    );
    return next(error);
  }
  await Instructor.updateOne({ _id: UpdateInfo }, { $set: { ...req.body } });

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { updateInfoAccount: await Instructor.findById(UpdateInfo) },
  });
});
// DeleteAccount
const DeleteAccount = asyncWrapper(async (req, res, next) => {
  const UserID = req.params.UserID;
  const user = await Instructor.findById(UserID);
  if (!user) {
    const error = AppError.create(
      null,
      400,
      httpStatusText.FAIL,
      "user is invalid"
    );
    return next(error);
  }

  await Instructor.deleteOne({ _id: UserID });
  res.status(201).json({ status: httpStatusText.SUCCESS, data: null });
});
module.exports = {
  register,
  login,
  updateInfoAccount,
  DeleteAccount,
};
