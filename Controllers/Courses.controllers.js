const Course = require("../model/CoursesSchema");
const { validationResult, body } = require("express-validator");
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middlewares/asyncWrapper");
const AppError = require("../utils/AppError");
const months = require("../utils/months");
const Instructor = require("../model/InstructorSchema");
const Students = require("../model/StudentSchema");

// add course
const AddCourse = asyncWrapper(async (req, res, next) => {
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
  const { title, description, price, UrlCourse } = req.body;

  const NewCourse = await new Course({
    title,
    description,
    price,
    UrlCourse,
  });
  //  Add the course creation date to the database [year, month]
  const DateAddCourse = new Date();
  const Month = months[DateAddCourse.getMonth()];
  const year = DateAddCourse.getFullYear().toString();
  NewCourse.Created_At = `${year}-${Month}`;
  // Add the Course Originator to database
  const CourseOriginator = req.currentUser;
  NewCourse.CourseOriginator = {
    id: CourseOriginator.id,
    FirstName: CourseOriginator.FirstName,
    LastName: CourseOriginator.LastName,
  };
  await NewCourse.save();

  // Add the course to the teacher list
  await Instructor.updateOne(
    { _id: req.currentUser.id },
    { $push: { CoursesCreated: NewCourse } }
  );

  res.status(201).json({ status: httpStatusText.SUCCESS, data: { NewCourse } });
});

// get course
const getCourse = asyncWrapper(async (req, res, next) => {
  const course = await Course.findById(req.params.CourseID, { __v: false });
  if (!course) {
    const error = AppError.create(
      "course is invalid",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }
  res.status(200).json({ status: httpStatusText.SUCCESS, data: course });
});

// get all courses
const getAllCourse = asyncWrapper(async (req, res, next) => {
  const query = req.query;
  const limit = query.limit;
  const page = query.page;
  const skip = (page - 1) * limit;
  const courses = await Course.find({}, { __v: false }).skip(skip).limit(limit);
  res.status(200).json({ status: httpStatusText.SUCCESS, data: courses });
});

// Update course
const UpdateInfoCourse = asyncWrapper(async (req, res, next) => {
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
  const courseID = req.params.CourseID;
  const course = await Course.findById(courseID);
  if (!course) {
    const error = AppError.create(
      null,
      400,
      httpStatusText.FAIL,
      "course is invalid"
    );
    return next(error);
  }

  if (course.CourseOriginator.id != req.currentUser.id) {
    return next(AppError.create("this role is not authorized", 401));
  }

  const NewCourseInfo = await Course.updateOne(
    { _id: courseID },
    { $set: { ...req.body } }
  );

  if (NewCourseInfo.modifiedCount >= 1) {
    //  update course from course assigned constructor
    await Instructor.updateOne(
      { _id: req.currentUser.id, "CoursesCreated._id": course._id },
      {
        $set: {
          "CoursesCreated.$": { ...course.toObject(), ...req.body },
        },
      }
    );
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { NewCourseInfo },
  });
});

// delete course
const deleteCourse = asyncWrapper(async (req, res, next) => {
  const courseID = req.params.CourseID;
  const course = await Course.findById(courseID);
  if (!course) {
    const error = AppError.create(
      null,
      400,
      httpStatusText.FAIL,
      "course is invalid"
    );
    return next(error);
  }
  if (course.CourseOriginator.id != req.currentUser.id) {
    return next(AppError.create("this role is not authorized", 401));
  }

  await Course.deleteOne({ _id: courseID });
  // Delete course from course assigned constructor
  await Instructor.updateOne(
    { _id: req.currentUser.id },
    { $pull: { CoursesCreated: { _id: course._id } } }
  );

  res.status(201).json({ status: httpStatusText.SUCCESS, data: null });
});

// Buy a course
const BuyCourse = asyncWrapper(async (req, res, next) => {
  const courseID = req.params.CourseID;
  const course = await Course.findOne(
    { _id: courseID },
    { _v: false, StudentsEnrolled: false }
  );

  if (!course) {
    const error = AppError.create(
      null,
      400,
      httpStatusText.FAIL,
      "course is invalid"
    );
    return next(error);
  }
  //
  const currentStudents = await Students.findOne(
    { _id: req.currentUser.id },
    { FirstName: true, LastName: true, _id: true }
  );
  //

  
  await Course.updateOne(
    { _id: courseID },
    { $push: { StudentsEnrolled: currentStudents }}
  );
  //
  await Students.updateOne(
    { _id: currentStudents._id },
    { $push: { CoursesEnrolled: course } }
  );
  //
  await Instructor.updateOne(
    { _id: course.CourseOriginator.id, "CoursesCreated._id": course._id },
    { $push: { "CoursesCreated.$.StudentsEnrolled": currentStudents } }
  );

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { UrlCourse: course.UrlCourse },
  });
});

module.exports = {
  AddCourse,
  getCourse,
  getAllCourse,
  UpdateInfoCourse,
  deleteCourse,
  BuyCourse,
};
