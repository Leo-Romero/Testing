require('dotenv').config()
require('./mongo')

const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/Note')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')

app.use(cors())
// middleware para parsear, hacer post con json
app.use(express.json())
// para los estaticos ej: localhost:3000/static/logo.png
app.use('/static', express.static('images'))


app.get('/', (req, res) => {
  res.send('<h1>Hola !</h1>')
})

// GET
app.get('/api/notes', (req, res, next) => {
  Note.find({})
    .then(notes => {
      res.json(notes)
    })
    .catch(err => next(err))  
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
app.post('/api/notes', (req, res, next) => {
  const note = req.body
    
  if(!note.content) {
    return res.status(400).json({
      error: 'note.content is missing'
    })
  }

  const newNote = new Note({
    content: note.content,
    date: new Date(),
    important: note.important || false
  })

  newNote.save()
    .then(savedNote => {
      res.json(savedNote)
    })
    .catch(err => next(err))  
})

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
