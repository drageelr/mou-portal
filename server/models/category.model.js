const { DataTypes } = require('sequelize');
const sequelize = require('../services/sequelize');

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    lowerBound: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    upperBound: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    lowerSuggestionBound: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    upperSuggestionBound: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = Category;