const jwt = require("jsonwebtoken");
const config = require("../configs/secret-key");

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).send({
      success: false,
      error: "Unauthorized: No token provided.",
    });
  }

  jwt.verify(token, config.secret, (error, decoded) => {
    if (error) {
      return res.status(401).send({
        success: false,
        error: "Fail to Authentication. Error -> " + error,
      });
    }

    req.userId = decoded.id;
    req.role = decoded.role;
    next();
  });
};

isAdmin = (req, res, next) => {
  if (req.role === 1) {
    next();
    return;
  } else {
    res.status(401).send({ success: false, message: "Require Role Admin!" });
  }
};

const authJwt = {};
authJwt.verifyToken = verifyToken;
authJwt.isAdmin = isAdmin;

module.exports = authJwt;
