const foodPartnerModel = require('../models/foodPartner.model')
const foodModel = require('../models/food.model')
const mongoose = require('mongoose')


async function getFoodPartnerById(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            message: "Invalid food partner id"
        })
    }

    try {
        const foodPartner = await foodPartnerModel
            .findById(req.params.id)
            .select('resturantName address')
            .lean()

        if (!foodPartner) {
            return res.status(404).json({
                message: "Food partner not found"
            })
        }

        const food = await foodModel
            .find({ foodPartner: foodPartner._id })
            .select('name video description')
            .lean()

        return res.status(200).json({
            foodPartner,
            food
        })
    } catch (error) {
        console.error('Could not load food partner profile:', error)
        return res.status(500).json({
            message: "Could not load food partner profile"
        })
    }
}


module.exports = {
    getFoodPartnerById
}