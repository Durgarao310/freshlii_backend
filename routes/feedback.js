const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/controller.feedback");

// get all feedbacks
router.get("/all", feedbackController.feedbacks_get_all);

// get single feedback
router.get("/:id", feedbackController.single_feedback);

//add feedback
router.post("/", feedbackController.feedback_post);

//update feedback
router.patch("/:id", feedbackController.feedback_update);

//delete feedback
router.delete("/:id", feedbackController.feedback_delete);

module.exports = router;
