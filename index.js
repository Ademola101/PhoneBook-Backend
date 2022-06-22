require('dotenv').config()
const cors = require("cors");
const express = require("express");
const PhoneBook = require("./models/Phonebook")
const morgan = require("morgan");
morgan.token("data", (request) => {
  return request.method === "POST" ? JSON.stringify(request.body) : ""
})
const app = express();
app.use(express.static("build"))
app.use(express.json());
const errorHandler = (error,request, response, next) => {
  console.log(error.message);
  if (error === "CastError") {
return response.status(400).send({
  error: "malformatted id"
});


  }

  next(error)
}

app.use(errorHandler)

app.use(cors())

const PORT =process.env.PORT || 4000;

const requestLogger = (request,response,next) => {
console.log("Method: ", request.method);
console.log("Path: ", request.path);
console.log("Body: " , request.body);
next()
};

app.use(requestLogger)


const getRandom = () => {
  return Math.floor(Math.random() * (100 - 1) + 1 )
}

app.get("/api/persons", (req, res) => {
  PhoneBook.find({}).then(result => {
    res.json(result)
  })
});

app.get("/info",(req, res) => {
  const totalPerson = Persons.length;
  res.send(`<p> Phone book has info for ${totalPerson} people </p> <br/> <div> ${new Date}`)
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = Persons.find(person => person.id === id)
  if(person) {
    res.json(person)
  }
else {
res.status(404).end()
}
});

app.delete("/api/persons/:id", (req,res,next) => {
  // const id  = Number(req.params.id);
  // Persons = Persons.filter(person => person.id !== id)
// res.status(204).end()

PhoneBook.findByIdAndRemove(req.params.id).then(result => {
  res.status(204).end()
}).catch(error => next(error))
});

app.post("/api/persons", (req, res) => {
const body = req.body;
const phoneNumbers =  Persons.map(person => person.number)
console.log(phoneNumbers);
if(!body.name){
  return res.status(400).json({error: "name is missing"})
}
if(!body.number){
  return res.status(400).json({error: "number is missing"})
}

if (phoneNumbers.filter(number => number === body.number).length > 0 ){
  return res.status(400).json({error: "Number already added"})
}

const newPerson = new PhoneBook({
  name: body.name,
  number: body.number
})
newPerson.save().then(savedPerson => {
  res.json(savedPerson)
})
})

const unknownEndPoint = (request, response) => {
  response.status(404).send({error: "unknown endpoint"})
};

app.use(unknownEndPoint)


app.listen(PORT, () => console.log(`Server running at ${PORT}`))

