const mongoose = require('mongoose');

const BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please add a name'],
    unique: true,
    trim: true,
    maxlength: [50, 'name should be less than 50 character']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'please add a description'],
    maxlength: [500, 'name should be less than 500 character']
  },
  website: {
    type: String,
    required: [true, 'please add website']
    // match: [
    //   '^(https?://)?(((www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z‌​0-9]{0,61}[a-z0-9]\\‌​.[a-z]{2,6})|((\\d{1‌​,3}\\.){3}\\d{1,3}))‌​(:\\d{2,4})?(/[-\\w@‌​\\+\\.~#\\?&/=%]*)?$‌',
    //   'website is not in a correct format'
    // ]
  },
  phone: {
    type: String,
    required: [true, 'please add user mobile number'],
    maxlength: [20, 'moblie no should be less than 20 digit']
  },
  email: {
    type: String,
    required: [true, 'please add an address'],
    match: [
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/gim,
      'Email should be in correct format'
    ]
  },
  address: {
    type: String,
    required: [true, 'please add an address']
  },
  location: {
    //geojson
    type: String,
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'] // 'location.type' must be 'Point'
      // required: true
    },
    coordinates: {
      type: [Number],
      //required: true,
      index: '2dsphere'
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zincode: String,
    country: String
  },
  careers: {
    type: [String],
    required: true,
    enum: [
      'Web Development',
      'Mobile Development',
      'UI/UX Desiner',
      'Data Science',
      'Business',
      'Others'
    ]
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [10, 'Rating must can not be more than 10']
  },
  averageCost: Number,
  photo: {
    type: String,
    default: 'no-photo.jpg'
  },
  houshing: {
    type: Boolean,
    default: false
  },
  jobAssistant: {
    type: Boolean,
    default: false
  },
  jobGuarantee: {
    type: Boolean,
    default: false
  },
  acceptGi: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Bootcamp', BootcampSchema);
