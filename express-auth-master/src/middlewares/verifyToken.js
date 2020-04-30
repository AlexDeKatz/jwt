var jwt = require("jsonwebtoken");
var secret = require("../config/secret");

function verifyToken(req, res, next) {
  // Checks if token is provided with request
  if (!req.headers.authorization) {
    return res.status(401).send({ auth: false, message: "No token provided." });
  }
  // getting token from headers
  var token = req.headers.authorization.split(" ")[1];
  // Verify token signature - returns payload data
  jwt.verify(token, secret.key, function(err, decoded) {
    if (err) {
      return res
        .status(401)
        .send({ auth: false, message: "Failed to authenticate token." });
    }
    req.userId = decoded.email;
    next();
  });
}
module.exports = verifyToken;
