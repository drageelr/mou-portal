const { DataTypes } = require('sequelize');
const sequelize = require('../services/sequelize');

const SMou = sequelize.define('SMou', {
    id: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    societyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: 'Society',
        referencesKey: 'id'
    },
    categoryId: {
        type: DataTypes.INTEGER,
        // allowNull: false,
        references: 'Category',
        referencesKey: 'id'
    },
    sponsorName: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    sponsorAlias: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    sponsorEmail: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    tax: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: true
});

module.exports = SMou;