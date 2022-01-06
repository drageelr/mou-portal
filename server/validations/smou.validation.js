const Joi = require('express-validation').Joi;

exports.createSMouValidation = {
    body: Joi.object({
        sponsorName: Joi.string().min(1).max(50).required(),
        sponsorAlias: Joi.string().min(1).max(50).required(),
        sponsorEmail: Joi.string().email().min(1).max(50).required(),
        tax: Joi.boolean().required()
    })
};

exports.updateSMouBenefitValidation = {
    body: Joi.object({
        smouId: Joi.number().integer().required(),
        benefits: Joi.array().items(Joi.object({
            description: Joi.string().min(1).max(250).required(),
            value: Joi.number().integer().required()
        })).required()
    })
}

exports.fetchSMouBenefitValidation = {
    body: Joi.object({
        smouId: Joi.number().integer().required()
    })
}

exports.updateSMouCategoryValidation = {
    body: Joi.object({
        smouId: Joi.number().integer().required(),
        categoryId: Joi.number().integer().required()
    })
}

exports.fetchSMouCategoryValidation = {
    body: Joi.object({
        smouId: Joi.number().integer().required(),
    })
}

exports.addSMouMileageValidation = {
    body: Joi.object({
        smouId: Joi.number().integer().required(),
        description: Joi.string().min(1).max(250).required()
    })
}

exports.removeSMouMileageValidation = {
    body: Joi.object({
        smouId: Joi.number().integer().required(),
        mileageId: Joi.number().integer().required()
    })
}

exports.fetchSMouMileageValidation = {
    body: Joi.object({
        smouId: Joi.number().integer().required(),
    })
}

exports.submitSMouValidation = {
    body: Joi.object({
        smouId: Joi.number().integer().required(),
    })
}

exports.fetchSMouValidation = {
    body: Joi.object({
        smouId: Joi.number().integer().required(),
    })
}

exports.reviewSMouValidation = {
    body: Joi.object({
        smouId: Joi.number().integer().required(),
        comment: Joi.string().min(1).max(500)
    })
}

exports.approveSMouValidation = {
    body: Joi.object({
        smouId: Joi.number().integer().required(),
        comment: Joi.string().min(1).max(500)
    })
}

exports.issueSMouValidation = {
    body: Joi.object({
        smouId: Joi.number().integer().required(),
        comment: Joi.string().min(1).max(500)
    })
}

exports.verifySMouValidation = {
    body: Joi.object({
        smouId: Joi.number().integer().required(),
        comment: Joi.string().min(1).max(500)
    })
}

exports.cancelSMouValidation = {
    body: Joi.object({
        smouId: Joi.number().integer().required(),
        comment: Joi.string().min(1).max(500)
    })
}

exports.fetchSMouLogValidation = {
    body: Joi.object({
        smouId: Joi.number().integer().required(),
    })
}

exports.updateSMouMileageValidation = {
    body: Joi.object({
        smouId: Joi.number().integer().required(),
        mileageId: Joi.number().integer().required(),
        status: Joi.boolean().required()
    })
}