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

module.exports = router;