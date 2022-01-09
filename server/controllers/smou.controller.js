const customError = require('../errors/errors');
const hFuncs = require('../services/helper-funcs');
const { sequelize } = require('../services/sequelize');
const { fn, col, Op, QueryTypes } = require('sequelize');

const { userTypeMap } = require('../services/constants');
const CCAAccess = require('../models/ccaaccess.model');
const Dept = require('../models/dept.model');
const Category = require('../models/category.model');
const Mileage = require('../models/mileage.model');
const CategoryMileage = require('../models/category-mileage.model');
const SMou = require('../models/smou.model');
const SMouMileage = require('../models/smoumileage.model');
const SMouStatus = require('../models/smoustatus.model');
const SMouBenefit = require('../models/smoubenefit.model');

async function validateSMouAccess(societyId, smouId) {
    let reqSMou = await SMou.findOne({
        where: {
            [Op.and]: [
                { id: smouId },
                { societyId: societyId }
            ]
        }
    })

    return reqSMou;
}

exports.createSMou = async (req, res, next) => {
    try {
        let params = req.body;

        let newSMou = await SMou.create({
            societyId: params.userObj.id,
            sponsorName: params.sponsorName,
            sponsorAlias: params.sponsorAlias,
            sponsorEmail: params.sponsorEmail,
            tax: params.tax
        });

        await SMouStatus.create({
            smouId: newSMou.id,
            signed: false,
            status: 'In Progress'
        })

        res.json({
            statusCode: 200,
            message: "Sponsor MoU Created!",
            data: {
                id: newSMou.id
            }
        });
    } catch(err) {
        next(err);
    }
}

exports.updateSMouBenefit = async (req, res, next) => {
    try {
        let params = req.body;

        let smouValidated = await validateSMouAccess(params.userObj.id, params.smouId);
        if (!smouValidated) throw new customError.ForbiddenAccessError("you are not allowed to access somone else's smou");

        let reqSMouStatus = await SMouStatus.findOne({
            where: {
                smouId: params.smouId
            }
        });
        if (reqSMouStatus.status != 'In Progress') throw new customError.ForbiddenAccessError("not allowed to update");

        await Promise.all([
            SMouBenefit.destroy({
                where: {
                    smouId: params.smouId
                }
            }),
            SMouMileage.destroy({
                where: {
                    smouId: params.smouId
                }
            }),
            SMou.update({categoryId: null}, {
                where: {
                    id: params.smouId
                }
            })
        ]);

        if (params.benefits.length) {
            await SMouBenefit.bulkCreate(params.benefits.map((obj, index) => {
                return {id: index + 1, smouId: params.smouId, description: obj.description, value: obj.value};
            }));
        }

        res.json({
            statusCode: 200,
            message: "Sponsor MoU Benefits Updated!",
        })
    } catch(err) {
        next(err);
    }
}

exports.fetchSMouBenefit = async (req, res, next) => {
    try {
        let params = req.body;

        let smouValidated = await validateSMouAccess(params.userObj.id, params.smouId);
        if (!smouValidated) throw new customError.ForbiddenAccessError("you are not allowed to access somone else's smou");

        let reqSMouBenefit = await SMouBenefit.findAll({
            where: {
                smouId: params.smouId
            },
            order: [
                ['id', 'ASC']
            ]
        });

        res.json({
            statusCode: 200,
            message: "Sponsor MoU Benefits Fetched Successfully!",
            data: {
                benefits: reqSMouBenefit.map((obj) => {
                    return {description: obj.description, value: obj.value}
                })
            }
        });
    } catch(err) {
        next(err);
    }
}

