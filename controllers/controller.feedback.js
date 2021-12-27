const Feedback = require("../models/feedback");

// get all feedbacks
const feedbacks_get_all = async (req, res) => {
  try {
    const res = await Feedback.find();
    if (res) {
      return res.status(200).send({
        status: "success",
        message: "Get Feedbacks Successfully",
        content: res,
      });
    }
  } catch (error) {
    return res.status(400).send({
      status: "fail",
      message: error.message,
      content: null,
    });
  }
};

// add a feedback
const feedback_post = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      status: "fail",
      message: "Please check your request!",
      content: null,
    });
  }
  const feedback = new Feedback(req.body);
  try {
    const res = await feedback.save();
    return res.status(200).send({
      status: "success",
      message: "Added Feedback Successfully",
      content: res,
    });
  } catch (error) {
    return res.status(400).send({
      status: "fail",
      message: error.message,
      content: null,
    });
  }
};

// update feedback
const feedback_update = async (req, res) => {
  const id = req.params.id;
  if (!req.params.id || !req.body) {
    return res.status(200).send({
      status: "fail",
      message: "Please check your request",
      content: null,
    });
  }

  await Feedback.findByIdAndUpdate(id, req.body)
    .then((data) => {
      return res.status(200).send({
        status: "success",
        message: "Updated Feedback Successfully",
        content: data,
      });
    })
    .catch((err) => {
      return res.status(400).send({
        status: "fail",
        message: err.message,
        content: null,
      });
    });
};

const feedback_delete = async (req, res) => {
  const id = req.params.id;
  await Feedback.findByIdAndDelete(id)
    .then((data) => {
      return res.status(200).send({
        status: "success",
        message: "Deleted Feedback Successfully",
        content: data,
      });
    })
    .catch((err) => {
      return res.status(400).send({
        status: "fail",
        message: err.message,
        content: null,
      });
    });
};

const single_feedback = async (req, res) => {
  const id = req.params.id;
  await Feedback.findById(id)
    .then((data) => {
      return res.status(200).send({
        status: "success",
        message: "fetch Feedback Successfully",
        content: data,
      });
    })
    .catch((err) => {
      return res.status(400).send({
        status: "fail",
        message: err.message,
        content: null,
      });
    });
};

module.exports = {
  feedbacks_get_all,
  feedback_post,
  feedback_update,
  feedback_delete,
  single_feedback,
};
