const express = require("express");
const router = express.Router();
const StudentsControllers = require("../Controllers/Students.controllers");
const {
  validationSchemaRegisterStudents,
  validationSchemaLoginStudents,
  ValidationschemeupdateinfoStudents,
} = require("../middlewares/validationSchemaStudents");

const verificationToken = require("../middlewares/verificationToken");
const allowedTo = require("../middlewares/allowedTo");
const usersRoles = require("../utils/usersRoles");

router
  .post(
    "/register",
    validationSchemaRegisterStudents(),
    StudentsControllers.register
  )
  .post("/login", validationSchemaLoginStudents(), StudentsControllers.login);

router.patch(
  "/UpdateInfoUser/",
  verificationToken,
  allowedTo(usersRoles.student),
  ValidationschemeupdateinfoStudents(),
  StudentsControllers.updateInfoAccount
);

router.delete(
  "/DeleteAccount/",
  verificationToken,
  allowedTo(usersRoles.student),
  StudentsControllers.DeleteAccount
);

module.exports = router;
