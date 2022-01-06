const { DataTypes } = require('sequelize');
const { sequelize } = require('../services/sequelize');

const Dept = sequelize.define('Dept', {
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
    }
}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = Dept;