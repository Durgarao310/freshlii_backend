const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const couponSchema = new Schema(
  {
    price: {
      type: String,
      required: true,
    },
    coupon: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
  },
);
const Coupon = mongoose.model('coupon', couponSchema);

module.exports = Coupon;
