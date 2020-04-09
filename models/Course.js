const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'please add a course title'],
  },
  description: {
    type: String,
    required: [true, 'please add a course description'],
  },
  weeks: {
    type: String,
    required: [true, 'please add a number of weeks for course'],
  },
  tuitionFee: {
    type: Number,
    required: [true, 'please add a tution cost'],
  },
  minimumSkill: {
    type: String,
    required: [true, 'please add a tution cost'],
    enum: ['beginner', 'intermediate', 'expert'],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    require: true,
  },
});

// Static method to get avg of course tuitions

courseSchema.statics.getAverageCost = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuitionFee' },
      },
    },
  ]);

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageCost after save
courseSchema.post('save', function () {
  this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost before remove
courseSchema.pre('DELETE', function () {
  this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('course', courseSchema);
