const Joi = require('express-validation').Joi;

exports.createCCAValidation = {
    body: Joi.object({
        name: Joi.string().min(1).max(50).required(),
        designation: Joi.string().min(1).max(50).required(),
        email: Joi.string().email().min(1).max(50).required()
    })
};

exports.createSocietyValidation = {
    body: Joi.object({
        name: Joi.string().min(1).max(50).required(),
        initials: Joi.string().min(1).max(10).required(),
        email: Joi.string().email().min(1).max(50).required()
    })
};

exports.createDepartmentValidation = {
    body: Joi.object({
        name: Joi.string().min(1).max(50).required()
    })
};

exports.createDUserValidation = {
    body: Joi.object({
        deptId: Joi.number().integer().required(),
        name: Joi.string().min(1).max(50).required(),
        email: Joi.string().email().min(1).max(50).required(),
    })
};

exports.editCCAValidation = {
    body: Joi.object({
        id: Joi.number().integer().required(),
        name: Joi.string().min(1).max(50),
        designation: Joi.string().min(1).max(50),
        email: Joi.string().email().min(1).max(50)
    })
};

exports.editCCAAccessValidation = {
    body: Joi.object({
        id: Joi.number().integer().required(),
        account: Joi.boolean(),
        approval: Joi.boolean(),
        review: Joi.boolean(),
        verify: Joi.boolean(),
        cancel: Joi.boolean(),
        log: Joi.boolean(),
        category: Joi.boolean(),
    })
};

exports.editSocietyValidation = {
    body: Joi.object({
        id: Joi.number().integer().required(),
        name: Joi.string().min(1).max(50),
        initials: Joi.string().min(1).max(10),
        email: Joi.string().email().min(1).max(50)
    })
};

exports.editDepartmentValidation = {
    body: Joi.object({
        id: Joi.number().integer().required(),
        name: Joi.string().min(1).max(50).required()
    })
};

exports.editDUserValidation = {
    body: Joi.object({
        id: Joi.number().integer().required(),
        deptId: Joi.number().integer(),
        name: Joi.string().min(1).max(50),
        email: Joi.string().email().min(1).max(50),
    })
};

exports.fetchCCAValidation = {
    body: Joi.object({
    
    })
};

exports.fetchSocietyValidation = {
    body: Joi.object({
    
    })
};

exports.fetchDepartmentValidation = {
    body: Joi.object({
    
    })
};

exports.fetchDUserValidation = {
    body: Joi.object({
    
    })
};

exports.changePasswordValidation = {
    body: Joi.object({
        oldPassword: Joi.string().min(8).max(30).required(),
        newPassword: Joi.string().min(8).max(30).required(),
    })
};

exports.updatePasswordValidation = {
    body: Joi.object({
        newPassword: Joi.string().min(8).max(30).required()
    })
};