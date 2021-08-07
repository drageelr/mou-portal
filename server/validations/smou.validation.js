const Joi = require('express-validation').Joi;

exports.createSMouValidation = {
    body: Joi.object({
        categoryId: Joi.number().integer().required(),
        sponsorName: Joi.number()
    })
};