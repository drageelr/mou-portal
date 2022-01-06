const { DataTypes } = require('sequelize');
const { sequelize } = require('../services/sequelize');

const CategoryMileage = sequelize.define('Category_Mileage', {
    categoryId: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        allowNull: false,
        references: 'Category',
        referencesKey: 'id'
    },
    mileageId: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        allowNull: false,
        references: 'Mileage',
        referencesKey: 'id'
    }
}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = CategoryMileage;