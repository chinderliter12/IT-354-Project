const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/bookingRoutes"); // ✅ FIXED

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

// DB CONNECT
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});