const router = require('express').Router();
const Course = require('../models/Course');

// get all courses with tutor info
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().populate('tutor', 'name');

    const formattedCourses = courses
      .filter(course => course.tutor && course.tutor.name)
      .map(course => ({
        name: course.name,
        tutor: course.tutor.name,
        tutorId: course.tutor._id,
        description: course.description
      }));

    res.json(formattedCourses);
  } catch (err) {
    console.error("GET COURSES ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;