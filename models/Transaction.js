const Sequelize = require('sequelize')
const db = require('../config/database')
const Portfolio = require('./Portfolio')
const Share = require('./Share')

const Transaction = db.define('transaction', {
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    totalPrice: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
    },
    isBuyTrade: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
})

Transaction.belongsTo(Portfolio, {
    foreignKey: {
        allowNull: false,
    },
})

Transaction.belongsTo(Share, {
    foreignKey: {
        allowNull: false,
    },
})

// Create table if it does not exists
Transaction.sync({})

module.exports = Transaction
