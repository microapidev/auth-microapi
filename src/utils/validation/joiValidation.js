const Joi = require('@hapi/joi');


const validator = async (schema, toValidate, res, next) => {
  // This middleware will validate client's request body
  await schema.validateAsync(toValidate);

  next();
};

exports.registerValidation = () => (req, res, next) => {
  const schema = Joi.object().keys({
    username: Joi.string().min(4).max(20).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: true },
      })
      .trim()
      .required(),
    password: Joi.string().min(8).max(20).required(),
    phone_number: Joi.string().min(10).max(11).pattern(/^[0-9]+$/),
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

exports.forgotValidation = () => (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: true },
      })
      .trim()
      .required(),
  });
  return validator(schema, req.body, res, next);
};

exports.resetPasswordValidation = () => (req, res, next) => {
  const schema = Joi.object().keys({
    password: Joi.string().min(8).max(20).required(),
  });
  return validator(schema, req.body, res, next);
};