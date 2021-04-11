const { Schema, model } = require('mongoose')

const noteSchema = Schema({
  content: String,
  date: Date,
  important: Boolean,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})
  
// nombre del modelo siempre en singular
const Note = model('Note', noteSchema)

module.exports = Note
