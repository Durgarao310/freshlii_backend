const jwt = require("jsonwebtoken");
const User = require("../models/user");

const verifyUser = async (request, response, next) => {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  // checking token
  if (!token)
    return response.status(401).send({
      status: "fail",
      message: "Token is missing",
    });

  // validate jwt token
  try {
    var decoded = jwt.verify(token, process.env.SECRET_TOKEN);
  } catch (err) {
    return response.status(401).send({
      status: "fail",
      message: err,
    });
  }
  //check user
  const user = await User.findById({ _id: decoded.userId });
  if (!user)
    return response.status(404).send({
      status: "fail",
      message: "user not found",
    });
  request.user = user;
  next();
};

module.exports = verifyUser;
