const express = require("express");
const router = express.Router();
const InstructorControllers = require("../Controllers/Instructor.controllers");
const {
  validationSchemaRegisterInstructor,
  validationSchemaLoginInstructor,
  ValidationschemeupdateinfoInstructor,
} = require("../middlewares/validationSchemaInstructor");
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
  "/UpdateInfoUser/:UserID",
  ValidationschemeupdateinfoInstructor(),
  InstructorControllers.updateInfoAccount
);

router.delete("/DeleteAccount/:UserID", InstructorControllers.DeleteAccount);

module.exports = router;
