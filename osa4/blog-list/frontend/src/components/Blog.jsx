import { useState } from "react"

const Blog = ({ blog, likeBlog }) => {

  const [detailsVisible, setDetailsVisible] = useState(false)

  let buttonText = detailsVisible ? "hide" : "show"
  return(
    <div>      
      {blog.title} {" "}     
      <button onClick={() => setDetailsVisible(!detailsVisible)}>{buttonText}</button>
      {detailsVisible &&
      <ul>
        <li>Author: {blog.author}</li>
        <li>Likes: {blog.likes} <button onClick={() => likeBlog(blog)}>like</button></li>
        <li>Url: {blog.url}</li>
        <li>Poster: {blog.user.name}</li>
      </ul>
      }
      
    </div>  
  )
}

export default Blog