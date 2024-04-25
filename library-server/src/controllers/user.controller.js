const UserService = require('../services/user.service.js');

class UserController {
    static async register(req, res) {
        try {
            const { user, accessToken, refreshToken } = await UserService.register(req.body);
            res.status(201).json({ user, accessToken, refreshToken });
          } catch (error) {
            res.status(400).json({ message: error.message });
          }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const { user, accessToken, refreshToken } = await UserService.login(email, password);
            res.status(200).json({ user, accessToken, refreshToken });
          } catch (error) {
            res.status(401).json({ message: error.message });
          }
    }

    static async logout(req, res) {
        try {
            const { userId } = req.currentUser;
            const token = req.token;
            await UserService.logout(userId, token);
            res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async deleteUser(req, res) {
        try {
            await UserService.deleteUser(req.params.userId);
            res.status(200).json({ message: 'User with id :' + req.params.userId + ' successfuly deleted!' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async refreshAccessToken(req, res) {
        try {
            const { userId, role } = req.currentUser;
            const accessToken = UserService.generateAccessToken(userId, role);
            await UserService.setAccesTokenByUserIdInRedis(userId, accessToken);
            res.status(200).json({ accessToken });
        } catch (error) {
            res.status(500).json({ message: error.message});
        }
    }

    static async setBookToFavourite(req, res) {
        try {
            const { userId, bookId } = req.params;
            const settedBook = await UserService.setBookToFavourite(userId, bookId);
            res.status(200).json(settedBook);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getFavouriteBooks(req, res) {
        const { userId } = req.params;

        try {
            const favouriteBooks = await UserService.getFavouriteBooks(userId);
            res.status(200).json(favouriteBooks);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getBookFromFavourite(req, res) {
        const { userId, bookId } = req.params;

        try {
            const favouriteBook = await UserService.getBookFromFavourite(userId, bookId);
            res.status(200).json(favouriteBook);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async deleteBookFromFavourite(req, res) {
        const { userId, bookId } = req.params;

        try {
            const deletedBook = await UserService.deleteBookFromFavourite(userId, bookId);
            res.status(200).json({ deletedBook });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async searchBooksByQueryFromFavoutire(req, res) {
        const { userId } = req.params;
        const { query } = req.query;

        try {
            const books = await UserService.searchBooksByQueryFromFavourites(userId, query);
            res.status(200).json(books);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = UserController;

