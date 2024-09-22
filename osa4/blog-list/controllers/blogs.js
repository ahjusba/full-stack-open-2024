const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if(authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username :1, name: 1 })
  response.json(blogs)  
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if(!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid '})
  }
  const user = await User.findById(decodedToken.id)
  
  if (!user) {
    return response.status(400).json({ error: `user matching id ${body.userId} can't be found` })
  }

  const blog = new Blog({ ...body, user: user.id }) //Blog gets the user's ID
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog.id) //And user also gets the blog's ID
  await user.save()
  response.status(201).json(savedBlog)      
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findByIdAndDelete(request.params.id)
  if(blog) {
    response.status(204).end()
  } else {
    response.status(404).json({ error: "blog not found "})
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { ...request.body },
    { new: true, runValidators: true }
  )

  if(updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(400).json({ error: 'blog not found' })
  }
})

module.exports = blogsRouter