const customError = require('../errors/errors');
const hFuncs = require('../services/helper-funcs');
const Category = require('../models/category.model');
const Mileage = require('../models/mileage.model');
const CategoryMileage = require('../models/category-mileage.model');
const { sequelize } = require('../services/sequelize');
const { QueryTypes, fn, col, Op } = require('sequelize');
const SMouBenefit = require('../models/smoubenefit.model');
const Dept = require('../models/dept.model');
const SMou = require('../models/smou.model');

exports.createCategory = async (req, res, next) => {
    try {
        let params = req.body;

        let newEntry = await Category.create({
            name: params.name,
            lowerBound: params.lowerBound,
            upperBound: params.upperBound,
            lowerSuggestionBound: params.lowerSuggestionBound,
            upperSuggestionBound: params.upperSuggestionBound
        });

        res.json({
            statusCode: 200,
            message: 'Category Creation Successful!',
            data: {
                id: newEntry.id
            }
        });
    } catch(err) {
        next(err);
    }
}

exports.createMileage = async (req, res, next) => {
    try {
        let params = req.body;

        if (params.checkDeptId <= 0)
            params.checkDeptId = null;

        let newEntry = await Mileage.create({
            description: params.description,
            checkdeptId: params.checkDeptId,
            checkCCA: params.checkCCA,
            checkSociety: params.checkSociety
        });

        res.json({
            statusCode: 200,
            message: 'Mileage Creation Successful!',
            data: {
                id: newEntry.id
            }
        });
    } catch(err) {
        next(err);
    }
}

exports.editCategory = async (req, res, next) => {
    try {
        let params = req.body;

        let updateAttributes = hFuncs.duplicateObject(params, ['name', 'lowerBound', 'upperBound', 'lowerSuggestionBound', 'upperSuggestionBound', 'active'], true);

        let updatedEntry = await Category.update(updateAttributes, {
            where: { id: params.id },
            returning: true,
            plain: true
        });

        if (!updatedEntry[1]) throw new customError.BadRequestError('unable to edit category');

        res.json({
            statusCode: 200,
            message: 'Category Update Successful!'
        });
    } catch(err) {
        next(err);
    }
}

exports.editMileage = async (req, res, next) => {
    try {
        let params = req.body;

        if (params.checkDeptId > 0) {
            let newDept = await Dept.findOne({ where: { id: params.checkDeptId } });

            if (!newDept) throw new customError.NotFoundError('department not found');
        } else if (params.checkDeptId <= 0) {
            params.checkDeptId = null;
        }

        let updateAttributes = hFuncs.duplicateObject(params, ['description', 'checkDeptId', 'checkCCA', 'checkSociety'], true);

        let updatedEntry = await Mileage.update(updateAttributes, {
            where: { id: params.id },
            returning: true,
            plain: true
        });

        if (!updatedEntry[1]) throw new customError.BadRequestError('unable to edit category');

        res.json({
            statusCode: 200,
            message: 'Mileage Update Successful!'
        });
    } catch(err) {
        next(err);
    }
}

exports.fetchCategory = async (req, res, next) => {
    try {
        let reqEntries = await Category.findAll();

        const categories = reqEntries.map(obj => hFuncs.duplicateObject(obj, ['id', 'name', 'lowerBound', 'upperBound', 'lowerSuggestionBound', 'upperSuggestionBound', 'active'], true));

        res.json({
            statusCode: 200,
            message: 'Categories Fetched Successfully!',
            data: {
                categories: categories
            }
        })
    } catch(err) {
        next(err);
    }
}

exports.fetchMileage = async (req, res, next) => {
    try {
        let params = req.body;
        let reqEntries = undefined;

        if (params.categoryId) {
            let [result, _] = await sequelize.query('SELECT * FROM Mileage WHERE id in (SELECT mileageId FROM Category_Mileage WHERE categoryId = ' + params.categoryId + ');', QueryTypes.SELECT);

            reqEntries = result;
        } else {
            reqEntries = await Mileage.findAll();
        }

        const mileages = reqEntries.map(obj => hFuncs.duplicateObject(obj, ['id', 'description', 'checkDeptId', 'checkCCA', 'checkSociety'], true));

        res.json({
            statusCode: 200,
            message: 'Mileages Fetched Successfully!',
            data: {
                mileages: mileages
            }
        })
    } catch(err) {
        next(err);
    }
}

exports.addMileage = async (req, res, next) => {
    try {
        let params = req.body;

        // let reqCategory = Category.findOne({ where: { id: params.categoryId } });
        // let reqMileage = Mileage.findOne({ where: { id: params.mileageId } });

        // let duplicateEntry = CategoryMileage.findOne({ where: { categoryId: params.categoryId, mileageId: params.mileageId } });
    
        let [reqCategory, reqMileage, duplicateEntry] = await Promise.all([Category.findOne({ where: { id: params.categoryId } }), Mileage.findOne({ where: { id: params.mileageId } }), CategoryMileage.findOne({ where: { categoryId: params.categoryId, mileageId: params.mileageId } })]);

        if (!reqCategory || !reqMileage) throw new customError.NotFoundError('category or mileage not does not exist');

        if (duplicateEntry) throw new customError.DuplicateResourceError('mileage already added');
    
        await CategoryMileage.create({
            categoryId: params.categoryId,
            mileageId: params.mileageId
        });

        res.json({
            statusCode: 200,
            message: 'Mileage Addition Successful!'
        });
    } catch(err) {
        next(err);
    }
}

exports.removeMileage = async (req, res, next) => {
    try {
        let params = req.body;
    
        await CategoryMileage.destroy({ where: { categoryId: params.categoryId, mileageId: params.mileageId }});

        res.json({
            statusCode: 200,
            message: 'Mileage Deletion Successful!'
        });
    } catch(err) {
        next(err);
    }
}

exports.suggestCategory = async (req, res, next) => {
    try {
        let params = req.body;

        let reqSMou = await SMou.findOne({ where: { id: params.smouId } });
        if (!reqSMou) throw new customError.NotFoundError("smou not found");

        let reqSMouBenefitSum = await SMouBenefit.findAll({
            where: {
                smouId: params.smouId
            },
            attributes: [
                [fn('sum', col('value')), 'sum']
            ]
        });

        console.log(reqSMouBenefitSum[0].dataValues.sum);

        let reqCategory = await Category.findAll({
            where: {
                [Op.and]: [
                    {
                        [Op.and]: [
                            { lowerSuggestionBound: { [Op.lte]: reqSMouBenefitSum[0].dataValues.sum } },
                            { upperSuggestionBound: { [Op.gte]: reqSMouBenefitSum[0].dataValues.sum } }
                        ]
                    },
                    { active: true }
                ]
            }
        })

        res.json({
            statusCode: 200,
            message: 'Category Suggested Successfully!',
            data: {
                categories: reqCategory.map((obj) => {
                    return {id: obj.id, name: obj.name, lowerBound: obj.lowerBound, upperBound: obj.upperBound}
                })
            }
        })
    } catch(err) {
        next(err);
    }
}