const jwt = require("jsonwebtoken");
const { ApiUnathorizedError } = require("../utils/errors");
const verifyUser = (req, res, next) => {
  try {
    let token =
      req.cookies.token || req.headers["authorization"]?.split(" ")[1];
    let rslt = jwt.verify(token, process.env.JWT_SECRET);
    if (rslt) {
      // console.log(rslt);
      req.user = rslt;
      next();
    } else {
      throw new ApiUnathorizedError("Please Login");
    }
  } catch (err) {
    next(new ApiUnathorizedError(err.message));
  }
};

module.exports = { verifyUser };
