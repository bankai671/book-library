const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');

const BookController = require('../controllers/book.controller');
const AuthMiddleware = require('../middleware/auth.middleware');

const multipleUpload =  upload.fields([
    { name: 'imageFile', maxCount: 1 }, 
    { name: 'bookFile', maxCount: 1 }
]);

router.get('/all', BookController.getAllBooks);
router.post('/create', AuthMiddleware.verifyAccessToken, AuthMiddleware.verifyPermissions, multipleUpload, BookController.createBook);
router.delete('/:bookId', AuthMiddleware.verifyAccessToken, AuthMiddleware.verifyPermissions, BookController.deleteBook);
router.get('/search', BookController.searchBooksByQuery);
router.get('/:bookId', BookController.getById);
router.get('/', BookController.getBooksByLimit);

module.exports = router;

