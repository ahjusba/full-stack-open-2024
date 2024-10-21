import { useState, useEffect } from 'react'
import Blog from './components/Blog'
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

    } catch (exception) {
      console.log("Couldn't fetch bloglist")
      setErrorMessage("Couldn't fetch bloglist")
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
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
      setTimeout(() => {
        setMessage(null)
      }, 2000)
      updateBlogList()
    } catch (exception) {
      console.log("failed to post blog")
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
        <Blogs blogs={blogs} user={user} handleLogout={handleLogout}/>        
        <NewBlog postNewBlog={postNewBlog}/> 
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

const Blogs = ({ blogs, user, handleLogout }) => {
  return(
    <div>
      <h2>Logged in as {user.name}</h2>
      <button onClick={handleLogout}>logout</button>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
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