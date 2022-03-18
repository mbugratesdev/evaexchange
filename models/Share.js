const Sequelize = require('sequelize')
const db = require('../config/database')

const Share = db.define('share', {
    symbol: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
    },
})

// Create table if it does not exists
Share.sync({})

module.exports = Share
