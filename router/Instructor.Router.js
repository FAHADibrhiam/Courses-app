const express = require("express");
const router = express.Router();
const InstructorControllers = require("../Controllers/Instructor.controllers");
const {
  validationSchemaRegisterInstructor,
  validationSchemaLoginInstructor,
  ValidationschemeupdateinfoInstructor,
} = require("../middlewares/validationSchemaInstructor");

const verificationToken = require("../middlewares/verificationToken");
const allowedTo = require("../middlewares/allowedTo");
const usersRoles = require("../utils/usersRoles");
router
  .post(
    "/register",
    validationSchemaRegisterInstructor(),
    InstructorControllers.register
  )
  .post(
    "/login",
    validationSchemaLoginInstructor(),
    InstructorControllers.login
  );

router.patch(
  "/UpdateInfoUser/",
  verificationToken,
  allowedTo(usersRoles.Instructor),
  ValidationschemeupdateinfoInstructor(),
  InstructorControllers.updateInfoAccount
);

router.delete(
  "/DeleteAccount/",
  verificationToken,
  allowedTo(usersRoles.Instructor),
  InstructorControllers.DeleteAccount
);

module.exports = router;
