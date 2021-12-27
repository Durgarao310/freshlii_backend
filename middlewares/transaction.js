const Joi = require("joi");

const transactionValidation = (data) => {
  const schema = Joi.object({
    userId: Joi.string().min(8).required(),
    title: Joi.string().min(6).required(),
    timeStamp: Joi.string().min(6).required(),
    amount: Joi.string().min(2).required(),
    type: Joi.string().min(2).required(),
    status: Joi.string().min(2).required(),
    details: Joi.array().required(),
  });
  return schema.validate(data);
};

module.exports.transactionValidation = transactionValidation;
