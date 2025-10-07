const jwt = require('jsonwebtoken');
const User = require('../Models/User');
protect = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Not authorized, token missing' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        res.clearCookie('token');
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

const authenticateToken = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Access Denied.Not Signed In.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded._id).select('-password');
        if (!req.user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        next();
    } catch (ex) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

const authorizeSystemAdmin = (req, res, next) => {
    if (!req.user || !req.user.role == 'SYSTEM ADMIN') {
        return res.status(403).json({ message: 'Access Denied: Requires System Admin privileges.' });
    }
    next();
};

const authorizeAdmin = (req, res, next) => {
    if (!req.user || !req.user.role == 'ADMIN') {
        return res.status(403).json({ message: 'Access Denied: Requires System Admin privileges.' });
    }
    next();
};

module.exports = { authenticateToken, authorizeSystemAdmin, authorizeAdmin, protect };