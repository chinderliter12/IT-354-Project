const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();



app.use(cors()); 


// ======================
// BODY PARSER
// ======================
app.use(express.json());


// ======================
// TEST
// ======================
app.get("/", (req, res) => {
  res.send("API Running...");
});


// ======================
// ROUTES
// ======================
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const bookingRoutes = require("./routes/bookingRoutes");
app.use("/api/bookings", bookingRoutes);

const courseRoutes = require("./routes/courseRoutes");
app.use("/api/courses", courseRoutes);


// ======================
// DB CONNECT
// ======================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


// ======================
// START SERVER
// ======================
const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});