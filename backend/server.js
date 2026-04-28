const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

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

app.use('/api/appointments', appointmentRoutes);
app.use('/api/auth', authRoute);
app.use('/api/booking', bookingRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes)

//  DB CONNECTION 
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// FRONTEND 
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
    res.redirect('/views/homePage.html');
});

// START SERVER 
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));