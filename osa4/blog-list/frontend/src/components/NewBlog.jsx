import { useState } from 'react'

const NewBlog = ({ postNewBlog }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreateBlog = () => {
    postNewBlog(title, author, url)
    // setTitle('') // Clear the input fields after submission
    // setAuthor('')
    // setUrl('')
  }

  return (
    <div>
      <h1>Create New Blog</h1>
      <div>
        <input
          type="text"
          value={title}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          data-testid='title'
        />
      </div>
      <div>
        <input
          type="text"
          value={author}
          placeholder="Author"
          onChange={(e) => setAuthor(e.target.value)}
          data-testid='author'
        />
      </div>
      <div>
        <input
          type="text"
          value={url}
          placeholder="URL"
          onChange={(e) => setUrl(e.target.value)}
          data-testid='url'
        />
      </div>
      <button onClick={handleCreateBlog}>Create</button>
    </div>
  )
}

export default NewBlog