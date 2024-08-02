import axios from 'axios'

// const url = 'http://localhost:3001/api/persons'
// const url = 'https://puhelinluettelojussi2.fly.dev/api/persons'
const url = '/api/persons'

const getAll = () => {
  console.log("getting from " + url)
  const request = axios.get(url)
  return request.then(response => response.data)
}

const update = (id, person) => {
  return axios
    .put(`${url}/${id}`, person)
    .then(response => response.data)    
}

const add = (person) => {
  return axios
    .post(`${url}`, person)
    .then(response => response.data)
}

const remove = (id) => {
  return axios
    .delete(`${url}/${id}`)
}

export default {getAll, update, add, remove}