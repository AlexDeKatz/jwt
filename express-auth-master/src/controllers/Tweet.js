var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var Tweet = require("../models/Tweet");
var VerifyToken = require("../middlewares/VerifyToken");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Create a new tweet - User should be authenticated
router.post("/", VerifyToken, function(req, res) {
  Tweet.create(
    {
      userId: req.userId,
      content: req.body.content
    },
    function(err, tweet) {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .send({ message: "Some error occured on server" });
      }
      res.status(201).send(tweet);
    }
  );
});

// Returns all tweets - user authentication not required.
router.get("/", function(req, res) {
  Tweet.find({}, { __v: 0 }, function(err, tweets) {
    if (err)
      return res.status(500).send({ message: "Some error occured on server" });
    res.status(200).send(tweets);
  });
});

module.exports = router;
