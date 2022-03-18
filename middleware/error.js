const errorHandler = (err, req, res, next) => {
    res.status(500).json({
        success: false,
        error: 'Something went wrong',
    })
}

module.exports = errorHandler
