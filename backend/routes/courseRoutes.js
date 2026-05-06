const express = require('express');
const router = express.Router();

const Course = require('../models/Course');
const User = require('../models/User');

const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');


router.post('/', auth, roleAuth(["admin"]), async (req, res) => {
    try {
        const { name, tutor, description } = req.body;

        if (!name || !tutor || !description) {
            return res.status(400).json({ message: "All fields required" });
        }

        const tutorUser = await User.findById(tutor);

        if (!tutorUser || tutorUser.role !== "tutor") {
            return res.status(400).json({ message: "Invalid tutor" });
        }

        const course = new Course({
            name,
            tutor,
            description
        });

        await course.save();

        res.status(201).json(course);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/', async (req, res) => {
    try {
        const courses = await Course.find().populate("tutor", "name email");
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;