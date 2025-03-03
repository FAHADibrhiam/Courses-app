const AppError = require("../utils/AppError");
module.exports = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.currentUser.role)) {
      return next(AppError.create("this role is not authorized", 401));
    }
    return next();
  };
};
