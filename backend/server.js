const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const userRoute = require('./routes/user.route')
const chatRoute = require('./routes/chat.route')
const messageRoute = require('./routes/message.route')

const app = express()
require('dotenv').config()

app.use(express.json())
app.use(cors())
app.use("/api/users", userRoute)
app.use('/api/chats', chatRoute)
app.use('/api/messages', messageRoute)

const port = process.env.PORT || 5000
const uri = process.env.MONGO_URI || ''

app.listen(port, (req, res) => {
    console.log(`Server on port ${port} `)
})


mongoose.connect(uri).then(() => {
    console.log('Database connected with Mongo')
}).catch(err => {
    console.log('Error in connect to Mongo', err)
})