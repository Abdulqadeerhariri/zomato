const foodModel = require('../models/food.model')
const likeModel = require('../models/like.model')
const saveModel = require('../models/save.model')
const storageService = require('../services/storage.service')
const { v4: uuid } = require('uuid')


async function createFood(req, res) {
    console.log(req.foodPartner)
    console.log(req.body)
    console.log(req.file)

    const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid())
    const foodItem = await foodModel.create({
        name: req.body.name,
        description: req.body.description,
        video: fileUploadResult.url,
        foodPartner: req.foodPartner._id
    })

    res.status(201).json({
        message: "food created successfully",
        food: foodItem
    })

}

async function getFoodItem(req, res) {
    const foodItems = await foodModel.find({})

    const [likes, saves] = await Promise.all([
        likeModel.find({ user: req.user._id }).select('food'),
        saveModel.find({ user: req.user._id }).select('food')
    ])
    const likedFoodIds = new Set(likes.map((like) => like.food.toString()))
    const savedFoodIds = new Set(saves.map((save) => save.food.toString()))

    res.status(200).json({
        message: "food item fetched successfully",
        food: foodItems.map((food) => ({
            ...food.toObject(),
            isLiked: likedFoodIds.has(food._id.toString()),
            isSaved: savedFoodIds.has(food._id.toString())
        }))
    })
}

async function getSavedFood(req, res) {
    const saves = await saveModel.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .populate('food')

    res.status(200).json({
        message: "saved food fetched successfully",
        food: saves.map((save) => save.food).filter(Boolean)
    })
}


async function likeFood(req, res) {
    const { foodId } = req.body
    const user = req.user

    const isUserAlreadyLiked = await likeModel.findOne({
        user: user._id,
        food: foodId
    })
    if(isUserAlreadyLiked) {
        await likeModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findOneAndUpdate(
            { _id: foodId },
            {
                $inc: { likeCount: -1 }
            }
        )

        return res.status(200).json({
            message: "Food unliked successfully"
        })
    }

    const like = await likeModel.create({
        user: user._id,
        food: foodId
    })

    await foodModel.findOneAndUpdate(
        { _id: foodId },
        {
            $inc: { likeCount: 1 }
        }
    )

    res.status(200).json({
        message: "Food liked successfully",
        like
    })
}


async function saveFood(req, res) {
    const { foodId } = req.body
    const user = req.user

    const isUserAlreadySaved = await saveModel.findOne({
        user: user._id,
        food: foodId
    })
    if(isUserAlreadySaved) {
        await saveModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findOneAndUpdate(
            { _id: foodId },
            {
                $inc: { saveCount: -1 }
            }
        )

        return res.status(200).json({
            message: "Food unsaved successfully"
        })
    }

    const save = await saveModel.create({
        user: user._id,
        food: foodId
    })

    await foodModel.findOneAndUpdate(
        { _id: foodId },
        {
            $inc: { saveCount: 1 }
        }
    )

    res.status(200).json({
        message: "Food saved successfully",
        save
    })
}


module.exports = {
    createFood,
    getFoodItem,
    getSavedFood,
    likeFood,
    saveFood
}