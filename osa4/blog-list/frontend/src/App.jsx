import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Toggleable from './components/Toggleable'
import blogService from './services/blogs'
import loginService from './services/login'
import NewBlog from './components/NewBlog'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [message, setMessage] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    } 

    updateBlogList()
  }, [])

  const updateBlogList = async () => {
    try {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
      updateBlogList()
    } catch (exception) {
      console.log("Couldn't fetch bloglist")
      setErrorMessage("Couldn't fetch bloglist")
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const likeBlog = async (updatedBlog) => {
    console.log("Like blog")
    try {
      const blog = await blogService.putLike(updatedBlog)
      console.log("Updated blog: ", blog)
    } catch (exception) {
      console.log(exception)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      console.log("logged in")
      const user = await loginService.login({
        username, password,
      })
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
    } catch (exception) {
      console.log("failed to log in")
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    console.log("logout")
    window.localStorage.removeItem('loggedUser')
    setUser(null)
    setUsername('')
    setPassword('')
  }

  const postNewBlog = async (title, author, url) => {
    const newBlog = {
      title,
      author,
      url
    }
    console.log("Posting: ", newBlog)
    try {
      await blogService.post(newBlog)
      setMessage(`Added new blog: ${title}`)
      blogFormRef.current.toggleVisibility()
      setTimeout(() => {
        setMessage(null)
      }, 2000)
      updateBlogList()
    } catch (exception) {
      console.log("failed to post blog", exception)
      setErrorMessage('Failed to post blog')
      setTimeout(() => {
        setErrorMessage(null)        
      }, 2000)
    }
  }

  return (
    <div>
      { errorMessage ?? <ErrorMessage message={errorMessage} />}
      { message ?? <Message message={message} />}
      { user ? 
      <>
        <Blogs blogs={blogs} user={user} handleLogout={handleLogout} likeBlog={likeBlog}/>        
        <Toggleable buttonLabel={"add new note"} ref={blogFormRef}>
          <NewBlog postNewBlog={postNewBlog}/> 
        </Toggleable>
      </> :
        <LoginForm
          handleLogin={handleLogin}
          setUsername={setUsername}
          setPassword={setPassword}
          username={username}
          password={password}
        />
      }      
    </div>
  )
}

const ErrorMessage = ({ message }) => {
  return(
    <p>{message}</p>
  )
}

const Message = ({ message }) => {
  return(
    <p>{message}</p>
  )
}

const Blogs = ({ blogs, user, handleLogout, likeBlog }) => {
  return(
    <div>
      <h2>Logged in as {user.name}</h2>
      <button onClick={handleLogout}>logout</button>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} likeBlog={likeBlog}/>
      )}
    </div>
  )
}

const LoginForm = ({ handleLogin, setUsername, setPassword, username, password }) => {
  return(
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )
}

export default App