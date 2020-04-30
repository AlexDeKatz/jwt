const express = require("express");
const app = express();
var db = require("./db");
var UserController = require("./controllers/User");
var AuthController = require("./controllers/Auth");
var TweetController = require("./controllers/Tweet");

app.get("/", function(req, res) {
  res.send({ message: "Hello World!" });
});

app.use("/users", UserController);
app.use("/auth", AuthController);
app.use("/tweets", TweetController);

module.exports = app;
