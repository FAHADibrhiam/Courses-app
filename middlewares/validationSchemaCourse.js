const { body } = require("express-validator");

const validationSchemaAddCourse = () => {
  return [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("The title is required")
      .isString(),

    body("description")
      .trim()
      .notEmpty()
      .withMessage("The description is required")
      .isString(),

    body("price")
      .trim()
      .notEmpty()
      .withMessage("The price is required")
      .isString(),

    body("UrlCourse")
      .trim()
      .notEmpty()
      .withMessage("The Url course is required")
      .isURL()
      .withMessage("The requested link must be valid")
      .isString(),
  ];
};

const validationSchemaUpdateinfocourse = () => {
  return [
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("The title is required")
      .isString(),

    body("description")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("The description is required")
      .isString(),

    body("price")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("The price is required")
      .isString(),

    body("UrlCourse")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("The Url course is required")
      .isURL()
      .withMessage("The requested link must be valid")
      .isString(),
  ];
};

module.exports = {
  validationSchemaAddCourse,
  validationSchemaUpdateinfocourse,
};
