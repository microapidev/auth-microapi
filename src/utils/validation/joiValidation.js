const Joi = require("@hapi/joi");

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
    phone_number: Joi.string()
      .min(10)
      .max(11)
      .pattern(/^[0-9]+$/),
    emailVerifyCallbackUrl: Joi.string().trim().required(),
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

exports.updateSettingsValidation = () => (req, res, next) => {
  const schema = Joi.object()
    .keys({
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: true },
        })
        .trim()
        .required(),
      successCallbackUrl: Joi.string().uri().required(),
      failureCallbackUrl: Joi.string().uri().required(),
      facebookAuthProvider: Joi.object().keys({
        appID: Joi.string().allow(null).required(),
        appSecret: Joi.string().allow(null).required(),
      }),
      twitterAuthProvider: Joi.object().keys({
        key: Joi.string().allow(null).required(),
        secret: Joi.string().allow(null).required(),
      }),
      githubAuthProvider: Joi.object().keys({
        clientID: Joi.string().allow(null).required(),
        clientSecret: Joi.string().allow(null).required(),
      }),
      googleAuthProvider: Joi.object().keys({
        clientID: Joi.string().allow(null).required(),
        clientSecret: Joi.string().allow(null).required(),
      }),
    })
    .or(
      "facebookAuthProvider",
      "twitterAuthProvider",
      "githubAuthProvider",
      "googleAuthProvider"
    );
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
    emailVerifyCallbackUrl: Joi.string().trim().required(),
  });
  return validator(schema, req.body, res, next);
};
exports.changePasswordValidation = () => (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: true },
      })
      .trim()
      .required(),
    oldPassword: Joi.string().trim().required(),
    newPassword: Joi.string().trim().required(),
  });
  return validator(schema, req.body, res, next);
};

exports.resetPasswordValidation = () => (req, res, next) => {
  const schema = Joi.object().keys({
    password: Joi.string().min(8).max(20).required(),
    password_confirmation: Joi.any().valid(Joi.ref("password")).required(),
  });
  return validator(schema, req.body, res, next);
};
