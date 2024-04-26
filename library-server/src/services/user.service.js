const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redisClient = require('../../redis_connect.js');
const mongoose = require('mongoose');

const generateError = require('../utils/generateError.js');

const User = require('../models/user.model.js');
const UserBook = require('../models/user-book.model.js');

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_ACCESS_TIME, JWT_REFRESH_TIME } = require('../../config.js');

class UserService {
    static async register({ email, password, role }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword, role });
        await newUser.save();
        return this.login(email, password);
    }

    static async login(email, password) {
        const user = await User.findOne({ email }).lean();
        if (!user) {
            throw generateError('User not found', 404);
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw generateError('Invalid password', 401);
        }

        const accessToken = this.generateAccessToken(user._id, user.role);
        const refreshToken = this.generateRefreshToken(user._id, user.role);

        await this.setAccesTokenByUserIdInRedis(user._id, accessToken);
        await this.setRefreshTokenByUserIdInRedis(user._id, refreshToken);

        return { user: {...user, password: 'you got mogged' }, accessToken, refreshToken };
    }

    static async logout(userId) {
        await this.deleteAccesTokenByUserIdFromRedis(userId);
        await this.deleteRefreshTokenByUserIdFromRedis(userId);
    }

    static async getAllUsers() {
        const users = await User.find().lean();
        return users;
    }

    static async deleteUser(userId) {
        const candidate = User.findById(userId).lean();
        if (!candidate) {
            throw generateError('User not found', 404);
        }

        const deletedUser = await User.deleteOne(candidate);
        this.deleteAccesTokenByUserIdFromRedis(userId);
        this.deleteRefreshTokenByUserIdFromRedis(userId);
        return deletedUser; 
    }

    static async setBookToFavourite(userId, bookId) {
        const isUserBookExist = await UserBook.findOne({ userId, bookId });

        if (isUserBookExist) {
            throw generateError('Book already in favourite', 403);
        }

        const newUserBook = new UserBook({ userId, bookId });
        await newUserBook.save();
        return newUserBook;
    }

    static async getFavouriteBooks(userId) {
        const userBooks = await UserBook.aggregate([
            { $match: { userId: mongoose.Types.ObjectId.createFromHexString(userId) } },
            {
                $lookup: {
                    from: 'books',
                    localField: 'bookId',
                    foreignField: '_id',
                    as: 'bookDetails'
                }
            },
            { $unwind: '$bookDetails' },
            {
                $project: {
                    _id: '$bookDetails._id',
                    title: '$bookDetails.title',
                    author: '$bookDetails.author',
                    genre: '$bookDetails.genre',
                    publishingYear: '$bookDetails.publishingYear',
                    description: '$bookDetails.description',
                    imagePath: '$bookDetails.imagePath',
                    bookPath: '$bookDetails.bookPath'
                }
            }
        ]);

        return userBooks;
    }

    static async getBookFromFavourite(userId, bookId) {
        const favouriteBook = await UserBook.findOne({ userId, bookId });
        return favouriteBook;
    }

    static async deleteBookFromFavourite(userId, bookId) {
        const deletedBook = await UserBook.findOneAndDelete({ userId, bookId });
        if (!deletedBook) {
            throw generateError('Book not deleted');
        }

        return deletedBook;
    }

    static async searchBooksByQueryFromFavourites(userId, query) {
        const searchQuery = { title: { $regex: new RegExp(`.*${query}.*`, 'i') } };

        const books = await UserBook.aggregate([
                { $match: { userId: mongoose.Types.ObjectId.createFromHexString(userId) } },
                {
                    $lookup: {
                        from: 'books',
                        localField: 'bookId',
                        foreignField: '_id',
                        as: 'bookDetails'
                    }
                },
                { $unwind: '$bookDetails' },
                {
                    $project: {
                        _id: '$bookDetails._id',
                        title: '$bookDetails.title',
                        author: '$bookDetails.author',
                        genre: '$bookDetails.genre',
                        publishingYear: '$bookDetails.publishingYear',
                        description: '$bookDetails.description',
                        imagePath: '$bookDetails.imagePath',
                        bookPath: '$bookDetails.bookPath'
                    }
                },
                { $match: searchQuery }
            ]);
 
        if (!books) {
            throw generateError('Unable to find books', 404);
        }

        return books;
    }

    static generateAccessToken(userId, role) {
        const accessToken = jwt.sign({ userId, role }, JWT_ACCESS_SECRET);
        return accessToken;
    }

    static generateRefreshToken(userId, role) {
        const refreshToken = jwt.sign({ userId, role }, JWT_REFRESH_SECRET);
        return refreshToken;
    }
    
    static async setAccesTokenByUserIdInRedis(userId, accessToken) {
       await redisClient.set(`${userId}_access_token`, accessToken, {
           EX: Number.parseInt(JWT_ACCESS_TIME),
       });
    }

    static async setRefreshTokenByUserIdInRedis(userId, refreshToken) {
       await redisClient.set(`${userId}_refresh_token`, refreshToken, {
           EX: Number.parseInt(JWT_REFRESH_TIME),
       });
    }

    static async getAccessTokenByUserIdFromRedis(userId) {
        const token = await redisClient.get(`${userId}_access_token`);
        return token;
    }

    static async getRefreshTokenByUserIdFromRedis(userId) {
        const token = await redisClient.get(`${userId}_refresh_token`);
        return token;
    }

    static async deleteAccesTokenByUserIdFromRedis(userId) {
        await redisClient.del(`${userId}_access_token`);
    }

    static async deleteRefreshTokenByUserIdFromRedis(userId) {
        await redisClient.del(`${userId}_refresh_token`);
    }
}

module.exports = UserService;

