const Book = require("../models/book.model");
const generateError = require("../utils/generateError");

class BookService {
    static async getAllBooks() {
        const books = Book.find().lean();
        return books;
    }
    
    static async getBooksByLimit(limit = 12) {
        const books = await Book.find().limit(limit).lean();
        return books;
    }

    static async getById(bookId) {
        const book = await Book.findById(bookId).lean();
        if (!book) {
            throw generateError('Book not found', 404);
        }

        return book;
    }

    static async createBook(bookData) {
        const { title, author, genre, publishingYear, description, imagePath, bookPath } = bookData;

        const newBook = new Book({ 
            title, 
            author, 
            genre, 
            publishingYear: Number.parseInt(publishingYear), 
            description,
            imagePath,
            bookPath
        });

        await newBook.save();
        return newBook;
    }

    static async deleteBook(bookId) {
        const book = await Book.findByIdAndDelete(bookId, { lean: true });
        if (!book) {
            throw generateError('Book not found', 404);
        }

        return book;
    }

    static async searchBooksByQuery(query) {
        const searchQuery = { title: { $regex: new RegExp(`.*${query}.*`, 'i') } };
        const books = await Book.find(searchQuery).lean();
        return books;
    }
}

module.exports = BookService;

