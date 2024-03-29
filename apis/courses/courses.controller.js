const mongoose = require("mongoose");
const courses = require("./courses.model");

exports.getCourses = async (req, res, next) => {
  try {
    const allCourses = await courses.find({}).limit(100);
    res.send({ status: 200, data: allCourses });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.addCourse = async (req, res, next) => {
  try {
    const course = new courses({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      description : req.body.description,
      fees : req.body.fees,
    });

    const newCourse = await course.save();
    res.send({ status: 200, data: newCourse });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
