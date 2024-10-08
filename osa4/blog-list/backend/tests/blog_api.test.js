const { test, after, beforeEach, describe, before } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const api = supertest(app)

describe('When there is initially some blogs saved', () => {
  let user = null
  let token = null
  before(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const userToBeSaved = new User({ name: 'James Bond', username: 'Double-o-seven', passwordHash })
    await userToBeSaved.save()
    user = await helper.getAnyUserModel()
    token = await helper.loginUser({ username: 'Double-o-seven', password: 'sekret' })
  })
  
  beforeEach(async () => {   
    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs
      .map(blog => new Blog({ ...blog, user: user.id }))
    const promiseArray = blogObjects.map(blog => {
      return blog.save()
    })

    let blogsArray = []
    blogObjects.map(blog => {
      blogsArray = blogsArray.concat(blog.id)
    })

    await Promise.all(promiseArray)
    user.blogs = blogsArray
    await user.save()
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
  
  test('blogs has a title HTML is easy', async () => {
    const response = await api.get('/api/blogs')
    
    const titles = response.body.map(e => e.title)
    assert(titles.includes('Go To Statement Considered Harmful'))
  })

  test('blog cant be added without auth token', async () => {
    const newBlog = 
    {
      _id: "5a422a851b54a676234d1799",
      title: "async/await simplifies making async calls",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 9,
      userId: user.id,
    }  
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test('blog cant be added with a faulty auth token', async () => {
    const newBlog = 
    {
      _id: "5a422a851b54a676234d1799",
      title: "async/await simplifies making async calls",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 9,
      userId: user.id,
    }  
  
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token+"asd"}`)
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  // test('a blog with a falty userId wont be added', async () => {
  //   const faultyId = user.id + "a"
  //   const newBlog = 
  //   {
  //     _id: "5a422a851b54a676234d1799",
  //     title: "async/await simplifies making async calls",
  //     author: "Michael Chan",
  //     url: "https://reactpatterns.com/",
  //     likes: 9,
  //     userId: faultyId
  //   }  
  
  //   await api
  //     .post('/api/blogs')
  //     .set('Authorization', `Bearer ${token}`)
  //     .send(newBlog)
  //     .expect(400)
    
  //   const blogsAtEnd = await helper.blogsInDb()
  //   const titles = blogsAtEnd.map(r => r.title)
  //   assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  //   assert(!titles.includes("async/await simplifies making async calls"))
  
  // })

  // test('a blog without userID cant be added', async () => {
  //    const faultyId = user.id + "a"
  //   const newBlog = 
  //   {
  //     _id: "5a422a851b54a676234d1799",
  //     title: "async/await simplifies making async calls",
  //     author: "Michael Chan",
  //     url: "https://reactpatterns.com/",
  //     likes: 9,
  //   }  
  
  //   await api
  //     .post('/api/blogs')
  //     .set('Authorization', `Bearer ${token}`)
  //     .send(newBlog)
  //     .expect(400)
    
  //   const blogsAtEnd = await helper.blogsInDb()
  //   const titles = blogsAtEnd.map(r => r.title)
  //   assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  //   assert(!titles.includes("async/await simplifies making async calls"))
  
  // })
  
  test('a valid blog can be added ', async () => {
    const newBlog = 
    {
      _id: "5a422a851b54a676234d1799",
      title: "async/await simplifies making async calls",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 9,
      userId: user.id,
    }  
  
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
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
      userId: user.id
    }
  
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
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
      userId: user.id
    }
  
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    assert.ok(response.body.id) 
  })

  test('objects without likes gets likes: 0', async () => {
    const newBlog = {
      title: "This is new blog",
      url: "https://reactpatterns.com/",
      userId: user.id
    }
  
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    assert.strictEqual(response.body.likes, 0)
  })
  
  test('objects without URL field wont be added', async () => {
    const newBlog = {
      title: "This is new blog",
      userId: user.id
    }
  
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  describe('and viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const blogToView = { ...helper.initialBlogs[0], id: helper.initialBlogs[0]._id }
      delete blogToView._id
      delete blogToView.__v
      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)   
        .expect('Content-Type', /application\/json/)
      delete resultBlog.body.user
      assert.deepStrictEqual(resultBlog.body, blogToView)
    })

    test('fails with 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()
      await api
        .get(`/api/blogs/${validNonexistingId}`)
        .expect(404)        
    })  

    test('fails with 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081x82a3445'
      await api
        .get(`/api/blogs/${invalidId}`)
        .expect(400)     
    })  
  })

  describe('and deleting a specific blog', () => {
    test('which exists works and returns 204', async () => {
      const blogToDelete = helper.initialBlogs[0]
      const deleteId = blogToDelete._id
      await api
        .delete(`/api/blogs/${deleteId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
      
      const blogsAtEnd = await helper.blogsInDb()
      
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
      const titles = blogsAtEnd.map(b => b.title)
      assert(!titles.includes(blogToDelete.title))
    })

    test('which doesnt exist returns 400', async () => {
      const invalidId = '5a3d5da59070081x82a3445'
      await api
        .delete(`/api/blogs/${invalidId}`)
        .expect(400)
      
      const blogsAtEnd = await helper.blogsInDb()
      
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('updating a specific blog', () => {
    test('which exists works and returns 201', async () => {
      const blogToUpdate = helper.initialBlogs[0]
      const updateId = blogToUpdate._id
      const updatedLikes = 600
      const updatedBlog = { ...blogToUpdate, "likes": updatedLikes }    

      const response = await api
        .put(`/api/blogs/${updateId}`)
        .send(updatedBlog)
        .expect(200)
      
      assert.strictEqual(response.body.likes, updatedLikes)
    })

    test('which doesnt exist returns 400', async () => {
      const blogToUpdate = helper.initialBlogs[0]
      const invalidId = '5a3d5da59070081x82a3445'
      const updatedLikes = 600
      const updatedBlog = { ...blogToUpdate, "likes": updatedLikes }

      const response = await api
        .put(`/api/blogs/${invalidId}`)
        .send(updatedBlog)
        .expect(400)
    })
  })
})

after(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})
  await mongoose.connection.close()
})