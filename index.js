const { response } = require("express");
const express = require("express");
const app = express()
app.use(express.json())
const PORT = 8080

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2022-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2022-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-05-30T19:20:14.298Z",
    important: true
  }
];

const generateID = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map(note => note.id)) : 0
  return maxId + 1
}

app.get("/", (req,res) => {
  res.send(`<h1> Hello world </h1>`)
});

app.get("/api/notes", (req,res) => {
  res.json(notes)
});

app.get("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id)
  const note = notes.find((note) => {
   return note.id === id}
  //  return statement important in arror
  )
  if (note) {
    res.json(note)
  }
  else {
    res.status(404).end()
  }
  
});

app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter(note => note.id !== id)
  res.status(204).end()
});

app.post("/api/notes", (req,res) => {
  const maxId = notes.length > 0 ? Math.max(...notes.map(note => note.id)) : 0
  const body = req.body
  if(!body.content) {
    return response.status(400).json({error: "content missing"})
  }

const note = {
  id: generateID(),
  content: body.content,
  date: new Date(),
  important: body.important || false

};
notes = notes.concat(note);
res.json(note)
})

app.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
})