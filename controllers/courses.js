const asyncHandler = require('../middleware/async');
const ErrorResponce = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');
const Course = require('../models/Course');

//@desc     Get courses
//@routes   GET /api/v1/courses
//@routes   GET /api/v1/bootcamps/:bootcampId/courses
//@access   public

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description',
    });
  }

  const courses = await query;
  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

//@desc     Get single course
//@routes   GET /api/v1/courses/:id
//@access   public

exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!course) {
    return next(
      new ErrorResponce(`Course not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: course });
});

//@desc     Add course
//@routes   POST /api/v1/bootcamps/:bootcampid
//@access   private

exports.addCourse = asyncHandler(async (req, res, next) => {
  console.log('hello');
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponce(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  const course = await Course.create(req.body);

  res.status(201).json({
    success: true,
    data: course,
  });
});

//@desc     Add course
//@routes   POST /api/v1/bootcamps/:bootcampId
//@access   private

exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponce(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  const course = await Course.create(req.body);

  res.status(201).json({
    success: true,
    data: course,
  });
});

//@desc     update course
//@routes   PUT /api/v1/cources/:id
//@access   private

exports.updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponce(`Course not found with id of ${req.params.id}`, 404)
    );
  }
  const courses = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: courses,
  });
});

//@desc     delete course
//@routes   DELETE /api/v1/cources/:id
//@access   private

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponce(`Course not found with id of ${req.params.id}`, 404)
    );
  }

  await Course.remove();
  res.status(200).json({
    success: true,
    data: {},
  });
});
