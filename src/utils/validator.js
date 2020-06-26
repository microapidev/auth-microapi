require("@hapi/joi");

module.exports = async (schema, toValidate, res, next) => {
  try {
    await schema.validateAsync(toValidate);
    next();
  } catch (error) {
    return res.status(422).json({ message: error.message, status: 422 });
  }
};
