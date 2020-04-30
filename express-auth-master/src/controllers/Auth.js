var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var secret = require("../config/secret");
var User = require("../models/User");
var VerifyToken = require("../middlewares/VerifyToken");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// Sign Up - Register new user.
router.post("/register", async function(req, res) {
  // encrypt password - it will create a hash
  var hashedPassword = await bcrypt.hash(req.body.password, 8);

  // Create new user
  User.create(
    {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    },
    function(err, user) {
      if (err)
        return res
          .status(500)
          .send({ message: "Some error occured on server" });
      // create a token
      var token = jwt.sign({ email: user.email }, secret.key, {
        expiresIn: 86400 // expires in 24 hours
      });
      // send response
      res
        .status(201)
        .send({ name: user.name, email: user.email, token: token });
    }
  );
});

// Returns Profile
router.get("/me", VerifyToken, function(req, res) {
  User.findOne({ email: req.userId }, { password: 0 }, function(err, user) {
    if (err)
      return res.status(500).send({ message: "Some error occured on server" });
    if (!user) return res.status(404).send({ message: "User not found" });
    res.status(200).send(user);
  });
});

// Implements Login
router.post("/login", function(req, res) {
  //find email in DB
  User.findOne({ email: req.body.email }, async function(err, user) {
    if (err)
      return res.status(500).send({ message: "Some error occured on server" });
    if (!user) return res.status(404).send({ message: "User not found" });
    // compares hash password to real password
    var isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      return res
        .status(401)
        .send({ auth: false, token: null, message: "Invalid credentials." });
    }
    // create a token
    var token = jwt.sign({ email: user.email }, secret.key, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ name: user.name, email: user.email, token: token });
  });
});

module.exports = router;
