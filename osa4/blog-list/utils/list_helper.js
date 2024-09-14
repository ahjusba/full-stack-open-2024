const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {  
  const totalLikes = blogs.reduce((sum, blog) => sum + blog.likes, 0)
  return totalLikes
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((favorite, current) => 
    current.likes > favorite.likes ? current : favorite
  )
}

const mostBlogs = (blogs) => {
  if(blogs.length === 0) {
    return null
  }

  const blogsByAuthor = _.groupBy(blogs, 'author')
  const authorBlogCounts = _.map(blogsByAuthor, (blogs, author) => ({
    author: author,
    blogs: blogs.length
  }))

  return _.maxBy(authorBlogCounts, 'blogs')
}

const mostLikes = (blogs) => {
  if(blogs.length === 0) {
    return null
  }
  const blogsByAuthor = _.groupBy(blogs, 'author')
  const authorLikeCounts = _.map(blogsByAuthor, (blogs, author) => ({
    author: author, 
    likes: _.reduce(blogs, (sum, current) => sum + current.likes, 0)
  }))

  return _.maxBy(authorLikeCounts, 'likes')
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}