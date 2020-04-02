const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//load env vars
dotenv.config({ path: './config/config.env' });

//load models

const Bootcamp = require('./models/Bootcamps');

const Course = require('./models/Course');

//connect database

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

//read the json files

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);

//import into DB

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);

    await Course.create(courses);

    console.log('Data Imported');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

//delete data

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    console.log('Data destroyed');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
}

if (process.argv[2] === '-d') {
  deleteData();
}
