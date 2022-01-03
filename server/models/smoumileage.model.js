const { DataTypes } = require('sequelize');
const sequelize = require('../services/sequelize');

const SMouMileage = sequelize.define('SMouMileage', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    smouId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: 'SMou',
        referencesKey: 'id'
    },
    doneId: {
        type: DataTypes.INTEGER,
        allowNull: true
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

module.exports = SMouMileage;