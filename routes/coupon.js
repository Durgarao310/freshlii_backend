const express = require("express");
const router = express.Router();
const couponController = require("../controllers/controller.coupon");

// get all coupons
router.get("/", couponController.coupons_get);

// get single coupon
router.get("/:id", couponController.single_coupon);

//add coupon
router.post("/", couponController.coupon_post);

//update coupon
router.patch("/:id", couponController.coupon_update);

//delete coupon
router.delete("/:id", couponController.coupon_delete);

module.exports = router;
