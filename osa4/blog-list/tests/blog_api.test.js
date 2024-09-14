const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => {
    return blog.save()
  })
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are six blogs', async () => {
  const response = await api.get('/api/blogs')
  
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('Blogs has a title HTML is easy', async () => {
  const response = await api.get('/api/blogs')
  
  const titles = response.body.map(e => e.title)
  assert(titles.includes('Go To Statement Considered Harmful'))
})

test('a valid blog can be added ', async () => {
  const newBlog = 
  {
    _id: "5a422a851b54a676234d1799",
    title: "async/await simplifies making async calls",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 9,
  }  

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const blogsAtEnd = await helper.blogsInDb()
  const titles = blogsAtEnd.map(r => r.title)
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  assert(titles.includes("async/await simplifies making async calls"))

})

test('blog without title is not added', async () => {
  const newBlog = {
    likes: 19,
    url: "https://reactpatterns.com/",
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('documents have proper id field ', async () => {
  const newBlog = {
    title: "This is new blog",
    likes: 66,
    url: "https://reactpatterns.com/",
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.ok(response.body.id) 
})

test('objects without likes gets likes: 0', async () => {
  const newBlog = {
    title: "This is new blog",
    url: "https://reactpatterns.com/",
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test.only('objects without URL field wont be added', async () => {
  const newBlog = {
    title: "This is new blog",
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})