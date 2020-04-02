const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'please add a course title']
  },
  description: {
    type: String,
    required: [true, 'please add a course description']
  },
  weeks: {
    type: String,
    required: [true, 'please add a number of weeks for course']
  },
  tuitionFee: {
    type: Number,
    required: [true, 'please add a tution cost']
  },
  minimumSkill: {
    type: String,
    required: [true, 'please add a tution cost'],
    enum: ['beginner', 'intermediate', 'expert']
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    require: true
  }
});

module.exports = mongoose.model('course', courseSchema);
