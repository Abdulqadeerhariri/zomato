const express = require('express')
const authController = require('../controller/auth.controller')

const authRouter = express.Router()


// user auth APIs
authRouter.post('/register', authController.registerUser)
authRouter.post('/login', authController.loginUser)
authRouter.get('/logout', authController.logoutUser)


// food partner auth APIs
authRouter.post('/food-partner/register', authController.registerFoodPartner)
authRouter.post('/food-partner/login', authController.loginFoodPartner)
authRouter.get('/food-partner/logout', authController.logoutFoodPartner)    

module.exports = authRouter