const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)  
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)  
  const savedBlog = await blog.save()
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