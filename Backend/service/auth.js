const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET;
const jwtExpire = process.env.JWT_EXPIRES_IN;

function setUser(user) {
  return jwt.sign(
    {
      userId: user._id,
      username: user.username,
      role: user.role,
    },
    secret,
    { expiresIn: jwtExpire || "7d" }
  );
}

module.exports = { setUser };
