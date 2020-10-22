const mongoose = require('mongoose')

const TodoSchema = new mongoose.Schema({
  text: String, 
  complete: Boolean,
  category: String
}, { collection: 'todos' })

module.exports = mongoose.model('Todo', TodoSchema)