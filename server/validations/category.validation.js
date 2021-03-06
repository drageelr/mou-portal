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

exports.createMileageValidation = {
    body: Joi.object({
        description: Joi.string().min(1).max(250).required(),
        checkDeptId: Joi.number().integer().required(),
        checkCCA: Joi.boolean().required(),
        checkSociety: Joi.boolean().required()
    })
};

exports.editCategoryValidation = {
    body: Joi.object({
        id: Joi.number().integer().required(),
        name: Joi.string().min(1).max(50),
        lowerBound: Joi.number().integer(),
        upperBound: Joi.number().integer(),
        lowerSuggestionBound: Joi.number().integer(),
        upperSuggestionBound: Joi.number().integer(),
        active: Joi.boolean()
    })
};

exports.editMileageValidation = {
    body: Joi.object({
        id: Joi.number().integer().required(),
        description: Joi.string().min(1).max(250),
        checkDeptId: Joi.number().integer(),
        checkCCA: Joi.boolean(),
        checkSociety: Joi.boolean()
    })
};

exports.fetchCategoryValidation = {
    body: Joi.object({
    
    })
};

exports.fetchMileageValidation = {
    body: Joi.object({
        categoryId: Joi.number().integer()
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

exports.suggestCategoryValidation = {
    body: Joi.object({
        smouId: Joi.number().integer().required()
    })
}