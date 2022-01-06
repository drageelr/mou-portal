const { DataTypes } = require('sequelize');
const { sequelize } = require('../services/sequelize');

const CCAAccess = sequelize.define('CCA_Access', {
    id: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        allowNull: false,
        references: 'CCA',
        referencesKey: 'id'
    },
    account: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    approval: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    review: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    verify: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    cancel: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    log: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    category: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = CCAAccess;