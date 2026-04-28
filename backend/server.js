const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Routes
const authRoute = require('./routes/auth');
const bookingRoutes = require('./routes/bookingRoutes');
const courseRoutes = require('./routes/courseRoutes');

app.use('/api/auth', authRoute);
app.use('/api/booking', bookingRoutes);
app.use('/api/courses', courseRoutes);

//Brings user to main page
app.use(express.static(path.join(__dirname, '../frontend')));
app.get('/', (req, res) => {
  res.redirect('/views/homePage.html');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

