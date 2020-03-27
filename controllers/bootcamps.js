//@desc     GET ALL BOOTCAMPS
//@routes   GET /api/v1/bootcamps
//@access   public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'show all Bootcamp' });
};

//@desc     GET ONE BOOTCAMPS
//@routes   GET /api/v1/bootcamps/:id
//@access   public
exports.getBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `show Bootcamp ${req.params.id}` });
};

//@desc     CREATE NEW BOOTCAMPS
//@routes   POST /api/v1/bootcamp
//@access   private
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'create new Bootcamp' });
};

//@desc     UPDATE BOOTCAMPS
//@routes   PUT /api/v1/bootcamps/:id
//@access   private
exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `update Bootcamp ${req.params.id}` });
};

//@desc     DELETE BOOTCAMPS
//@routes   DELETE /api/v1/bootcamps/:id
//@access   private
exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete Bootcamp ${req.params.id}` });
};
