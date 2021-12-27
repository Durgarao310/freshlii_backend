require("dotenv").config();
const stripe = require("stripe")(process.env.S_KEY);

const payment = async (req, res) => {
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2020-08-27" }
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "cad",
    customer: customer.id,
    payment_method_types: ["card"],
  });

  return res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: process.env.P_KEY,
  });
};

export default {
  payment,
};
