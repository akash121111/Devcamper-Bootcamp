const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const ErrorResponce = require('../utils/errorResponse');

//@desc     GET ALL BOOTCAMPS
//@routes   GET /api/v1/bootcamps
//@access   public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  //copy queryStr to queryReq

  const queryReq = { ...req.query };

  console.log(req.query);

  //field to remove

  const removeField = ['select', 'sort', 'limit', 'page'];

  //loop removefields to deleted

  removeField.forEach((params) => delete queryReq[params]);

  //create query string
  let queryStr = JSON.stringify(queryReq);

  //crete operaters like gt,gte,lt,lte and in

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //finding resource

  query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

  //select request
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  //sort
  if (req.query.sort) {
    const fields = req.query.sort.split(',').join(' ');
    query = query.sort(fields);
  } else {
    query = query.sort('-createdAt');
  }

  //pagination

  const page = parseInt(req.query.page, 10) || 1;

  const limit = parseInt(req.query.limit, 10) || 25;

  const startIndex = (page - 1) * limit;

  const endIndex = page * limit;

  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  //pagination query

  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  const bootcamps = await query;
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
});

//@desc     GET ONE BOOTCAMPS
//@routes   GET /api/v1/bootcamps/:id
//@access   public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  res.status(200).json({ success: true, data: bootcamp });

  if (!bootcamp) {
    return next(
      new ErrorResponce(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
});

//@desc     CREATE NEW BOOTCAMPS
//@routes   POST /api/v1/bootcamps
//@access   private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

//@desc     UPDATE BOOTCAMPS
//@routes   PUT /api/v1/bootcamps/:id
//@access   private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return res.status(400).json({
      success: false,
      data: 'no any data available',
    });
  }
  return res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

//@desc     DELETE BOOTCAMPS
//@routes   DELETE /api/v1/bootcamps/:id
//@access   private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return res.status(400).json({
      success: false,
      data: 'no any data available',
    });
  }
  bootcamp.remove();
  return res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc     Get bootcamp using distance
// @routes   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access   public
exports.getBootcampUsingRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  //get lat and long from zipcode

  console.log(distance);
  console.log(zipcode);

  const loc = await geocoder.geocode(zipcode);

  const lat = loc[0].latitude;
  const lon = loc[0].longitude;

  //calculate radius using distance

  //radius of Earth =6 378.1 kilometers

  const radius = distance / 3963;

  console.log(radius);
  console.log(lat);
  console.log(lon);

  const bootcamps = await Bootcamp.find({
    // location: { city: { $eq: 'aya' } }
    location: { $geoWithin: { $centerSphere: [[lon, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
