import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewBlog from './NewBlog'

test('<NewBlog /> updates parent state and calls postNewBlog', async () => {

  const postNewBlog = vi.fn()

  render(<NewBlog postNewBlog={postNewBlog}/>)

  const titleInput = screen.getByPlaceholderText('Title')
  const authorInput = screen.getByPlaceholderText('Author')
  const urlInput = screen.getByPlaceholderText('URL')
  const postButton = screen.getByText("Create")
  expect(postButton).toBeDefined()

  await userEvent.type(titleInput, "This is the title")
  await userEvent.type(authorInput, "James Bond")
  await userEvent.type(urlInput, "https://topsecret.com")

  await userEvent.click(postButton)
  expect(postNewBlog.mock.calls).toHaveLength(1)
  console.log(postNewBlog.mock.calls[0])
  expect(postNewBlog.mock.calls[0]).toStrictEqual(["This is the title", "James Bond", "https://topsecret.com"])
})
