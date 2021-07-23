const jwt = require('../services/jwt');
const customError = require('../errors/errors');
const hFuncs = require('../services/helper-funcs');
const { userTypeMap } = require('../services/constants');
const { sendForgotPasswordEmail } = require('../services/nodemailer');

exports.login = async (req, res, next) => {
    try {
        let params = req.body;

        let reqUser = await userTypeMap[params.type].findOne({ where: { email: params.email, password: hFuncs.hash(params.password), active: true } });

        if (!reqUser) throw new customError.AuthenticationError('invalid email or password');

        let token = jwt.signUser(reqUser.id, params.type);

        let data = {
            token: token,
            name: reqUser.name
        }

        if (params.type == 'cca')
            data.designation = reqUser.designation;
        else if (params.type == 'society')
            data.initials = reqUser.initials;

        res.json({
            statusCode: 200,
            message: 'Login Successful!',
            data: data
        });

    } catch (err) {
        next(err);
    }
}

exports.forgotPassword = async (req, res, next) => {
    try {
        let params = req.body;

        let reqUser = await userTypeMap[params.type].findOne({ where: { email: params.email } });

        if (!reqUser) throw new customError.NotFoundError('user not found');

        let token = jwt.signUser(reqUser.id, params.type, '1h');

        sendForgotPasswordEmail(params.email, process.env.SERVER_URL + '/api/account/update-password?token=' + token);

        res.json({
            statusCode: 200,
            message: 'Email Sent Successfully!'
        });
    } catch (err) {
        next(err);
    }
}