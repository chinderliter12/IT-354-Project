const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create course
router.post('/', async (req, res) => {
    try {
        const course = await Course.create({
            name: req.body.name,
            tutor: req.body.tutor,
            description: req.body.description
        });

        res.json(course);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;