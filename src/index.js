const express = require("express");
const cors = require("cors");

const quizRouter = require("./routers/quizRouter");
const userRouter = require("./routers/userRouter");
require("./db/mongoose");

app = express();

port = process.env.PORT | 5000;

app.use(express.json());

app.use(cors());
app.use("/user", userRouter);
app.use("/quiz", quizRouter);

app.listen(port, () => console.log(`app is up and running on port ${port}`));
