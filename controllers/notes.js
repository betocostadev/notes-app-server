const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// Function below to use JWT for Authentication tokens
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

notesRouter.get('/', async (request, response, next) => {
  const notes = await Note
    .find({})
    .populate('user', { username: 1, name: 1 })
  try {
    if (notes) {
      response.json(notes)
    } else {
      response.status(500).end()
    }
  } catch (e) {
    response.status(500).end()
    next(e)
  }
})

notesRouter.get('/:id', async (request, response, next) => {
  try {
    const note = await Note.findById(request.params.id)
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  } catch (e) {
    next(e)
  }
})

notesRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body
    // Using authenticated user with Token
    const token = getTokenFrom(request)
    // eslint-disable-next-line no-undef
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    if (!body || !body.content) {
      return response.status(400).json({
        error: 'Content missing'
      })
    }

    const note =  new Note ({
      content: body.content,
      important: body.important || false,
      date: new Date(),
      user: user._id
    })

    const savedNote = await note.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()
    response.json(savedNote)

  } catch (error) {
    next(error)
  }

})

notesRouter.delete('/:id', async (request, response, next) => {
  try {
    await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

notesRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, { new: true })
  try {
    response.json(updatedNote)
  } catch (error) {
    next(error)
  }
})

module.exports = notesRouter
