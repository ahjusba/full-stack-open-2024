require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))
app.use(express.static('dist'))

//POST url status responsetime person
morgan.token('person', function (req, res) { return JSON.stringify(req.body) })

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const person = Person.findById(request.params.id).then(person => {
    if(!person) {
      return response.status(404).end()
    } 
    response.json(person)
  })
  .catch(error =>  next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      if (result) {
        response.status(204).end() // Successfully deleted
      } else {
        response.status(404).send({ error: 'Person not found' })
      }
    })
    .catch(error => {
      next(error)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
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

  const person = new Person({    
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const nameAlreadyExists = (name) => {
  Person.find({ name: name }).then(result => {
    console.log(result)
    return result.length > 0
  })
}

app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      const timeStamp = getCustomTimestamp()
      response.send(`<p>Phonebook has info for ${count} people</p><p>${timeStamp}</p>`)
    })
    .catch(error => {
      console.error(error)
      next(error)
    })
})

const PORT = process.env.PORT || 3001
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

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  console.log("Error name: " + error.name)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)