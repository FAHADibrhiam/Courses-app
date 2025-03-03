const express = require("express");
const router = express.Router();
const CoursesControllers = require("../Controllers/Courses.controllers");
const {
  validationSchemaAddCourse,
  validationSchemaUpdateinfocourse,
} = require("../middlewares/validationSchemaCourse");

const verificationToken = require("../middlewares/verificationToken");
const allowedTo = require("../middlewares/allowedTo");
const usersRoles = require("../utils/usersRoles");
router
  .route("/")
  // add course
  .post(
    verificationToken,
    allowedTo(usersRoles.Instructor),
    validationSchemaAddCourse(),
    CoursesControllers.AddCourse
  )
  // get all courses
  .get(verificationToken, CoursesControllers.getAllCourse);

// get course
router.get("/:CourseID", verificationToken, CoursesControllers.getCourse);

// Update course
router.patch(
  "/updateinfocourse/:CourseID",
  verificationToken,
  allowedTo(usersRoles.Instructor),
  validationSchemaUpdateinfocourse(),
  CoursesControllers.UpdateInfoCourse
);

// delete course
router.delete(
  "/deletecourse/:CourseID",
  verificationToken,
  allowedTo(usersRoles.Instructor),
  CoursesControllers.deleteCourse
);

// Buy a course

router.post(
  "/buycourse/:CourseID",
  verificationToken,
  allowedTo(usersRoles.student),
  CoursesControllers.BuyCourse
);

module.exports = router;
