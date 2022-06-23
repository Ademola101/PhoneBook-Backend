require('dotenv').config()
const cors = require('cors')
const express = require('express')
const PhoneBook = require('./models/Phonebook')
const morgan = require('morgan')
morgan.token('data', (request) => {
  return request.method === 'POST' ? JSON.stringify(request.body) : ''
})
const app = express()
app.use(express.static('build'))
app.use(express.json())


const errorHandler = (error,request, response, next) => {
  console.log(error.message)
  if (error === 'CastError') {
    return response.status(400).send({
      error: 'malformatted id'
    })


  }

  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })}


  next(error)
}

app.use(errorHandler)

app.use(cors())

const PORT =process.env.PORT || 4000

const requestLogger = (request,response,next) => {
  console.log('Method: ', request.method)
  console.log('Path: ', request.path)
  console.log('Body: ' , request.body)
  next()
}

app.use(requestLogger)


const getRandom = () => {
  return Math.floor(Math.random() * (100 - 1) + 1 )
}

app.get('/api/persons', (req, res) => {
  PhoneBook.find({}).then(result => {
    res.json(result)
  })
})

app.get('/info',(req, res,next) => {
  PhoneBook.find({}).then(persons => {
    res.send(`<p> Phone book has info for ${persons.length} people </p> <br/> <div> ${new Date}`)
  }).catch(error => next(error))

})

app.get('/api/persons/:id', (req, res,next) => {
  // const id = Number(req.params.id);
  // const person = Persons.find(person => person.id === id)
  PhoneBook.findById(req.params.id).then(person => {
    if(person) {
      res.json(person)
    }
    else {
      res.status(404).end()
    }
  }).catch(error => next(error))


})

app.delete('/api/persons/:id', (req,res,next) => {
  // const id  = Number(req.params.id);
  // Persons = Persons.filter(person => person.id !== id)
// res.status(204).end()

  PhoneBook.findByIdAndRemove(req.params.id).then(result => {
    res.status(204).end()
  }).catch(error => next(error))
})

app.post('/api/persons', (req, res,next) => {
  const { name, number } = req.body
  // const phoneNumbers =  Persons.map(person => person.number)
  // console.log(phoneNumbers);

  const newPerson = new PhoneBook({
    name,
    number
  })
  newPerson.save().then(savedPerson => {
    res.json(savedPerson)
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (req, res,next) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number
  }

  PhoneBook.findByIdAndUpdate(req.params.id, person, { new:true }).then(updatedPhoneBook => {
    res.json(updatedPhoneBook)
  }).catch(error => next(error))
})
const unknownEndPoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndPoint)


app.listen(PORT, () => console.log(`Server running at ${PORT}`))

