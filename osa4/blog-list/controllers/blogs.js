const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username :1, name: 1 })
  response.json(blogs)  
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const loggedInUser = request.user
  if(!loggedInUser) {
    return response.status(401).json({ error: 'User not logged in' })
  }

  const blog = new Blog({ ...body, user: loggedInUser.id }) //Blog gets the user's ID
  const savedBlog = await blog.save()
  loggedInUser.blogs = loggedInUser.blogs.concat(savedBlog.id) //And user also gets the blog's ID
  await loggedInUser.save()
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
  const loggedInUser = request.user
  let blog = await Blog.findById(request.params.id)
  if(!blog) {
    return response.status(404).json({ error: "blog not found "})
  }

  if(loggedInUser.id === blog.user.toString()) {
    blog = await Blog.findByIdAndDelete(request.params.id)
  } else {
    return response.status(401).json({ error: "this user can't delete this blog "})
  }

  if(blog) {
    response.status(204).end()
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