const Joi = require('express-validation').Joi;

exports.loginValidation = {
    body: Joi.object({
        email: Joi.string().email().min(1).max(50).required(),
        password: Joi.string().min(8).max(30).required(),
        type: Joi.string().regex(/^(cca|society|duser)/).required()
    })
};

exports.forgotPasswordValidation = {
    body: Joi.object({
        email: Joi.string().email().required(),
        type: Joi.string().regex(/^(cca|society|duser)/).required()
    })
}