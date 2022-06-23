const mongoose = require('mongoose')

const password = process.argv[2]

const url = `mongodb+srv://Fullstack:${password}@phone.pyvtu.mongodb.net/?retryWrites=true&w=majority`

const Schema = mongoose.Schema

const PhonebookSchema = new Schema({
  name: String,
  number: Number
})

const PhoneBook = mongoose.model('PhoneBook', PhonebookSchema)

mongoose.connect(url).then(result => {
  console.log('connected')
  if(process.argv.length < 4){
    PhoneBook.find({}).then(results => {
      results.forEach(result => {
        console.log(result)
      })
    })
  }
  const person = new PhoneBook({
    name: process.argv[3],
    number: process.argv[4]
  })
  return person.save()
}).then(result => {
  console.log(`added ${process.argv[3]} number ${process.argv[4]}`)
  return mongoose.connection.close()
}).catch(error => {
  console.log(error)
})



