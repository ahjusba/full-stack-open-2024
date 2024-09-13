const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const mongoose = require('mongoose')
const configs = require('./utils/configs')

mongoose.set('strictQuery', false)
const mongoUrl = configs.MONGODB_URI
mongoose.connect(configs.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())
app.use(blogsRouter)

module.exports = app