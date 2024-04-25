const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user.controller.js');
const AuthMiddleware = require('../middleware/auth.middleware.js');

router.get('/all', UserController.getAllUsers);
router.delete('/:userId', UserController.deleteUser);
router.post('/:userId/books/:bookId', AuthMiddleware.verifyAccessToken, UserController.setBookToFavourite);
router.delete('/:userId/books/:bookId', AuthMiddleware.verifyAccessToken, UserController.deleteBookFromFavourite);
router.get('/:userId/books', AuthMiddleware.verifyAccessToken, UserController.getFavouriteBooks);
router.get('/:userId/search', AuthMiddleware.verifyAccessToken, UserController.searchBooksByQueryFromFavoutire);
router.get('/:userId/books/:bookId', AuthMiddleware.verifyAccessToken, UserController.getBookFromFavourite);

module.exports = router;

