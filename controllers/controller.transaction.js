const { transactionValidation } = require("../middlewares/transaction");
const Transaction = require("../models/transaction");

// get all stops
const transactions_get_all = async (req, res) => {
  try {
    const data = await Transaction.find({ userId: req.params.id });
    return res.status(200).send({
      status: "success",
      message: "Get Transactions Successfully",
      content: data,
    });
  } catch (error) {
    return res.status(400).send({
      status: "fail",
      message: error.message,
      content: null,
    });
  }
};

// add a stop
const transaction_post = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      status: "fail",
      message: "Please check your request!",
      content: null,
    });
  }

  //validation
  const { error } = transactionValidation(req.body);
  if (error) {
    return res.status(400).send({
      status: "fail",
      message: "validation error",
      content: error.details[0].message,
    });
  }

  const transaction = new Transaction(req.body);
  try {
    const data = await transaction.save();
    if (data) {
      return res.status(200).send({
        status: "success",
        message: "Added Transaction Successfully",
        content: data,
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

// update stop
const transaction_update = async (req, res) => {
  const id = req.params.id;
  if (!req.params.id || !req.body) {
    return res.status(400).send({
      status: "fail",
      message: "Please check request",
      content: null,
    });
  }
  try {
    const data = await Transaction.findByIdAndUpdate(id, req.body);
    return res.status(200).send({
      status: "success",
      message: "Updated Transaction Successfully",
      content: data,
    });
  } catch (error) {
    return res.status(400).send({
      status: "fail",
      message: error.message,
      content: null,
    });
  }
};

const transaction_delete = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Transaction.findByIdAndDelete(id);
    return res.status(200).send({
      status: "success",
      message: "Deleted Transaction Successfully",
      content: data,
    });
  } catch (error) {
    return res.status(400).send({
      status: "server error",
      message: error.message,
      content: null,
    });
  }
};

const single_transaction = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Transaction.findById(id);
    return res.status(200).send({
      status: "success",
      message: "fetch Transaction Successfully",
      conten: data,
    });
  } catch (error) {
    return res.status(400).send({
      status: "server error",
      message: error.message,
      content: null,
    });
  }
};

module.exports = {
  transactions_get_all,
  transaction_post,
  transaction_update,
  transaction_delete,
  single_transaction,
};
