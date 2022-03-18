const express = require('express')
const errorHandler = require('./middleware/error')

// Connect to db
const sequelize = require('./config/database')

// Test connection
sequelize
    .authenticate()
    .then(() => console.log('Database connected...'))
    .catch((err) => console.log('Error: ' + err))

const app = express()

// Parser middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Index route
app.use('/api/clients', require('./routes/clients'))
app.use('/api/portfolios', require('./routes/portfolios'))
app.use('/api/shares', require('./routes/shares'))
app.use('/api/transactions', require('./routes/transactions'))
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server started on port ${PORT}`))
