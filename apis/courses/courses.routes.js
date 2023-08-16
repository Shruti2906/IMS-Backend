const express = require("express");
const router = express.Router();
const courseController = require("./courses.controller");

router.post("/addcourses", courseController.addCourse);

router.get("/courses", courseController.getCourses);

module.exports = router;