const { DataTypes } = require('sequelize');
const { sequelize } = require('../services/sequelize');

const SMouBenefit = sequelize.define('SMouBenefit', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    smouId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'SMou',
            key: 'id'
        }
    },
    description: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    value: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = SMouBenefit;