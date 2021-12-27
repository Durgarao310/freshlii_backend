const Joi = require("joi");
const PasswordComplexity = require("joi-password-complexity");

const registerValidation = (data) => {
  const schema = Joi.object({
    phone: Joi.string().min(10).required(),
    userName: Joi.string().min(3).max(30).required(),
    password: new PasswordComplexity({
      min: 8,
      max: 25,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
      requirementCount: 4,
    }).required(),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
