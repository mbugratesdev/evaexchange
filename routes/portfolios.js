const express = require('express')
const router = express.Router()
const asyncHandler = require('../middleware/async')
const Portfolio = require('../models/Portfolio.js')

router.get('/all', (req, res) => {
    Portfolio.findAll()
        .then((portfolios) => res.json({ success: true, data: portfolios }))
        .catch((err) => res.json({ success: false, error: 'Error fetching portfolios' }))
})

router.post(
    '/',
    asyncHandler(async (req, res) => {
        const { clientId } = req.body

        if (!clientId) return res.status(400).json({ success: false, error: 'Please provide client id' })

        // Create user
        const portfolio = await Portfolio.create({ clientId })
        return res.status(201).json({ success: true, data: portfolio })
    })
)

module.exports = router
