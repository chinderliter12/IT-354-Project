const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization']; // case-insensitive
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(' ')[1]; // "Bearer <token>"
  if (!token) return res.status(401).json({ error: "Token missing" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verified._id; // 
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
};