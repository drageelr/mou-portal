const jwt = require('jsonwebtoken');
const customError = require('../errors/errors');
const { userTypeMap } = require('../services/constants');

exports.signUser = (id, type, expiry = '12h') => {
    return jwt.sign({id: id, type: type}, process.env.SECRET_KEY, {expiresIn: expiry});
}

function decodeToken(token) {
    try {
        return jwt.verify(token, process.env.SECRET_KEY);
    } catch(e) {
        return {err: e};
    }
}

exports.verfiyUser = async (req, res, next) => {
    try {
        let token = req.get("Authorization");
        if (token) {
            token = token.substring(7);
        } else {
            throw new customError.ForbiddenAccessError("no token given");
        }

        let decodedObj = decodeToken(token);
        if(decodedObj.err) throw new customError.ForbiddenAccessError("invalid token");

        let reqUser = await userTypeMap[decodedObj.type].findOne({ where: { id: decodedObj.id, active: true } });
        if (reqUser) {
            req.body.userObj = {id: decodedObj.id, type: decodedObj.type};
        } else {
            throw new customError.ForbiddenAccessError("invalid token");
        }

        next();
    } catch(e) {
        next(e);
    }
}