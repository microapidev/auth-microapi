//validation of data sent by a user
const Joi = require('@hapi/joi')

//register route validation
const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password:Joi.string().required(),
        role:Joi.string().required()
    });
    return schema.validate(data);
};
//login route validation
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password:Joi.string().required()
    });
    return schema.validate(data);
};
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;