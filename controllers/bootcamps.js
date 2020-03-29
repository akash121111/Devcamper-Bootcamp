const Bootcamp = require('../models/Bootcamps');
const ErrorResponce = require('../utils/errorResponse');

//@desc     GET ALL BOOTCAMPS
//@routes   GET /api/v1/bootcamps
//@access   public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({
      success: true,
      data: bootcamps
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      data: 'no any devcamper available'
    });
  }
};

//@desc     GET ONE BOOTCAMPS
//@routes   GET /api/v1/bootcamps/:id
//@access   public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    res.status(200).json({ success: true, data: bootcamp });

    if (!bootcamp) {
      return next(
        new ErrorResponce(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }
  } catch (err) {
    // res.status(400).json({
    //   success: false,
    //   data: 'no any data available'

    // });
    next(
      new ErrorResponce(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
};

//@desc     CREATE NEW BOOTCAMPS
//@routes   POST /api/v1/bootcamps
//@access   private
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc     UPDATE BOOTCAMPS
//@routes   PUT /api/v1/bootcamps/:id
//@access   private
exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!bootcamp) {
      return res.status(400).json({
        success: false,
        data: 'no any data available'
      });
    }
    return res.status(200).json({
      success: true,
      data: bootcamp
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      data: 'no any data available'
    });
  }
};

//@desc     DELETE BOOTCAMPS
//@routes   DELETE /api/v1/bootcamps/:id
//@access   private
exports.deleteBootcamp = async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  try {
    if (!bootcamp) {
      return res.status(400).json({
        success: false,
        data: 'no any data available'
      });
    }
    return res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      data: 'no any data available'
    });
  }
};
