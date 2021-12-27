const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const { payment } = require("./controllers/stripe").default;
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const User = require("./models/user");

//config env
require("dotenv").config();

//import routes
const userRoute = require("./routes/user");

//Connect to DB
let dbURI;
if (process.env.NODE_ENV === "development") {
  dbURI = process.env.DB_CONNECTION_DEV;
}
if (process.env.NODE_ENV === "production") {
  dbURI = process.env.DB_CONNECTION_PROD;
}
mongoose.connect(
  dbURI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    dbName: "Freshlii",
  },
  () => {
    app.listen(process.env.PORT);
    console.log("Connected to DB");
  }
);

//intialize firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://freshlii.firebaseio.com",
});
const db = admin.firestore();

//middleware & static files
app.use(morgan("dev"));
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.post(`/api/${process.env.VERSION}/user/social-login`, async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(400).send({
      status: "fail",
      message: "token is required!",
      content: null,
    });
  }
  await admin
    .auth()
    .verifyIdToken(token)
    .then(async (decodedToken) => {
      const userUid = User.find({ uid: decodedToken.uid });
      if (userUid) {
        try {
          jwt.sign(
            { userId: userUid._id },
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
                  user: userUid,
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
      }

      if (!userUid) {
        if (!req.body.userName) {
          return res.status(400).send({
            status: "fail",
            message: "userName required",
            content: null,
          });
        }
        let userName = req.body.userName;
        let profilePicute = req.body.profilePicute
          ? req.body.profilePicute
          : null;

        let email = req.body.email ? req.body.email : null;
        let phone = req.body.phone ? req.body.phone : null;

        const user = new User({
          uid: userUid,
          userName: userName,
          email: email,
          profilePicute: profilePicute,
          phone: phone,
        });
        try {
          const resUser = await user.save();
          try {
            jwt.sign(
              { userId: resUser._id },
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
                    user: resUser,
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
        } catch (err) {
          res.status(400).send({
            status: "fail",
            message: err.message,
            content: null,
          });
        }
      }
    })
    .catch((err) => {
      return res.status(403).send({
        status: "fail",
        message: err.message,
        content: null,
      });
    });
});

// global routes
app.use(`/api/${process.env.VERSION}/user`, userRoute);
app.post(`/api/${process.env.VERSION}/payment`, payment);

// server live check
app.get("/status", (req, res) => {
  return res.send({
    status: "alive",
  });
});

module.exports = app;
