import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const post = async newObject => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const putLike = async updatedObject => {
  updatedObject.user = updatedObject.user.id
  updatedObject.likes = updatedObject.likes + 1
  const url = `${baseUrl}/${updatedObject.id}`
  console.log("PUTting to URL: ", url)
  const response = await axios.put(url, updatedObject)
  return response.data
}

export default { getAll, setToken, post, putLike }