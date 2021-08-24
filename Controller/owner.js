const Model = require('../Model/index')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
    async register(req, res) {
        try {
            let { firstName, lastName, email, password } = req.body
            if (!firstName || !lastName || !email || !password) return res.status(404).json({ success: false, errorMessage: 'All fields required' })
            const isExist = await Model.Owner.findOne({ email })
            if (isExist) return res.status(400).json({ success: false, errorMessage: 'Owner already exist with this email' })
            bcrypt.hash(password, 10, async (err, hash) => {
                password = hash
                const owner = new Model.Owner({ firstName, lastName, email, password })
                const saveOwner = await owner.save()
                res.status(200).json({ success: true, message: 'Owner register successfully', data: saveOwner })
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
            const isExist = await Model.Owner.findOne({ email })
            if (!isExist) return res.status(404).json({ success: false, errorMessage: 'Email not exist' })
            bcrypt.compare(password, isExist.password, function (err, result) {
                const token = jwt.sign({ _id: isExist._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
                result ? res.status(200).json({ success: true, message: 'login successfully', data: isExist, token }) : res.status(400).json({ success: true, success: false, errorMessage: 'Incorrect Password' })
            })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ success: false, errorMessage: 'Something went wrong' })
        }
    },
    async addProduct(req, res) {
        try {
            const { productName, quantity, productPrice } = req.body
            if (!productName || !quantity || !productPrice) return res.status(400).json({ success: false, errorMessage: 'All fields required' })
            const product = new Model.Product({ productName, seller: req.owner._id, quantity, productPrice })
            saveProduct = await product.save()
            res.status(200).json({ message: 'Product add successfully', data: saveProduct })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ success: false, errorMessage: 'Something went wrong' })
        }
    },
    async viewOrders(req, res) {
        try {
            const orders = await Model.Order.find({ seller: req.owner._id }).sort('-createdAt')
            if (!orders || orders.length == 0) return res.status(200).json({ success: false, message: 'No Orders found' })
            res.status(200).json({ success: true, message: 'All Orders', orders })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ success: false, errorMessage: 'Something went wrong' })
        }
    }
}