const express = require('express')
const Controller = require('../Controller/index')
const auth = require('../auth')

const router = express.Router()

router.post('/register', Controller.Owner.register)
router.post('/login', Controller.Owner.login)
router.post('/addProduct', auth, Controller.Owner.addProduct)
router.get('/viewOrders', auth, Controller.Owner.viewOrders)

module.exports = router