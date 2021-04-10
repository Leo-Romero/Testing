const mongoose = require('mongoose')
const { server } = require('../index')     // se debe colocaren index.js: module.exports = app

const Note = require('../models/Note')
const {
  api,
  initialNotes,
  getAllContentFromNotes
} = require('./helpers')

// esto se ejecuta antes de cada test
beforeEach(async () => {
  await Note.deleteMany({})     // borra todas

  const note1 = new Note(initialNotes[0])
  await note1.save()
  
  const note2 = new Note(initialNotes[1])
  await note2.save()
  
})

// OJO que esto DEBE ser asincrono
test('notes retorna un JSON', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test(`tiene ${initialNotes.length} notas`, async () => {
  const response = await api.get('/api/notes')
  expect(response.body).toHaveLength(initialNotes.length)
})

test('la primer nota es de FullStack', async () => {
  const { contents } = await getAllContentFromNotes()

  expect(contents).toContain('Aprendiendo FullStack')
})

test('agregar una nueva nota', async () => {
  const newNote = {
    content: 'Nueva nota de test',
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const { contents, response } = await getAllContentFromNotes()

  expect(response.body).toHaveLength(initialNotes.length + 1)
  expect(contents).toContain(newNote.content)
})

test('agregar una nueva nota sin contenido', async () => {
  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/notes')
  expect(response.body).toHaveLength(initialNotes.length)
})

test('una nota puede ser borrada', async () => {
  const { response: firstResponse } = await getAllContentFromNotes()
  const { body: notes } = firstResponse
  const noteToDelete = notes[0]

  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)

  const { contents, response: secondResponse } = await getAllContentFromNotes()

  expect(secondResponse.body).toHaveLength(initialNotes.length - 1)
  expect(contents).not.toContain(noteToDelete.content)
})

test('una nota con un id erroneo no puede borrarse', async () => {
  await api
    .delete('/api/notes/1234')
    .expect(500)

  const { response } = await getAllContentFromNotes()

  expect(response.body).toHaveLength(initialNotes.length)
})

test('una nota con un id valido pero que no existe no puede borrarse', async () => {
  const validObjectIdThatDoNotExist = '606f4bb2fe88932382fa7802'
  await api
    .delete(`/api/notes/${validObjectIdThatDoNotExist}`)
    .expect(204)

  const { response } = await getAllContentFromNotes()

  expect(response.body).toHaveLength(initialNotes.length)
})


// esto se ejecuta cuando termina todo
// aqui cerramos el server para que no moleste
afterAll(() => {
  mongoose.connection.close()
  server.close()
})
