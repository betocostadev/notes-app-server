// Notes App backend - Using Express
const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
// const Note = require('./models/note')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

// Use Static to serve the static HTML file from the build folder
// Use CORS module to allow Cross-Origin Resource Sharing
app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(middleware.requestLogger)

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app

// const logger = function (tokens, request, response) {
//   return [
//     tokens.method(request, response),
//     tokens.url(request, response),
//     tokens.status(request, response),
//     tokens.res(request, response, 'content-length'), '-',
//     tokens['response-time'](request, response), 'ms',
//     JSON.stringify(request.body)
//   ].join(' ')
// }

// app.use(morgan(logger))


// let notes = [
//   {
//     id: 1,
//     content: 'HTML is easy',
//     date: '2019-05-30T17:30:31.098Z',
//     important: true
//   },
//   {
//     id: 2,
//     content: 'Browser can execute only Javascript',
//     date: '2019-05-30T18:39:34.091Z',
//     important: false
//   },
//   {
//     id: 3,
//     content: 'GET and POST are the most important methods of HTTP protocol',
//     date: '2019-05-30T19:20:14.298Z',
//     important: true
//   }
// ]

// eslint-disable-next-line no-unused-vars
// const generateNoteId = () => {
//   const maxId = notes.length > 0
//     ? Math.max(...notes.map(n => n.id))
//     : 0

//   return maxId + 1
// }

// app.get('/', (req, res) => {
//   res.send('<h1>Hello World!</h1>')
// })

// Not stored on the DB
// app.get('/api/notes', (req, res) => {
//   res.json(notes)
// })

// app.get('/api/notes/:id', (req, res) => {
//   const id = Number(req.params.id)
//   const note = notes.find(note => note.id === id)
//   if (note) {
//     res.json(note)
//   } else {
//     res.status(404).end()
//   }
// })

// app.delete('/api/notes/:id', (req, res) => {
//   const id = Number(req.params.id)
//   notes = notes.filter(note => note.id !== id)
//   res.status(204).end()
// })


// Using Mongo with Mongoose
// app.get('/api/notes', (request, response, next) => {
//   Note.find({})
//     .then(notes => {
//       if (notes) {
//         response.json(notes)
//       } else {
//         response.status(500).end()
//       }
//     })
//     .catch(e => {
//       response.status(500).end()
//       next(e)
//     })
// })


// app.get('/api/notes/:id', (request, response, next) => {
//   Note.findById(request.params.id)
//     .then(note => {
//       if (note) {
//         response.json(note)
//       } else {
//         response.status(404).end()
//       }
//     })
//     .catch(error => next(error))
// })


// app.post('/api/notes', (request, response, next) => {
//   const body = request.body

//   if (!body || !body.content) {
//     return response.status(400).json({
//       error: 'Content missing'
//     })
//   }

//   const note =  new Note ({
//     content: body.content,
//     important: body.important || false,
//     date: new Date(),
//     // id: generateNoteId() - Auto gen by MongoDB
//   })
//   // notes = notes.concat(note)
//   note
//     .save()
//     .then(savedNote => savedNote.toJSON())
//     .then(savedAndFormattedNote => {
//       response.json(savedAndFormattedNote)
//     })
//     .catch(error => next(error))
// })

// app.delete('/api/notes/:id', (request, response, next) => {
//   Note.findByIdAndDelete(request.params.id)
//     .then(() => {
//       response.status(204).end()
//     })
//     .catch(error => next(error))
// })

// app.put('/api/notes/:id', (request, response, next) => {
//   const body = request.body

//   const note = {
//     content: body.content,
//     important: body.important,
//   }

//   Note.findByIdAndUpdate(request.params.id, note, { new: true })
//     .then(updatedNote => {
//       response.json(updatedNote)
//     })
//     .catch(error => next(error))
// })

// eslint-disable-next-line no-undef
// const PORT = process.env.PORT
// app.listen(PORT, () => {
//   console.log(`Server running on port: ${PORT}`)
//   console.log(`If you are running locally, access it in: http://localhost:${PORT}/`)
// })



