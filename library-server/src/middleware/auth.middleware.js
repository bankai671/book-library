const jwt = require('jsonwebtoken');

const UserService = require('../services/user.service.js');

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = require('../../config.js');

class AuthMiddleware {
    static async verifyAccessToken(req, res, next) {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Invalid request' });
        }

        try {
            const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    
            req.currentUser = decoded;
            const tokenFromRedis = await UserService.getAccessTokenByUserIdFromRedis(decoded.userId);

            if (tokenFromRedis !== token) {
                throw new Error('Access tokens are not the same');
            }

            next();
        } catch (error) {
            return res.status(401).json({ message: 'Unauthorized', error: error.message });
        }
    }

    static async verifyRefreshToken(req, res, next) {
        const { token } = req.body;
 
        if (!token) {
            return res.status(401).json({ message: 'Invalid request' });
        }

        try {
            const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
            req.currentUser = decoded;
 
            const tokenFromRedis = await UserService.getRefreshTokenByUserIdFromRedis(decoded.userId);
            if (!tokenFromRedis) {
                return res.status(401).json({ message: 'Invalid request, token is not in store' });
            }

            next();
        } catch (error) {
            return res.status(401).json({ message: error.message });
        }
    }

    static async verifyPermissions(req, res, next) {
        const user = req.currentUser;

        try {
            if (user.role !== 'admin') {
                throw new Error('Don\'t have have permissions');
            }

            next();
        } catch (error) {
            return res.status(401).json({ error: error.message });
        }
    }
}

module.exports = AuthMiddleware;

