const router = require('express').Router();
const validate = require('express-validation').validate;
const authValidation = require('../validations/auth.validation');
const authController = require('../controllers/auth.controller');

// API 1.1: Login
router.post(
    '/login',
    validate(authValidation.loginValidation, { keyByField: true }),
    authController.login
);

// API 1.2: Forgot Password
router.post(
    '/forgot-password',
    validate(authValidation.forgotPasswordValidation, { keyByField: true }),
    authController.forgotPassword
);

module.exports = router;