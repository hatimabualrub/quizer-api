const express = require("express");

const User = require("../models/User");

const Router = express.Router;
const userRouter = new Router();

userRouter.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    const isExist = await User.findOne({ username: req.body.username });
    if (isExist) {
      return res.status(409).send({ message: "Username Already Exist." });
    }
    await user.save();
    const token = await user.generateToken();
    res.status(201).send(token);
  } catch (e) {
    res.status(500).send({ message: "Internal Server Error." });
  }
});

userRouter.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).send({ message: "Invalid Username or Password." });
    }
    const token = await user.generateToken();
    res.send(token);
  } catch (e) {
    res.status(500).send({ message: "Internal Server Error." });
  }
});

module.exports = userRouter;
