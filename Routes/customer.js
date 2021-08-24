const express = require('express')
const Controller = require('../Controller/index')
const auth = require('../auth')

const router = express.Router()

router.post('/register', Controller.Customer.register)
router.post('/login', Controller.Customer.login)
router.get('/browseProducts', auth, Controller.Customer.browseProducts)
router.post('/orderProducts', auth, Controller.Customer.orderProducts)
router.get('/viewOrders', auth, Controller.Customer.viewOrders)

module.exports = router