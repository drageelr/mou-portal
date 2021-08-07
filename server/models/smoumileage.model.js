const { DataTypes } = require('sequelize');
const sequelize = require('../services/sequelize');

const SMouMileage = sequelize.define('SMouMileage', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
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
        allowNull: false
    },
    checkDeptId: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
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