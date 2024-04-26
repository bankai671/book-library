const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes.js');
const userRoutes = require('./user.routes.js');
const bookRoutes = require('./book.routes.js');

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/book', bookRoutes);

module.exports = router;

