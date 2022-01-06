const { DataTypes } = require('sequelize');
const { sequelize } = require('../services/sequelize');

const SMouStatus = sequelize.define('SMouStatus', {
    smouId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'SMou',
            key: 'id'
        }
    },
    reviewId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'CCA',
            key: 'id'
        }
    },
    approvalId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'CCA',
            key: 'id'
        }
    },
    verificationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'CCA',
            key: 'id'
        }
    },
    signed: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    cancelId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'CCA',
            key: 'id'
        }
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    commentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'CCA',
            key: 'id'
        }
    }
}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = SMouStatus;