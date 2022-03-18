const express = require('express')
const errorHandler = require('./middleware/error')

// Connect to db
const sequelize = require('./config/database')
const Transaction = require('./models/Transaction')
const Portfolio = require('./models/Portfolio')
const Client = require('./models/Client')
const Share = require('./models/Share')

// Test connection
sequelize
    .authenticate()
    .then(() => console.log('Database connected...'))
    .catch((err) => console.log('Error: ' + err))

const app = express()

// Parser middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Import into DB
const importData = async () => {
    try {
        await Client.bulkCreate(require('./_data/clients'))
        await Portfolio.bulkCreate(require('./_data/portfolios'))
        await Share.bulkCreate(require('./_data/shares'))
        console.log('Data imported..')
        process.exit()
    } catch (err) {
        console.error(err)
    }
}

// Delete data
const deleteData = async () => {
    try {
        await Portfolio.destroy({ where: {} })
        await Client.destroy({ where: {} })
        await Share.destroy({ where: {} })
        console.log('Data Destroyed..')
        process.exit()
    } catch (err) {
        console.error(err)
    }
}

if (process.argv[2] === '-i') {
    importData()
} else if (process.argv[2] === '-d') {
    deleteData()
}

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server started on port ${PORT}`))
