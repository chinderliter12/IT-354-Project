require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Routes
const authRoute = require('./routes/auth');
const bookingRoutes = require('./routes/bookingRoutes');
const courseRoutes = require('./routes/courseRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const userRoutes = require('./routes/userRoutes');
const auditLogRoutes = require('./routes/auditLogRoutes');


app.use('/api/bookings', bookingRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/auth', authRoute);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/logs', auditLogRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: "OK", message: "Server is running" });
});


// DB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => {
        console.error("MongoDB connection error:", err);
    });


// FrontEnd
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
    res.redirect('/views/homePage.html');
});


// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});