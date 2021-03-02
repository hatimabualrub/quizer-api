const mongoose = require("mongoose");

const quizShema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  id: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  duration: {
    type: Number,
    default: 600000,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    trim: true,
  },
  questions: [
    {
      questionBody: { type: String, required: true, trim: true },
      answers: [
        {
          answerBody: { type: String, required: true, trim: true },
          isCorrect: { type: Boolean, default: false },
        },
      ],
    },
  ],
  attempts: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, require: true },
      score: { type: Number, default: 0 },
      isFinished: { type: Boolean, default: false },
    },
  ],
});

quizShema.methods.generateScore = async function (answers, userId) {
  const quiz = this;
  let score = 0;
  answers.forEach((answerIndex, questionIndex) => {
    if (quiz.questions[questionIndex].answers[answerIndex].isCorrect) {
      score++;
    }
  });
  const attemptIndex = quiz.attempts.findIndex(({ user }) =>
    user.equals(userId)
  );
  if (quiz.attempts[attemptIndex].isFinished) {
    return quiz.attempts[attemptIndex].score;
  }
  quiz.attempts[attemptIndex].score = score;
  quiz.attempts[attemptIndex].isFinished = true;
  await quiz.save();
  return score;
};

const Quiz = mongoose.model("Quiz", quizShema);

module.exports = Quiz;
