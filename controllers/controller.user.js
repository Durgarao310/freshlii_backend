const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { registerValidation } = require("../middlewares/registerValidation");
const { loginValidation } = require("../middlewares/loginValidation");

const user_register = async (req, res) => {
  // validation
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send({
      status: "fail",
      message: "validation error!",
      content: error.details[0].message,
    });
  }

  // check phone if exist
  const phoneExist = await User.findOne({ phone: req.body.phone });
  if (phoneExist) {
    return res.status(400).send({
      status: "fail",
      message: "phone number check!",
      content: "phone number already taken try another one or else login!",
    });
  }

  // hashing password
  const saltRounds = 10;
  let passwordHash = await bcrypt.hash(req.body.password, saltRounds);
  const user = new User({
    userName: req.body.userName,
    password: passwordHash,
    phone: req.body.phone,
  });

  try {
    const resUser = await user.save();
    return res.status(200).send({
      status: "success",
      message: "user register successfully!",
      content: resUser,
    });
  } catch (err) {
    return res.status(400).send({
      status: "fail",
      message: err.message,
      content: null,
    });
  }
};

const user_login = async (req, res) => {
  // validation
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send({
      status: "fail",
      message: "validation error!",
      content: error.details[0].message,
    });
  }

  //user check
  const user = await User.findOne({ phone: req.body.phone });
  if (!user) {
    return res.status(400).send({
      status: "fail",
      message: "user check error!",
      content: "no user found please register and login!",
    });
  }

  //password match
  const passMatching = await bcrypt.compare(req.body.password, user.password);
  if (!passMatching) {
    return res.status(400).send({
      status: "fail",
      message: "user creditionals error",
      content: "phone or password wrong!",
    });
  }
  try {
    jwt.sign(
      { userId: user._id },
      process.env.SECRET_TOKEN,
      { expiresIn: "365d" },
      (err, token) => {
        if (err) {
          return res.status(400).send({
            status: "fail",
            message: err.message,
            content: null,
          });
        }
        return res.status(200).send({
          status: "success",
          message: "logedin successfully!",
          content: {
            user: user,
            token: token,
          },
        });
      }
    );
  } catch (err) {
    return res.status(400).send({
      status: "fail",
      message: err.message,
      content: null,
    });
  }
};

const user_edit = async (req, res) => {
  const { id } = req.params;
  await User.findOneAndUpdate({ _id: id }, req.body)
    .then((result) => {
      if (!result) {
        return res.status(400).send({ res: "no user found" });
      }
      return res.status(200).send({ result: req.body });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

const user_forgotpassword = async (req, res) => {
  console.log(req.body);
  const phone = req.body.phone;
  if (!phone) {
    return res.status(400).send({
      status: "fail",
      message: "phone number required",
      content: null,
    });
  }
  const user = await User.findOne({ phone });
  if (!user) {
    res.status(404).send({
      status: "fail",
      message: "no user found!",
      content: null,
    });
  }

  try {
    jwt.sign(
      { userId: user._id },
      process.env.SECRET_TOKEN,
      { expiresIn: "60" },
      (err, token) => {
        if (err) {
          return res.status(400).send({
            status: "fail",
            message: err.message,
            content: null,
          });
        }
        return res.status(200).send({
          status: "success",
          message: "logedin successfully!",
          content: {
            user: user,
            token: token,
          },
        });
      }
    );
  } catch (err) {
    return res.status(400).send({
      status: "fail",
      message: err.message,
      content: null,
    });
  }
};

// const user_resetpassword = async (req, res) => {
//   const { email, otp } = req.body;
//   // highlight-start
//   const userid = await User.findOne({ email: email });
//   console.log(userid);
//   const user = await Otp.findOne({ userId: userid._id });
//   console.log(user);
//   const verify_otp = await Otp.findOne({ otp: otp });
//   if (!user) {
//     res
//       .status(404)
//       .send({ err: "Invalid user or otp expired please try again" });
//   }
//   if (!verify_otp) {
//     res.status(404).send({ err: "Invalid otp please try again!" });
//   }
//   if (verify_otp.otp === otp && userid.email === email) {
//     const salt = bcrypt.genSaltSync(10);
//     const hashedPassword = bcrypt.hashSync(req.body.password, salt);
//     try {
//       const updateUser = await User.findOneAndUpdate(
//         { email: email },
//         { password: hashedPassword }
//       );
//       res.status(202).send("Password is changed");
//     } catch (err) {
//       res.status(500).send({ err });
//     }
//   } else {
//     res.status(500).send({ err: "Token is invalid" });
//   }
// };

// // get all users
// const get_all_users = (req, res) => {
//   User.find()
//     .then((result) => {
//       return res.status(200).send(result);
//     })
//     .catch((err) => {
//       res.status(400).send(err);
//     });
// };

// // get single
// const get_single_user = (req, res) => {
//   const id = req.params.id;
//   User.find({ _id: id })
//     .then((result) => {
//       return res.status(200).send(result);
//     })
//     .catch((err) => {
//       res.status(400).send(err);
//     });
// };

// // delete user
// const delete_user = (req, res) => {
//   const id = req.params.id;
//   User.findByIdAndDelete(id)
//     .then((data) => {
//       return res.status(200).send({
//         status: "OK",
//         message: "Deleted User Successfully",
//         content: data,
//       });
//     })
//     .catch((err) => {
//       return res.status(400).send({
//         status: "ERR_SERVER",
//         message: err.message,
//         content: null,
//       });
//     });
// };

module.exports = {
  user_register,
  user_login,
  user_forgotpassword,
  // user_resetpassword,
  user_edit,
  // get_all_users,
  // get_single_user,
  // delete_user,
};
