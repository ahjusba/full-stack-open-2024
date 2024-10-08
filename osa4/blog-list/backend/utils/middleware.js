const User = require('../models/user')
const jwt = require('jsonwebtoken')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  if(error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  if(error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).send({ error: 'expected `username` to be unique' })
  }

  if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  }

  if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if(authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  }
  next()
}

const userExtractor = async (request, response, next) => {

  if(!request.token) {
    next()
    return
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  const loggedInUser = await User.findById(decodedToken.id);
  request.user = loggedInUser
  next()
}

module.exports = {
  errorHandler, unknownEndpoint, tokenExtractor, userExtractor
}