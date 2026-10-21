const mongoose = require('mongoose')

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("BD connected successfully")
    } catch (error) {
        console.log("DB connection", error)
    }
}

module.exports = connectDB