require('dotenv').config()
require('./mongo')

const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/Note')
const User = require('./models/User')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')
const usersRouter = require('./controllers/users')

app.use(cors())
// middleware para parsear, hacer post con json
app.use(express.json())
// para los estaticos ej: localhost:3000/static/logo.png
app.use('/static', express.static('images'))


app.get('/', (req, res) => {
  res.send('<h1>Hola !</h1>')
})

// GET
app.get('/api/notes', async (req, res) => {
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1
  })
  
  res.json(notes) 
})

// GET/id
app.get('/api/notes/:id', (req, res, next) => {
  const { id } = req.params

  Note.findById(id)
    .then(note => {
      if(note) {
        return res.json(note)
      }
      else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))  
})

//PUT
app.put('/api/notes/:id', (req, res, next) => {
  const { id } = req.params
  const note = req.body
 
  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  // NOTA: el new: true es para que me devuelva el modificado
  // por defecto devuelve el encontrado
  Note.findByIdAndUpdate(id, newNoteInfo, {new: true})
    .then(result => {
      res.json(result)
    })
    .catch(err => next(err))
})

// DELETE
app.delete('/api/notes/:id', (req, res, next) => {
  const { id } = req.params
 
  Note.findByIdAndDelete(id)
    .then(() => res.status(204).end())
    .catch(err => next(err))
})

// POST
app.post('/api/notes', async (req, res, next) => {
  const { content,
    important = false,
    userId
  } = req.body
    
  const user = await User.findById(userId)

  if(!content) {
    return res.status(400).json({
      error: 'required "content" field is missing'
    })
  }

  const newNote = new Note({
    content,
    date: new Date(),
    important,
    user: user._id
  })

  try {
    const savedNote = await newNote.save()

    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    res.json(savedNote)
  } catch (error) {
    next(error)
  }
})

app.use('/api/users', usersRouter)

app.use(notFound)
app.use(handleErrors)

// para heroku utiliza env sino utilizar 3000
const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
  console.log(`Server corriendo en el puerto: ${PORT}`)
})

module.exports = {
  app,
  server
}
