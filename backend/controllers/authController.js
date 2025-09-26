const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const SECRET = 'ExpenseTracker2025!';

exports.signup = (req, res) => {
    const { username, password } = req.body;
    User.findByUsername(username, (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        User.create(username, hashedPassword, (err) => {
            if (err) throw err;
            res.json({ message: 'User registered successfully' });
        });
    });
};

exports.login = (req, res) => {
    const { username, password } = req.body;
    User.findByUsername(username, (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = results[0];
        const isValid = bcrypt.compareSync(password, user.password);
        if (!isValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1d' });
        res.json({ token });
    });
};
