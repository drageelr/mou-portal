const router = require('express').Router();
const validate = require('express-validation').validate;
const { verfiyUser } = require('../services/jwt');
const { validateUserAccess, validateCCAAccess } = require('../services/access-validator');
const categoryValidation = require('../validations/account.validation');
const categoryController = require('../controllers/account.controller');

// API 2.1: Create Category
router.post(
    '/create',
    validate(accountValidation.createCategoryValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    validateCCAAccess,
    accountController.createCategory
);

// API 2.2: Edit Category
router.post(
    '/edit',
    validate(accountValidation.editCategoryValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    validateCCAAccess,
    accountController.editCategory
);

// API 2.2: Add Mileage
router.post(
    '/add-mileage',
    validate(accountValidation.addMileageValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    validateCCAAccess,
    accountController.addMileage
);

module.exports = router;``