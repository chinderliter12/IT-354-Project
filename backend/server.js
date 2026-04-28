const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/bookingRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

// DB CONNECT
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Routes
const authRoute = require('./routes/auth');
app.use('/api/auth', authRoute);
const bookingRoutes = require('./routes/bookingRoutes');
app.use('/api/booking', bookingRoutes);
const courseRoutes = require('./routes/courseRoutes');
app.use('/api/courses', courseRoutes);

//Brings user to main page
app.use(express.static(path.join(__dirname, '../frontend')));
app.get('/', (req, res) => {
  res.redirect('/views/homePage.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});