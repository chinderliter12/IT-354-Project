const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    tutor: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Course', CourseSchema);
