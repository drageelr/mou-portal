const { DataTypes } = require('sequelize');
const { sequelize } = require('../services/sequelize');

const SMouStatus = sequelize.define('SMouStatus', {
    smouId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: 'SMou',
        referencesKey: 'id'
    },
    reviewId: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: true,
        references: 'CCA',
        referencesKey: 'id'
    },
    approvalId: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: true,
        references: 'CCA',
        referencesKey: 'id'
    },
    verificationId: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: true,
        references: 'CCA',
        referencesKey: 'id'
    },
    signed: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    cancelId: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: true,
        references: 'CCA',
        referencesKey: 'id'
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    commentId: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: true,
        references: 'SMouComment',
        referencesKey: 'id'
    }
}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = SMouStatus;