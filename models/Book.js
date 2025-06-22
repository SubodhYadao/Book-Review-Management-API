const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title:   { type: String, required: true },
  author:  { type: String, required: true },
  genre:   { type: String },  //since some books may not have genres (assuming)
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});

module.exports = mongoose.model('Book', bookSchema);
