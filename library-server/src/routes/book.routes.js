const express = require('express');
const router = express.Router();
const multer  = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = '';
        if (file.mimetype.startsWith('image/')) {
            uploadPath = './public/images/';
        }
        if (file.mimetype === 'application/pdf' || file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            uploadPath = './public/books/';
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Buffer.from(file.originalname, 'latin1').toString('utf8'));
    }
});

const upload = multer({ storage });
const multipleUpload =  upload.fields([
    { name: 'imageFile', maxCount: 1 }, 
    { name: 'bookFile', maxCount: 1 }
]);

const BookController = require('../controllers/book.controller');
const AuthMiddleware = require('../middleware/auth.middleware');

router.get('/all', BookController.getAllBooks);
router.post('/create', AuthMiddleware.verifyAccessToken, AuthMiddleware.verifyPermissions, multipleUpload, BookController.createBook);
router.delete('/:bookId', AuthMiddleware.verifyAccessToken, AuthMiddleware.verifyPermissions, BookController.deleteBook);
router.get('/search', BookController.searchBooksByQuery);
router.get('/:bookId', BookController.getById);
router.get('/', BookController.getBooksByLimit);

module.exports = router;

