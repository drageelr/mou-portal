const Joi = require('express-validation').Joi;

exports.createCategoryValidation = {
    body: Joi.object({
        name: Joi.string().required().min(1).max(50).required(),
        lowerBound: Joi.number().integer().required(),
        upperBound: Joi.number().integer().required(),
        lowerSuggestionBound: Joi.number().integer().required(),
        upperSuggestionBound: Joi.number().integer().required()
    })
};

exports.editCategoryValidation = {
    body: Joi.object({
        id: Joi.number().integer().required(),
        name: Joi.string().required().min(1).max(50),
        lowerBound: Joi.number().integer(),
        upperBound: Joi.number().integer(),
        lowerSuggestionBound: Joi.number().integer(),
        upperSuggestionBound: Joi.number().integer(),
        active: Joi.boolean()
    })
};

exports.addMileageValidation = {
    body: Joi.object({
        categoryId: Joi.number().integer().required(),
        mileageId: Joi.number().integer().required()
    })
};

exports.removeMileageValidation = {
    body: Joi.object({
        categoryId: Joi.number().integer().required(),
        mileageId: Joi.number().integer().required()
    })
};

exports.createMileageValidation = {
    body: Joi.object({
        description: Joi.string().min(1).max(250).required(),
        checkdeptId: Joi.number().integer().required(),
        checkCCA: Joi.boolean().required(),
        checkSociety: Joi.boolean().required()
    })
};

exports.editMileageValidation = {
    body: Joi.object({
        id: Joi.number().integer().required(),
        description: Joi.string().min(1).max(250),
        checkdeptId: Joi.number().integer(),
        checkCCA: Joi.boolean(),
        checkSociety: Joi.boolean()
    })
};