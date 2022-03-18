var Sequelize = require('sequelize')

require('dotenv').config({ path: './config/config.env' })

module.exports = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
})
