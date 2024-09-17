const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')
const api = supertest(app)
const bcrypt = require('bcrypt')

describe('when there is initially one user in db', () => {

  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'Bond', passwordHash })
    await user.save()
  })
  
  test('there really is one user in db', async () => {
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, 1)
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = { 
      username: "007",
      name: "James Bond",
      password: "MI5"
    }
    
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    const usernames = usersAtEnd.map(user => user.username)
    assert(usernames.includes(newUser.username))    
  })

  test('creation with an existing username doesnt work', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = { 
      username: "uniqueName",
      name: "Kalle Kalastaja",
      password: "salasana"
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const userWithSameUsername = {
      username: "uniqueName",
      name: "Juusto Juustonen",
      password: "salasana"
    }

    const response = await api
      .post('/api/users')
      .send(userWithSameUsername)
      .expect(400) //conflict
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(response.body.error.includes('expected `username` to be unique'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
  })

  after(async () => {
    await mongoose.connection.close()
  })
})