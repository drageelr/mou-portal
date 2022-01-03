const router = require('express').Router();
const validate = require('express-validation').validate;
const { verfiyUser } = require('../services/jwt');
const { validateUserAccess, validateCCAAccess } = require('../services/access-validator');
const categoryValidation = require('../validations/category.validation');
const categoryController = require('../controllers/category.controller');

// API 3.1: Create Category
router.post(
    '/create',
    validate(categoryValidation.createCategoryValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    validateCCAAccess,
    categoryController.createCategory
);

// API 3.2: Create Mileage
router.post(
    '/create-mileage',
    validate(categoryValidation.createMileageValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    validateCCAAccess,
    categoryController.createMileage
);

// API 3.3: Edit Category
router.post(
    '/edit',
    validate(categoryValidation.editCategoryValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    validateCCAAccess,
    categoryController.editCategory
);

// API 3.4: Edit Mileage
router.post(
    '/edit-mileage',
    validate(categoryValidation.editMileageValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    validateCCAAccess,
    categoryController.editMileage
);

// API 3.5: Fetch Category
router.post(
    '/fetch',
    validate(categoryValidation.fetchCategoryValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    categoryController.fetchCategory
);

// API 3.6: Fetch Mileage
router.post(
    '/fetch-mileage',
    validate(categoryValidation.fetchMileageValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    categoryController.fetchMileage
);

// API 3.7: Add Mileage
router.post(
    '/add-mileage',
    validate(categoryValidation.addMileageValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    validateCCAAccess,
    categoryController.addMileage
);

// API 3.8: Remove Mileage
router.post(
    '/remove-mileage',
    validate(categoryValidation.removeMileageValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    validateCCAAccess,
    categoryController.removeMileage
);

// API 3.9: Suggest Category
router.post(
    '/suggest',
    validate(categoryValidation.suggestCategoryValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    categoryController.suggestCategory
)

module.exports = router;