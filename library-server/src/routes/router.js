const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes.js');
const userRoutes = require('./user.routes.js');
const bookRoutes = require('./book.routes.js');
const dashboardRoutes = require('./dashboard.routes.js');

const AuthMiddleware = require('../middleware/auth.middleware.js');

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/dashboard', AuthMiddleware.verifyAccessToken, dashboardRoutes);
router.use('/book', bookRoutes);

module.exports = router;

