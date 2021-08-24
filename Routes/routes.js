const express = require('express')
const Routes = require('./index')

const router = express.Router()

router.use('/owner', Routes.Owner)
router.use('/customer', Routes.Customer)

module.exports = router