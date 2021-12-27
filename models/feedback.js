const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  rideId: {
    type: String,
    required: true,
  },
  ratting: {
    type: String,
    required: true,
  },
});
const Feedback = mongoose.model("feedback", feedbackSchema);
module.exports = Feedback;
