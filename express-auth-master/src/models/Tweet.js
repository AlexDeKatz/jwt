var mongoose = require("mongoose");

var TweetSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    content: { type: String, maxlength: 240, required: true }
  },
  { timestamps: true }
);

mongoose.model("Tweet", TweetSchema);
module.exports = mongoose.model("Tweet");
