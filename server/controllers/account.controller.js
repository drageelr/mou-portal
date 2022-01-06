const generator = require('generate-password');
const customError = require('../errors/errors');
const hFuncs = require('../services/helper-funcs');
const { userTypeMap } = require('../services/constants');
const { sendAccountCreationEmail } = require('../services/nodemailer');
const CCA = require('../models/cca.model');
const CCAAccess = require('../models/ccaaccess.model');
const Society = require('../models/society.model');
const Dept = require('../models/dept.model');
const DUser = require('../models/duser.model');

function genPass() {
    return generator.generate({
        length: 10,
        numbers: true,
        lowercase: true,
        uppercase: true,
        strict: true
    });
}

exports.createCCA = async (req, res, next) => {
    try {
        let params = req.body;
        
        let duplicateEntry = await CCA.findOne({ where: { email: params.email } });

        if (duplicateEntry) throw new customError.DuplicateResourceError('cca with email already exists');

        let password = genPass();

        let newEntry = await CCA.create({
            name: params.name,
            email: params.email,
            designation: params.designation,
            password: hFuncs.hash(password)
        });

        await CCAAccess.create({ id: newEntry.id });

        sendAccountCreationEmail(params.email, params.name, password, 'CCA');

        res.json({
            statusCode: 200,
            message: 'CCA Acccount Creation Successful!',
            data: {
                id: newEntry.id
            }
        });
    } catch(err) {
        next(err);
    }
}

exports.createSociety = async (req, res, next) => {
    try {
        let params = req.body;
        
        let duplicateEntry = await Society.findOne({ where: { email: params.email } });

        if (duplicateEntry) throw new customError.DuplicateResourceError('society with email already exists');

        let password = genPass();

        let newEntry = await Society.create({
            name: params.name,
            email: params.email,
            initials: params.initials,
            password: hFuncs.hash(password)
        });

        sendAccountCreationEmail(params.email, params.name, password, 'Society');

        res.json({
            statusCode: 200,
            message: 'Society Acccount Creation Successful!',
            data: {
                id: newEntry.id
            }
        });
    } catch(err) {
        next(err);
    }
}

exports.createDepartment = async (req, res, next) => {
    try {
        let params = req.body;
        
        let newEntry = await Dept.create({
            name: params.name
        });

        res.json({
            statusCode: 200,
            message: 'Department Creation Successful!',
            data: {
                id: newEntry.id
            }
        });
    } catch(err) {
        next(err);
    }
}

exports.createDUser = async (req, res, next) => {
    try {
        let params = req.body;
        
        let duplicateEntry = await DUser.findOne({ where: { email: params.email } });

        if (duplicateEntry) throw new customError.DuplicateResourceError('duser with email already exists');

        let reqDept = await Dept.findOne({ where: { id: params.deptId } });

        if (!reqDept) throw new customError.BadRequestError('invalid department id');

        let password = genPass();

        let newEntry = await DUser.create({
            name: params.name,
            email: params.email,
            deptId: params.deptId,
            password: hFuncs.hash(password)
        });

        sendAccountCreationEmail(params.email, params.name, password, 'guser');

        res.json({
            statusCode: 200,
            message: 'DUser Acccount Creation Successful!',
            data: {
                id: newEntry.id
            }
        });
    } catch(err) {
        next(err);
    }
}

exports.editCCA = async (req, res, next) => {
    try {
        let params = req.body;
        
        if (params.email) {
            let duplicateEntry = await CCA.findOne({ where: { email: params.email } });
    
            if (duplicateEntry) throw new customError.DuplicateResourceError('cca with email already exists');
        }

        let updateAttributes = hFuncs.duplicateObject(params, ['name', 'designation', 'email'], true);

        let updatedEntry = await CCA.update(updateAttributes, {
            where: { id: params.id },
            returning: true,
            plain: true
        });

        if (!updatedEntry[0]) throw new customError.BadRequestError('unable to edit cca account');
        
        res.json({
            statusCode: 200,
            message: 'CCA Acccount Update Successful!',
        });
    } catch(err) {
        next(err);
    }
}

exports.editCCAAccess = async (req, res, next) => {
    try {
        let params = req.body;

        let updateAttributes = hFuncs.duplicateObject(params, ['account', 'appproval', 'review', 'verify', 'cancel', 'log', 'category'], true);

        let updatedEntry = await CCA.update(updateAttributes, {
            where: { id: params.id },
            returning: true,
            plain: true
        });

        if (!updatedEntry[0]) throw new customError.BadRequestError('unable to edit cca account access');
        
        res.json({
            statusCode: 200,
            message: 'CCA Acccount Access Update Successful!',
        });
    } catch(err) {
        next(err);
    }
}

