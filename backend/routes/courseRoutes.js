const express = require('express');
const router = express.Router();
const Course = require('../models/Course'); // Your Course schema

// GET all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find().populate('tutor', 'name email');
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST a new course
router.post('/', async (req, res) => {
    try {
        const { name, description, tutor } = req.body;
        const course = new Course({ name, description, tutor });
        await course.save();
        res.json(course);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
