const { DataTypes } = require('sequelize');
const { sequelize } = require('../services/sequelize');

const Mileage = sequelize.define('Mileage', {
    id: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    description: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    checkDeptId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: 'Dept',
        referencesKey: 'id'
    },
    checkCCA: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    checkSociety: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = Mileage;