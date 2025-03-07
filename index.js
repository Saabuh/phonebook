require('dotenv').config()
const Entry = require('./models/entry')
const express = require('express')
const morgan = require('morgan')

const app = express()

morgan.token('body', (request) => {

  return JSON.stringify(request.body)
})

//Middleware
app.use(express.json())
app.use(express.static('dist'))
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

  Entry.countDocuments().then(count => {
    response.send(`<p>phonebook has info for ${count} people.</p>
    <p>${formattedDate} ${formattedTime} (${formattedTimeZone})<p/>`)
  })

})

app.get('/api/persons', (request, response) => {

  Entry.find({}).then(entries => {
    response.json(entries)
  })
})

app.get('/api/persons/:id', (request, response, next) => {

  Entry.findById(request.params.id).then(entry => {
    if (entry) {
      response.json(entry)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => {
      next(error)
    })
})

app.put('/api/persons/:id', (request, response, next) => {


  const entry = {
    name: request.body.name,
    number: request.body.number,
  }

  Entry.findByIdAndUpdate(request.params.id, entry, {new: true, runValidators: true})
    .then(updatedEntry => {
      response.json(updatedEntry)
    })
    .catch(error => {
      next(error)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {

  Entry.findByIdAndDelete(request.params.id).then(result => {
    if (result) {
      response.status(204).end()
    } else {
      response.status(404).end()
    }
  })
    .catch(error => {
      next(error)
    })

  //no content returned, request fulfilled
})

app.post('/api/persons', (request, response, next) => {

  const newPerson = {
    name: request.body.name,
    number: request.body.number
  }

  const entry = new Entry(newPerson)
  entry.save().then(savedEntry => {
    response.json(savedEntry)
  })
    .catch(error => {
      next(error)
    })
})

//Middleware
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({error: error})
  }

  return response.status(500).end()
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`listening on port ${PORT}`)
