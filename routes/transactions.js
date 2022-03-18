const express = require('express')
const router = express.Router()

const Transaction = require('../models/Transaction.js')
const Joi = require('joi')
const Share = require('../models/Share.js')
const Portfolio = require('../models/Portfolio.js')
const Client = require('../models/Client.js')

const schema = Joi.object({
    quantity: Joi.number().integer().positive().required(),
    portfolioId: Joi.number().integer().positive().required(),
    shareId: Joi.number().integer().positive().required(),
})

router.get('/all', (req, res) => {
    Transaction.findAll()
        .then((transactions) => res.json({ success: true, data: transactions }))
        .catch((err) => res.json({ success: false, error: 'Error fetching transactions' }))
})

router.post('/buy', async (req, res) => {
    // Data validation
    const { quantity, portfolioId, shareId } = req.body

    const { error, value } = schema.validate({ quantity, portfolioId, shareId })
    if (error) return res.status(400).json({ success: false, error: error.message })

    // Balance check
    const share = await Share.findByPk(shareId)
    if (share === null) return res.status(404).json({ success: false, error: 'No share with the given id' })

    const portfolio = await Portfolio.findByPk(portfolioId)
    if (portfolio === null) return res.status(404).json({ success: false, error: 'No portfolio with the given id' })

    let client = await Client.findByPk(portfolio.clientId)

    if (client.balance < share.price * quantity)
        return res.status(400).json({ success: false, error: 'Unsufficient balance error' })

    // Calculate total price
    const totalPrice = share.price * quantity

    // Update client balance
    client.balance = client.balance - totalPrice
    client = await client.save()

    // Create transaction
    const transaction = await Transaction.create({ portfolioId, shareId, quantity, isBuyTrade: true, totalPrice })

    res.status(201).json({ success: true, data: transaction })
})

router.post('/sell', async (req, res) => {
    // Data validation
    const { quantity, portfolioId, shareId } = req.body

    const { error, value } = schema.validate({ quantity, portfolioId, shareId })
    if (error) return res.status(400).json({ success: false, error: error.message })

    // Share check
    const share = await Share.findByPk(shareId)
    if (share === null) return res.status(404).json({ success: false, error: 'No share with the given id' })

    const portfolio = await Portfolio.findByPk(portfolioId)
    if (portfolio === null) return res.status(404).json({ success: false, error: 'No portfolio with the given id' })

    const numberOfBoughtShares = await Transaction.sum('quantity', {
        where: { portfolioId, shareId, isBuyTrade: true },
    })

    const numberOfSoldShares = await Transaction.sum('quantity', {
        where: { portfolioId, shareId, isBuyTrade: false },
    })

    const numberOfShares = numberOfBoughtShares - numberOfSoldShares

    if (numberOfShares < quantity) return res.status(404).json({ success: false, error: 'Unsufficient number of shares error' })

    // Calculate total price
    const totalPrice = share.price * quantity

    // Update client balance
    let client = await Client.findByPk(portfolio.clientId)

    client.balance = client.balance + totalPrice
    client = await client.save()

    // Create transaction
    const transaction = await Transaction.create({ portfolioId, shareId, quantity, isBuyTrade: false, totalPrice })

    res.status(201).json({ success: true, data: transaction })
})

module.exports = router
