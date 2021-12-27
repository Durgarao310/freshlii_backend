const Coupon = require("../models/coupon");

// get all coupons
const coupons_get = async (req, res) => {
  await Coupon.find()
    .then((data) => {
      return res.status(200).send({
        status: "success",
        message: "Get Coupons Successfully",
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

// add a coupon
const coupon_post = async (req, res) => {
  if (!req.body) {
    return res.status(500).send({
      status: "fail",
      message: "Please check your request!",
      content: null,
    });
  }
  //check email if exist
  const couponExist = await Coupon.findOne({ coupon: req.body.coupon });
  if (couponExist) {
    return res.status(400).json({ err: "This coupon already exists" });
  }
  const coupon = new Coupon({
    price: req.body.price,
    description: req.body.description,
    coupon: req.body.coupon,
    endDate: req.body.endDate,
  });

  try {
    const data = await coupon.save();
    return res.status(200).send({
      status: "success",
      message: "Added Coupon Successfully",
      content: data,
    });
  } catch (err) {
    return res.status(400).send({
      status: "fail",
      message: err.message,
      content: null,
    });
  }
};

// update coupon
const coupon_update = async (req, res) => {
  const id = req.params.id;
  if (!req.params.id || !req.body) {
    return res.status(200).send({
      status: "fail",
      message: "Please check your ID request",
      content: null,
    });
  }

  const coupon = {
    price: req.body.price,
    description: req.body.description,
    coupon: req.body.coupon,
    endDate: req.body.endDate,
  };

  await Coupon.findByIdAndUpdate(id, coupon)
    .then((data) => {
      return res.status(200).send({
        status: "success",
        message: "Updated Coupon Successfully",
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

const coupon_delete = async (req, res) => {
  const id = req.params.id;
  await Coupon.findByIdAndDelete(id)
    .then((data) => {
      return res.status(200).send({
        status: "success",
        message: "Deleted Coupon Successfully",
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

const single_coupon = async (req, res) => {
  const id = req.params.id;
  await Coupon.findById(id)
    .then((data) => {
      return res.status(200).send({
        status: "success",
        message: "fetch Coupon Successfully",
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
  coupons_get,
  coupon_post,
  coupon_update,
  coupon_delete,
  single_coupon,
};
