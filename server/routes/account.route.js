const router = require('express').Router();
const validate = require('express-validation').validate;
const { verfiyUser } = require('../services/jwt');
const { validateUserAccess, validateCCAAccess } = require('../services/access-validator');
const accountValidation = require('../validations/account.validation');
const accountController = require('../controllers/account.controller');

// API 2.1: Create CCA
router.post(
    '/cca/create',
    validate(accountValidation.createCCAValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    validateCCAAccess,
    accountController.createCCA
);

// API 2.2: Create Society
router.post(
    '/society/create',
    validate(accountValidation.createSocietyValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    validateCCAAccess,
    accountController.createSociety
);

// API 2.3: Create Department
router.post(
    '/dept/create',
    validate(accountValidation.createDepartmentValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    validateCCAAccess,
    accountController.createDepartment
);

// API 2.4: Create DUser
router.post(
    '/duser/create',
    validate(accountValidation.createDUserValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    validateCCAAccess,
    accountController.createDUser
);

// API 2.5: Edit CCA
router.post(
    '/cca/edit',
    validate(accountValidation.editCCAValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    validateCCAAccess,
    accountController.editCCA
);

// API 2.6: Edit CCA Access
router.post(
    '/cca/edit-access',
    validate(accountValidation.editCCAAccessValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    validateCCAAccess,
    accountController.editCCAAccess
);

// API 2.7: Edit Society
router.post(
    '/society/edit',
    validate(accountValidation.editSocietyValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    validateCCAAccess,
    accountController.editSociety
);

// API 2.8: Edit Department
router.post(
    '/dept/edit',
    validate(accountValidation.editDepartmentValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    validateCCAAccess,
    accountController.editDepartment
);

// API 2.9: Edit DUser
router.post(
    '/duser/edit',
    validate(accountValidation.editDUserValidation, { keyByField: true }),
    verfiyUser,
    validateUserAccess,
    validateCCAAccess,
    accountController.editDUser
);

// API 2.10: Change Password
router.post(
    '/change-password',
    validate(accountValidation.changePasswordValidation, { keyByField: true }),
    verfiyUser,
    accountController.changePassword
);

// API 2.11: Update Password
router.post(
    '/update-password',
    validate(accountValidation.updatePasswordValidation, { keyByField: true }),
    verfiyUser,
    accountController.updatePassword
);

module.exports = router;