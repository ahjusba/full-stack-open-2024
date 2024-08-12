const mongoose = require('mongoose')

//Command line contains less than three arguments: we need password to connect to MongoDb
if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://ahjusba:${password}@fullstackopen.67f6ppd.mongodb.net/puhelinluettelo?retryWrites=true&w=majority&appName=FullStackOpen`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const createNewPersonEntry = () => {
  const name = process.argv[3]
  const number = process.argv[4]
  const person = new Person({
    name: name,
    number: number,
  })
  person.save().then(() => {
    console.log(`Saved person ${name} with number ${number} to MongoDb`)
    mongoose.connection.close()
  })
}

const printPeopleCollection = () => {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}

//Command line contain five arguments, eg. "$node mongo.js yourpassword Anna 040-1234556"
if(process.argv.length === 5) {
  createNewPersonEntry()
}

//Command line contain five arguments, eg. "$node mongo.js yourpassword"
if(process.argv.length === 3) {
  printPeopleCollection()
}

if(process.argv.length !== 3 && process.argv.length !== 5) {
  console.log('Too few or many arguments')
  mongoose.connection.close()
}




