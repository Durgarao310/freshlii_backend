const express = require("express");
const router = express.Router();

const {
  user_register,
  user_login,
  user_forgotpassword,
  user_edit,
} = require("../controllers/controller.user");

const verifyUser = require("../middlewares/verifyUser");

// user register
router.post("/register", user_register);
router.post("/login", user_login);

router.post("/edit", verifyUser, user_edit);

module.exports = router;
