const express = require('express');
const router = express.Router();

const AuthMiddleware = require('../middleware/auth.middleware.js');
const UserController = require('../controllers/user.controller.js');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/logout', AuthMiddleware.verifyAccessToken, UserController.logout);
router.post('/refresh-token', AuthMiddleware.verifyRefreshToken, UserController.refreshAccessToken);

module.exports = router;

