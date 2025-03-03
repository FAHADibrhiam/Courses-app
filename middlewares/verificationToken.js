const jwt = require("jsonwebtoken");
const asyncWrapper = require("../middlewares/asyncWrapper");
const AppError = require("../utils/AppError");
const httpStatusText = require("../utils/httpStatusText");

const verificationToken = asyncWrapper(async (req, res, next) => {
  const authHeader =
    req.header["Authorization"] || req.headers["authorization"];
  if (!authHeader) {
    const error = AppError.create(
      null,
      401,
      httpStatusText.FAIL,
      "login is required"
    );

    return next(error);
  }
  try {
    const tokenUser = authHeader.split(" ")[1];

    const currentUser = await jwt.verify(
      tokenUser,
      process.env.SECRET_KEY_TOKEN
    );
    
    
    req.currentUser = currentUser;
    next();
  } catch (err) {
    const error = AppError.create(
      null,
      401,
      httpStatusText.FAIL,
      "token is invalid"
    );

    next(error);
  }
});

module.exports = verificationToken;
