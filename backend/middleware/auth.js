const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const token = authHeader.replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { id, role, name }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};