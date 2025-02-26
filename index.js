const express = require('express')
const morgan = require('morgan')

const app = express()

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const generateId = () => {
  return String(Math.floor(Math.random() * 1000))
}

morgan.token('body', (request, response) => {

  return JSON.stringify(request.body)
})

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

//Middleware
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/info', (request, response) => {

  const now = new Date()
  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'short', // "Sat"
    month: 'short',   // "Jan"
    day: '2-digit',   // "22"
    year: 'numeric'   // "2025"
  })

  const formattedTime = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // 24-hour format
    timeZoneName: 'short',
  })

  const timeZone = now.toLocaleTimeString('en-US', {
    timeZoneName: 'long',
    hour12: false,
  })

  const formattedTimeZone = timeZone.split(' ').slice(1).join(' ')

  response.send(`<p>phonebook has info for ${persons.length} people.</p>
  <p>${formattedDate} ${formattedTime} (${formattedTimeZone})<p/>
  `)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  id = request.params.id

  const person = persons.find(note => note.id === id)

  if (!person) {
    return response.status(404).end()
  }

  response.json(person)

})

app.delete('/api/persons/:id', (request, response) => {
  id = request.params.id
  persons = persons.filter(person => person.id !== id)

  //no content returned, request fulfilled
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {

  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "missing name or number."
    })
  } else if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: "name must be unique."
    })
  }

  const newPerson = {
    id: generateId(),
    name: request.body.name,
    number: request.body.number
  }

  persons = persons.concat(newPerson)

  response.json(newPerson)
})

//Middleware
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`listening on port ${PORT}`)
