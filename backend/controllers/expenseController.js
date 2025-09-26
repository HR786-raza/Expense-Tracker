const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const Expense = require('../models/expenseModel');

exports.getAllExpenses = (req, res) => {
    Expense.getAll((err, results) => {
        if (err) throw err;
        res.json(results);
    });
};

exports.getExpensesByFilter = (req, res) => {
    const { category, startDate, endDate } = req.query;
    Expense.getByFilter(category, startDate, endDate, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
};

exports.addExpense = (req, res) => {
    const data = req.body;
    Expense.add(data, (err, result) => {
        if (err) throw err;
        res.json({ message: 'Expense Added', id: result.insertId });
    });
};

exports.updateExpense = (req, res) => {
    const id = req.params.id;
    const data = req.body;
    Expense.update(id, data, (err) => {
        if (err) throw err;
        res.json({ message: 'Expense Updated' });
    });
};

exports.deleteExpense = (req, res) => {
    const id = req.params.id;
    Expense.delete(id, (err) => {
        if (err) throw err;
        res.json({ message: 'Expense Deleted' });
    });
};

exports.exportToExcel = (req, res) => {
    Expense.getAll((err, results) => {
        if (err) throw err;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Expenses');

        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Title', key: 'title', width: 30 },
            { header: 'Amount', key: 'amount', width: 15 },
            { header: 'Category', key: 'category', width: 20 },
            { header: 'Date', key: 'date', width: 15 },
            { header: 'Created At', key: 'created_at', width: 20 },
        ];

        worksheet.addRows(results);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=expenses.xlsx');

        workbook.xlsx.write(res).then(() => res.end());
    });
};

exports.exportToPDF = (req, res) => {
    Expense.getAll((err, results) => {
        if (err) throw err;

        const doc = new PDFDocument({ margin: 30, size: 'A4' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=expenses.pdf');

        doc.pipe(res);

        doc.fontSize(20).text('Expense Report', { align: 'center' });
        doc.moveDown();

        results.forEach(exp => {
            doc.fontSize(12).text(
                `ID: ${exp.id} | Title: ${exp.title} | Amount: ${exp.amount} | Category: ${exp.category} | Date: ${exp.date}`
            );
            doc.moveDown(0.5);
        });

        doc.end();
    });
};
