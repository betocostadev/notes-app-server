const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response, next) => {
  const users = await User
    .find({})
    .populate('notes', { content: 1, date: 1 })
  try {
    if (users) {
      response.json(users)
    } else {
      response.status(500).end()
    }
  } catch (error) {
    response.status(500).end()
    next(error)
  }
})

usersRouter.get('/:id', async (request, response, next) => {
  try {
    const user = await User.findById(request.params.id)
    if (user) {
      response.json(user)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

usersRouter.post('/', async (request, response, next) => {
  const body = request.body

  const saltRounds = 10
  // About saltRounds = https://github.com/kelektiv/node.bcrypt.js/#a-note-on-rounds
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  if (!body || !body.username || !body.name || !body.password) {
    return response.status(400).json({
      error: 'Content missing. username, name and password are required!'
    })
  }

  const user =  new User ({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  try {
    const savedUser = await user.save()
    response.json(savedUser)
  } catch (error) {
    next(error)
  }

})

module.exports = usersRouter
