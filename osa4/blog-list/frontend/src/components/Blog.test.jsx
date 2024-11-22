import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'John Doe',
    likes: 1,
    url: 'http://example.com',
    user: { name: 'James Bond' }
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} likeBlog={mockHandler}/>)
  
  const title = screen.getByText('Component testing is done with react-testing-library')
  expect(title).toBeDefined()

  const url = screen.queryByText('http://example.com')
  expect(url).toBeNull()

  const likes = screen.queryByText('1')
  expect(likes).toBeNull()  
})

test('renders sub-content after clicking SHOW', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'John Doe',
    likes: 1,
    url: 'http://example.com',
    user: { name: 'James Bond' }
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} likeBlog={mockHandler}/>)

  const user = userEvent.setup()
  const showButton = screen.getByText("show")
  await user.click(showButton)

  let url = screen.queryByText('http://example.com')
  expect(url).toBeDefined()

  let likes = screen.queryByText('1')
  expect(likes).toBeDefined()
})

test('clicking LIKE works', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'John Doe',
    likes: 1,
    url: 'http://example.com',
    user: { name: 'James Bond' }
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} likeBlog={mockHandler}/>)  

  const user = userEvent.setup()
  const showButton = screen.getByText("show")
  await user.click(showButton)
  
  const likeButton = screen.getByText("like")
  await user.click(likeButton)
  await user.click(likeButton)
  expect(mockHandler.mock.calls).toHaveLength(2)
})
