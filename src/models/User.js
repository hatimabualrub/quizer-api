const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  token: {
    type: String,
    trim: true,
  },
});

userSchema.virtual("quizzes", {
  ref: "Quiz",
  localField: "_id",
  foreignField: "creator",
});

userSchema.methods.generateToken = async function () {
  user = this;
  token = jwt.sign({ _id: user._id }, "hatimisthebest");
  user.token = token;
  await user.save();
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
