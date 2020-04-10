const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const ErrorResponce = require('../utils/errorResponse');
const path = require('path');

//@desc     GET ALL BOOTCAMPS
//@routes   GET /api/v1/bootcamps
//@access   public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advanceResult);
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

//@desc     Upload photo to BOOTCAMPS
//@routes   POST /api/v1/bootcamps/:id/photo
//@access   private

exports.uploadBootcampPhoto = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponce(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.FILE_MAX_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.FILE_MAX_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
  });
  res.status(200).json({
    success: true,
    date: file.name,
  });
});
