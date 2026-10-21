const express =  require('express')
const authController = require('../controller/foodPartner.controller')

const router = express.Router()

// Get method  /api/food-partner/:id
router.get('/:id', authController.getFoodPartnerById)


module.exports = router