require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');


const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
const authRoute = require('./routes/auth');
const bookingRoutes = require('./routes/bookingRoutes');
const courseRoutes = require('./routes/courseRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const userRoutes = require('./routes/userRoutes');
<<<<<<< HEAD
=======

app.use('/api/users', userRoutes);
>>>>>>> origin/login-fix

app.use('/api/appointments', appointmentRoutes);
app.use('/api/auth', authRoute);
app.use('/api/booking', bookingRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes)


app.get('/api/health', (req, res) => {
    res.json({ status: "OK", message: "Server is running" });
});

// DB CONNECTION 
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => {
        console.error("MongoDB connection error:", err);
    });

// FRONTEND
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
    res.redirect('/views/homePage.html');
});

// START SERVER
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));