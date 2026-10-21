const express = require('express')
const authRouter = require('./routes/auth.routes')
const cookieParser = require('cookie-parser')
const foodRouter = require('./routes/food.routes')
const foodPartnerRouter = require('./routes/foodPartner.routes')
const cors = require('cors')

const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())


app.use('/api/auth', authRouter)
app.use('/api/food', foodRouter)
app.use('/api/food-partner', foodPartnerRouter)


module.exports = app