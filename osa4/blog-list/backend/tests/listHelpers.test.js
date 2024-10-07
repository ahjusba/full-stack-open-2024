// const { test, describe } = require('node:test')
// const assert = require('node:assert')
// const listHelper = require('../utils/list_helper')

// const listWithZeroBlogs = []


// const listWithOneBlog = [
//   {
//     _id: '1',
//     title: 'Seven',
//     author: 'Kauno',
//     url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
//     likes: 7,
//     __v: 0
//   }
// ]

// const listWithThreeBlogs = [
//   {
//     _id: '1',
//     title: 'Looks like 5',
//     author: 'Alisa',
//     url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
//     likes: 5,
//     __v: 0
//   },
//   {
//     _id: '2',
//     title: 'Eili',
//     author: 'Edsger W. Dijkstra',
//     url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
//     likes: 500,
//     __v: 0
//   },
//   {
//     _id: '3',
//     title: '50 secrets',
//     author: 'Aatu',
//     url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
//     likes: 50,
//     __v: 0
//   }
// ]

// const listWithSixBlogs = [
//   {
//     _id: "5a422a851b54a676234d17f7",
//     title: "React patterns",
//     author: "Michael Chan",
//     url: "https://reactpatterns.com/",
//     likes: 7,
//     __v: 0
//   },
//   {
//     _id: "5a422aa71b54a676234d17f8",
//     title: "Go To Statement Considered Harmful",
//     author: "Edsger W. Dijkstra",
//     url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
//     likes: 5,
//     __v: 0
//   },
//   {
//     _id: "5a422b3a1b54a676234d17f9",
//     title: "Canonical string reduction",
//     author: "Edsger W. Dijkstra",
//     url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
//     likes: 12,
//     __v: 0
//   },
//   {
//     _id: "5a422b891b54a676234d17fa",
//     title: "First class tests",
//     author: "Robert C. Martin",
//     url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
//     likes: 10,
//     __v: 0
//   },
//   {
//     _id: "5a422ba71b54a676234d17fb",
//     title: "TDD harms architecture",
//     author: "Robert C. Martin",
//     url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
//     likes: 0,
//     __v: 0
//   },
//   {
//     _id: "5a422bc61b54a676234d17fc",
//     title: "Type wars",
//     author: "Robert C. Martin",
//     url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
//     likes: 2,
//     __v: 0
//   }  
// ]


// test('dummy returns one', () => {
//   const blogs = []

//   const result = listHelper.dummy(blogs)
//   assert.strictEqual(result, 1)
// })

// describe('total likes', () => {
  
//   test('when list has only one blog, equals the likes of that', () => {
//     const result = listHelper.totalLikes(listWithOneBlog)
//     assert.strictEqual(result, 7)
//   })
  
//   test('of empty list is zero', () => {
//     const result = listHelper.totalLikes(listWithZeroBlogs)
//     assert.strictEqual(result, 0)
//   })

//   test('of a bigger list is calculated right', () => {
//     const result = listHelper.totalLikes(listWithThreeBlogs)
//     assert.strictEqual(result, 555)
//   })
// })

// describe('favorite blog', () => {
//   test('is the one with most likes', () => {
//     const result = listHelper.favoriteBlog(listWithThreeBlogs)
//     const expectedValue = 
//     {
//       _id: '2',
//       title: 'Eili',
//       author: 'Edsger W. Dijkstra',
//       url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
//       likes: 500,
//       __v: 0
//     }
//     assert.deepStrictEqual(result, expectedValue)
//   })
// })

// describe('most blogs', () => {
//   test('is the one with most blogs', () => {
//     const result = listHelper.mostBlogs(listWithSixBlogs)
//     const expectedValue = {
//       author: "Robert C. Martin",
//       blogs: 3
//     }

//     assert.deepStrictEqual(result, expectedValue)  
//   })  
// })

// describe('mostLikedAuthor', () => {
//   test('is the one with most likes among all blogs', () => {
//     const result = listHelper.mostLikes(listWithSixBlogs)
//     const expectedValue = {
//       author: "Edsger W. Dijkstra",
//       likes: 17
//     }
//     assert.deepStrictEqual(result, expectedValue)
//   })
// })