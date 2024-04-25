const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log(req.currentUser);
    res.json({message: 'you got this endpoint!'});
})

module.exports = router;

