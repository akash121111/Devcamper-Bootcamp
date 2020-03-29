const ErrorResponce = require('../utils/errorResponse');
const errorHandler = (err, req, res, next) => {
  console.log(err.stack);
  console.log(err.name);
  res.status(err.statusCode || 500).json({
    sucess: false,
    error: err.message || 'server error'
  });
};

module.exports = errorHandler;
