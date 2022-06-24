const mongoose = require('mongoose')
const url  = process.env.MONGODB_URL

console.log('connecting to', url)

mongoose.connect(url).then(() => {
  console.log('connected to db')
}).catch(error => {
  console.log('error connecting to db', error.message)
})

const Schema = mongoose.Schema
const numberValidator = [{
  validator: (number) => {
    if ((number[2] === '-' || number[3] === '-') && number.length < 9) {
      return false
    }

    return true

  },
  msg: 'must be at least 8 digit',
},
{

  validator: (number) => {
    return /^\d{2,3}-\d+$/.test(number)
  },

  meg: 'invalid phone number' },
]
const PhonebookSchema = new Schema({
  name: {
    type: String,
    minLength: 3
  },
  number: {
    type: Number,
    required: [true, 'number is required'],
    minLength: 8,
    validate: numberValidator
  }
})

PhonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('PhoneBook', PhonebookSchema)
