const jwt = require('jsonwebtoken');
const SECRET = 'ExpenseTracker2025!';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.query.token;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

module.exports = verifyToken;
