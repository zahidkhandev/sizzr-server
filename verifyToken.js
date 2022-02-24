const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("./src/errors");

function verify(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication Token invalid");
  }

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err)
        res.status(403).json({ msg: "Token is not valid!", status: 403 });
      req.user = user;
      next();
    });
  } catch (error) {
    throw new UnauthenticatedError("Authentication Token invalid");
  }
}

module.exports = verify;
