const customError = require('../errors/errors');
const hFuncs = require('../services/helper-funcs');
const Category = require('../models/category.model');
const Mileage = require('../models/mileage.model');
const CategoryMileage = require('../models/category-mileage.model');

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
            deptId: params.deptId,
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

        let updateAttributes = hFuncs.duplicateObject(params, ['description', 'deptId', 'checkCCA', 'checkSociety'], true);

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