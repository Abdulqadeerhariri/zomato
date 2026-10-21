const userModel = require('../models/user.model')
const foodPartnerModel = require('../models/foodPartner.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


async function registerUser(req, res) {
    const { fullName, email, password } = req.body || {};

    if (!fullName || !email || !password) {
        return res.status(401).json({
            message: "fullName, email and password is required"
        })
    }

    const isUserExist = await userModel.findOne({
        email
    })

    if (isUserExist) {
        return res.status(400).json({
            message: "Account already exist with this email"
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        fullName,
        email,
        password: hash
    })

    const token = jwt.sign({
        _id: user._id
    }, process.env.JWT_SECRET)

    res.cookie('token', token)

    res.status(201).json({
        message: "User created successfully",
        user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
        },
        token
    })
}

async function loginUser(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        })
    }

    const user = await userModel.findOne({ email })
    if (!user) {
        return res.status(400).json({
            message: "sorry email not found, try a valid email"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid password, try a valid password"
        })
    }

    const token = jwt.sign({
        _id: user.id
    }, process.env.JWT_SECRET)

    res.cookie('token', token)

    res.status(201).json({
        message: "User logged in successfully",
        user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
        },
        token
    })
}

async function logoutUser(req, res) {

    res.clearCookie('token')
    res.status(200).json({
        message: "user logged out successfully"
    })
} 

async function registerFoodPartner(req, res) {
    const { resturantName, email, password, phone, contactName, address } = req.body

    const isUserExist = await foodPartnerModel.findOne({ email })
    if(isUserExist) {
        return res.status(400).json({
            message: "user already exist with this email"
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const foodPartner = await foodPartnerModel.create({
        resturantName,
        email,
        password: hash,
        phone,
        contactName,
        address
    })

    const token = jwt.sign({
        _id: foodPartner._id
    }, process.env.JWT_SECRET)

    res.cookie('token', token)
    res.status(201).json({
        message: "Food Partner created successfully",
        foodPartner: {
            _id: foodPartner._id,
            resturantName: foodPartner.resturantName,
            email: foodPartner.email,
            phone: foodPartner.phone,
            contactName: foodPartner.contactName,
            address: foodPartner.address
        },
        token
    })

}

async function loginFoodPartner(req, res) {
    const { email, password } = req.body

    if(!email || !password) {
        return res.status(401).json({
            message: "email and password are required"
        })
    }

    const foodPartner = await foodPartnerModel.findOne({ email })
    if(!foodPartner) {
        return res.status(400).json({
            message: "Sorry invalid email address, try a valid email"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, foodPartner.password)
    if(!isPasswordValid) {
        return res.status(400).json({
            message: "invalid password, please try a valid password"
        })
    }

    const token = jwt.sign({
        _id: foodPartner._id
    }, process.env.JWT_SECRET)

    res.cookie('token', token)
    res.status(200).json({
        message: "Food Partner logged in successfully",
        foodPartner: {
            _id: foodPartner._id,
            resturantName: foodPartner.resturantName,
            name: foodPartner.name,
            email: foodPartner.email
        },
        token
    })
}

async function logoutFoodPartner(req, res) {

    res.clearCookie('token')
    res.status(200).json({
        message: "Food Partner logged out successfully"
    })
} 

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
}