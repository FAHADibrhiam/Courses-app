const { body } = require("express-validator");

const validationSchemaRegisterStudents = () => {
  return [
    body("FirstName")
      .trim()
      .notEmpty()
      .withMessage("The first name is required")
      .isString()
      .isLength({ min: 3 })
      .withMessage("The first Name must be more than 3 characters long"),
    body("LastName")
      .trim()
      .notEmpty()
      .withMessage("The last name is required")
      .isString()
      .isLength({ min: 3 })
      .withMessage("The last Name must be more than 3 characters long"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("the email is required")
      .isEmail()
      .withMessage("filed must be a valid email address"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("the password is required")
      .isString()
      .isLength({ min: 8 })
      .withMessage("The password must be more than 8 characters long")
      .matches(/[@#$]/)
      .withMessage("Password must contain a special character (@, #, $,)"),
  ];
};

const validationSchemaLoginStudents = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("the email is required")
      .isEmail()
      .withMessage("filed must be a valid email address"),
    body("password").notEmpty().withMessage("the password is required").trim(),
  ];
};
const ValidationschemeupdateinfoStudents = () => {
  return [
    body("FirstName")
      .trim()
      .optional()
      .isString()
      .isLength({ min: 3 })
      .withMessage("The first Name must be more than 3 characters long"),
    body("LastName")
      .trim()
      .optional()
      .isString()
      .isLength({ min: 3 })
      .withMessage("The last Name must be more than 3 characters long"),
    body("email")
      .trim()
      .optional()
      .isEmail()
      .withMessage("filed must be a valid email address"),
    body("password")
      .trim()
      .optional()
      .isString()
      .isLength({ min: 8 })
      .withMessage("The password must be more than 8 characters long")
      .matches(/[@#$]/)
      .withMessage("Password must contain a special character (@, #, $,)"),
  ];
};

module.exports = {
  validationSchemaRegisterStudents,
  validationSchemaLoginStudents,
  ValidationschemeupdateinfoStudents,
};
