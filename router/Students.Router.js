const express = require("express");
const router = express.Router();
const StudentsControllers = require("../Controllers/Students.controllers");
const {
    validationSchemaRegisterStudents,
    validationSchemaLoginStudents,
    ValidationschemeupdateinfoStudents,
  } = require("../middlewares/validationSchemaStudents");
router
  .post(
    "/register",
    validationSchemaRegisterStudents(),
    StudentsControllers.register
  )
  .post("/login", validationSchemaLoginStudents(), StudentsControllers.login);

router.patch(
  "/UpdateInfoUser/:UserID",
  ValidationschemeupdateinfoStudents(),
  StudentsControllers.updateInfoAccount
);

router.delete("/DeleteAccount/:UserID", StudentsControllers.DeleteAccount);

module.exports = router;
