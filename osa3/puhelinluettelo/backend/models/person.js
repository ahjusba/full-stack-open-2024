const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function(value) {
        //eg. 050-123123 or 09-0011
        const regex = /^\d{2,3}-\d{5,}$/
        return regex.test(value)
      },
      message: props => `${props.value} not a valid format. Expected format is "number-number", eg. "050-112233"`
    },
    required: true,
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)