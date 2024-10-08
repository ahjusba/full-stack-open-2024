const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const mongoose = require('mongoose')
const configs = require('./utils/configs')
const { errorHandler, unknownEndpoint, tokenExtractor, userExtractor } = require('./utils/middleware')

mongoose.set('strictQuery', false)
const mongoUrl = configs.MONGODB_URI
console.log("MongoURL: ", mongoUrl)
mongoose.connect(configs.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())
app.use(tokenExtractor)
app.use(userExtractor)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(errorHandler)
app.use(unknownEndpoint)

module.exports = app