const router = require('express').Router();
const validate = require('express-validation').validate;
const { verfiyUser } = require('../services/jwt');
const { validateUserAccess, validateCCAAccess } = require('../services/access-validator');
const categoryValidation = require('../validations/category.validation');
const categoryController = require('../controllers/category.controller');

// API 2.1: Create Category
router.post(
    '/create',
    validate(categoryValidation.createCategoryValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    validateCCAAccess,
    categoryController.createCategory
);

// API 2.2: Create Mileage
router.post(
    '/create-mileage',
    validate(categoryValidation.createMileageValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    validateCCAAccess,
    categoryController.createMileage
);

// API 2.3: Edit Category
router.post(
    '/edit',
    validate(categoryValidation.editCategoryValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    validateCCAAccess,
    categoryController.editCategory
);

// API 2.4: Edit Mileage
router.post(
    '/edit-mileage',
    validate(categoryValidation.editMileageValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    validateCCAAccess,
    categoryController.editMileage
);

// API 2.5: Add Mileage
router.post(
    '/add-mileage',
    validate(categoryValidation.addMileageValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    validateCCAAccess,
    categoryController.addMileage
);

// API 2.6: Remove Mileage
router.post(
    '/remove-mileage',
    validate(categoryValidation.removeMileageValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    validateCCAAccess,
    categoryController.removeMileage
);

module.exports = router;