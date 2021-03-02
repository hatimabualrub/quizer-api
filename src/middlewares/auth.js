const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "hatimisthebest");

    const user = await User.findOne({ _id: decoded._id, token });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ message: "Invalid Credentials" });
  }
};

module.exports = auth;
