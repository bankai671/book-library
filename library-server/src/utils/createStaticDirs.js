const fs = require('fs');

const createStaticDirs = () => {
    try {
        if (!fs.existsSync('public')) {
            fs.mkdirSync('public')
        }
        if (!fs.existsSync('public/images')) {
            fs.mkdirSync('public/images');
        }
        if (!fs.existsSync('public/books')) {
            fs.mkdirSync('public/books');
        }
    } catch (err) {
        console.error(err);
    } 
}

module.exports = createStaticDirs;

