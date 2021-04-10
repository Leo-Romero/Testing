const { app } = require('../index')  
const supertest = require('supertest')
const api = supertest(app)

const initialNotes = [
  {
    content: 'Aprendiendo FullStack',
    important: true,
    date: new Date
  },
  {
    content: 'Adelante! Vamos por más',
    important: true,
    date: new Date
  }
]

const getAllContentFromNotes = async () => {
  const response = await api.get('/api/notes')
  return {
    contents: response.body.map(note => note.content),
    response
  }
}
  
module.exports = {
  api,
  initialNotes,
  getAllContentFromNotes
}
