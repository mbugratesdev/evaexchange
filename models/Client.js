const Sequelize = require('sequelize')
const db = require('../config/database')

const Client = db.define('client', {
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    balance: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
    },
})

// Create table if it does not exists
Client.sync({})

module.exports = Client
