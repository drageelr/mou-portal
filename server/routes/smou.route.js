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

// API 4.6: Add SMou Mileage
router.post(
    '/mileage-add',
    validate(smouValidation.addSMouMileageValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    smouController.addSMouMileage
);

// API 4.7: Remove SMou Mileage
router.post(
    '/mileage-remove',
    validate(smouValidation.removeSMouMileageValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    smouController.removeSMouMileage
);

// -- NOT IMPLEMENTED BELOW --

// API 4.8: Fetch SMou Mileage
router.post(
    '/mileage-fetch',
    validate(smouValidation.fetchSMouMileageValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    // smouController.fetchSMouMileage
);

// API 4.9: Submit SMou
router.post(
    '/submit',
    validate(smouValidation.submitSMouValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    // smouController.submitSMou
);

// API 4.10: Fetch SMou
router.post(
    '/fetch',
    validate(smouValidation.fetchSMouValidation, { keyByField: true }),
    verfiyUser,
    // smouController.fetchSMou
);

// API 4.11: Review SMou
router.post(
    '/review',
    validate(smouValidation.reviewSMouValidation, { keyByField: true }),
    verfiyUser,
    validateCCAAccess,
    // smouController.reviewSMou
);

// API 4.12: Approve SMou
router.post(
    '/approve',
    validate(smouValidation.removeSMouMileageValidation, { keyByField: true }),
    verfiyUser,
    validateCCAAccess,
    // smouController.approveSMou
);

// API 4.13: Issue SMou
router.post(
    '/issue',
    validate(smouValidation.issueSMouValidation, { keyByField: true }),
    verfiyUser,
    // smouController.issueSMou
);

// // API 4.14: PDF SMou
// router.post(
//     '/pdf',
//     validate(),
//     // Add another layer of verification here for the token
//     // smouController.pdfSMou
// );

// // API 4.15: Sign SMou
// router.post(
//     '/sign',
//     validate(),
//     // Add another layer of verification here for the token
//     // smouController.signSMou
// );

// API 4.16: Verify SMou
router.post(
    '/verify',
    validate(smouValidation.verifySMouValidation, { keyByField: true }),
    verfiyUser,
    validateCCAAccess,
    // smouController.verifySMou
);

// API 4.17: Cancel SMou
router.post(
    '/cancel',
    validate(smouValidation.cancelSMouValidation, { keyByField: true }),
    verfiyUser,
    validateCCAAccess,
    // smouController.cancelSMou
);

// API 4.18: Fetch SMou Log
router.post(
    '/log-fetch',
    validate(smouValidation.fetchSMouLogValidation, { keyByField: true }),
    verfiyUser,
    validateCCAAccess,
    // smouController.fetchSMouLog
);

// API 4.19: Update SMou Mileage
router.post(
    '/mielage-update',
    validate(smouValidation.updateSMouMileageValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    // smouController.updateSMouMileage
);

module.exports = router;