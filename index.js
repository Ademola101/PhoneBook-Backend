const { response } = require("express");
const express = require("express");
const morgan = require("morgan");
morgan.token("data", (request) => {
  return request.method === "POST" ? JSON.stringify(request.body) : ""
})
const app = express();
app.use(express.json());
const PORT = 4000;

const requestLogger = (request,response,next) => {
console.log("Method: ", request.method);
console.log("Path: ", request.path);
console.log("Body: " , request.body);
next()
};

app.use(requestLogger)

let Persons = [
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
];


const getRandom = () => {
  return Math.floor(Math.random() * (100 - 1) + 1 )
}

app.get("/api/persons", (req, res) => {
  res.json(Persons)
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

app.delete("/api/persons/:id", (req,res) => {
  const id  = Number(req.params.id);
  Persons = Persons.filter(person => person.id !== id)
res.status(204).end()
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

const newPerson = {
  name: body.name,
  number: body.number,
  id: getRandom()
};
Persons = Persons.concat(newPerson);
res.json(newPerson)
})

const unknownEndPoint = (request, response) => {
  response.status(404).send({error: "unknown endpoint"})
};

app.use(unknownEndPoint)


app.listen(PORT, () => console.log(`Server running at ${PORT}`))

