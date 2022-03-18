const express = require('express')
const router = express.Router()
const Share = require('../models/Share.js')
const Joi = require('joi')

const priceSchema = Joi.number().positive().required()

const schema = Joi.object({
    symbol: Joi.string().length(3).pattern(new RegExp('[A-Z][A-Z][A-Z]')).required(),
    price: priceSchema,
})

router.get('/all', (req, res) => {
    Share.findAll()
        .then((shares) =>
            res.json({
                success: true,
                data: shares,
            })
        )
        .catch((err) =>
            res.json({
                success: false,
                error: 'Error fetching shares',
            })
        )
})

router.post('/', (req, res) => {
    const { symbol, price } = req.body

    const { error, value } = schema.validate({ symbol, price })
    if (error) return res.status(400).json({ success: false, error: error.message })

    // Create user
    Share.create({
        symbol,
        price,
    })
        .then((share) => res.status(201).json({ success: true, data: share }))
        .catch((err) => res.status(400).json({ success: false, error: 'Error adding share' }))
})

router.put('/:id', async (req, res) => {
    const { price } = req.body

    const { error, value } = priceSchema.validate(price)
    if (error) return res.status(400).json({ success: false, error: 'Please provide a valid price value' })

    Share.findByPk(req.params.id)
        .then((share) => {
            share.price = price
            share
                .save()
                .then((newShare) => res.json({ success: true, data: newShare }))
                .catch((err) => res.status(400).json({ success: false, error: 'Error updating share' }))
        })
        .catch((err) => res.status(404).json({ success: false, error: 'Share not found with the given id' }))
})

module.exports = router
