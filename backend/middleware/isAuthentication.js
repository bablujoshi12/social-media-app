const jwt = require("jsonwebtoken");
const ExpressError = require("../utils/ExpressError");

const isAuthentication = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return next(new ExpressError(401, " jwt token is required"));
  }
  try {
    const decoded = jwt.verify(auth, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return next(new ExpressError(401, " jwt token is unvalid"));
  }
};

module.exports = isAuthentication;
