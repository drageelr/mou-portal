const { DataTypes } = require('sequelize');
const sequelize = require('../services/sequelize');

const SMouComment = sequelize.define('SMouComment', {
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
    content: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    ccaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: 'CCA',
        referencesKey: 'id'
    }
}, {
    freezeTableName: true,
    timestamps: true
});

module.exports = SMouComment;