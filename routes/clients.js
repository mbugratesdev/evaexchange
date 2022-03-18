const express = require('express')
const router = express.Router()
const Client = require('../models/Client.js')
const Joi = require('joi')

const schema = Joi.object({
    email: Joi.string().email().required(),
})

router.get('/all', (req, res) => {
    Client.findAll()
        .then((clients) => res.json({ success: true, data: clients }))
        .catch((err) => res.json({ success: false, error: 'Error fetching clients' }))
})

router.post('/', (req, res) => {
    const { email } = req.body

    const { error, value } = schema.validate({ email })
    if (error) return res.status(400).json({ success: false, error: error.message })

    // Create user
    Client.create({
        email,
        balance: 10000.0,
    })
        .then((client) => res.status(201).json({ success: true, data: client }))
        .catch((err) => res.status(400).json({ success: false, error: 'Error creating client' }))
})

module.exports = router
