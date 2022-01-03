const router = require('express').Router();
const validate = require('express-validation').validate;
const { verfiyUser } = require('../services/jwt');
const { validateUserAccess, validateCCAAccess } = require('../services/access-validator');
const smouValidation = require('../validations/smou.validation');
const smouController = require('../controllers/smou.controller');

// API 4.1: Create SMou
router.post(
    '/create',
    validate(smouValidation.createSMouValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    smouController.createSMou
);

// API 4.2: Update SMou Benefit
router.post(
    '/benefit-update',
    validate(smouValidation.updateSMouBenefitValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    smouController.updateSMouBenefit
);

// API 4.3: Fetch SMou Benefit
router.post(
    '/benefit-fetch',
    validate(smouValidation.fetchSMouBenefitValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    smouController.fetchSMouBenefit
);

// API 4.4: Update SMou Category
router.post(
    '/category-update',
    validate(smouValidation.updateSMouCategoryValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    smouController.updateSMouCategory
);

// API 4.5: Fetch SMou Category
router.post(
    '/category-fetch',
    validate(smouValidation.fetchSMouCategoryValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    smouController.fetchSMouCategory
);

module.exports = router;