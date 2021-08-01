const router = require('express').Router();
const validate = require('express-validation').validate;
const { verfiyUser } = require('../services/jwt');
const { validateUserAccess, validateCCAAccess } = require('../services/access-validator');
const categoryValidation = require('../validations/category.validation');
const categoryController = require('../controllers/category.controller');

// API 2.1: Create Category
router.post(
    '/create',
    validate(accountValidation.createCategoryValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    validateCCAAccess,
    accountController.createCategory
);

// API 2.2: Create Mileage
router.post(
    '/create-mileage',
    validate(accountValidation.createMileageValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    validateCCAAccess,
    accountController.createMileage
);

// API 2.3: Edit Category
router.post(
    '/edit',
    validate(accountValidation.editCategoryValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    validateCCAAccess,
    accountController.editCategory
);

// API 2.4: Edit Mileage
router.post(
    '/edit-mileage',
    validate(accountValidation.editMileageValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    validateCCAAccess,
    accountController.editMileage
);

// API 2.5: Add Mileage
router.post(
    '/add-mileage',
    validate(accountValidation.addMileageValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    validateCCAAccess,
    accountController.addMileage
);

// API 2.6: Remove Mileage
router.post(
    '/remove-mileage',
    validate(accountValidation.removeMileageValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    validateCCAAccess,
    accountController.removeMileage
);

module.exports = router;