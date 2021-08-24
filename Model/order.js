const mongoose = require('mongoose')
const OrderSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner',
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Order', OrderSchema)