const mongoose = require("mongoose");

mongoose.connect(
  "mongodb://quizeradmin:quizeradmin@cluster0-shard-00-00.6fdl0.mongodb.net:27017,cluster0-shard-00-01.6fdl0.mongodb.net:27017,cluster0-shard-00-02.6fdl0.mongodb.net:27017/quizer?ssl=true&replicaSet=atlas-10lec5-shard-0&authSource=admin&retryWrites=true&w=majority",
  // "mongodb+srv://quizeradmin:quizeradmin@cluster0.6fdl0.mongodb.net/quizer?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  () => console.log("connected to quizer database")
);
