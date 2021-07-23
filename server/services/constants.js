const CCA = require('../models/cca.model');
const Society = require('../models/society.model');
const DUser = require('../models/duser.model');

exports.userTypeMap = {
    'cca': CCA,
    'society': Society,
    'duser': DUser
}