const customError = require('../errors/errors');
const hFuncs = require('../services/helper-funcs');
const Category = require('../models/category.model');
const Mileage = require('../models/mileage.model');
const CategoryMileage = require('../models/category-mileage.model');
const { sequelize } = require('../services/sequelize');
const { QueryTypes, fn, col, Op } = require('sequelize');
const SMouBenefit = require('../models/smoubenefit.model');

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

        let newEntry = await Mileage.create({
            description: params.description,
            checkdeptId: params.checkdeptId,
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

        if (!updatedEntry[0]) throw new customError.BadRequestError('unable to edit category');

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

        let updateAttributes = hFuncs.duplicateObject(params, ['description', 'checkdeptId', 'checkCCA', 'checkSociety'], true);

        let updatedEntry = await Mileage.update(updateAttributes, {
            where: { id: params.id },
            returning: true,
            plain: true
        });

        if (!updatedEntry[0]) throw new customError.BadRequestError('unable to edit category');

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
        let reqEntries = await Category.find();

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
            reqEntries = await sequelize.query('SELECT * FROM Mileage WHERE id in (SELECT mileageId FROM Category_Mileage WHERE categoryId = ' + params.categoryId + ');', QueryTypes.SELECT);
        } else {
            reqEntries = await Mileage.find();
        }

        const mileages = reqEntries.map(obj => hFuncs.duplicateObject(obj, ['id', 'name', 'initials', 'email', 'active'], true));

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

        let reqCategory = Category.findOne({ where: { id: params.categoryId } });
        let reqMileage = Mileage.findOne({ where: { id: params.mileageId } });

        let duplicateEntry = CategoryMileage.findOne({ where: { categoryId: params.categoryId, mileageId: params.mileageId } });
    
        await Promise.all([reqCategory, reqMileage, duplicateEntry]);

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

        let reqSMouBenefitSum = await SMouBenefit.findAll({
            where: {
                smouId: params.smouId
            },
            attributes: [
                [fn('sum', col('value')), 'sum']
            ]
        });

        let reqCategory = await Category.findAll({
            where: {
                [Op.and]: [
                    {
                        [Op.and]: [
                            { lowerSuggestionBound: { [Op.lte]: reqSMouBenefitSum.sum } },
                            { upperSuggestionBound: { [Op.gte]: reqSMouBenefitSum.sum } }
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