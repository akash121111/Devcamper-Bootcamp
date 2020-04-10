const express = require('express');
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampUsingRadius,
  uploadBootcampPhoto,
} = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');

const advanceResult = require('../middleware/advanceResult');

//include other resources routes

const courseRouter = require('./courses');

const router = express.Router();

//routes for courses

router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampUsingRadius);

router
  .route('/')
  .get(advanceResult(Bootcamp, 'courses'), getBootcamps)
  .post(createBootcamp);

//upload photo

router.route('/:id/photo').put(uploadBootcampPhoto);

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
