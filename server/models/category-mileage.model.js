const { DataTypes } = require('sequelize');
const { sequelize } = require('../services/sequelize');

const CategoryMileage = sequelize.define('Category_Mileage', {
    categoryId: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'Category',
            key: 'id'
        }
    },
    mileageId: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'Mileage',
            key: 'id'
        }
    }
}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = CategoryMileage;