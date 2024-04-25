const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userBookSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    bookId: { type: Schema.Types.ObjectId, ref: 'Book' },
});

const UserBook = mongoose.model('UserBook', userBookSchema);

module.exports = UserBook;

