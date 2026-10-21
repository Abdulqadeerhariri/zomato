const foodPartnerModel = require('../models/foodPartner.model')
const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')

async function authFoodPartnerMiddleware(req, res, next) {
    const token = req.cookies.token;
    if(!token) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const foodPartner = await foodPartnerModel.findById(decoded._id || decoded.id)

        if(!foodPartner) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        req.foodPartner = foodPartner
        next()
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
}

async function authUserMiddleware(req, res, next) {
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({
            message: "please login first"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded._id || decoded.id)

        if(!user) {
            return res.status(401).json({
                message: "Please sign in with a user account"
            })
        }

        req.user = user
        next()

    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        })
    }

}

module.exports = {
    authFoodPartnerMiddleware,
    authUserMiddleware
}