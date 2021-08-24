const Model = require('../Model/index')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
    async register(req, res) {
        try {
            let { firstName, lastName, email, password } = req.body
            if (!firstName || !lastName || !email || !password) return res.status(404).json({ success: false, errorMessage: 'All fields required' })
            const isExist = await Model.Customer.findOne({ email })
            if (isExist) return res.status(400).json({ success: false, errorMessage: 'Customer already exist with this email' })
            bcrypt.hash(password, 10, async (err, hash) => {
                password = hash
                const customer = new Model.Customer({ firstName, lastName, email, password })
                const saveCustomer = await customer.save()
                res.status(200).json({ success: true, message: 'Customer register successfully', data: saveCustomer })
            })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ success: false, errorMessage: 'Something went wrong' })
        }
    },
    async login(req, res) {
        try {
            const { email, password } = req.body
            if (!email || !password) return res.status(400).json({ success: false, errorMessage: 'All fields required' })
            const isExist = await Model.Customer.findOne({ email })
            if (!isExist) return res.status(401).json({ success: false, errorMessage: 'Email not exist' })
            bcrypt.compare(password, isExist.password, function (err, result) {
                const token = jwt.sign({ _id: isExist._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
                result ? res.status(200).json({ success: true, message: 'login successfully', data: isExist, token }) : res.status(401).json({ success: true, success: false, errorMessage: 'Incorrect Password' })
            })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ success: false, errorMessage: 'Something went wrong' })
        }
    },
    async browseProducts(req, res) {
        try {
            const allProducts = await Model.Product.find().sort('-createdAt')
            if (!allProducts || allProducts.length == 0) return res.status(200).json({ success: false, message: 'No Product found' })
            res.status(200).json({ success: true, message: 'All products', allProducts })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ success: false, errorMessage: 'Something went wrong' })
        }
    },
    async orderProducts(req, res) {
        try {
            const { productId, quantity } = req.body
            if (!productId) return res.status(400).json({ success: false, errorMessage: 'All fields required' })
            const isExist = await Model.Product.findById(productId)
            if (!isExist) return res.status(404).json({ success: false, errorMessage: 'No Product found with this Id' })
            if (isExist.quantity == 0) return res.status(200).json({ success: false, message: 'Sorry this product is out of stock' })
            if (quantity >= isExist.quantity) return res.status(200).json({ success: false, message: 'please choose less quantity' })
            const orderProduct = new Model.Order({ seller: isExist.seller, buyer: req.customer._id, price: quantity * isExist.productPrice, quantity })
            const saveOrder = await orderProduct.save()
            await Model.Product.findByIdAndUpdate(productId, { $set: { quantity: isExist.quantity - quantity } })
            res.status(200).json({ success: true, message: 'Order Placed successfully', order: saveOrder })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ success: false, errorMessage: 'Something went wrong' })
        }
    },
    async viewOrders(req, res) {
        try {
            const orders = await Model.Order.find({ buyer: req.customer._id }).sort('-createdAt')
            if (!orders || orders.length == 0) return res.status(200).json({ success: false, message: 'No Orders found' })
            res.status(200).json({ success: true, message: 'All Orders', orders })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ success: false, errorMessage: 'Something went wrong' })
        }
    }
}