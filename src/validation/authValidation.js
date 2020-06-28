const Joi = require('@hapi/joi');
const validator = require('../utils/validator');

exports.registerValidation = () => (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: true },
      })
      .trim()
      .required(),
    username: Joi.string().min(4).max(20).required(),
    password: Joi.string().min(8).max(20).required(),
    // role: Joi.string().required(),
    // phone_number: Joi.string().min(10).max(11).pattern(/^[0-9]+$/).required(),
  });
  return validator(schema, req.body, res, next);
};

exports.loginValidation = () => (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: true },
      })
      .trim()
      .required(),
    password: Joi.string().min(8).max(20).required(),
  });
  return validator(schema, req.body, res, next);
};
