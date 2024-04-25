const BookService = require("../services/book.service");

class BookController {
    static async getAllBooks(req, res) {
        try {
            const books = await BookService.getAllBooks();
            res.status(200).json(books);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getBooksByLimit(req, res) {
        try {
            const { limit } = req.query;
            const books = await BookService.getBooksByLimit(limit);
            res.status(200).json(books);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const { bookId } = req.params;
            const book = await BookService.getById(bookId);
            res.status(200).json(book);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async createBook(req, res) {
        const { imagePath = '', bookPath = '', ...rest } = req.body;

        try {
            const createdBook = await BookService.createBook({ 
                imagePath,
                bookPath,
                ...rest
            });

            res.status(200).json(createdBook);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async deleteBook(req, res) {
        const { bookId } = req.params;
        try {
            const deletedBook = await BookService.deleteBook(bookId);
            res.status(200).json({ deletedBook });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async searchBooksByQuery(req, res) {
        const { query } = req.query;

        try {
            const books = await BookService.searchBooksByQuery(query);
            res.status(200).json(books);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = BookController;

