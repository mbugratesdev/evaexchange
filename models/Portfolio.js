const Sequelize = require('sequelize')
const db = require('../config/database')
const Client = require('./Client')

const Portfolio = db.define('portfolio', {})

Portfolio.belongsTo(Client, {
    foreignKey: {
        allowNull: false,
        unique: true,
    },
})

// Create table if it does not exists
Portfolio.sync({})

module.exports = Portfolio
