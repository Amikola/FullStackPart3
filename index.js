const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
require('dotenv').config()
app.use(express.json())
app.use(express.static('dist'))

const morgan = require('morgan')
app.use(morgan(function (tokens, req, res) {
  if (tokens.method(req, res) === 'POST') {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body)
    ].join(' ')

  }else {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ')
  }

}))


const People = require('./models/people')





const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if (error.name === 'ValidationError')
  {return response.status(400).json({ error: error.message })
  }

  next(error)
}




app.get('/info', (req, res,) => {
  const now = new Date()

  People.find({}).then(peoples => {
    res.send(`
    <p>Phonebook has info for ${peoples.length} people</p>
    </br>
    <p>${now}</p>
    `)
  })

})

app.get('/api/persons', (request, response) => {
  People.find({}).then(peoples => {
    response.json(peoples)
  })
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new People({
    name: body.name,
    number: body.number,
  })

  person.save().then(result => {
    response.json(result)
  }).catch(error => {
    next(error)
  })


})


app.put('/api/persons/:id',(request, response, next)  => {

  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  People.findByIdAndUpdate(request.params.id, person, { new: person.number })
    .then(updatedPerson => {
      response.json(updatedPerson)
    }).catch(error => {
      next(error)
    })

})

app.get('/api/persons/:id', (request, response, next)  => {

  People.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }

    }).catch(error => {
      next(error)
    })
})




app.delete('/api/persons/:id', (request, response, next) => {
  People.findByIdAndDelete(request.params.id)
    .then(result => {
      result
      response.status(204).end()
    })
    .catch(error => {

      next(error)})

})




app.use(unknownEndpoint)

app.use(errorHandler)




const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})