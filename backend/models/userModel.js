const db = require('../db');

const User = {
    findByUsername: (username, callback) => {
        db.query('SELECT * FROM users WHERE username = ?', [username], callback);
    },
    create: (username, hashedPassword, callback) => {
        db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], callback);
    }
};

module.exports = User;
