const express = require('express')
var morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

//POST url status responsetime person
morgan.token('person', function (req, res) { return JSON.stringify(req.body) })

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if(!person) {
    return response.status(404).end()
  } 

  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  if(!body.name) {
    return response.status(400).json({
      error: 'Name is missing'
    })
  }

  if(!body.number) {
    return response.status(400).json({
      error: 'Number is missing'
    })
  }

  if(nameAlreadyExists(body.name)) {
    return response.status(400).json({
      error: 'Name already exists'
    })
  }

  const person = {    
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)
  response.json(person)
})

const nameAlreadyExists = (name) => {
  const similarNames = persons.filter(person => person.name === name)
  return similarNames.length > 0
}

const generateId = () => {
  return Math.floor(Math.random() * 100000)
}

app.get('/info', (request, response) => {
  const peopleCount = persons.length
  const timeStamp = getCustomTimestamp()
  response.send(`<p>Phonebook has info for ${peopleCount} people</p><p>${timeStamp}</p>`)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

 const getCustomTimestamp = () => {
  const now = new Date();

  // Format the date part
  const day = now.toLocaleDateString('en-US', { weekday: 'short' });
  const month = now.toLocaleDateString('en-US', { month: 'short' });
  const date = now.getDate();
  const year = now.getFullYear();

  // Format the time part
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const time = `${hours}:${minutes}:${seconds}`;

  // Get the GMT offset
  const timezoneOffset = -now.getTimezoneOffset();
  const offsetHours = String(Math.floor(Math.abs(timezoneOffset) / 60)).padStart(2, '0');
  const offsetMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, '0');
  const gmtOffset = `GMT${timezoneOffset >= 0 ? '+' : '-'}${offsetHours}${offsetMinutes}`;

  // Get the time zone name
  const timeZoneName = now.toLocaleTimeString('en-US', { timeZoneName: 'long' }).split(' ').slice(2).join(' ');

  // Combine all parts
  return `${day} ${month} ${date} ${year} ${hours}.${minutes}:${seconds} ${gmtOffset} (${timeZoneName})`;
}