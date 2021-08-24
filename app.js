require('dotenv').config()
const express = require('express')
const routes = require('./Routes/routes')
const connectDB = require('./connection')

const app = express()
connectDB()

const PORT = process.env.PORT || 4000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', routes)

app.listen(PORT, () => {
    console.log(`Server is working on ${PORT}`)
})