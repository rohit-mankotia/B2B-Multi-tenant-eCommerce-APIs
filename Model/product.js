const mongoose = require('mongoose')
const ProductSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    productImage: {
        type: String,
        default: ''  //required true
    },
    productPrice: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Product', ProductSchema)