exports.editSociety = async (req, res, next) => {
    try {
        let params = req.body;
        
        if (params.email) {
            let duplicateEntry = await Society.findOne({ where: { email: params.email } });
    
            if (duplicateEntry) throw new customError.DuplicateResourceError('society with email already exists');
        }

        let updateAttributes = hFuncs.duplicateObject(params, ['name', 'initials', 'email'], true);

        let updatedEntry = await Society.update(updateAttributes, {
            where: { id: params.id },
            returning: true,
            plain: true
        });

        if (!updatedEntry[0]) throw new customError.BadRequestError('unable to edit society account');
        
        res.json({
            statusCode: 200,
            message: 'Society Acccount Update Successful!',
        });
    } catch(err) {
        next(err);
    }
}

exports.editDepartment = async (req, res, next) => {
    try {
        let params = req.body;
        
        let updatedEntry = await Dept.update({ name: params.name }, {
            where: { id: params.id },
            returning: true,
            plain: true
        });

        if (!updatedEntry[0]) throw new customError.BadRequestError('unable to edit department');
        
        res.json({
            statusCode: 200,
            message: 'Department Update Successful!',
        });
    } catch(err) {
        next(err);
    }
}

exports.editDUser = async (req, res, next) => {
    try {
        let params = req.body;
        
        if (params.email) {
            let duplicateEntry = await DUser.findOne({ where: { email: params.email } });
    
            if (duplicateEntry) throw new customError.DuplicateResourceError('duser with email already exists');
        }

        if (params.deptId) {
            let newDept = await DUser.findOne({ where: { id: params.deptId } });

            if (!deptId) throw new customError.NotFoundError('department not found');
        }

        let updateAttributes = hFuncs.duplicateObject(params, ['name', 'initials', 'email', 'deptId'], true);

        let updatedEntry = await DUser.update(updateAttributes, {
            where: { id: params.id },
            returning: true,
            plain: true
        });

        if (!updatedEntry[0]) throw new customError.BadRequestError('unable to edit duser account');
        
        res.json({
            statusCode: 200,
            message: 'DUser Acccount Update Successful!',
        });
    } catch(err) {
        next(err);
    }
}

exports.fetchCCA = async (req, res, next) => {
    try {
        let reqEntries = CCA.find();
        let reqEntriesAccess = CCAAccess.find();

        await Promise.all([reqEntries, reqEntriesAccess]);

        const users = reqEntries.map(obj => hFuncs.duplicateObject(obj, ['id', 'name', 'designation', 'email', 'active'], true));
        const userAccess = reqEntriesAccess.map(obj => hFuncs.duplicateObject(obj, ['id', 'account', 'approval', 'review', 'verify', 'cancel', 'log', 'category'], true));

        res.json({
            statusCode: 200,
            message: 'CCA Accounts Fetched Successfully!',
            data: {
                users: users,
                userAccess: userAccess
            }
        })
    } catch(err) {
        next(err);
    }
}

exports.fetchSociety = async (req, res, next) => {
    try {
        let reqEntries = await Society.find();

        const users = reqEntries.map(obj => hFuncs.duplicateObject(obj, ['id', 'name', 'initials', 'email', 'active'], true));

        res.json({
            statusCode: 200,
            message: 'Society Accounts Fetched Successfully!',
            data: {
                users: users
            }
        })
    } catch(err) {
        next(err);
    }
}

exports.fetchDepartment = async (req, res, next) => {
    try {
        let reqEntries = await Dept.find();

        const departments = reqEntries.map(obj => hFuncs.duplicateObject(obj, ['id', 'name'], true));

        res.json({
            statusCode: 200,
            message: 'Departments Fetched Successfully!',
            data: {
                departments: departments
            }
        })
    } catch(err) {
        next(err);
    }
}

exports.fetchDUser = async (req, res, next) => {
    try {
        let reqEntries = await DUser.find();

        const users = reqEntries.map(obj => hFuncs.duplicateObject(obj, ['id', 'deptId', 'name', 'email', 'active'], true));

        res.json({
            statusCode: 200,
            message: 'DUser Accounts Fetched Successfully!',
            data: {
                users: users
            }
        })
    } catch(err) {
        next(err);
    }
}

exports.changePassword = async (req, res, next) => {
    try {
        let params = req.body;

        let updateEntry = await userTypeMap[params.userObj.type].update({password: hFuncs.hash(params.newPassword)}, {
            where: { password: hFuncs.hash(params.oldPassword), id: params.userObj.id },
            returning: true,
            plain: true
        });

        if (!updateEntry[0]) throw new customError.BadRequestError('invalid old password');

        res.json({
            statusCode: 200,
            message: 'Change Password Successful!'
        });
    } catch(err) {
        next(err);
    }
}

exports.updatePassword = async (req, res, next) => {
    try {
        let params = req.body;

        let updateEntry = await userTypeMap[params.userObj.type].update({password: hFuncs.hash(params.newPassword)}, {
            where: { id: params.userObj.id },
            returning: true,
            plain: true
        });

        console.log(updateEntry);

        if (!updateEntry[1]) throw new customError.BadRequestError('unable to update password');

        res.json({
            statusCode: 200,
            message: 'Update Password Successful!'
        });
    } catch(err) {
        next(err);
    }
}