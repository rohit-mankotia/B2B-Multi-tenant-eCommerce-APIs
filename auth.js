const Model = require('./Model/index')
const jwt = require('jsonwebtoken')









module.exports = (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) return res.status(403).json({ success: false, errorMessage: 'You must login first' })
    const token = authorization.replace('Bearer ', '')
    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
        if (err) return res.status(403).json({ success: false, errorMessage: 'You must login first' })
        const { _id } = payload
        try {
            const owner = await Model.Owner.findById(_id).select('-password')
            if (owner) {
                req.owner = owner
            }
            else {
                const customer = await Model.Customer.findById(_id).select('-password')
                if (!customer) return res.status(500).json({ success: false, errorMessage: 'Something went wrong' })
                req.customer = customer
            }
        }
        catch (err) {
            console.log(err)
        }
        next()
    })
}

