const { DataTypes } = require('sequelize');
const sequelize = require('../services/sequelize');

const SMou = sequelize.define('SMou', {
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
    timestamps: true
});

module.exports = SMou;