exports.updateSMouCategory = async (req, res, next) => {
    try {
        let params = req.body;

        let smouValidated = await validateSMouAccess(params.userObj.id, params.smouId);
        if (!smouValidated) throw new customError.ForbiddenAccessError("you are not allowed to access somone else's smou");

        let reqSMouStatus = await SMouStatus.findOne({
            where: {
                smouId: params.smouId
            }
        });
        if (reqSMouStatus.status != 'In Progress') throw new customError.ForbiddenAccessError("not allowed to update");

        let reqSMouBenefitSum = await SMouBenefit.findAll({
            where: {
                smouId: params.smouId
            },
            attributes: [
                [fn('sum', col('value')), 'sum']
            ]
        });

        let reqCategory = await Category.findOne({
            where: {
                [Op.and]: [
                    {
                        [Op.and]: [
                            { id: params.categoryId },
                            { active: true }
                        ]
                    },
                    {
                        [Op.and]: [
                            { lowerSuggestionBound: { [Op.lte]: reqSMouBenefitSum[0].dataValues.sum } },
                            { upperSuggestionBound: { [Op.gte]: reqSMouBenefitSum[0].dataValues.sum } }
                        ]
                    }
                ]
            }
        })

        if (!reqCategory) throw new customError.BadRequestError("bad category selected");

        await Promise.all([
            SMou.update({categoryId: params.categoryId}, {
                where: {
                    id: params.smouId
                }
            }),
            SMouMileage.destroy({
                where: {
                    smouId: params.smouId
                }
            })
        ]);

        await sequelize.query('SET @num=0;\nINSERT INTO SMouMileage (id, smouId, doneId, description, checkDeptId, checkCCA, checkSociety)\nSELECT @num := @num+1 AS id, ' + params.smouId + ' AS smouId, null AS doneId, description, checkDeptId, checkCCA, checkSociety\nFROM Mileage\nWHERE Mileage.id IN (SELECT mileageId FROM Category_Mileage WHERE categoryId = ' + reqCategory.id + ');');

        res.json({
            statusCode: 200,
            message: "SMou Category Updated!"
        });
    } catch(err) {
        next(err);
    }
}

exports.fetchSMouCategory = async (req, res, next) => {
    try {
        let params = req.body;

        let smouValidated = await validateSMouAccess(params.userObj.id, params.smouId);
        if (!smouValidated) throw new customError.ForbiddenAccessError("you are not allowed to access somone else's smou");

        let reqCategory = await Category.findOne({
            where: {
                id: smouValidated.categoryId
            }
        });

        res.json({
            statusCode: 200,
            message: "SMou Category Fetched Successfully!",
            data: {
                id: smouValidated.categoryId,
                name: reqCategory.name,
                lowerBound: reqCategory.lowerBound,
                upperBound: reqCategory.upperBound
            }
        });
    } catch(err) {
        next(err);
    }
}

exports.addSMouMileage = async (req, res, next) => {
    try {
        let params = req.body;

        let smouValidated = await validateSMouAccess(params.userObj.id, params.smouId);
        if (!smouValidated) throw new customError.ForbiddenAccessError("you are not allowed to access somone else's smou");

        let reqSMouStatus = await SMouStatus.findOne({
            where: {
                smouId: params.smouId
            }
        });
        if (reqSMouStatus.status != 'In Progress') throw new customError.ForbiddenAccessError("not allowed to update");

        let newSMouMileageId = await sequelize.query('INSERT INTO SMouMileage (id, smouId, doneId, description, checkDeptId, checkCCA, checkSociety) VALUES (SELECT id + 1 FROM SMouMileage WHERE smouId = ' + params.smouId + ', ' + params.smouId + ', NULL, ' + params.description + ', NULL, FALSE, FALSE)', {type: QueryTypes.INSERT});

        res.json({
            statusCode: 200,
            message: "SMou Mileage Added Successfully!",
            data: {
                id: newSMouMileageId
            }
        })

    } catch(err) {
        next(err);
    }
}

exports.removeSMouMileage = async (req, res, next) => {
    try {
        let params = req.body;

        let smouValidated = await validateSMouAccess(params.userObj.id, params.smouId);
        if (!smouValidated) throw new customError.ForbiddenAccessError("you are not allowed to access somone else's smou");

        let reqSMouStatus = await SMouStatus.findOne({
            where: {
                smouId: params.smouId
            }
        });
        if (reqSMouStatus.status != 'In Progress') throw new customError.ForbiddenAccessError("not allowed to update");

        await SMouMileage.destroy({
            where: {
                [Op.and]: [
                    {
                        id: params.mileageId
                    },
                    {
                        smouId: params.smouId
                    }
                ]
            }
        });

        res.json({
            statusCode: 200,
            message: "SMou Mileage Removed Successfully!"
        });
    } catch(err) {
        next(err);
    }
}

