const express = require("express");

const Quiz = require("../models/Quiz");
const User = require("../models/User");
const auth = require("../middlewares/auth");

const Router = express.Router;
const quizRouter = new Router();

quizRouter.post("/create", auth, async (req, res) => {
  try {
    const isExist = await Quiz.findOne({ id: req.body.id });
    if (isExist) {
      return res.status(409).send({ message: "Quiz ID Already Exist." });
    }
    const quiz = new Quiz({ ...req.body, creator: req.user });
    await quiz.save();
    res.status(201).send(quiz._id);
  } catch (e) {
    res.status(500).send({ message: "Internal Server Error." });
  }
});

quizRouter.post("/add-questions", auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.body.quiz_id);
    if (!quiz) {
      res.status(404).send({ message: "Quiz Not Found." });
    }
    quiz.questions = req.body.questions;
    await quiz.save();
    res
      .status(201)
      .send({ quizID: quiz.id, title: quiz.title, password: quiz.password });
  } catch (e) {
    res.status(500).send({ message: "Internal Server Error." });
  }
});

quizRouter.post("/attempt", auth, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      id: req.body.id,
      password: req.body.password,
    });
    if (!quiz) {
      return res
        .status(404)
        .send({ message: "Quiz ID or Password Is Not Valid." });
    }
    const isAttempted = quiz.attempts.find(({ user }) =>
      user.equals(req.user._id)
    );
    if (isAttempted) {
      return res
        .status(409)
        .send({ message: "User Already Enrolled To Quiz." });
    }
    quiz.attempts = quiz.attempts.concat({ user: req.user._id });
    await quiz.save();
    const { _id, title, id, questions, duration } = quiz;
    res.send({ _id, title, id, questions, duration });
  } catch (e) {
    res.status(500).send({ message: "Internal Server Error." });
  }
});

quizRouter.post("/finishattempt", auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.body.quizId);
    if (!quiz) {
      return res.status(401).send({ message: "Quiz Not Found." });
    }

    const score = await quiz.generateScore(req.body.answers, req.user._id);
    const limit = quiz.questions.length;
    res.send({ quizTitle: quiz.title, quizId: quiz.id, score, limit });
  } catch (e) {
    res.status(500).send({ message: "Internal Server Error." });
  }
});

quizRouter.get("/showcreated", auth, async (req, res) => {
  try {
    await req.user.populate({ path: "quizzes" }).execPopulate();
    if (req.user.quizzes.length === 0) {
      return res.status(404).send({ message: "No Created Quizzes Yet.." });
    }
    res.send(req.user.quizzes);
  } catch (e) {
    res.status(500).send({ message: "Internal Server Error." });
  }
});

quizRouter.get("/showattempts/:id", auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).send({ message: "Quiz Not Found!" });
    }

    const attemptsList = await Promise.all(
      quiz.attempts.map(async (attempt) => {
        const user = await User.findById(attempt.user);
        return {
          user: user.username,
          score: attempt.score + " / " + quiz.questions.length,
        };
      })
    );
    res.send({ attemptsList, title: quiz.title });
  } catch (e) {
    res.status(500).send({ message: "Internal Server Error." });
  }
});

quizRouter.get("/showcompleted", auth, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ "attempts.user": req.user._id });
    if (quizzes.length === 0) {
      return res.status(404).send({ message: "No Completed Quizzes Yet.." });
    }
    const quizList = quizzes.map((quiz) => {
      return {
        title: quiz.title,
        id: quiz.id,
        score:
          quiz.attempts.filter(({ user }) => user.equals(req.user._id))[0]
            .score +
          " / " +
          quiz.questions.length,
      };
    });
    res.send(quizList);
  } catch (e) {
    res.status(500).send({ message: "Internal Server Error." });
  }
});

module.exports = quizRouter;
