const db = require('../db');

const Expense = {
    getAll: (callback) => {
        db.query('SELECT * FROM expenses ORDER BY date DESC', callback);
    },
    getByFilter: (category, startDate, endDate, callback) => {
        let sql = 'SELECT * FROM expenses WHERE 1=1';
        const params = [];

        if (category) {
            sql += ' AND category = ?';
            params.push(category);
        }
        if (startDate && endDate) {
            sql += ' AND date BETWEEN ? AND ?';
            params.push(startDate, endDate);
        }
        sql += ' ORDER BY date DESC';

        db.query(sql, params, callback);
    },
    add: (data, callback) => {
        db.query('INSERT INTO expenses SET ?', data, callback);
    },
    update: (id, data, callback) => {
        db.query('UPDATE expenses SET ? WHERE id = ?', [data, id], callback);
    },
    delete: (id, callback) => {
        db.query('DELETE FROM expenses WHERE id = ?', [id], callback);
    },
};

module.exports = Expense;
