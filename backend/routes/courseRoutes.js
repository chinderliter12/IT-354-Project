const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

const auth = require('../middleware/auth');
const role = require('../middleware/role');



// GET ALL COURSES 

router.get('/', async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('tutor', 'name email username');

        res.json(courses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});



// CREATE COURSE (TUTOR ONLY)

router.post('/', auth, role(["tutor"]), async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({ error: "Name and description required" });
        }

        const course = new Course({
            name,
            description,
            tutor: req.user.id // 👈 automatically assign logged-in tutor
        });

        await course.save();

        res.status(201).json(course);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;