const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/controller.transaction");

// get all transaction
router.get("/all/:id", transactionController.transactions_get_all);

// get single transaction
router.get("/:id", transactionController.single_transaction);

//add transaction
router.post("/", transactionController.transaction_post);

//update transaction
router.patch("/:id", transactionController.transaction_update);

//delete transaction
router.delete("/:id", transactionController.transaction_delete);

module.exports = router;
