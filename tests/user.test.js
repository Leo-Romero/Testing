const bcrypt = require('bcrypt')
const User = require('../models/User')
const { api, getUsers } = require('./helpers')
const mongoose = require('mongoose')
const { server } = require('../index')

describe.only('crear un nuevo usuario', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('1234', 10)
    const user = new User({username: 'Prueba1', passwordHash})

    await user.save()
  })

  test('creando un usuario nuevo', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'Juany',
      name: 'Juan',
      password: 'passwrd'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const usersAtEnd = await getUsers()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain(newUser.username)
  })

  test('no se puede cargar un usuario con el mismo username', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'Prueba1',    // username ya cargado
      name: 'diagnostico',
      password: 'passwrd'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(409)
      .expect('Content-Type', /application\/json/)
    
    expect(result.body.error).toContain('expected `username` to be unique')
    
    const userAtEnd = await getUsers()
    expect(userAtEnd).toHaveLength(usersAtStart.length)
  })

  afterAll(() => {
    mongoose.connection.close()
    server.close()
  })
})

