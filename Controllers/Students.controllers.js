const Students = require("../model/StudentSchema");
const Instructor = require("../model/InstructorSchema");
const { validationResult, body } = require("express-validator");
const bcrypt = require("bcrypt");
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middlewares/asyncWrapper");
const AppError = require("../utils/AppError");
const generateJWT = require("../utils/generateJWT");
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
  const newUser = new Students({
    FirstName,
    LastName,
    email,
    password: passwordHashing,
    role: "Student",
  });
  // generate json web token
  const token = await generateJWT({
    FirstName: FirstName,
    LastName: LastName,
    id: newUser._id,
    role: newUser.role,
  });
  newUser.token = token;
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
  const user = await Students.findOne({ email: email });
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
  // generate json web token
  const token = await generateJWT({
    FirstName: user.FirstName,
    LastName: user.LastName,
    id: user._id,
    role: user.role,
  });
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { welcome: `${user.FirstName} ${user.LastName}`, token },
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

  const currentUserID = req.currentUser.id;
  const user = await Students.findOne({ _id: currentUserID });
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
  const NewInfo = await Students.updateOne(
    { _id: currentUserID },
    { $set: { ...req.body } }
  );
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { updateInfoAccount: NewInfo },
  });
});

// DeleteAccount
const DeleteAccount = asyncWrapper(async (req, res, next) => {
  const currentUserID = req.currentUser.id;
  const user = await Students.findOne({ _id: currentUserID });
  if (!user) {
    const error = AppError.create(
      null,
      400,
      httpStatusText.FAIL,
      "user is invalid"
    );
    return next(error);
  }
  await Students.deleteOne({ _id: currentUserID });
  res.status(201).json({ status: httpStatusText.SUCCESS, data: null });
});

module.exports = {
  register,
  login,
  updateInfoAccount,
  DeleteAccount,
};
