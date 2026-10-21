const express = require('express')
const foodController = require('../controller/food.controller')
const authMiddleware = require('../middleware/auth.middleware')
const multer = require('multer')

const upload = multer({
    storage: multer.memoryStorage()
})
const foodRouter = express.Router()



foodRouter.post('/', 
    authMiddleware.authFoodPartnerMiddleware, 
    upload.single("video"),
    foodController.createFood
)


foodRouter.get('/',
    authMiddleware.authUserMiddleware,
    foodController.getFoodItem
)

foodRouter.get('/saved',
    authMiddleware.authUserMiddleware,
    foodController.getSavedFood
)


foodRouter.post('/like', 
    authMiddleware.authUserMiddleware, 
    foodController.likeFood
)

foodRouter.post('/save', 
    authMiddleware.authUserMiddleware, 
    foodController.saveFood
)

module.exports = foodRouter