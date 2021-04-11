const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')

// es relativo a /api/users
usersRouter.get('/', async (req, res) => {
  // populate trae todas las notas del user
  const users = await User.find({}).populate('notes', {
    content: 1,   // muestra content
    date: 1,      // muestra date
    //_id: 0        // No muestra _id (hay que indicarlo forzosamente que no lo muestre)
  }) 

  res.json(users)
})

usersRouter.post('/', async (req, res) => {
  const { body } = req
  const {username, name, password} = body

  // hasheo la password
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  
  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()

  res.status(201).json(savedUser)
})

module.exports = usersRouter
