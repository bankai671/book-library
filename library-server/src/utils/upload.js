const multer  = require('multer');

const allowedBookFormats = [
    'application/pdf',
]

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = '';
        if (file.mimetype.startsWith('image/')) {
            uploadPath = './public/images/';
        }
        if (allowedBookFormats.includes(file.mimetype)) {
            uploadPath = './public/books/';
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Buffer.from(file.originalname, 'latin1').toString('utf8'));
    }
});

const upload = multer({ storage });

module.exports = upload;

