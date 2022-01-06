const CCA = require('../models/cca.model');
const CCAAccess = require('../models/ccaaccess.model');
const Society = require('../models/society.model');
const Dept = require('../models/dept.model');
const DUser = require('../models/duser.model');
const Category = require('../models/category.model');
const Mileage = require('../models/mileage.model');
const CategoryMileage = require('../models/category-mileage.model');
const SMou = require('../models/smou.model');
const SMouMileage = require('../models/smoumileage.model');
const SMouStatus = require('../models/smoustatus.model');
const SMouBenefit = require('../models/smoubenefit.model');
const Comment = require('../models/comment.model');

exports.syncModels = async () => {
    try {
        await CCA.sync();
        await CCAAccess.sync();
        await Society.sync();
        await Dept.sync();
        await DUser.sync();
        await Category.sync();
        await Mileage.sync();
        await CategoryMileage.sync();
        await SMou.sync();
        await SMouMileage.sync();
        await SMouStatus.sync();
        await SMouBenefit.sync();
        await Comment.sync();
    } catch(err) {
        console.log(err);
    }
}