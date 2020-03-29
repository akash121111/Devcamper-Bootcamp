const NodeGeocoder = require('node-geocoder');

const option = {
  provider: process.env.GEOCODE_PROVIDER,
  httpAdapter: 'https',
  apiKey: process.env.GEOCODE_API_KEY, // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(option);

module.exports = geocoder;
