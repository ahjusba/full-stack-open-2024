const notesRouter = require('express').Router()
const Person = require('../models/person')

notesRouter.get('/', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

notesRouter.get('/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if(!person) {
      return response.status(404).end()
    }
    response.json(person)
  })
    .catch(error =>  next(error))
})

notesRouter.delete('/:id', (request, response, next) => {
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

notesRouter.put('/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

notesRouter.post('/', (request, response, next) => {
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

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

const nameAlreadyExists = (name) => {
  Person.find({ name: name }).then(result => {
    console.log(result)
    return result.length > 0
  })
}

notesRouter.get('/info', (request, response, next) => {
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

const getCustomTimestamp = () => {
  const now = new Date()

  // Format the date part
  const day = now.toLocaleDateString('en-US', { weekday: 'short' })
  const month = now.toLocaleDateString('en-US', { month: 'short' })
  const date = now.getDate()
  const year = now.getFullYear()

  // Format the time part
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  // Get the GMT offset
  const timezoneOffset = -now.getTimezoneOffset()
  const offsetHours = String(Math.floor(Math.abs(timezoneOffset) / 60)).padStart(2, '0')
  const offsetMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, '0')
  const gmtOffset = `GMT${timezoneOffset >= 0 ? '+' : '-'}${offsetHours}${offsetMinutes}`

  // Get the time zone name
  const timeZoneName = now.toLocaleTimeString('en-US', { timeZoneName: 'long' }).split(' ').slice(2).join(' ')

  // Combine all parts
  return `${day} ${month} ${date} ${year} ${hours}.${minutes}:${seconds} ${gmtOffset} (${timeZoneName})`
}

module.exports = notesRouter