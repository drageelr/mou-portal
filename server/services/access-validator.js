const customError = require('../errors/errors');
const CCAAccess = require('../models/ccaaccess.model');

const userAccess = {
    // API 2: Account Management
    '/api/account/cca/create': ['cca'],
    '/api/account/society/create': ['cca'],
    '/api/account/dept/create': ['cca'],
    '/api/account/duser/create': ['cca'],
    '/api/account/cca/edit': ['cca'],
    '/api/account/cca/edit-access': ['cca'],
    '/api/account/society/edit': ['cca'],
    '/api/account/dept/edit': ['cca'],
    '/api/account/duser/edit': ['cca'],
    
    // API 3: Category Management
    '/api/category/create': ['cca'],
    '/api/category/create-mileage': ['cca'],
    '/api/category/edit': ['cca'],
    '/api/category/edit-mileage': ['cca'],
    '/api/category/add-mileage': ['cca'],
    '/api/category/remove-mileage': ['cca'],
    '/api/category/suggest': ['society'],

    // API 4: SMou Management
    '/api/smou/create': ['society'],
    '/api/smou/benefit-update': ['society'],
    '/api/smou/benefit-fetch': ['society'],
    '/api/smou/category-update': ['society'],
    '/api/smou/category-fetch': ['society'],
    '/api/smou/mileage-add': ['society'],
    '/api/smou/mileage-remove': ['society'],
    '/api/smou/mileage-fetch': ['society', 'duser', 'cca'],
    '/api/smou/submit': ['society'],
    '/api/smou/fetch': ['cca'],
    '/api/smou/review': ['cca'],
    '/api/smou/approve': ['cca'],
    '/api/smou/issue': ['cca'],
    '/api/smou/verify': ['cca'],
    '/api/smou/cancel': ['cca'],
    '/api/smou/log-fetch': ['cca'],
    '/api/smou/mileage-update': ['society', 'duser', 'cca'],
};

const ccaAccess = {
    // API 2: Account Management
    '/api/account/cca/create': 'account',
    '/api/account/society/create': 'account',
    '/api/account/dept/create': 'account',
    '/api/account/duser/create': 'account',
    '/api/account/cca/edit': 'account',
    '/api/account/cca/edit-access': 'account',
    '/api/account/society/edit': 'account',
    '/api/account/dept/edit': 'account',
    '/api/account/duser/edit': 'account',

    // API 3: Category Management
    '/api/category/create': 'category',
    '/api/category/create-mileage': 'category',
    '/api/category/edit': 'category',
    '/api/category/edit-mileage': 'category',
    '/api/category/add-mileage': 'category',
    '/api/category/remove-mileage': 'category',

    // API 4: SMou Mangement
    '/api/smou/review': 'review',
    '/api/smou/approve': 'approve',
    '/api/smou/verify': 'verify',
    '/api/smou/verify': 'cancel',
    '/api/smou/log-fetch': 'log',
};

exports.validateUserAccess = (req, res, next) => {
    try {
        let accessList = userAccess[req.originalUrl];
        if (accessList) {
            let accessGranted = false;

            for (let a of accessList) {
                if (a === req.body.userObj.type) {
                    accessGranted = true;
                    break;
                }
            }

            if (accessGranted) {
                next();
            } else {
                throw new customError.ForbiddenAccessError('invalid permission to access resource');
            }
        } else {
            next();
        }
    } catch(err) {
        next(err);
    }
}

exports.validateCCAAccess = async (req, res, next) => {
    try {
        if (req.body.userObj.type === 'cca') {
            let reqCCAAccess = await CCAAccess.findOne({ where: { id: req.body.userObj.id } });
            let access = ccaAccess[req.originalUrl];
            if(reqCCAAccess[access]) {
                next();
            } else {
                throw new customError.ForbiddenAccessError('permission required to access this resource');
            }
        } else {
            next();
        }
    } catch (err) {
        next(err);
    }
}