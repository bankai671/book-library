const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: { 
        type: String, 
        required: true
    },
    author: { 
        type: String, 
        required: true
    },
    genre: { 
        type: String,
        required: true
    },
    publishingYear: {
        type: Number, 
        min: 0,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imagePath: {
        type: String,
    },
    bookPath: {
        type: String,
    }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;

